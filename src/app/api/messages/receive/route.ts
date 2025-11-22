import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

// Webhook für eingehende Email-Antworten
// Kann von Zapier, Make.com, Gmail API oder Resend Inbound aufgerufen werden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      conversationId, 
      from, 
      fromName, 
      subject, 
      body: emailBody, 
      messageId,
      tutorId,
      tutorName,
      recipientId,
      recipientName 
    } = body

    // Validierung
    if (!conversationId || !emailBody) {
      return NextResponse.json(
        { error: 'conversationId and body are required' },
        { status: 400 }
      )
    }

    // Option 1: Explizit übergebene IDs verwenden (wenn vorhanden)
    let senderId = tutorId
    let senderName = tutorName || fromName
    let recipId = recipientId
    let recipName = recipientName
    let sessionId = null

    // Option 2: Wenn keine expliziten IDs, aus letzter Nachricht ableiten
    if (!senderId || !recipId) {
      const lastMessageSnapshot = await adminDb
        .collection('messages')
        .where('conversationId', '==', conversationId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()

      if (lastMessageSnapshot.empty) {
        return NextResponse.json(
          { error: 'Conversation not found and no explicit IDs provided' },
          { status: 404 }
        )
      }

      const lastMessage = lastMessageSnapshot.docs[0].data()
      
      // Tutor ist jetzt der Sender, Parent der Empfänger
      senderId = senderId || lastMessage.recipientId // Tutor
      senderName = senderName || lastMessage.recipientName
      recipId = recipId || lastMessage.senderId // Parent
      recipName = recipName || lastMessage.senderName
      sessionId = lastMessage.sessionId || null
    }

    // Speichere Antwort in Firestore
    const messageRef = await adminDb.collection('messages').add({
      conversationId,
      senderId,
      senderName,
      recipientId: recipId,
      recipientName: recipName,
      subject: subject || 'Antwort',
      content: emailBody,
      sessionId,
      isRead: false,
      createdAt: new Date().toISOString(),
      source: 'email', // Markiere als von Email kommend
      emailMessageId: messageId || null, // Gmail Message ID für Tracking
    })

    console.log('Email reply saved:', {
      messageId: messageRef.id,
      conversationId,
      from,
      preview: emailBody.substring(0, 50)
    })

    return NextResponse.json({
      success: true,
      messageId: messageRef.id,
      conversationId
    })
  } catch (error) {
    console.error('Error processing email reply:', error)
    return NextResponse.json(
      { error: 'Failed to process email reply' },
      { status: 500 }
    )
  }
}

// Alternative: Resend Inbound Webhook Format
// Wenn du Resend Inbound Routes verwendest
export async function PUT(request: NextRequest) {
  try {
    // Resend sendet Inbound Emails als PUT Request
    const payload = await request.json()
    
    // Resend Format
    const { from, to, subject, html, text } = payload
    
    // Parse conversationId aus "to" Adresse
    // Format: messages+{conversationId}@roma-munich.de
    const match = to?.match(/messages\+([^@]+)@/)
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid recipient format' },
        { status: 400 }
      )
    }

    const conversationId = match[1]
    const emailBody = text || html || ''
    const fromEmail = from.email || from
    const fromName = from.name || 'Tutor'

    // Verwende gleiche Logik wie POST
    return POST(
      new NextRequest(request.url, {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          from: fromEmail,
          fromName,
          subject,
          body: emailBody,
          messageId: payload.messageId
        })
      })
    )
  } catch (error) {
    console.error('Error processing Resend inbound email:', error)
    return NextResponse.json(
      { error: 'Failed to process inbound email' },
      { status: 500 }
    )
  }
}

