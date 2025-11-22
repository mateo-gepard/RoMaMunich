'use client'

import Link from 'next/link'
import { CheckCircle, Calendar, Mail, ArrowRight } from 'lucide-react'

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-purple-600" size={48} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Buchung erfolgreich!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Deine Buchung wurde erfolgreich übermittelt. Du erhältst in Kürze eine Bestätigungs-E-Mail mit allen Details.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Was passiert jetzt?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-semibold text-navy-900">Bestätigungs-Email</div>
                  <div className="text-sm text-gray-600">Du erhältst eine Email mit allen Buchungsdetails</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-semibold text-navy-900">Mentor kontaktiert dich</div>
                  <div className="text-sm text-gray-600">Dein Mentor meldet sich innerhalb von 24h bei dir</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold text-navy-900">Session startet</div>
                  <div className="text-sm text-gray-600">Zum vereinbarten Termin beginnt eure Zusammenarbeit</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Calendar size={20} />
              <span>Zum Dashboard</span>
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-navy-900 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              <span>Zur Startseite</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

