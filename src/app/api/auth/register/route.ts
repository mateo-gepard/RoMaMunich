import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, role } = body

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt sein' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      )
    }

    // Check if user exists in Firebase Auth
    try {
      await adminAuth.getUserByEmail(email)
      return NextResponse.json(
        { error: 'Ein Benutzer mit dieser E-Mail existiert bereits' },
        { status: 409 }
      )
    } catch (error: any) {
      // User doesn't exist, continue with registration
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    })

    // Hash password for Firestore backup
    const hashedPassword = await bcrypt.hash(password, 10)

    // Store additional user data in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      role: role === 'PARENT' ? 'PARENT' : 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: 'Registrierung erfolgreich',
        user: {
          id: userRecord.uid,
          name,
          email,
          role: role === 'PARENT' ? 'PARENT' : 'STUDENT',
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}