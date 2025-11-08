
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { products } from '@/lib/products-data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, origin } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos en el carrito' },
        { status: 400 }
      )
    }

    // Construir line_items para Stripe
    const lineItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.productId}`)
      }

      let price = product.price
      let name = product.name

      if (item.variantId && product.variants) {
        const variant = product.variants.find(v => v.id === item.variantId)
        if (variant) {
          price = variant.price
          name = `${product.name} - ${variant.name}`
        }
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name,
            images: product.images.map(img => `${origin}${img}`),
            description: product.description,
          },
          unit_amount: Math.round(price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      }
    })

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/carrito?success=true`,
      cancel_url: `${origin}/carrito?cancelled=true`,
      shipping_address_collection: {
        allowed_countries: ['ES', 'PT', 'FR', 'IT', 'DE', 'GB'],
      },
      billing_address_collection: 'required',
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
