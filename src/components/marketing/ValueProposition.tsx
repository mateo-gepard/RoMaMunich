'use client'

import { Award, Target, Users, TrendingUp, Shield, Clock } from 'lucide-react'

export default function ValueProposition() {
  const values = [
    {
      icon: Award,
      title: 'Elite-Expertise',
      titleEn: 'Elite Expertise',
      description:
        'Unsere Mentoren sind Olympiade-Sieger, Frühstudierende an LMU/TUM und mehrfache Wettbewerbsgewinner.',
      descriptionEn:
        'Our mentors are Olympiad winners, early university students at LMU/TUM, and multiple competition champions.',
    },
    {
      icon: Users,
      title: 'Peer-Learning Effekt',
      titleEn: 'Peer Learning Effect',
      description:
        'Altersnahe Mentoren verstehen moderne Lernmethoden und teilen ähnliche Erfahrungen.',
      descriptionEn:
        'Age-appropriate mentors understand modern learning methods and share similar experiences.',
    },
    {
      icon: Target,
      title: 'Ergebnisorientiert',
      titleEn: 'Results-Oriented',
      description:
        'Jede Session wird vorbereitet. Ziele definieren, Fortschritt tracken, Resultate demonstrieren.',
      descriptionEn:
        'Every session is prepared. Define goals, track progress, demonstrate results.',
    },
    {
      icon: Clock,
      title: 'Intensive Betreuung',
      titleEn: 'Intensive Mentoring',
      description:
        'Maximal 5 Stunden pro Fach pro Woche garantieren höchste Qualität und Fokus.',
      descriptionEn:
        'Maximum 5 hours per subject per week guarantee highest quality and focus.',
    },
    {
      icon: Shield,
      title: 'Höchste Professionalität',
      titleEn: 'Highest Professionalism',
      description:
        'Strukturierte Prozesse, sichere Zahlungen, Fortschritts-Tracking und Eltern-Dashboard.',
      descriptionEn:
        'Structured processes, secure payments, progress tracking, and parent dashboard.',
    },
    {
      icon: TrendingUp,
      title: 'Limitierte Plätze',
      titleEn: 'Limited Spots',
      description:
        'Bewusste Limitierung schafft Exklusivität, Qualität und persönliche Betreuung.',
      descriptionEn:
        'Conscious limitation creates exclusivity, quality, and personal attention.',
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6">Warum RoMa Munich</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Wir vereinen zwei Dinge, die im klassischen Nachhilfemarkt praktisch
            nie zusammenkommen: Elite-Fachkompetenz und altersnahe pädagogische
            Zugänglichkeit.
          </p>
        </div>

        {/* Value Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="card-premium hover:scale-105 transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-navy-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-navy-900 text-white rounded-2xl p-8 flex flex-col items-center">
              <Shield className="mb-4" size={36} color="#fff" fill="#fff" stroke="#fff" />
              <h3 className="text-2xl font-bold mb-2">Garantierte Qualität</h3>
              <p className="text-gray-300">Alle Mentoren sind geprüft und nachweislich erfolgreich</p>
            </div>
            <div className="bg-navy-900 text-white rounded-2xl p-8 flex flex-col items-center">
              <Award className="mb-4" size={36} color="#fff" fill="#fff" stroke="#fff" />
              <h3 className="text-2xl font-bold mb-2">Elite-Expertise</h3>
              <p className="text-gray-300">Olympiade-Sieger und Frühstudierende an Top-Unis</p>
            </div>
            <div className="bg-navy-900 text-white rounded-2xl p-8 flex flex-col items-center">
              <Target className="mb-4" size={36} color="#fff" fill="#fff" stroke="#fff" />
              <h3 className="text-2xl font-bold mb-2">Ergebnisorientiert</h3>
              <p className="text-gray-300">Klare Ziele, messbare Fortschritte, transparentes Tracking</p>
            </div>
            <div className="bg-navy-900 text-white rounded-2xl p-8 flex flex-col items-center">
              <TrendingUp className="mb-4" size={36} color="#fff" fill="#fff" stroke="#fff" />
              <h3 className="text-2xl font-bold mb-2">Nachhaltig</h3>
              <p className="text-gray-300">Nicht nur Noten, sondern Lernkompetenz für die Zukunft</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
