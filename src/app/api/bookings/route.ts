import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tutorId, subject, date, startTime, endTime, durationHours } = body

    // Get tutor info
    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
    })

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })
    }

    const price = tutor.hourlyRate * durationHours

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        tutorId,
        subject,
        date: new Date(date),
        startTime,
        endTime,
        durationHours,
        price,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Mentoring Session: ${subject}`,
              description: `${durationHours}h with ${tutor.id}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      metadata: {
        bookingId: booking.id,
      },
    })

    // Update booking with Stripe session ID
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: checkoutSession.id },
    })

    return NextResponse.json({
      bookingId: booking.id,
      checkoutUrl: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
