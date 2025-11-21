'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Calendar as CalendarIcon,
  MessageCircle,
  Settings,
  LogOut,
  User,
  Clock,
  Video,
  MapPin,
  X,
  Send,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface Session {
  id: string
  date: string
  time: string
  endTime: string
  subject: string
  tutorName: string
  tutorId: string
  duration: number
  location: 'online' | 'in-person'
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
  meetingLink?: string
}

const MASTER_TUTOR_EMAIL = 'mateo.mamaladze@gmail.com'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackText, setFeedbackText] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [unreadMessages, setUnreadMessages] = useState(0)
  
  // Master tutor functionality
  const isMasterTutor = session?.user?.email === MASTER_TUTOR_EMAIL
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [bookingToReject, setBookingToReject] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Load unread message count
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!session?.user) return
      try {
        const response = await fetch('/api/messages')
        const data = await response.json()
        const totalUnread = data.conversations?.reduce(
          (sum: number, conv: any) => sum + (conv.unreadCount || 0),
          0
        ) || 0
        setUnreadMessages(totalUnread)
      } catch (error) {
        console.error('Error loading unread count:', error)
      }
    }
    
    if (session) {
      loadUnreadCount()
      // Poll for updates every 10 seconds
      const interval = setInterval(loadUnreadCount, 10000)
      return () => clearInterval(interval)
    }
  }, [session])

  useEffect(() => {
    const fetchSessions = async () => {
      // Load real sessions from API
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setSessions(data.sessions || [])
          
          // For master tutor, also load all bookings
          if (isMasterTutor) {
            setAllBookings(data.allBookings || data.sessions || [])
          }
        } else {
          setSessions([])
        }
      } catch (error) {
        console.error('Error loading sessions:', error)
        setSessions([])
      }
    }

    if (session) {
      fetchSessions()
    }
  }, [session, isMasterTutor])

  const handleCancelSession = async (sessionId: string) => {
    if (!cancellationReason.trim()) {
      alert('Bitte geben Sie einen Grund für die Stornierung an.')
      return
    }

    setLoading(true)
    try {
      // API call to cancel session with reason
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          reason: cancellationReason,
          session: selectedSession 
        }),
      })

      if (response.ok) {
        setSessions(sessions.map(s => 
          s.id === sessionId ? { ...s, status: 'cancelled' as const } : s
        ))
        setShowCancelModal(false)
        setSelectedSession(null)
        setCancellationReason('')
        alert('Session erfolgreich storniert. Der Tutor wurde benachrichtigt.')
      } else {
        alert('Fehler beim Stornieren der Session.')
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
      alert('Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedSession) return
    
    setLoading(true)
    try {
      // API call to send message with reply-to system
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: selectedSession.tutorId,
          tutorName: selectedSession.tutorName,
          subject: selectedSession.subject,
          message: messageText,
          sessionId: selectedSession.id,
        }),
      })

      if (response.ok) {
        setMessageText('')
        setShowMessageModal(false)
        setSelectedSession(null)
        alert('Nachricht erfolgreich gesendet!')
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        alert('Fehler beim Senden der Nachricht.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!selectedSession) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/bookings/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          rating: feedbackRating,
          feedback: feedbackText,
          bookingData: {
            tutorId: selectedSession.tutorId,
            tutorName: selectedSession.tutorName,
            subject: selectedSession.subject,
            studentName: session?.user?.name || 'Student',
            date: selectedSession.date,
            time: selectedSession.time,
          }
        }),
      })

      if (response.ok) {
        setFeedbackRating(5)
        setFeedbackText('')
        setShowFeedbackModal(false)
        setSelectedSession(null)
        // Refresh sessions to show updated rating
        const refreshResponse = await fetch('/api/bookings')
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          setSessions(data.sessions || [])
        }
        alert('Feedback erfolgreich gesendet! Der Tutor wurde benachrichtigt.')
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        alert('Fehler beim Senden des Feedbacks.')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  // Master tutor approval handlers
  const handleApproveBooking = async (bookingId: string) => {
    setApprovalLoading(bookingId)
    try {
      const response = await fetch('/api/bookings/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action: 'approve' }),
      })

      if (response.ok) {
        // Update local state
        setAllBookings(allBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'confirmed' } : b
        ))
        alert('Buchung erfolgreich bestätigt!')
      } else {
        const data = await response.json()
        alert(`Fehler: ${data.error}`)
      }
    } catch (error) {
      console.error('Error approving booking:', error)
      alert('Ein Fehler ist aufgetreten.')
    } finally {
      setApprovalLoading(null)
    }
  }

  const handleRejectBooking = async () => {
    if (!bookingToReject) return

    if (!rejectionReason.trim()) {
      alert('Bitte gib einen Grund für die Ablehnung an.')
      return
    }

    setApprovalLoading(bookingToReject.id)
    try {
      const response = await fetch('/api/bookings/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId: bookingToReject.id, 
          action: 'reject',
          reason: rejectionReason 
        }),
      })

      if (response.ok) {
        // Update local state
        setAllBookings(allBookings.map(b => 
          b.id === bookingToReject.id ? { ...b, status: 'cancelled' } : b
        ))
        setShowRejectModal(false)
        setBookingToReject(null)
        setRejectionReason('')
        alert('Buchung abgelehnt.')
      } else {
        const data = await response.json()
        alert(`Fehler: ${data.error}`)
      }
    } catch (error) {
      console.error('Error rejecting booking:', error)
      alert('Ein Fehler ist aufgetreten.')
    } finally {
      setApprovalLoading(null)
    }
  }

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

  const now = new Date()
  
  const getSessionEndTime = (sess: Session) => {
    if (!sess.endTime) return new Date(sess.date)
    const [hours, minutes] = sess.endTime.split(':').map(Number)
    const endDateTime = new Date(sess.date)
    endDateTime.setHours(hours, minutes, 0, 0)
    return endDateTime
  }

  const upcomingSessions = sessions.filter(s => {
    if (s.status === 'cancelled') return false
    if (s.status === 'pending' || s.status === 'confirmed') {
      const endTime = getSessionEndTime(s)
      return endTime > now
    }
    return false
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastSessions = sessions.filter(s => {
    if (s.status === 'completed' || s.status === 'cancelled') return true
    if (s.status === 'confirmed') {
      const endTime = getSessionEndTime(s)
      return endTime <= now
    }
    return false
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
              <span className="text-gray-600 hidden sm:block">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-gray-600 hover:text-navy-900 transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Abmelden</span>
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
              className="flex items-center space-x-3 px-4 py-3 bg-navy-600 text-white rounded-lg font-medium transition-colors"
            >
              <CalendarIcon size={20} />
              <span>Meine Sessions</span>
            </Link>
            <Link
              href="/booking"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              <span>Session buchen</span>
            </Link>
            <Link
              href="/dashboard/messages"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              <MessageCircle size={20} />
              <span>Nachrichten</span>
              {unreadMessages > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              <Settings size={20} />
              <span>Einstellungen</span>
            </Link>
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-navy-900 mb-1">
                  Willkommen zurück!
                </h1>
                <p className="text-gray-600">
                  Verwalten Sie Ihre Mentoring-Sessions
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-navy-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-navy-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Kalender
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Anstehend</p>
                    <p className="text-3xl font-bold text-navy-900">
                      {upcomingSessions.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Abgeschlossen</p>
                    <p className="text-3xl font-bold text-navy-900">
                      {pastSessions.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gesamt Stunden</p>
                    <p className="text-3xl font-bold text-navy-900">
                      {sessions.reduce((acc, s) => acc + s.duration, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Master Tutor: Pending Bookings Approval Section */}
            {isMasterTutor && allBookings.filter(b => b.status === 'pending').length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy-900">
                      Buchungen zur Genehmigung
                    </h2>
                    <p className="text-sm text-gray-600">
                      {allBookings.filter(b => b.status === 'pending').length} Buchung(en) warten auf Bestätigung
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {allBookings
                    .filter(b => b.status === 'pending')
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-lg p-4 border border-amber-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-navy-900">
                                {booking.contactInfo?.name || 'Unbekannt'}
                              </h3>
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                Ausstehend
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>{booking.tutorName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon size={14} />
                                <span>
                                  {new Date(booking.date).toLocaleDateString('de-DE', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric' 
                                  })} um {booking.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {booking.location === 'online' ? <Video size={14} /> : <MapPin size={14} />}
                                <span>{booking.location === 'online' ? 'Online' : 'Vor Ort'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">
                                  Paket: {booking.packageDetails?.name || booking.package}
                                </span>
                              </div>
                            </div>
                            {booking.contactInfo?.message && (
                              <div className="mt-2 text-sm text-gray-600 italic">
                                "{booking.contactInfo.message}"
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveBooking(booking.id)}
                              disabled={approvalLoading === booking.id}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                              {approvalLoading === booking.id ? '...' : 'Bestätigen'}
                            </button>
                            <button
                              onClick={() => {
                                setBookingToReject(booking)
                                setShowRejectModal(true)
                              }}
                              disabled={approvalLoading === booking.id}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                              Ablehnen
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-bold text-navy-900 mb-4">
                  Kalender Ansicht
                </h2>
                <div className="calendar-container">
                  <Calendar
                    onChange={(value) => setSelectedDate(value as Date)}
                    value={selectedDate}
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        const sessionsOnDate = sessions.filter(
                          (s) => new Date(s.date).toDateString() === date.toDateString()
                        )
                        if (sessionsOnDate.length > 0) {
                          return (
                            <div className="flex justify-center mt-1">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            </div>
                          )
                        }
                      }
                      return null
                    }}
                    className="w-full border-none"
                  />
                </div>
                
                {/* Sessions on selected date */}
                {sessions.filter(
                  (s) => new Date(s.date).toDateString() === selectedDate.toDateString()
                ).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-navy-900 mb-3">
                      Sessions am {selectedDate.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </h3>
                    <div className="space-y-3">
                      {sessions
                        .filter(
                          (s) => new Date(s.date).toDateString() === selectedDate.toDateString()
                        )
                        .map((sess) => (
                          <div
                            key={sess.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-navy-900">
                                  {sess.subject} mit {sess.tutorName}
                                </h4>
                                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {sess.time} - {sess.endTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {sess.location === 'online' ? (
                                      <>
                                        <Video size={14} />
                                        Online
                                      </>
                                    ) : (
                                      <>
                                        <MapPin size={14} />
                                        Vor Ort
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  sess.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : sess.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : sess.status === 'completed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {sess.status === 'confirmed' && 'Bestätigt'}
                                {sess.status === 'pending' && 'Ausstehend'}
                                {sess.status === 'completed' && 'Abgeschlossen'}
                                {sess.status === 'cancelled' && 'Storniert'}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* List View - Upcoming Sessions */}
            {viewMode === 'list' && upcomingSessions.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-bold text-navy-900 mb-4">
                  Nächste Sessions
                </h2>
                <div className="space-y-3">
                  {upcomingSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-navy-900 text-lg">
                              {sess.subject} mit {sess.tutorName}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={16} />
                              {new Date(sess.date).toLocaleDateString('de-DE', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={16} />
                              {sess.time} - {sess.endTime} ({sess.duration}h)
                            </span>
                            <span className="flex items-center gap-1">
                              {sess.location === 'online' ? (
                                <>
                                  <Video size={16} />
                                  Online
                                </>
                              ) : (
                                <>
                                  <MapPin size={16} />
                                  Vor Ort
                                </>
                              )}
                            </span>
                          </div>
                          {sess.notes && (
                            <p className="text-sm text-gray-500 mt-2">
                              {sess.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap sm:flex-col gap-2">
                          {sess.location === 'online' && sess.meetingLink && (
                            <a
                              href={sess.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                            >
                              Meeting beitreten
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setSelectedSession(sess)
                              setShowMessageModal(true)
                            }}
                            className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm font-medium"
                          >
                            Nachricht senden
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSession(sess)
                              setShowCancelModal(true)
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            Stornieren
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Sessions */}
            {viewMode === 'list' && pastSessions.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-bold text-navy-900 mb-4">
                  Vergangene Sessions
                </h2>
                <div className="space-y-3">
                  {pastSessions.slice(0, 5).map((sess) => (
                    <div
                      key={sess.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-navy-900">
                              {sess.subject} mit {sess.tutorName}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={16} />
                              {new Date(sess.date).toLocaleDateString('de-DE')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={16} />
                              {sess.time} ({sess.duration}h)
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSession(sess)
                              setShowFeedbackModal(true)
                            }}
                            className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm font-medium"
                          >
                            Feedback geben
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {viewMode === 'list' && upcomingSessions.length === 0 && pastSessions.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-soft">
                <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Noch keine Sessions gebucht
                </h3>
                <p className="text-gray-600 mb-6">
                  Buchen Sie Ihre erste Session und starten Sie Ihre Lernreise!
                </p>
                <Link
                  href="/booking"
                  className="inline-block px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors font-medium"
                >
                  Session buchen
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy-900">
                Session stornieren
              </h3>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setSelectedSession(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Möchten Sie die Session am{' '}
              {new Date(selectedSession.date).toLocaleDateString('de-DE')} um{' '}
              {selectedSession.time} wirklich stornieren?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Stornierungen sind bis 24 Stunden vor der Session kostenlos.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grund für die Stornierung *
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                placeholder="Bitte teilen Sie uns den Grund mit..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setSelectedSession(null)
                  setCancellationReason('')
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleCancelSession(selectedSession.id)}
                disabled={loading || !cancellationReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Wird storniert...' : 'Stornieren'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy-900">
                Nachricht an {selectedSession.tutorName}
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setSelectedSession(null)
                  setMessageText('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ihre Nachricht
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                placeholder="Schreiben Sie Ihre Nachricht..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setSelectedSession(null)
                  setMessageText('')
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSendMessage}
                disabled={loading || !messageText.trim()}
                className="flex-1 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Wird gesendet...' : 'Senden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy-900">
                Feedback für {selectedSession.tutorName}
              </h3>
              <button
                onClick={() => {
                  setShowFeedbackModal(false)
                  setSelectedSession(null)
                  setFeedbackRating(5)
                  setFeedbackText('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bewertung
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackRating(rating)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        rating <= feedbackRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kommentar (optional)
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                placeholder="Teilen Sie Ihre Erfahrung..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFeedbackModal(false)
                  setSelectedSession(null)
                  setFeedbackRating(5)
                  setFeedbackText('')
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Wird gesendet...' : 'Feedback senden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Booking Modal (Master Tutor) */}
      {showRejectModal && bookingToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-navy-900">
                Buchung ablehnen
              </h3>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setBookingToReject(null)
                  setRejectionReason('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Möchten Sie die Buchung von{' '}
              <strong>{bookingToReject.contactInfo?.name}</strong> wirklich ablehnen?
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-700">
              <p><strong>Datum:</strong> {new Date(bookingToReject.date).toLocaleDateString('de-DE')} um {bookingToReject.time}</p>
              <p><strong>Tutor:</strong> {bookingToReject.tutorName}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grund für die Ablehnung *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                placeholder="Bitte gib den Grund an (wird an den Kunden gesendet)..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setBookingToReject(null)
                  setRejectionReason('')
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={handleRejectBooking}
                disabled={approvalLoading !== null || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {approvalLoading ? 'Wird abgelehnt...' : 'Ablehnen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
