import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await request.json()
    const userId = session.user.id || session.user.email!

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    // Store hidden conversation in Firestore
    // Use composite key: userId + conversationId
    const hiddenConvRef = adminDb
      .collection('hiddenConversations')
      .doc(`${userId}_${conversationId}`)

    await hiddenConvRef.set({
      userId,
      conversationId,
      hiddenAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error hiding conversation:', error)
    return NextResponse.json(
      { error: 'Failed to hide conversation' },
      { status: 500 }
    )
  }
}
