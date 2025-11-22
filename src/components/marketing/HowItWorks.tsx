'use client'

import { Search, Calendar, Video, TrendingUp } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Matching-Quiz',
      titleEn: 'Matching Quiz',
      description:
        'Beantworte 6 Fragen zu Fach, Niveau, Ziel und Lernstil. Unser intelligentes System findet den perfekten Mentor.',
      descriptionEn:
        'Answer 6 questions about subject, level, goal and learning style. Our intelligent system finds the perfect mentor.',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Erstgespräch buchen',
      titleEn: 'Book Consultation',
      description:
        'Wähle einen verfügbaren Termin aus dem Kalender. Sichere Zahlung via Stripe. Sofortige Bestätigung per E-Mail.',
      descriptionEn:
        'Choose an available slot from the calendar. Secure payment via Stripe. Instant confirmation via email.',
    },
    {
      number: '03',
      icon: Video,
      title: 'Intensive Sessions',
      titleEn: 'Intensive Sessions',
      description:
        'Jede Session ist vorbereitet mit Material, Aufgaben und klarem Lernziel. Online oder persönlich in München.',
      descriptionEn:
        'Every session is prepared with materials, exercises and clear learning objectives. Online or in-person in Munich.',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Fortschritt tracken',
      titleEn: 'Track Progress',
      description:
        'Im Eltern-Dashboard siehst du Lernplan, absolvierte Themen, Session-Zusammenfassungen und Notenentwicklung.',
      descriptionEn:
        "In the parent dashboard you see learning plan, completed topics, session summaries and grade development.",
    },
  ]

  return (
    <section className="section-padding bg-navy-900 text-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-white mb-6">So funktioniert's</h2>
          <p className="text-xl text-gray-300">
            Von der ersten Anfrage bis zum messbaren Erfolg – unser Prozess ist
            klar strukturiert und auf Ergebnisse ausgerichtet.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Connection Line (Desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-white/20 z-0"></div>
                )}

                {/* Card */}
                <div className="relative z-10 space-y-4">
                  {/* Number Badge */}
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl">
                    <span className="text-6xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Icon className="text-purple-500" size={24} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/matching"
            className="inline-flex items-center space-x-2 px-10 py-5 bg-purple-500 text-white font-bold text-lg rounded-xl hover:bg-purple-400 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95"
          >
            <span>Jetzt starten</span>
          </a>
        </div>
      </div>
    </section>
  )
}

