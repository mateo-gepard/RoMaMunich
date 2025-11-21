import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email und Passwort erforderlich')
        }

        try {
          const userRecord = await adminAuth.getUserByEmail(credentials.email)
          const userDoc = await adminDb.collection('users').doc(userRecord.uid).get()
          
          if (!userDoc.exists) {
            throw new Error('Benutzer nicht gefunden')
          }

          const userData = userDoc.data()
          const isValid = await bcrypt.compare(credentials.password, userData?.password || '')
          
          if (!isValid) {
            throw new Error('Ungültiges Passwort')
          }

          return {
            id: userRecord.uid,
            email: userRecord.email || '',
            name: userData?.name || '',
            role: userData?.role || 'STUDENT',
          }
        } catch (error: any) {
          console.error('Auth error:', error)
          throw new Error('Anmeldung fehlgeschlagen')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata)
    }
  },
}
