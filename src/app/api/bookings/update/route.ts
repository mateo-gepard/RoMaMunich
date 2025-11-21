import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { adminDb } from '@/lib/firebaseAdmin'

const MASTER_TUTOR_EMAIL = 'romamuenchen@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only master tutor can update session titles
    if (session.user.email !== MASTER_TUTOR_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { sessionId, subject, tutorName } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update booking in Firestore
    const updates: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email
    }

    if (subject !== undefined) {
      updates.subject = subject
    }

    if (tutorName !== undefined) {
      updates.tutorName = tutorName
    }

    await adminDb.collection('bookings').doc(sessionId).update(updates)

    return NextResponse.json({ 
      success: true,
      message: 'Session updated successfully' 
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}
