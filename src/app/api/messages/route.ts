import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'

const MASTER_TUTOR_EMAIL = 'mateo.mamaladze@gmail.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const masterView = searchParams.get('masterView') === 'true'
    const userId = session.user.id || session.user.email!
    const isMasterTutor = session.user.email === MASTER_TUTOR_EMAIL

    if (conversationId) {
      // Fetch specific conversation messages - nur nach conversationId filtern
      const messagesSnapshot = await adminDb
        .collection('messages')
        .where('conversationId', '==', conversationId)
        .get()

      // Sortiere im Code statt in der Query
      const messages = messagesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      return NextResponse.json({ messages })
    } else {
      // Master tutor sees ALL conversations
      if (isMasterTutor && masterView) {
        const allMessagesSnapshot = await adminDb
          .collection('messages')
          .get()

        const allMessages = allMessagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        // Group by conversation
        const conversationsMap = new Map()
        
        allMessages.forEach((msg: any) => {
          const existing = conversationsMap.get(msg.conversationId)
          if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
            conversationsMap.set(msg.conversationId, {
              conversationId: msg.conversationId,
              tutorId: msg.recipientId.startsWith('tutor') || msg.recipientId.includes('@') && msg.recipientId !== msg.senderId ? msg.recipientId : msg.senderId,
              tutorName: msg.recipientId.startsWith('tutor') || msg.recipientId.includes('@') && msg.recipientId !== msg.senderId ? msg.recipientName : msg.senderName,
              studentId: msg.senderId.includes('@') && !msg.senderId.startsWith('tutor') ? msg.senderId : msg.recipientId,
              studentName: msg.senderId.includes('@') && !msg.senderId.startsWith('tutor') ? msg.senderName : msg.recipientName,
              lastMessage: {
                content: msg.content,
                createdAt: msg.createdAt,
                isFromMe: false // Master views all as external
              },
              unreadCount: 0
            })
          }
        })

        // Filter out hidden conversations for master tutor
        const hiddenConvsSnapshot = await adminDb
          .collection('hiddenConversations')
          .where('userId', '==', userId)
          .get()
        
        const hiddenConvIds = new Set(
          hiddenConvsSnapshot.docs.map(doc => doc.data().conversationId)
        )

        const conversations = Array.from(conversationsMap.values())
          .filter(conv => !hiddenConvIds.has(conv.conversationId))
          .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())

        return NextResponse.json({ conversations })
      }

      // Regular user: Fetch all conversations for this user - separate queries ohne orderBy
      const sentMessagesSnapshot = await adminDb
        .collection('messages')
        .where('senderId', '==', userId)
        .get()

      const receivedMessagesSnapshot = await adminDb
        .collection('messages')
        .where('recipientId', '==', userId)
        .get()

      // Combine and group by conversationId
      const allMessages = [
        ...sentMessagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...receivedMessagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ]

      // Group by conversation and get latest message for each
      const conversationsMap = new Map()
      
      allMessages.forEach((msg: any) => {
        const existing = conversationsMap.get(msg.conversationId)
        if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
          conversationsMap.set(msg.conversationId, {
            conversationId: msg.conversationId,
            tutorId: msg.senderId === userId ? msg.recipientId : msg.senderId,
            tutorName: msg.senderId === userId ? msg.recipientName : msg.senderName,
            studentId: msg.senderId === userId ? msg.senderId : msg.recipientId,
            studentName: msg.senderId === userId ? msg.senderName : msg.recipientName,
            lastMessage: {
              content: msg.content,
              createdAt: msg.createdAt,
              isFromMe: msg.senderId === userId
            },
            unreadCount: 0 // Will be calculated below
          })
        }
      })

      // Calculate unread count for each conversation
      conversationsMap.forEach((conv, convId) => {
        const unread = allMessages.filter((msg: any) => 
          msg.conversationId === convId && 
          msg.recipientId === userId && 
          !msg.isRead
        ).length
        conv.unreadCount = unread
      })

      // Filter out hidden conversations
      const hiddenConvsSnapshot = await adminDb
        .collection('hiddenConversations')
        .where('userId', '==', userId)
        .get()
      
      const hiddenConvIds = new Set(
        hiddenConvsSnapshot.docs.map(doc => doc.data().conversationId)
      )

      const conversations = Array.from(conversationsMap.values())
        .filter(conv => !hiddenConvIds.has(conv.conversationId))
        .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())

      return NextResponse.json({ conversations })
    }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await request.json()
    const userId = session.user.id || session.user.email!

    // Mark all messages in this conversation as read for this user
    const messagesSnapshot = await adminDb
      .collection('messages')
      .where('conversationId', '==', conversationId)
      .where('recipientId', '==', userId)
      .where('isRead', '==', false)
      .get()

    const batch = adminDb.batch()
    messagesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true })
    })
    await batch.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
