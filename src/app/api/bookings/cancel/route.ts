import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, reason, session: bookingSession } = await request.json()

    if (!sessionId || !reason) {
      return NextResponse.json(
        { error: 'Session ID and reason are required' },
        { status: 400 }
      )
    }

    // Send cancellation email to tutor
    const tutorEmail = `tutor-${bookingSession.tutorId}@roma-munich.de` // Replace with actual tutor email lookup
    
    await resend.emails.send({
      from: 'RoMa Munich <noreply@roma-munich.de>',
      to: tutorEmail,
      subject: `Session storniert - ${bookingSession.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ef4444; }
              .reason-box { background: #fef2f2; padding: 15px; border-radius: 6px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Session storniert</h1>
              </div>
              <div class="content">
                <p>Hallo ${bookingSession.tutorName},</p>
                <p>Eine Session wurde vom Schüler storniert.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Session Details</h3>
                  <p><strong>Fach:</strong> ${bookingSession.subject}</p>
                  <p><strong>Datum:</strong> ${new Date(bookingSession.date).toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Uhrzeit:</strong> ${bookingSession.time}</p>
                  <p><strong>Dauer:</strong> ${bookingSession.duration}h</p>
                </div>

                <div class="reason-box">
                  <h3 style="margin-top: 0; color: #991b1b;">Grund für die Stornierung</h3>
                  <p>${reason}</p>
                </div>

                <p>Bei Fragen wenden Sie sich bitte an unser Support-Team.</p>
                
                <p style="margin-top: 30px;">
                  Mit freundlichen Grüßen,<br>
                  <strong>Ihr RoMa Munich Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'RoMa Munich <noreply@roma-munich.de>',
      to: session.user.email!,
      subject: `Stornierungsbestätigung - ${bookingSession.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Stornierung bestätigt</h1>
              </div>
              <div class="content">
                <p>Hallo ${session.user.name},</p>
                <p>Ihre Session wurde erfolgreich storniert.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Stornierte Session</h3>
                  <p><strong>Fach:</strong> ${bookingSession.subject}</p>
                  <p><strong>Mentor:</strong> ${bookingSession.tutorName}</p>
                  <p><strong>Datum:</strong> ${new Date(bookingSession.date).toLocaleDateString('de-DE')}</p>
                  <p><strong>Uhrzeit:</strong> ${bookingSession.time}</p>
                </div>

                <p>Der Mentor wurde über die Stornierung informiert.</p>
                
                <p style="margin-top: 30px;">
                  Mit freundlichen Grüßen,<br>
                  <strong>Ihr RoMa Munich Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cancelling session:', error)
    return NextResponse.json(
      { error: 'Failed to cancel session' },
      { status: 500 }
    )
  }
}
