import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Webhook handler for incoming email replies from tutors
 * Resend will forward replies to messages+{conversationId}@roma-munich.de
 * Configure this in Resend dashboard: Settings > Inbound Routes
 * 
 * Route pattern: messages+*@roma-munich.de -> https://your-domain.com/api/messages/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // Extract conversation ID from recipient address
    // Format: messages+{conversationId}@roma-munich.de
    const toAddress = payload.to || ''
    const conversationIdMatch = toAddress.match(/messages\+([^@]+)@/)
    
    if (!conversationIdMatch) {
      console.error('Invalid recipient format:', toAddress)
      return NextResponse.json({ error: 'Invalid recipient' }, { status: 400 })
    }

    const conversationId = conversationIdMatch[1]
    const fromEmail = payload.from
    const fromName = payload.from_name || 'Tutor'
    const subject = payload.subject || 'Re: Nachricht'
    const htmlContent = payload.html || payload.text || ''
    const textContent = payload.text || ''

    // Extract the actual reply content (remove quoted text)
    const replyContent = extractReplyContent(textContent)

    // Find the original conversation
    const conversationSnapshot = await adminDb
      .collection('messages')
      .where('conversationId', '==', conversationId)
      .limit(1)
      .get()

    if (conversationSnapshot.empty) {
      console.error('Conversation not found:', conversationId)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const originalMessage = conversationSnapshot.docs[0].data()
    const recipientId = originalMessage.senderId
    const recipientName = originalMessage.senderName

    // Store the reply in Firestore
    await adminDb.collection('messages').add({
      conversationId,
      senderId: originalMessage.recipientId, // Tutor ID
      senderName: fromName,
      recipientId: recipientId,
      recipientName: recipientName,
      subject: subject,
      content: replyContent,
      sessionId: originalMessage.sessionId,
      isRead: false,
      createdAt: new Date().toISOString(),
      source: 'email_reply',
    })

    // Get recipient email (student)
    // In production, fetch from user database
    const recipientEmail = recipientId // Assuming ID is email for now

    // Forward the reply to the student
    await resend.emails.send({
      from: 'RoMa Munich <noreply@roma-munich.de>',
      to: recipientEmail,
      replyTo: `messages+${conversationId}@roma-munich.de`,
      subject: `Antwort von ${fromName} - ${originalMessage.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
              .message-box { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #14b8a6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Neue Antwort von ${fromName}</h1>
              </div>
              <div class="content">
                <p>Hallo ${recipientName},</p>
                <p>Ihr Mentor hat auf Ihre Nachricht geantwortet.</p>
                
                <div class="message-box">
                  <p><strong>Betreff:</strong> ${originalMessage.subject}</p>
                  <p><strong>Nachricht:</strong></p>
                  <p>${replyContent}</p>
                </div>

                <p><strong>Um zu antworten, antworten Sie einfach auf diese E-Mail</strong> oder besuchen Sie Ihr Dashboard.</p>
                
                <a href="https://roma-munich.de/dashboard/messages?conversation=${conversationId}" 
                   style="display: inline-block; padding: 12px 24px; background: #14b8a6; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px;">
                  Im Dashboard öffnen
                </a>
                
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

    return NextResponse.json({ success: true, messageStored: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

// Helper function to extract reply content (remove quoted text)
function extractReplyContent(text: string): string {
  // Remove common email reply markers
  const lines = text.split('\n')
  const replyLines: string[] = []
  
  for (const line of lines) {
    // Stop at common reply delimiters
    if (
      line.startsWith('On ') ||
      line.startsWith('Am ') ||
      line.startsWith('>') ||
      line.includes('wrote:') ||
      line.includes('schrieb:')
    ) {
      break
    }
    replyLines.push(line)
  }
  
  return replyLines.join('\n').trim()
}

// Verify webhook signature (if Resend provides one)
function verifyWebhookSignature(request: NextRequest): boolean {
  // Implement signature verification here
  // For now, we'll trust the request
  return true
}

