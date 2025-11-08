
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover'
})

export const dynamic = "force-dynamic"

/**
 * Webhook para manejar eventos de Stripe relacionados con Personajes Mágicos
 * 
 * EVENTOS MANEJADOS:
 * - checkout.session.completed: Cuando se completa una suscripción
 * - invoice.payment_succeeded: Renovación exitosa
 * - customer.subscription.deleted: Cancelación
 */
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET_MAGICAL) {
    return NextResponse.json(
      { error: 'Stripe no configurado' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_MAGICAL!
    )

    console.log('🔔 Webhook de Personajes Mágicos:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (!session.client_reference_id) {
          console.error('No client_reference_id en session')
          break
        }

        const metadata = session.metadata
        const planType = metadata?.planType as 'addon' | 'standalone' | undefined

        if (!planType) {
          console.error('No planType en metadata')
          break
        }

        // Activar personajes mágicos para el usuario
        await prisma.subscription.update({
          where: { user_id: session.client_reference_id },
          data: {
            magical_companions_enabled: true,
            magical_companions_plan_type: planType,
            magical_companions_subscription_id: session.subscription as string,
            magical_companions_status: 'active'
          }
        })

        console.log(`✅ Personajes mágicos activados para usuario ${session.client_reference_id} (${planType})`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) {
          console.log('No subscription ID en invoice')
          break
        }

        // Verificar que el pago sea de personajes mágicos
        const subscription = await prisma.subscription.findFirst({
          where: { magical_companions_subscription_id: subscriptionId }
        })

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              magical_companions_status: 'active'
            }
          })
          console.log(`✅ Renovación exitosa de personajes mágicos para suscripción ${subscriptionId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Desactivar personajes mágicos
        const userSub = await prisma.subscription.findFirst({
          where: { magical_companions_subscription_id: subscription.id }
        })

        if (userSub) {
          await prisma.subscription.update({
            where: { id: userSub.id },
            data: {
              magical_companions_enabled: false,
              magical_companions_plan_type: 'none',
              magical_companions_subscription_id: null,
              magical_companions_status: 'cancelled'
            }
          })
          console.log(`❌ Personajes mágicos cancelados para usuario ${userSub.user_id}`)
        }
        break
      }

      default:
        console.log(`⚠️  Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Error procesando webhook:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}
