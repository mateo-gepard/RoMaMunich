'use client'

import { Award, GraduationCap, Trophy, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'

export default function TutorShowcase() {
  const featuredTutors = [
    {
      name: 'Max Müller',
      age: 19,
      image: null, // Placeholder
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
      name: 'Sophie Weber',
      age: 18,
      image: null,
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
      name: 'Leon Schmidt',
      age: 19,
      image: null,
      subjects: ['Mathematik', 'Chemie'],
      achievements: [
        '2. Preis Jugend forscht (Bundesebene)',
        'Teilnehmer Internationale Chemie-Olympiade',
      ],
      earlyStudy: 'Chemie, TUM',
      rating: 4.9,
      sessions: 78,
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-500 rounded-full px-4 py-2 mb-6">
            <Sparkles className="text-white" size={20} />
            <span className="text-white font-semibold">
              Ausgewählte Mentoren
            </span>
          </div>
          <h2 className="mb-6">Lerne von den Besten</h2>
          <p className="text-xl text-gray-600">
            Jeder unserer Mentoren hat außergewöhnliche akademische Leistungen
            vorzuweisen und brennt für sein Fach.
          </p>
        </div>

        {/* Tutor Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredTutors.map((tutor, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-premium p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Profile Image Placeholder */}
              <div className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="text-white opacity-40" size={80} />
                </div>
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-gold-500 text-white rounded-full p-2">
                  <Award size={20} />
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-1">
                    {tutor.name}
                  </h3>
                  <p className="text-gray-600">{tutor.age} Jahre</p>
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

                {/* Early Study */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GraduationCap size={16} />
                  <span>Frühstudium: {tutor.earlyStudy}</span>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  {tutor.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <Trophy
                        className="text-purple-500 flex-shrink-0 mt-1"
                        size={16}
                      />
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
                  <div>
                    <div className="flex items-center space-x-1 text-purple-500 font-semibold">
                      <Star className="fill-purple-500" size={18} />
                      <span className="text-lg">{tutor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {tutor.sessions} Sessions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-navy-900">
                      Erste Stunde kostenlos
                    </div>
                    <div className="text-xs text-gray-500">
                      Danach 35€/h
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/mentors/${index + 1}`}
                  className="block w-full text-center py-3 bg-navy-600 text-white font-semibold rounded-lg hover:bg-navy-700 transition-colors"
                >
                  Profil ansehen
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTAs */}
        <div className="text-center">
          <Link
            href="/mentors"
            className="inline-flex items-center space-x-2 btn-primary text-lg"
          >
            <span>Alle Mentoren entdecken</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

