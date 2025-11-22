'use client'

import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import CalendlyWidget from '@/components/CalendlyWidget'

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 pt-24 pb-20">
        <div className="container-premium">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Buche dein kostenloses
                <br />
                <span className="text-gradient-teal">Erstgespräch</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Wähle einen passenden Termin für ein unverbindliches Kennenlerngespräch.
                Wir besprechen deine Ziele und finden den perfekten Mentor für dich.
              </p>
            </div>

            {/* Calendly Widget */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <CalendlyWidget 
                url="https://calendly.com/romamuenchen/erstgesprach" 
                type="inline"
              />
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Keine Kreditkarte erforderlich</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Unverbindlich & kostenlos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sofortige Bestätigung</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
