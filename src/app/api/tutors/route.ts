import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get('subject')
    const level = searchParams.get('level')
    const language = searchParams.get('language')

    // Query Firestore tutors collection
    let query = adminDb.collection('tutors').where('isActive', '==', true)

    // Optional filters
    if (subject) {
      query = query.where('subjects', 'array-contains', subject)
    }
    if (level) {
      query = query.where('levels', 'array-contains', level)
    }
    if (language) {
      query = query.where('languages', 'array-contains', language)
    }

    const snapshot = await query.get()

    let tutors = snapshot.docs.map(doc => {
      const data = doc.data() as { rating?: number }
      return { id: doc.id, ...data }
    })

    // Sort by rating desc, take top 10
    tutors = tutors.sort((a, b) => ((b.rating ?? 0) - (a.rating ?? 0))).slice(0, 10)

    return NextResponse.json(tutors)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tutors' },
      { status: 500 }
    )
  }
}

