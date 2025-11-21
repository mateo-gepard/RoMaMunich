import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "romamunich-7472d",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()
const auth = getAuth()

async function clearFirestore() {
  console.log('🗑️  Starting Firestore cleanup...\n')

  try {
    // Delete all bookings
    console.log('📅 Deleting all bookings...')
    const bookingsSnapshot = await db.collection('bookings').get()
    const bookingDeletePromises = bookingsSnapshot.docs.map(doc => doc.ref.delete())
    await Promise.all(bookingDeletePromises)
    console.log(`✅ Deleted ${bookingsSnapshot.size} bookings\n`)

    // Delete all tutors
    console.log('👨‍🏫 Deleting all tutors...')
    const tutorsSnapshot = await db.collection('tutors').get()
    const tutorDeletePromises = tutorsSnapshot.docs.map(doc => doc.ref.delete())
    await Promise.all(tutorDeletePromises)
    console.log(`✅ Deleted ${tutorsSnapshot.size} tutors\n`)

    // Delete all messages
    console.log('💬 Deleting all messages...')
    const messagesSnapshot = await db.collection('messages').get()
    const messageDeletePromises = messagesSnapshot.docs.map(doc => doc.ref.delete())
    await Promise.all(messageDeletePromises)
    console.log(`✅ Deleted ${messagesSnapshot.size} messages\n`)

    // Delete all users from Authentication
    console.log('👥 Deleting all user accounts...')
    const listUsersResult = await auth.listUsers()
    const userDeletePromises = listUsersResult.users.map(user => auth.deleteUser(user.uid))
    await Promise.all(userDeletePromises)
    console.log(`✅ Deleted ${listUsersResult.users.length} user accounts\n`)

    console.log('🎉 Firestore cleanup completed successfully!')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
}

// Run the cleanup
clearFirestore()
  .then(() => {
    console.log('\n✨ All data has been cleared from Firestore and Authentication!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
