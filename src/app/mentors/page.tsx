'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Award, GraduationCap, Star, Trophy, Filter, ChevronDown } from 'lucide-react'

interface Tutor {
  id: number
  name: string
  age: number
  subjects: string[]
  achievements: string[]
  earlyStudy: string
  rating: number
  sessions: number
  image?: string
}

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const subjects = [
    'Alle Fächer',
    'Mathematik',
    'Physik',
    'Chemie',
    'Informatik',
    'Biologie',
    'Deutsch',
    'Englisch',
  ]

  useEffect(() => {
    // Load tutors
    const loadTutors = async () => {
      try {
        const response = await fetch('/api/tutors')
        const data = await response.json()
        setTutors(data.tutors || mockTutors)
      } catch (error) {
        setTutors(mockTutors)
      } finally {
        setIsLoading(false)
      }
    }
    loadTutors()
  }, [])

  const mockTutors: Tutor[] = [
    {
      id: 1,
      name: 'Max Müller',
      age: 19,
      subjects: ['Mathematik', 'Physik'],
      achievements: [
        '1. Preis Bundesweite Mathematik-Olympiade 2023',
        'Silbermedaille IPhO 2024',
      ],
      earlyStudy: 'Mathematik, TUM',
      rating: 5.0,
      sessions: 120,
    },
    {
      id: 2,
      name: 'Sophie Weber',
      age: 18,
      subjects: ['Informatik', 'Mathematik'],
      achievements: [
        'Gold Bundeswettbewerb Informatik 2024',
        'Leiterin Robotik-AG am Max-Gymnasium',
      ],
      earlyStudy: 'Informatik, LMU',
      rating: 5.0,
      sessions: 95,
    },
    {
      id: 3,
      name: 'Leon Schmidt',
      age: 19,
      subjects: ['Mathematik', 'Chemie'],
      achievements: [
        '2. Preis Jugend forscht (Bundesebene)',
        'Teilnehmer Internationale Chemie-Olympiade',
      ],
      earlyStudy: 'Chemie, TUM',
      rating: 4.9,
      sessions: 78,
    },
    {
      id: 4,
      name: 'Emma Fischer',
      age: 17,
      subjects: ['Biologie', 'Chemie'],
      achievements: [
        'Bronze Internationale Biologie-Olympiade',
        'Schülerlabor-Programm am Deutschen Museum',
      ],
      earlyStudy: 'Molekulare Medizin, LMU',
      rating: 4.9,
      sessions: 62,
    },
    {
      id: 5,
      name: 'Jonas Klein',
      age: 18,
      subjects: ['Deutsch', 'Englisch'],
      achievements: [
        'Landessieger Vorlesewettbewerb Bayern',
        'Cambridge Certificate C2',
      ],
      earlyStudy: 'Germanistik & Anglistik, LMU',
      rating: 5.0,
      sessions: 85,
    },
  ]

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSubject =
      selectedSubject === 'all' ||
      selectedSubject === 'Alle Fächer' ||
      tutor.subjects.includes(selectedSubject)

    return matchesSearch && matchesSubject
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-16">
        <div className="container-premium">
          <Link
            href="/"
            className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-purple">Unsere Mentoren</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Elite-Schüler aus München mit Olympiade-Erfolgen, Frühstudium und nachgewiesenen Erfolgen.
          </p>
        </div>
      </div>

      <div className="container-premium py-12">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Suche nach Namen oder Fach..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none px-6 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="all">Alle Fächer</option>
                {subjects.slice(1).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-navy-900">{filteredTutors.length}</span> Mentoren gefunden
          </p>
        </div>

        {/* Tutors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Lade Mentoren...</p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">Keine Mentoren gefunden. Versuche eine andere Suche.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="card-premium hover:scale-105 transition-transform">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-navy-900 mb-1">
                      {tutor.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{tutor.age} Jahre</p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Award className="text-teal-600" size={24} />
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Early Study */}
                <div className="flex items-center space-x-2 mb-4 text-gray-700">
                  <GraduationCap size={18} className="text-teal-500" />
                  <span className="text-sm font-medium">{tutor.earlyStudy}</span>
                </div>

                {/* Achievements */}
                <div className="space-y-2 mb-4">
                  {tutor.achievements.slice(0, 2).map((achievement, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <Trophy className="text-teal-500 flex-shrink-0 mt-1" size={16} />
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
                  <div>
                    <div className="flex items-center space-x-1 text-teal-500 font-semibold">
                      <Star className="fill-teal-500" size={18} />
                      <span className="text-lg">{tutor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">{tutor.sessions} Sessions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-navy-900">
                      Erste Stunde kostenlos
                    </div>
                    <div className="text-xs text-gray-500">Danach 35€/h</div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/matching?tutor=${tutor.id}`}
                  className="block w-full text-center py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Jetzt anfragen
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-navy-900 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Nicht sicher, welcher Mentor passt?</h2>
          <p className="text-xl text-gray-300 mb-6">
            Unser Matching-Quiz findet in 2 Minuten den perfekten Mentor für dich.
          </p>
          <Link
            href="/matching"
            className="inline-block px-8 py-4 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors"
          >
            Matching starten
          </Link>
        </div>
      </div>
    </div>
  )
}
