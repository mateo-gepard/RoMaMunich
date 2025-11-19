import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get('subject')
    const level = searchParams.get('level')
    const language = searchParams.get('language')

    const where: any = {
      isActive: true,
    }

    if (subject) {
      where.subjects = {
        some: {
          subject: subject,
        },
      }
    }

    const tutors = await prisma.tutor.findMany({
      where,
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
      take: 10,
    })

    return NextResponse.json(tutors)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tutors' },
      { status: 500 }
    )
  }
}
