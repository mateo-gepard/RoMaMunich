'use client'

import Link from 'next/link'
import { Search, Users, Calendar, Rocket, CheckCircle, Award, Target, TrendingUp } from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Matching-Quiz starten',
      description: 'Beantworte 6 schnelle Fragen zu Fach, Niveau, Lernstil und Zielen. Dauert nur 2 Minuten.',
      details: [
        'Welches Fach brauchst du?',
        'Was ist dein aktuelles Niveau?',
        'Welche Ziele verfolgst du?',
        'Wie lernst du am besten?',
        'Wie dringend brauchst du Hilfe?',
        'Kontaktinformationen',
      ],
    },
    {
      number: 2,
      icon: Users,
      title: 'Top 3 Mentor-Vorschläge',
      description: 'Unser Algorithmus findet die besten Matches basierend auf Fachkompetenz, Lernstil und Persönlichkeit.',
      details: [
        'Match-Score zeigt Kompatibilität',
        'Detaillierte Profile mit Achievements',
        'Frühstudium & Olympiade-Erfolge',
        'Bewertungen & Erfahrung',
        'Verfügbarkeit in Echtzeit',
      ],
    },
    {
      number: 3,
      icon: Calendar,
      title: 'Erstgespräch buchen',
      description: 'Wähle deinen Favoriten und buche ein 30-minütiges Kennenlerngespräch – kostenlos und unverbindlich.',
      details: [
        'Kostenlose 30-Minuten-Session',
        'Persönliches Kennenlernen',
        'Ziele und Erwartungen besprechen',
        'Lernplan-Skizze erstellen',
        'Keine Verpflichtung',
      ],
    },
    {
      number: 4,
      icon: Rocket,
      title: 'Loslegen & Fortschritt tracken',
      description: 'Nach dem Match beginnt das strukturierte Mentoring. Fortschritte werden im Dashboard dokumentiert.',
      details: [
        'Flexibles Stundenpaket wählen',
        'Online oder vor Ort in München',
        'Eltern-Dashboard mit Updates',
        'Lernplan mit Meilensteinen',
        'Regelmäßige Fortschritts-Reports',
      ],
    },
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Garantierte Qualität',
      description: 'Alle Mentoren sind geprüft und nachweislich erfolgreich',
    },
    {
      icon: Award,
      title: 'Elite-Expertise',
      description: 'Olympiade-Sieger und Frühstudierende an Top-Unis',
    },
    {
      icon: Target,
      title: 'Ergebnisorientiert',
      description: 'Klare Ziele, messbare Fortschritte, transparentes Tracking',
    },
    {
      icon: TrendingUp,
      title: 'Nachhaltig',
      description: 'Nicht nur Noten, sondern Lernkompetenz für die Zukunft',
    },
  ]

  const faqs = [
    {
      question: 'Wie lange dauert das Matching?',
      answer: 'Das Quiz dauert 2 Minuten. Danach siehst du sofort deine Top 3 Matches mit detaillierten Profilen.',
    },
    {
      question: 'Was kostet die erste Stunde?',
      answer: 'Die erste Stunde ist komplett kostenlos! So kannst du den Mentor kennenlernen und sehen, ob die Chemie stimmt.',
    },
    {
      question: 'Wie viel kostet das Mentoring danach?',
      answer: 'Ab der zweiten Stunde liegt der Preis bei 35€ pro Stunde. Wir bieten auch Pakete an (10h: 315€, 20h: 665€) - erste Stunde inklusive gratis.',
    },
    {
      question: 'Kann ich online oder vor Ort lernen?',
      answer: 'Beides ist möglich. Viele Sessions finden online statt, aber Vor-Ort-Treffen in München sind ebenfalls buchbar.',
    },
    {
      question: 'Was, wenn die Chemie nicht stimmt?',
      answer: 'Nach dem kostenlosen Erstgespräch entscheidest du. Kein Risiko, keine Verpflichtung.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20">
        <div className="container-premium">
          <Link
            href="/"
            className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            So funktioniert's
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
            In 4 einfachen Schritten zum perfekten Mentor – von der ersten Anfrage bis zur erfolgreichen Zusammenarbeit.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="container-premium py-16">
        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 md:gap-12 items-center`}
              >
                {/* Icon */}
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center">
                      <Icon className="text-white" size={64} />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-2/3">
                  <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-16">
        <div className="container-premium">
          <h2 className="text-4xl font-bold text-navy-900 mb-12 text-center">
            Warum RoMa Munich?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-teal-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="container-premium py-16">
        <h2 className="text-4xl font-bold text-navy-900 mb-12 text-center">
          Häufige Fragen
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy-900 text-white py-16">
        <div className="container-premium text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bereit zu starten?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Finde in 2 Minuten den perfekten Mentor für deine Ziele.
          </p>
          <Link
            href="/matching"
            className="inline-block px-10 py-5 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-600 transition-all shadow-xl hover:shadow-2xl"
          >
            Jetzt Matching starten
          </Link>
        </div>
      </div>
    </div>
  )
}
