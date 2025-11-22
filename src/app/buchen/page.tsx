'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Tutor, Subject } from '@/lib/supabase'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { Calendar, Clock, User, BookOpen, Check } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export default function BookingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingType, setBookingType] = useState<'trial' | 'regular'>('trial')
  const [hasTrialLesson, setHasTrialLesson] = useState(false)
  const [availableLessons, setAvailableLessons] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (user) {
      checkTrialStatus()
      checkAvailableLessons()
    }
  }, [user])

  const loadData = async () => {
    // Load tutors
    const { data: tutorsData } = await supabase
      .from('tutors')
      .select(`
        *,
        tutor_subjects(subject_id, subjects(*))
      `)
      .eq('available', true)

    // Load subjects
    const { data: subjectsData } = await supabase
      .from('subjects')
      .select('*')
      .order('name')

    if (tutorsData) {
      const formattedTutors = tutorsData.map(t => ({
        ...t,
        subjects: t.tutor_subjects?.map((ts: any) => ts.subjects) || []
      }))
      setTutors(formattedTutors)
    }
    setSubjects(subjectsData || [])
  }

  const checkTrialStatus = async () => {
    if (!user) return
    const { data } = await supabase.rpc('has_trial_lesson', { user_uuid: user.id })
    setHasTrialLesson(data || false)
    if (data) {
      setBookingType('regular')
    }
  }

  const checkAvailableLessons = async () => {
    if (!user) return
    const { data } = await supabase.rpc('get_available_lessons', { user_uuid: user.id })
    setAvailableLessons(data || 0)
  }

  const handleTutorSelect = (tutor: Tutor) => {
    setSelectedTutor(tutor)
    setStep(2)
  }

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const handleBooking = async () => {
    if (!user || !selectedTutor || selectedSubjects.length === 0 || !selectedDate || !selectedTime) {
      alert('Bitte fülle alle Felder aus')
      return
    }

    if (bookingType === 'regular' && availableLessons === 0) {
      alert('Du hast keine verfügbaren Stunden mehr. Bitte kaufe ein Paket.')
      router.push('/pakete')
      return
    }

    setLoading(true)

    try {
      // Get user's active package if booking is regular
      let packageId = null
      if (bookingType === 'regular') {
        const { data: packages } = await supabase
          .from('packages')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .order('purchased_at', { ascending: true })
          .limit(1)

        if (packages && packages.length > 0 && packages[0].lessons_used < packages[0].lessons_total) {
          packageId = packages[0].id
        }
      }

      // Create booking for each subject
      const bookings = selectedSubjects.map(subjectId => ({
        user_id: user.id,
        tutor_id: selectedTutor.id,
        subject_id: subjectId,
        package_id: packageId,
        booking_type: bookingType,
        date: selectedDate,
        start_time: selectedTime,
        end_time: calculateEndTime(selectedTime),
        duration_minutes: 60,
        status: 'pending',
        notes,
      }))

      const { error } = await supabase.from('bookings').insert(bookings)

      if (error) throw error

      // Update package lesson count if regular booking
      if (packageId) {
        const { error: pkgError } = await supabase.rpc('increment', {
          row_id: packageId,
          x: selectedSubjects.length,
        })
      }

      alert('Buchung erfolgreich! Du erhältst bald eine Bestätigung.')
      router.push('/dashboard')
    } catch (error) {
      console.error('Booking error:', error)
      alert('Fehler bei der Buchung. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHours = hours + 1
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const filteredTutors = selectedSubjects.length > 0
    ? tutors.filter(t => t.subjects?.some(s => selectedSubjects.includes(s.id)))
    : tutors

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
      <div className="text-white text-xl">Laden...</div>
    </div>
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 pt-24 pb-20">
        <div className="container-premium">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Buche deine {bookingType === 'trial' ? 'Probestunde' : 'Stunde'}
              </h1>
              <p className="text-xl text-gray-300">
                {bookingType === 'trial' 
                  ? 'Lerne deinen Mentor kennen – kostenlos und unverbindlich'
                  : `Du hast noch ${availableLessons} verfügbare Stunden`
                }
              </p>
            </div>

            {/* Booking Type Selection */}
            {!hasTrialLesson && (
              <div className="mb-8 flex justify-center space-x-4">
                <button
                  onClick={() => setBookingType('trial')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    bookingType === 'trial'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Probestunde (Kostenlos)
                </button>
                <button
                  onClick={() => setBookingType('regular')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    bookingType === 'regular'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Reguläre Stunde
                </button>
              </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-24 h-1 ${
                        step > s ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Tutor Selection */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Wähle deinen Mentor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      onClick={() => handleTutorSelect(tutor)}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500 cursor-pointer transition-all hover:scale-105"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <User className="text-purple-400" size={32} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{tutor.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {tutor.subjects?.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>
                      {tutor.bio && (
                        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{tutor.bio}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          ab {bookingType === 'trial' ? tutor.hourly_rate_trial : tutor.hourly_rate_regular}€/Std
                        </span>
                        <span className="text-purple-400 font-semibold">Auswählen →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Subject & Date Selection */}
            {step === 2 && selectedTutor && (
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="mb-6 text-purple-400 hover:text-purple-300"
                >
                  ← Zurück zur Mentor-Auswahl
                </button>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
                  <h3 className="text-lg font-bold text-white mb-2">Gewählter Mentor</h3>
                  <p className="text-gray-300">{selectedTutor.name}</p>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Wähle Fächer</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                  {selectedTutor.subjects?.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectToggle(subject.id)}
                      className={`p-4 rounded-xl font-semibold transition-all ${
                        selectedSubjects.includes(subject.id)
                          ? 'bg-purple-500 text-white border-2 border-purple-400'
                          : 'bg-white/5 text-gray-300 border-2 border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{subject.icon}</div>
                      {subject.name}
                      {selectedSubjects.includes(subject.id) && (
                        <Check className="inline ml-2" size={20} />
                      )}
                    </button>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-white mb-6">Wähle Datum & Zeit</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Datum
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Uhrzeit
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Wähle eine Zeit</option>
                      {Array.from({ length: 11 }, (_, i) => i + 9).map(hour => (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00 Uhr
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notizen (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Besondere Wünsche oder Themen..."
                  />
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={selectedSubjects.length === 0 || !selectedDate || !selectedTime}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Weiter zur Bestätigung
                </button>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && selectedTutor && (
              <div>
                <button
                  onClick={() => setStep(2)}
                  className="mb-6 text-purple-400 hover:text-purple-300"
                >
                  ← Zurück
                </button>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Bestätige deine Buchung
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-gray-400">Mentor:</span>
                      <span className="text-white font-semibold">{selectedTutor.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-gray-400">Fächer:</span>
                      <span className="text-white font-semibold">
                        {subjects.filter(s => selectedSubjects.includes(s.id)).map(s => s.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-gray-400">Datum:</span>
                      <span className="text-white font-semibold">
                        {format(new Date(selectedDate), 'EEEE, dd. MMMM yyyy', { locale: de })}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-gray-400">Zeit:</span>
                      <span className="text-white font-semibold">
                        {selectedTime} - {calculateEndTime(selectedTime)} Uhr
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-gray-400">Typ:</span>
                      <span className="text-white font-semibold">
                        {bookingType === 'trial' ? 'Probestunde (Kostenlos)' : 'Reguläre Stunde'}
                      </span>
                    </div>
                    {notes && (
                      <div className="py-3">
                        <span className="text-gray-400 block mb-2">Notizen:</span>
                        <p className="text-white">{notes}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Buchung läuft...' : 'Jetzt verbindlich buchen'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
