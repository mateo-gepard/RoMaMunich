'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container-premium relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h2 className="text-white text-5xl md:text-6xl font-bold leading-tight">
            Bereit für
            <br />
            <span className="text-gradient-teal">exzellente Bildung?</span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            Limitierte Plätze. Höchste Qualität. Messbare Erfolge.
            <br />
            Starte jetzt dein 1:1 Mentoring mit Münchens besten Schülern.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/matching"
              className="inline-flex items-center space-x-2 px-10 py-5 bg-purple-500 text-white font-bold text-lg rounded-xl hover:bg-purple-400 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95"
            >
              <span>Erstgespräch buchen</span>
              <ArrowRight size={24} />
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center space-x-2 px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-200"
            >
              <span>Mentoren kennenlernen</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sichere Zahlung</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>24h Stornierung</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sofortige Bestätigung</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

