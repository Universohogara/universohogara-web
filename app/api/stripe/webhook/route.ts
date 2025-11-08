
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === "subscription") {
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string
          const userId = session.metadata?.userId
          const extensionType = session.metadata?.extensionType

          if (userId) {
            // Si es una extensión de Personajes Mágicos
            if (extensionType === 'magical_companions') {
              await prisma.subscription.update({
                where: { user_id: userId },
                data: {
                  magical_companions_enabled: true,
                  magical_companions_plan_type: 'subscription',
                  magical_companions_subscription_id: subscriptionId,
                },
              })
            } else {
              // Es una suscripción base normal
              await prisma.subscription.update({
                where: { user_id: userId },
                data: {
                  stripe_subscription_id: subscriptionId,
                  stripe_customer_id: customerId,
                  status: "active",
                },
              })

              // Update user role to premium
              await prisma.user.update({
                where: { id: userId },
                data: { role: "premium" },
              })
            }
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionData: any = subscription
        
        await prisma.subscription.update({
          where: { stripe_subscription_id: subscription.id },
          data: {
            status: subscription.status,
            current_period_start: subscriptionData.current_period_start 
              ? new Date(subscriptionData.current_period_start * 1000) 
              : null,
            current_period_end: subscriptionData.current_period_end 
              ? new Date(subscriptionData.current_period_end * 1000) 
              : null,
            cancel_at_period_end: subscriptionData.cancel_at_period_end || false,
          },
        })

        // Update user role based on subscription status
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripe_subscription_id: subscription.id },
        })

        if (dbSubscription) {
          const newRole = subscription.status === "active" ? "premium" : "user"
          await prisma.user.update({
            where: { id: dbSubscription.user_id },
            data: { role: newRole },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.update({
          where: { stripe_subscription_id: subscription.id },
          data: {
            status: "cancelled",
          },
        })

        // Downgrade user to regular user
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripe_subscription_id: subscription.id },
        })

        if (dbSubscription) {
          await prisma.user.update({
            where: { id: dbSubscription.user_id },
            data: { role: "user" },
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceData: any = invoice
        const subscriptionId = typeof invoiceData.subscription === 'string' 
          ? invoiceData.subscription 
          : invoiceData.subscription?.id

        if (subscriptionId) {
          await prisma.subscription.update({
            where: { stripe_subscription_id: subscriptionId },
            data: {
              status: "past_due",
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
