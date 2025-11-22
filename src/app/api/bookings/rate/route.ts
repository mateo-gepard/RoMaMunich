import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, rating, feedback, bookingData } = await request.json()

    if (!sessionId || !rating) {
      return NextResponse.json(
        { error: 'Session ID and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Update booking with rating and feedback in Firestore
    await adminDb.collection('bookings').doc(sessionId).update({
      rating,
      feedback: feedback || '',
      ratedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // Get tutor email - in production, fetch from database
    const tutorEmail = bookingData.tutorEmail || `tutor-${bookingData.tutorId}@roma-munich.de`
    
    // Send notification email to tutor
    await resend.emails.send({
      from: 'RoMa Munich <noreply@roma-munich.de>',
      to: tutorEmail,
      subject: `Neue Bewertung - ${bookingData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
              .rating-box { background: ${rating >= 4 ? '#ecfdf5' : rating >= 3 ? '#fef3c7' : '#fef2f2'}; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: center; }
              .stars { font-size: 32px; color: #fbbf24; }
              .feedback-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌟 Neue Bewertung erhalten</h1>
              </div>
              <div class="content">
                <p>Hallo ${bookingData.tutorName},</p>
                <p>Sie haben eine neue Bewertung für eine Session erhalten!</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Session Details</h3>
                  <p><strong>Fach:</strong> ${bookingData.subject}</p>
                  <p><strong>Schüler:</strong> ${bookingData.studentName}</p>
                  <p><strong>Datum:</strong> ${new Date(bookingData.date).toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Uhrzeit:</strong> ${bookingData.time}</p>
                </div>

                <div class="rating-box">
                  <h3 style="margin-top: 0;">Bewertung</h3>
                  <div class="stars">${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
                  <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${rating} / 5 Sterne</p>
                </div>

                ${feedback ? `
                <div class="feedback-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Feedback vom Schüler</h3>
                  <p style="font-style: italic;">"${feedback}"</p>
                </div>
                ` : ''}

                <p>Vielen Dank für Ihre hervorragende Arbeit! ${rating >= 4 ? 'Diese positive Bewertung wird Ihnen helfen, weitere Schüler zu gewinnen.' : 'Nutzen Sie dieses Feedback, um sich weiterzuentwickeln.'}</p>
                
                <p style="margin-top: 30px;">
                  Mit freundlichen Grüßen,<br>
                  <strong>Ihr RoMa Munich Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    // Also send notification to admin
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: 'RoMa Munich <noreply@roma-munich.de>',
        to: process.env.ADMIN_EMAIL,
        subject: `Neue Bewertung: ${rating} Sterne - ${bookingData.subject}`,
        html: `
          <h2>Neue Bewertung im System</h2>
          <p><strong>Tutor:</strong> ${bookingData.tutorName}</p>
          <p><strong>Schüler:</strong> ${bookingData.studentName}</p>
          <p><strong>Fach:</strong> ${bookingData.subject}</p>
          <p><strong>Bewertung:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
          ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
          <p><strong>Session ID:</strong> ${sessionId}</p>
        `
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Rating submitted successfully' 
    })
  } catch (error) {
    console.error('Error submitting rating:', error)
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    )
  }
}

