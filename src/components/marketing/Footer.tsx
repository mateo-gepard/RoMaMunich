'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-premium py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-navy-900 font-bold text-xl">RM</span>
              </div>
              <span className="font-serif font-bold text-2xl">
                RoMa Munich
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Premium 1:1 Mentoring von Münchens besten Schülern.
              <br />
              <span className="text-purple-500 font-semibold">
                Qualität. Nähe. Struktur.
              </span>
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-lg mb-4">Plattform</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mentors"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mentoren finden
                </Link>
              </li>
              <li>
                <Link
                  href="/matching"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Matching-Quiz
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  So funktioniert's
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Anmelden
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">Unternehmen</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link
                  href="/become-mentor"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mentor werden
                </Link>
              </li>
              <li>
                <Link
                  href="/quality"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Qualitätskriterien
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Kontakt</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@roma-munich.de"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={18} />
                  <span>info@roma-munich.de</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+498912345678"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone size={18} />
                  <span>+49 89 1234 5678</span>
                </a>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>
                  Leopoldstraße 123
                  <br />
                  80802 München
                </span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} RoMa Munich. Alle Rechte vorbehalten.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Datenschutz
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                AGB
              </Link>
              <Link
                href="/imprint"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

