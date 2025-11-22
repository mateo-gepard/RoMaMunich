import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const {
      tutorId,
      tutorName,
      subject,
      date,
      time,
      location,
      package: packageType,
      packageDetails,
      contactInfo,
    } = body

    // Save booking to Firestore
    const bookingData = {
      userId: session?.user?.id || null,
      tutorId,
      tutorName,
      subject: subject || 'Nicht angegeben',
      date,
      time,
      location,
      package: packageType,
      packageDetails,
      contactInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const bookingRef = await adminDb.collection('bookings').add(bookingData)

    // Send confirmation email to customer
    const customerEmail = await resend.emails.send({
      from: 'RoMa Munich <onboarding@resend.dev>',  // Use Resend's default until domain is verified
      to: contactInfo.email,
      subject: 'Buchungsbestätigung - RoMa Munich',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a365d 0%, #0c1e30 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-box { background: white; border-left: 4px solid #14b8a6; padding: 15px; margin: 15px 0; border-radius: 5px; }
              .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Buchung erfolgreich!</h1>
              </div>
              <div class="content">
                <p>Hallo ${contactInfo.name},</p>
                <p>vielen Dank für deine Buchung bei RoMa Munich! Deine Session wurde erfolgreich gebucht.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Buchungsdetails</h3>
                  <p><strong>Fach:</strong> ${subject || 'Nicht angegeben'}</p>
                  <p><strong>Mentor:</strong> ${tutorName}</p>
                  <p><strong>Datum:</strong> ${new Date(date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Uhrzeit:</strong> ${time} Uhr</p>
                  <p><strong>Ort:</strong> ${location === 'online' ? 'Online (Link folgt)' : 'Vor Ort in München'}</p>
                  <p><strong>Paket:</strong> ${packageDetails.name}</p>
                  <p><strong>Preis:</strong> ${packageDetails.price === 0 ? 'Kostenlos' : `${packageDetails.price}€`}</p>
                </div>

                ${contactInfo.message ? `
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Deine Nachricht</h3>
                  <p>${contactInfo.message}</p>
                </div>
                ` : ''}

                <h3>Was passiert jetzt?</h3>
                <ol>
                  <li><strong>Mentor-Kontakt:</strong> ${tutorName} wird sich innerhalb von 24 Stunden bei dir melden</li>
                  <li><strong>Vorbereitung:</strong> Bereite Fragen oder Themen vor, die du besprechen möchtest</li>
                  <li><strong>Session:</strong> Zum vereinbarten Termin startet eure Session</li>
                </ol>

                ${location === 'online' ? `
                <p><em>Der Zoom/Teams-Link wird dir 24 Stunden vor der Session per Email zugeschickt.</em></p>
                ` : ''}

                <p style="margin-top: 30px;">Bei Fragen oder Änderungen kannst du uns jederzeit kontaktieren:</p>
                <p>📧 <a href="mailto:info@roma-munich.de">info@roma-munich.de</a><br>
                📞 +49 89 1234 5678</p>

                <p>Wir freuen uns auf eine erfolgreiche Zusammenarbeit!</p>
                <p>Dein RoMa Munich Team</p>
              </div>
              <div class="footer">
                <p>RoMa Munich - Premium 1:1 Mentoring<br>
                Leopoldstraße 123, 80802 München</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Send notification email to admin/tutor
    const adminEmail = await resend.emails.send({
      from: 'RoMa Munich <onboarding@resend.dev>',  // Use Resend's default until domain is verified
      to: process.env.ADMIN_EMAIL || 'info@roma-munich.de',
      subject: `Neue Buchung: ${tutorName} - ${contactInfo.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #14b8a6; color: white; padding: 20px; text-align: center; }
              .content { background: #f9fafb; padding: 20px; }
              .info-row { padding: 10px; border-bottom: 1px solid #ddd; }
              .info-label { font-weight: bold; color: #1a365d; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Neue Buchung eingegangen</h2>
              </div>
              <div class="content">
                <div class="info-row">
                  <span class="info-label">Mentor:</span> ${tutorName} (ID: ${tutorId})
                </div>
                <div class="info-row">
                  <span class="info-label">Kunde:</span> ${contactInfo.name}
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span> ${contactInfo.email}
                </div>
                <div class="info-row">
                  <span class="info-label">Telefon:</span> ${contactInfo.phone || 'Nicht angegeben'}
                </div>
                <div class="info-row">
                  <span class="info-label">Datum:</span> ${new Date(date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="info-row">
                  <span class="info-label">Uhrzeit:</span> ${time} Uhr
                </div>
                <div class="info-row">
                  <span class="info-label">Ort:</span> ${location === 'online' ? 'Online' : 'Vor Ort'}
                </div>
                <div class="info-row">
                  <span class="info-label">Paket:</span> ${packageDetails.name} (${packageDetails.price}€)
                </div>
                ${contactInfo.message ? `
                <div class="info-row">
                  <span class="info-label">Nachricht:</span><br>
                  ${contactInfo.message}
                </div>
                ` : ''}
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Buchung erfolgreich erstellt',
        bookingId: bookingRef.id,
        customerEmailId: customerEmail.data?.id,
        adminEmailId: adminEmail.data?.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Buchung konnte nicht erstellt werden' },
      { status: 500 }
    )
  }
}

