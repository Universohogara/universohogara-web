
import Stripe from "stripe"

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
  typescript: true,
})

// Helper function to get or create a Stripe customer
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
) {
  const { prisma } = await import("@/lib/db")
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (user?.subscription?.stripe_customer_id) {
    return user.subscription.stripe_customer_id
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  })

  // Save customer ID to database
  await prisma.subscription.upsert({
    where: { user_id: userId },
    update: {
      stripe_customer_id: customer.id,
    },
    create: {
      user_id: userId,
      stripe_customer_id: customer.id,
      status: "inactive",
    },
  })

  return customer.id
}

// Helper to create a checkout session - using dynamic origin
export async function createCheckoutSession(
  userId: string,
  email: string,
  origin: string,
  plan: 'essential' | 'advanced' = 'essential',
  name?: string | null
) {
  const customerId = await getOrCreateStripeCustomer(userId, email, name)

  // Determine which price ID to use based on the plan
  const priceId = plan === 'advanced' 
    ? process.env.STRIPE_PRICE_ID_ADVANCED 
    : process.env.STRIPE_PRICE_ID_ESSENTIAL

  if (!priceId) {
    throw new Error(`No se encontró el precio de Stripe para el plan: ${plan}`)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/premium?success=true`,
    cancel_url: `${origin}/premium?cancelled=true`,
    metadata: {
      userId,
      plan,
    },
  })

  return session
}

// Helper to create a billing portal session - using dynamic origin
export async function createBillingPortalSession(customerId: string, origin: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/premium`,
  })

  return session
}
