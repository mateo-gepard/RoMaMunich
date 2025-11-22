import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, level, goal, learningStyle, urgency, language, email } = body

    // Save matching quiz data in Firestore
    const matchingQuizRef = await adminDb.collection('matchingQuizzes').add({
      email,
      subject,
      level,
      goal,
      learningStyle,
      urgency,
      language,
      createdAt: new Date().toISOString(),
    })

    // Find matching tutors from Firestore
    let query = adminDb.collection('tutors').where('isActive', '==', true)
    
    // Filter by subject if provided
    if (subject) {
      query = query.where('subjects', 'array-contains', subject)
    }

    const snapshot = await query.get()
    let matchingTutors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Filter by level and language in-memory (Firestore has limited query capabilities)
    matchingTutors = matchingTutors.filter((tutor: any) => {
      if (level && tutor.levels && !tutor.levels.includes(level)) return false
      return true
    })

    // Sort by rating and take top 3
    matchingTutors = matchingTutors.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0)).slice(0, 3)

    // Calculate match scores (simplified algorithm)
    const tutorsWithScores = matchingTutors.map((tutor: any) => {
      let score = 85 // Base score

      // Language match
      if (tutor.language === language || (tutor.languages && tutor.languages.includes(language))) {
        score += 10
      }

      // High rating bonus
      if ((tutor.rating || 0) >= 4.8) {
        score += 5
      }

      return {
        ...tutor,
        matchScore: Math.min(score, 100),
      }
    })

    return NextResponse.json({
      quizId: matchingQuizRef.id,
      matches: tutorsWithScores,
    })
  } catch (error) {
    console.error('Error processing matching:', error)
    return NextResponse.json(
      { error: 'Failed to process matching' },
      { status: 500 }
    )
  }
}

