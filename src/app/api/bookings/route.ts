import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const MASTER_TUTOR_EMAIL = 'romamuenchen@gmail.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isMasterTutor = session.user.email === MASTER_TUTOR_EMAIL

    if (isMasterTutor) {
      // Master tutor sees ALL bookings
      const allBookingsSnapshot = await adminDb
        .collection('bookings')
        .orderBy('createdAt', 'desc')
        .get()

      const allBookings = allBookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return NextResponse.json({ 
        sessions: allBookings,
        allBookings: allBookings 
      })
    } else {
      // Regular users see only their bookings (excluding cancelled)
      // Match by userId OR email in contactInfo
      const bookingsSnapshot = await adminDb
        .collection('bookings')
        .get()

      const bookings = bookingsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((booking: any) => {
          // Match by userId or contactInfo email
          const matchesUser = booking.userId === session.user.id || 
                             booking.contactInfo?.email === session.user.email
          const notCancelled = booking.status !== 'cancelled'
          return matchesUser && notCancelled
        })

      return NextResponse.json({ sessions: bookings })
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tutorId, subject, date, startTime, endTime, durationHours } = body

    // Get tutor info from Firestore
    const tutorDoc = await adminDb.collection('tutors').doc(tutorId).get()
    if (!tutorDoc.exists) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 })
    }
    const tutor = tutorDoc.data()
    const price = (tutor?.hourlyRate || 0) * durationHours

    // Create booking in Firestore
    const bookingRef = await adminDb.collection('bookings').add({
      userId: session.user.id,
      tutorId,
      subject,
      date: new Date(date).toISOString(),
      startTime,
      endTime,
      durationHours,
      price,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
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
              description: `${durationHours}h with ${tutorId}`,
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
        bookingId: bookingRef.id,
      },
    })

    // Update booking with Stripe session ID
    await bookingRef.update({ stripeSessionId: checkoutSession.id })

    return NextResponse.json({
      bookingId: bookingRef.id,
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

