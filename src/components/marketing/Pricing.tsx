'use client'

import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

export default function Pricing() {
  const packages = [
    {
      name: 'Probestunde',
      nameEn: 'Trial Session',
      price: 'Kostenlos',
      per: 'erste Stunde',
      perEn: 'first hour',
      description: 'Kostenlos kennenlernen',
      descriptionEn: 'Free trial session',
      features: [
        'Kostenlose erste Stunde',
        'Persönliches Kennenlernen',
        'Ziele definieren',
        'Lernplan erstellen',
        'Keine Verpflichtung',
      ],
      featuresEn: [
        'Free first hour',
        'Personal introduction',
        'Define goals',
        'Create learning plan',
        'No commitment',
      ],
      cta: 'Jetzt buchen',
      ctaEn: 'Book Now',
      popular: false,
    },
    {
      name: '10-Stunden-Paket',
      nameEn: '10-Hour Package',
      price: '315',
      per: '€ (1. Stunde gratis + 9×35€)',
      perEn: '€ (1st hour free + 9×35€)',
      description: 'Ideal für kontinuierliche Betreuung',
      descriptionEn: 'Ideal for continuous support',
      features: [
        '1. Stunde kostenlos',
        '+ 9 weitere Stunden',
        'Personalisierter Lernplan',
        'Wöchentliche Fortschritts-Updates',
        'Eltern-Dashboard Zugang',
      ],
      featuresEn: [
        '1st hour free',
        '+ 9 more hours',
        'Personalized learning plan',
        'Weekly progress updates',
        'Parent dashboard access',
      ],
      cta: 'Paket wählen',
      ctaEn: 'Choose Package',
      popular: true,
    },
    {
      name: 'Abitur Sprint',
      nameEn: 'Abitur Sprint',
      price: '665',
      per: '€ (1. Stunde gratis + 19×35€)',
      perEn: '€ (1st hour free + 19×35€)',
      description: 'Intensive Vorbereitung auf Prüfungen',
      descriptionEn: 'Intensive exam preparation',
      features: [
        '1. Stunde kostenlos',
        '+ 19 weitere Stunden',
        'Intensive Abiturvorbereitung',
        'Prüfungssimulationen',
        'Wöchentliche Check-ins',
        'Priority Support',
      ],
      featuresEn: [
        '1st hour free',
        '+ 19 more hours',
        'Intensive Abitur preparation',
        'Mock exams',
        'Weekly check-ins',
        'Priority support',
      ],
      cta: 'Sprint buchen',
      ctaEn: 'Book Sprint',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6">Transparente Preise</h2>
          <p className="text-xl text-gray-600">
            Keine versteckten Kosten. Keine Abo-Fallen. Nur ehrliche,
            qualitätsbasierte Preise.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                pkg.popular
                  ? 'bg-navy-900 text-white shadow-premium scale-105 border-4 border-teal-500'
                  : 'bg-white shadow-soft hover:shadow-premium border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    <Sparkles size={16} />
                    <span>Beliebteste Wahl</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-6">
                {/* Name */}
                <h3
                  className={`text-2xl font-bold ${
                    pkg.popular ? 'text-white' : 'text-navy-900'
                  }`}
                >
                  {pkg.name}
                </h3>

                {/* Price */}
                <div>
                  <div
                    className={`text-5xl font-bold ${
                      pkg.popular ? 'text-teal-400' : 'text-navy-900'
                    }`}
                  >
                    {pkg.price}
                  </div>
                  <div
                    className={`text-lg ${
                      pkg.popular ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {pkg.per}
                  </div>
                </div>

                {/* Description */}
                <p
                  className={`text-lg ${
                    pkg.popular ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {pkg.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check
                        className={`flex-shrink-0 mt-1 ${
                          pkg.popular ? 'text-teal-400' : 'text-navy-600'
                        }`}
                        size={20}
                      />
                      <span
                        className={
                          pkg.popular ? 'text-gray-200' : 'text-gray-700'
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/matching"
                  className={`block w-full text-center py-4 font-bold rounded-lg transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-teal-500 text-white hover:bg-teal-400 shadow-lg'
                      : 'bg-navy-600 text-white hover:bg-navy-700'
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Alle Preise verstehen sich inkl. MwSt. • Sichere Zahlung via Stripe
            • Stornierung bis 24h vorher kostenlos
          </p>
          <Link
            href="/pricing"
            className="inline-block text-navy-600 font-semibold hover:text-navy-800 transition-colors"
          >
            Detaillierte Preisinformationen →
          </Link>
        </div>
      </div>
    </section>
  )
}
