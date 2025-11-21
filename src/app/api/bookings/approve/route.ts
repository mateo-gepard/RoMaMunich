import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const MASTER_TUTOR_EMAIL = 'romamuenchen@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is master tutor
    if (!session?.user || session.user.email !== MASTER_TUTOR_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - Only master tutor can approve bookings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { bookingId, action, reason } = body // action: 'approve' or 'reject'

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, action' },
        { status: 400 }
      )
    }

    // Get booking from Firestore
    const bookingRef = adminDb.collection('bookings').doc(bookingId)
    const bookingDoc = await bookingRef.get()

    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const bookingData = bookingDoc.data()

    // Update booking status
    const newStatus = action === 'approve' ? 'confirmed' : 'cancelled'
    await bookingRef.update({
      status: newStatus,
      approvedAt: action === 'approve' ? new Date().toISOString() : null,
      approvedBy: session.user.email,
      rejectionReason: action === 'reject' ? reason : null,
      updatedAt: new Date().toISOString(),
    })

    // Send notification email to customer
    const emailSubject = action === 'approve' 
      ? 'Buchung bestätigt - RoMa Munich'
      : 'Buchung abgelehnt - RoMa Munich'

    const emailHtml = action === 'approve' 
      ? `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a365d 0%, #0c1e30 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Buchung bestätigt!</h1>
              </div>
              <div class="content">
                <p>Hallo ${bookingData?.contactInfo?.name || 'Kunde'},</p>
                <div class="success-badge">BESTÄTIGT</div>
                <p>Deine Buchung wurde von unserem Team bestätigt!</p>
                
                <h3>Buchungsdetails</h3>
                <p><strong>Mentor:</strong> ${bookingData?.tutorName}</p>
                <p><strong>Datum:</strong> ${new Date(bookingData?.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Uhrzeit:</strong> ${bookingData?.time} Uhr</p>
                <p><strong>Ort:</strong> ${bookingData?.location === 'online' ? 'Online' : 'Vor Ort'}</p>

                ${bookingData?.location === 'online' ? `
                <p style="margin-top: 20px;"><strong>Meeting-Link:</strong> Wird 24 Stunden vor der Session per Email zugeschickt.</p>
                ` : ''}

                <p style="margin-top: 30px;">Wir freuen uns auf deine Session!</p>
                <p>Dein RoMa Munich Team</p>
              </div>
            </div>
          </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .warning-badge { background: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Buchung abgelehnt</h1>
              </div>
              <div class="content">
                <p>Hallo ${bookingData?.contactInfo?.name || 'Kunde'},</p>
                <div class="warning-badge">ABGELEHNT</div>
                <p>Leider mussten wir deine Buchung ablehnen.</p>
                
                ${reason ? `
                <h3>Grund:</h3>
                <p>${reason}</p>
                ` : ''}

                <p style="margin-top: 30px;">Bitte kontaktiere uns für eine alternative Terminvereinbarung:</p>
                <p>📧 <a href="mailto:info@roma-munich.de">info@roma-munich.de</a><br>
                📞 +49 89 1234 5678</p>

                <p>Dein RoMa Munich Team</p>
              </div>
            </div>
          </body>
        </html>
      `

    await resend.emails.send({
      from: 'RoMa Munich <onboarding@resend.dev>',
      to: bookingData?.contactInfo?.email,
      subject: emailSubject,
      html: emailHtml,
    })

    return NextResponse.json({
      success: true,
      message: `Booking ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      bookingId,
      newStatus,
    })
  } catch (error) {
    console.error('Booking approval error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking approval' },
      { status: 500 }
    )
  }
}
