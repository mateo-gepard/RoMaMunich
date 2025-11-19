import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, level, goal, learningStyle, urgency, language, email } = body

    // Save matching quiz data
    const matchingQuiz = await prisma.matchingQuiz.create({
      data: {
        email,
        subject,
        level,
        goal,
        learningStyle,
        urgency,
        language,
      },
    })

    // Find matching tutors based on criteria
    const matchingTutors = await prisma.tutor.findMany({
      where: {
        isActive: true,
        subjects: {
          some: {
            subject: subject,
            level: {
              has: level,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            language: true,
          },
        },
        subjects: true,
        achievements: true,
        earlyStudy: true,
        availability: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: 3,
    })

    // Calculate match scores (simplified algorithm)
    const tutorsWithScores = matchingTutors.map((tutor) => {
      let score = 85 // Base score

      // Language match
      if (tutor.user.language === language) {
        score += 10
      }

      // High rating bonus
      if (tutor.rating >= 4.8) {
        score += 5
      }

      return {
        ...tutor,
        matchScore: Math.min(score, 100),
      }
    })

    return NextResponse.json({
      quizId: matchingQuiz.id,
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
