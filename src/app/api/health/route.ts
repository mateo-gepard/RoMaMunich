import { NextResponse } from 'next/server'

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    nextauth: {
      secret: process.env.NEXTAUTH_SECRET ? 'configured' : 'missing',
      url: process.env.NEXTAUTH_URL || 'not set',
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'missing',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'configured' : 'missing',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'configured' : 'missing',
    }
  })
}

