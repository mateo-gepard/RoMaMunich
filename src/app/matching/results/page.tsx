'use client'

import { Award, Star, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function MatchingResultsPage() {
  // In production, this would come from the API based on quiz results
  const matchedTutors = [
    {
      id: 1,
      name: 'Max Müller',
      matchScore: 98,
      age: 19,
      subjects: ['Mathematik', 'Physik'],
      rating: 5.0,
      totalSessions: 120,
      achievements: [
        '1. Preis Bundesweite Mathematik-Olympiade 2023',
        'Silbermedaille IPhO 2024',
      ],
      earlyStudy: 'Mathematik, TUM',
      availability: ['Mo 16-19', 'Mi 14-18', 'Fr 16-20'],
      matchReasons: [
        'Spezialist für dein Niveau',
        'Erfahrung mit deinem Lernstil',
        'Sofort verfügbar',
      ],
    },
    {
      id: 2,
      name: 'Sophie Weber',
      matchScore: 95,
      age: 18,
      subjects: ['Mathematik', 'Informatik'],
      rating: 5.0,
      totalSessions: 95,
      achievements: [
        'Gold Bundeswettbewerb Informatik 2024',
        'Leiterin Robotik-AG am Max-Gymnasium',
      ],
      earlyStudy: 'Informatik, LMU',
      availability: ['Di 15-18', 'Do 16-19', 'Sa 10-14'],
      matchReasons: [
        'Perfekt für dein Ziel',
        'Spricht deine Sprache',
        'Ähnlicher Hintergrund',
      ],
    },
    {
      id: 3,
      name: 'Leon Schmidt',
      matchScore: 92,
      age: 19,
      subjects: ['Mathematik', 'Chemie'],
      rating: 4.9,
      totalSessions: 78,
      achievements: [
        '2. Preis Jugend forscht (Bundesebene)',
        'Teilnehmer Internationale Chemie-Olympiade',
      ],
      earlyStudy: 'Chemie, TUM',
      availability: ['Mo 14-17', 'Mi 16-19', 'Do 14-18'],
      matchReasons: [
        'Strukturierte Methodik',
        'Prüfungs-Spezialist',
        'Top Bewertungen',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Wir haben deine perfekten Matches!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Basierend auf deinen Antworten haben wir {matchedTutors.length}{' '}
            außergewöhnliche Mentoren gefunden, die perfekt zu dir passen.
          </p>
        </div>

        {/* Tutor Cards */}
        <div className="space-y-6 mb-12">
          {matchedTutors.map((tutor, index) => (
            <div
              key={tutor.id}
              className="card-premium hover:shadow-xl transition-all duration-300"
            >
              {/* Match Score Badge */}
              {index === 0 && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-gold-500 to-gold-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{tutor.matchScore}%</div>
                    <div className="text-xs">Match</div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-[200px_1fr_200px] gap-8">
                {/* Left: Profile Image */}
                <div>
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center mb-4">
                    <Award className="text-gold-500" size={60} />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gold-500 font-semibold mb-1">
                      <Star className="fill-gold-500" size={16} />
                      <span>{tutor.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {tutor.totalSessions} Sessions
                    </div>
                  </div>
                </div>

                {/* Middle: Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-navy-900 mb-1">
                      {tutor.name}
                    </h2>
                    <p className="text-gray-600">{tutor.age} Jahre • {tutor.earlyStudy}</p>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2">
                    {tutor.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <Award
                          className="text-gold-500 flex-shrink-0 mt-1"
                          size={16}
                        />
                        <span className="text-sm text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>

                  {/* Match Reasons */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-navy-900 mb-2">
                      Warum {tutor.name.split(' ')[0]} zu dir passt:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tutor.matchReasons.map((reason, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Verfügbar: {tutor.availability.join(', ')}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col justify-between">
                  <div className="bg-teal-50 border-2 border-teal-500 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600 mb-1">
                        1. Stunde kostenlos
                      </div>
                      <div className="text-xs text-gray-600">Danach 35€/h</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={`/booking?tutor=${tutor.id}`}
                      className="block w-full text-center py-3 bg-navy-600 text-white font-semibold rounded-lg hover:bg-navy-700 transition-colors"
                    >
                      Jetzt buchen
                    </Link>
                    <Link
                      href={`/mentors/${tutor.id}`}
                      className="block w-full text-center py-3 border-2 border-navy-600 text-navy-600 font-semibold rounded-lg hover:bg-navy-50 transition-colors"
                    >
                      Profil ansehen
                    </Link>
                  </div>

                  {index === 0 && (
                    <div className="mt-4 text-center">
                      <span className="inline-block px-3 py-1 bg-gold-100 text-gold-800 text-xs font-semibold rounded-full">
                        🏆 Top Match
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-navy-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Noch unsicher?
          </h3>
          <p className="text-gray-300 mb-6">
            Vereinbare ein kostenloses 15-minütiges Kennenlerngespräch
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
          >
            <span>Kostenlose Beratung</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
