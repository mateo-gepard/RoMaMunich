'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Booking, Package } from '@/lib/supabase'
import { Calendar, Clock, BookOpen, Package as PackageIcon, LogOut, User } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      loadData()
    }
  }, [user, authLoading])

  const loadData = async () => {
    if (!user) return

    try {
      // Load bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          tutor:tutors(*),
          subject:subjects(*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      // Load packages
      const { data: packagesData } = await supabase
        .from('packages')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('purchased_at', { ascending: false })

      setBookings(bookingsData || [])
      setPackages(packagesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
        <div className="text-white text-xl">Laden...</div>
      </div>
    )
  }

  const totalAvailableLessons = packages.reduce((sum, pkg) => sum + (pkg.lessons_total - pkg.lessons_used), 0)
  const upcomingBookings = bookings.filter(b => b.status !== 'cancelled' && new Date(b.date) >= new Date())
  const pastBookings = bookings.filter(b => new Date(b.date) < new Date() || b.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container-premium py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300 mt-1">Willkommen, {profile?.full_name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/buchen"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all"
              >
                Neue Buchung
              </Link>
              <button
                onClick={handleSignOut}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-premium py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Verfügbare Stunden</p>
                <p className="text-3xl font-bold text-white">{totalAvailableLessons}</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-lg">
                <Clock className="text-purple-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Kommende Termine</p>
                <p className="text-3xl font-bold text-white">{upcomingBookings.length}</p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-lg">
                <Calendar className="text-green-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Aktive Pakete</p>
                <p className="text-3xl font-bold text-white">{packages.length}</p>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-lg">
                <PackageIcon className="text-blue-400" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Packages Section */}
        {packages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Meine Pakete</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white capitalize">
                        {pkg.package_type.replace('_', ' ')} Paket
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Gekauft am {format(new Date(pkg.purchased_at), 'dd.MM.yyyy', { locale: de })}
                      </p>
                    </div>
                    <PackageIcon className="text-purple-400" size={24} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Verbleibend:</span>
                      <span className="text-white font-semibold">
                        {pkg.lessons_total - pkg.lessons_used} / {pkg.lessons_total} Stunden
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${((pkg.lessons_total - pkg.lessons_used) / pkg.lessons_total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Kommende Termine</h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                          {booking.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
                        </span>
                        {booking.booking_type === 'trial' && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">
                            Probestunde
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {booking.subject?.name} mit {booking.tutor?.name}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{format(new Date(booking.date), 'EEEE, dd. MMMM yyyy', { locale: de })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>{booking.start_time} - {booking.end_time} Uhr</span>
                        </div>
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-sm text-gray-400">{booking.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Vergangene Termine</h2>
            <div className="space-y-4">
              {pastBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {booking.status === 'completed' ? 'Abgeschlossen' : 'Storniert'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {booking.subject?.name} mit {booking.tutor?.name}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{format(new Date(booking.date), 'dd.MM.yyyy', { locale: de })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>{booking.start_time} - {booking.end_time} Uhr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 && packages.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-gray-500 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">Noch keine Buchungen</h3>
            <p className="text-gray-400 mb-8">Buche jetzt deine erste Stunde mit einem unserer Top-Mentoren!</p>
            <Link
              href="/buchen"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all shadow-xl"
            >
              <span>Jetzt buchen</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

