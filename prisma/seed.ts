import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const tutorPassword = await bcrypt.hash('password123', 10)

  // Tutor 1: Max Müller
  const tutor1User = await prisma.user.create({
    data: {
      email: 'max.mueller@roma-munich.de',
      password: tutorPassword,
      firstName: 'Max',
      lastName: 'Müller',
      phone: '+49 176 1234567',
      role: 'TUTOR',
      language: 'DE',
    },
  })

  const tutor1 = await prisma.tutor.create({
    data: {
      userId: tutor1User.id,
      bio: 'Bundessieger Mathematik-Olympiade 2023. Ich brenne für elegante Lösungen und möchte meine Begeisterung weitergeben.',
      bioEn: 'National Mathematics Olympiad Winner 2023. I am passionate about elegant solutions and want to share my enthusiasm.',
      age: 19,
      hourlyRate: 65,
      maxHoursPerWeek: 5,
      rating: 5.0,
      totalHours: 120,
      reviewCount: 24,
    },
  })

  await prisma.achievement.createMany({
    data: [
      {
        tutorId: tutor1.id,
        type: 'MATH_OLYMPIAD',
        title: '1. Preis Bundesweite Mathematik-Olympiade',
        titleEn: '1st Prize National Mathematics Olympiad',
        year: 2023,
        rank: '1. Preis',
      },
      {
        tutorId: tutor1.id,
        type: 'PHYSICS_OLYMPIAD',
        title: 'Silbermedaille Internationale Physik-Olympiade',
        titleEn: 'Silver Medal International Physics Olympiad',
        year: 2024,
        rank: 'Silber',
      },
    ],
  })

  await prisma.earlyStudy.create({
    data: {
      tutorId: tutor1.id,
      university: 'TUM',
      field: 'Mathematik',
      startYear: 2023,
    },
  })

  await prisma.tutorSubject.createMany({
    data: [
      {
        tutorId: tutor1.id,
        subject: 'MATHEMATICS',
        level: ['GYMNASIUM', 'ABITUR', 'COMPETITION', 'UNIVERSITY'],
      },
      {
        tutorId: tutor1.id,
        subject: 'PHYSICS',
        level: ['GYMNASIUM', 'ABITUR', 'COMPETITION'],
      },
    ],
  })

  // Tutor 2: Sophie Weber
  const tutor2User = await prisma.user.create({
    data: {
      email: 'sophie.weber@roma-munich.de',
      password: tutorPassword,
      firstName: 'Sophie',
      lastName: 'Weber',
      phone: '+49 176 2345678',
      role: 'TUTOR',
      language: 'EN',
    },
  })

  const tutor2 = await prisma.tutor.create({
    data: {
      userId: tutor2User.id,
      bio: 'Gold beim Bundeswettbewerb Informatik. Leite die Robotik-AG am Max-Gymnasium. Coding macht Spaß!',
      bioEn: 'Gold at National Computer Science Competition. Leading the Robotics AG at Max-Gymnasium. Coding is fun!',
      age: 18,
      hourlyRate: 60,
      maxHoursPerWeek: 5,
      rating: 5.0,
      totalHours: 95,
      reviewCount: 19,
    },
  })

  await prisma.achievement.createMany({
    data: [
      {
        tutorId: tutor2.id,
        type: 'INFORMATICS_OLYMPIAD',
        title: 'Gold Bundeswettbewerb Informatik',
        titleEn: 'Gold National Computer Science Competition',
        year: 2024,
        rank: 'Gold',
      },
      {
        tutorId: tutor2.id,
        type: 'ROBOTICS',
        title: 'Leiterin Robotik-AG am Max-Gymnasium',
        titleEn: 'Head of Robotics AG at Max-Gymnasium',
        year: 2024,
      },
    ],
  })

  await prisma.earlyStudy.create({
    data: {
      tutorId: tutor2.id,
      university: 'LMU',
      field: 'Informatik',
      startYear: 2024,
    },
  })

  await prisma.tutorSubject.createMany({
    data: [
      {
        tutorId: tutor2.id,
        subject: 'COMPUTER_SCIENCE',
        level: ['GYMNASIUM', 'ABITUR', 'COMPETITION'],
      },
      {
        tutorId: tutor2.id,
        subject: 'MATHEMATICS',
        level: ['GYMNASIUM', 'ABITUR'],
      },
    ],
  })

  // Create a sample student
  const studentPassword = await bcrypt.hash('student123', 10)

  const studentUser = await prisma.user.create({
    data: {
      email: 'anna.schmidt@example.com',
      password: studentPassword,
      firstName: 'Anna',
      lastName: 'Schmidt',
      phone: '+49 176 9876543',
      role: 'STUDENT',
      language: 'DE',
    },
  })

  await prisma.student.create({
    data: {
      userId: studentUser.id,
      age: 16,
      schoolType: 'GYMNASIUM',
      grade: 11,
      goals: 'Abitur-Vorbereitung in Mathematik',
      learningStyle: 'VISUAL',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test Accounts:')
  console.log('Tutor 1: max.mueller@roma-munich.de / password123')
  console.log('Tutor 2: sophie.weber@roma-munich.de / password123')
  console.log('Student: anna.schmidt@example.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
