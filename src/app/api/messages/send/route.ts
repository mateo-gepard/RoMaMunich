import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { Resend } from 'resend'
import { adminDb } from '@/lib/firebaseAdmin'

const resend = new Resend(process.env.RESEND_API_KEY)
const MASTER_TUTOR_EMAIL = 'mateo.mamaladze@gmail.com'

// Unique identifier for conversations
const generateConversationId = (userId: string, tutorId: string) => {
  return [userId, tutorId].sort().join('-')
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, recipientId, recipientName, tutorId, tutorName, subject, message, sessionId, masterTutorOverride } = await request.json()

    // Support both old format (tutorId) and new format (recipientId)
    const actualRecipientId = recipientId || tutorId
    const actualRecipientName = recipientName || tutorName

    if (!actualRecipientId || !message) {
      return NextResponse.json(
        { error: 'Recipient ID and message are required' },
        { status: 400 }
      )
    }

    const isMasterTutor = session.user.email === MASTER_TUTOR_EMAIL

    // Determine actual sender based on master tutor override
    let actualSenderId = session.user.id || session.user.email!
    let actualSenderName = session.user.name

    if (isMasterTutor && masterTutorOverride) {
      actualSenderId = masterTutorOverride.sendAsId
      actualSenderName = masterTutorOverride.sendAsName
    }

    // Use existing conversationId if provided, otherwise generate new one
    const finalConversationId = conversationId || generateConversationId(actualSenderId, actualRecipientId)
    
    // Store message in Firestore
    const messageRef = await adminDb.collection('messages').add({
      conversationId: finalConversationId,
      senderId: actualSenderId,
      senderName: actualSenderName,
      recipientId: actualRecipientId,
      recipientName: actualRecipientName,
      subject,
      content: message,
      sessionId,
      isRead: false,
      createdAt: new Date().toISOString(),
    })

    // Send notification to admin (same as booking system)
    // Use special reply-to address with conversationId for automatic processing
    const replyToAddress = `messages+${finalConversationId}@roma-munich.de`
    
    await resend.emails.send({
      from: 'RoMa Munich <onboarding@resend.dev>', // Use Resend's test domain (same as booking system)
      to: process.env.ADMIN_EMAIL || 'romamuenchen@gmail.com', // Send to admin email
      replyTo: replyToAddress, // Special address for automatic processing
      subject: `Neue Nachricht von ${actualSenderName} - ${subject}`,
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
              .message-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
              .reply-instructions { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 5px; }
              .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
              .conv-id { font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 3px; }
              .master-badge { background: #fbbf24; color: #78350f; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💬 Neue Nachricht</h1>
              </div>
              <div class="content">
                <p>Hallo Team,</p>
                <p>Eine neue Nachricht von <strong>${actualSenderName}</strong> ${isMasterTutor ? '<span class="master-badge">MASTER TUTOR</span>' : `(${session.user.email})`} wurde empfangen.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Nachrichtendetails</h3>
                  <p><strong>Von:</strong> ${actualSenderName}</p>
                  ${isMasterTutor ? `<p><strong>Gesendet von Master Account:</strong> ${session.user.email}</p>` : `<p><strong>Email:</strong> ${session.user.email}</p>`}
                  <p><strong>Betreff:</strong> ${subject || 'Keine Angabe'}</p>
                  <p><strong>Session ID:</strong> ${sessionId || 'N/A'}</p>
                  <p><strong>Empfänger:</strong> ${actualRecipientName}</p>
                  <p><strong>Conversation ID:</strong> <span class="conv-id">${finalConversationId}</span></p>
                </div>
                
                <div style="display: none;">
                  <!-- Structured tags for automatic parsing -->
                  SENDER: ${actualSenderName}
                  RECIPIENT: ${actualRecipientName}
                  CONVERSATION_ID: ${finalConversationId}
                  RECIPIENT_ID: ${actualRecipientId}
                  SENDER_ID: ${actualSenderId}
                  ${isMasterTutor ? `MASTER_ACCOUNT: ${session.user.email}` : ''}
                </div>

                <div class="message-box">
                  <h3 style="margin-top: 0; color: #1a365d;">Nachricht</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>

                <div class="reply-instructions">
                  <h3 style="margin-top: 0; color: #92400e;">📧 So antwortest du:</h3>
                  <ol style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Antworte direkt auf diese Email</strong> - Deine Antwort wird automatisch gespeichert und an ${session.user.name} weitergeleitet</li>
                    <li><strong>Antwort-Adresse:</strong> <span class="conv-id">${replyToAddress}</span></li>
                    <li>Die Nachricht erscheint automatisch im Dashboard unter deinem Namen (${tutorName})</li>
                  </ol>
                  <p style="margin: 0; font-size: 0.9em; color: #92400e;">
                    ✅ Einfach auf "Antworten" klicken - alles wird automatisch verarbeitet!
                  </p>
                </div>
                
                <p style="margin-top: 30px;">
                  Mit freundlichen Grüßen,<br>
                  <strong>Dein RoMa Munich System</strong>
                </p>
              </div>
              <div class="footer">
                <p>RoMa Munich - Premium 1:1 Mentoring<br>
                Diese Nachricht wurde automatisch generiert.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      messageId: messageRef.id,
      conversationId 
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// Handle incoming replies via webhook
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!conversationId) {
      // Fetch all conversations for user
      const messagesSnapshot = await adminDb
        .collection('messages')
        .where('conversationId', '>=', session.user.id!)
        .where('conversationId', '<=', session.user.id! + '\uf8ff')
        .orderBy('createdAt', 'desc')
        .get()

      const conversations = new Map()
      messagesSnapshot.docs.forEach(doc => {
        const data = doc.data()
        const convId = data.conversationId
        if (!conversations.has(convId)) {
          conversations.set(convId, {
            id: convId,
            ...data,
            messages: []
          })
        }
      })

      return NextResponse.json(Array.from(conversations.values()))
    } else {
      // Fetch specific conversation
      const messagesSnapshot = await adminDb
        .collection('messages')
        .where('conversationId', '==', conversationId)
        .orderBy('createdAt', 'asc')
        .get()

      const messages = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return NextResponse.json(messages)
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
