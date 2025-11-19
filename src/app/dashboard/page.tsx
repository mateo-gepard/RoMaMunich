'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Settings,
  LogOut,
  User,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalSessions: number
  upcomingSessions: number
  completedTopics: number
  currentStreak: number
}

interface UpcomingSession {
  id: string
  date: string
  time: string
  subject: string
  tutorName: string
  duration: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    upcomingSessions: 0,
    completedTopics: 0,
    currentStreak: 0,
  })
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      // Mock data - replace with actual API calls
      setStats({
        totalSessions: 12,
        upcomingSessions: 3,
        completedTopics: 8,
        currentStreak: 4,
      })

      setUpcomingSessions([
        {
          id: '1',
          date: '2024-01-15',
          time: '16:00',
          subject: 'Mathematik',
          tutorName: 'Max Müller',
          duration: 1.5,
        },
        {
          id: '2',
          date: '2024-01-17',
          time: '14:00',
          subject: 'Physik',
          tutorName: 'Sophie Weber',
          duration: 2,
        },
      ])
    }

    if (session) {
      fetchDashboardData()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-premium py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RM</span>
              </div>
              <span className="font-serif font-bold text-2xl text-navy-900">
                RoMa Munich
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Hallo, {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-gray-600 hover:text-navy-900"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-premium py-8">
        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 bg-navy-600 text-white rounded-lg font-medium"
            >
              <User size={20} />
              <span>Übersicht</span>
            </Link>
            <Link
              href="/dashboard/sessions"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              <Calendar size={20} />
              <span>Meine Sessions</span>
            </Link>
            <Link
              href="/dashboard/learning-plan"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              <BookOpen size={20} />
              <span>Lernplan</span>
            </Link>
            <Link
              href="/dashboard/progress"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              <TrendingUp size={20} />
              <span>Fortschritt</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              <Settings size={20} />
              <span>Einstellungen</span>
            </Link>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-700 text-white rounded-2xl p-8">
              <h1 className="text-3xl font-bold mb-2">
                Willkommen zurück, {session.user?.name}!
              </h1>
              <p className="text-gray-300">
                Bereit für deine nächste Session? Dein Fortschritt sieht
                großartig aus! 🚀
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="text-navy-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {stats.totalSessions}
                </div>
                <div className="text-sm text-gray-600">Gesamt Sessions</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="text-gold-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {stats.upcomingSessions}
                </div>
                <div className="text-sm text-gray-600">Anstehend</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="text-green-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {stats.completedTopics}
                </div>
                <div className="text-sm text-gray-600">Abgeschlossene Themen</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <Award className="text-orange-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {stats.currentStreak} 🔥
                </div>
                <div className="text-sm text-gray-600">Tage Streak</div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                Nächste Sessions
              </h2>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-navy-600" size={24} />
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900">
                          {session.subject}
                        </div>
                        <div className="text-sm text-gray-600">
                          mit {session.tutorName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-navy-900">
                        {new Date(session.date).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.time} • {session.duration}h
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/sessions"
                className="block mt-6 text-center text-navy-600 font-semibold hover:text-navy-800"
              >
                Alle Sessions ansehen →
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
