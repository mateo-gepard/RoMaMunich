'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'de' | 'en'>('de')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const content = {
    de: {
      mentors: 'Mentoren',
      howItWorks: 'Ablauf',
      pricing: 'Preise',
      about: 'Über uns',
      login: 'Anmelden',
      bookSession: 'Erstgespräch buchen',
    },
    en: {
      mentors: 'Mentors',
      howItWorks: 'How it Works',
      pricing: 'Pricing',
      about: 'About',
      login: 'Sign In',
      bookSession: 'Book Consultation',
    },
  }

  const t = content[language]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-premium shadow-soft'
          : 'bg-transparent text-white'
      }`}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RM</span>
            </div>
            <span className="font-serif font-bold text-2xl text-navy-900">
              RoMa Munich
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/mentors"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.mentors}
            </Link>
            <Link
              href="/how-it-works"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.howItWorks}
            </Link>
            <Link
              href="#pricing"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.pricing}
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.about}
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className={`flex items-center space-x-2 font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              <Globe size={18} />
              <span className="font-medium uppercase">{language}</span>
            </button>

            <Link
              href={session ? "/dashboard" : "/login"}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {session ? 'Dashboard' : t.login}
            </Link>

            <Link href="/matching" className="btn-primary">
              {t.bookSession}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-navy-700 hover:text-navy-900"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              <Link
                href="/mentors"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.mentors}
              </Link>
              <Link
                href="/how-it-works"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.howItWorks}
              </Link>
              <Link
                href="/pricing"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.pricing}
              </Link>
              <Link
                href="/about"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.about}
              </Link>
              <div className="border-t border-gray-200 pt-4 px-4 space-y-3">
                <button
                  onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                  className="flex items-center space-x-2 text-navy-700 w-full"
                >
                  <Globe size={18} />
                  <span className="font-medium">
                    {language === 'de' ? 'English' : 'Deutsch'}
                  </span>
                </button>
                <Link
                  href={session ? "/dashboard" : "/login"}
                  className="block text-navy-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {session ? 'Dashboard' : t.login}
                </Link>
                <Link
                  href="/matching"
                  className="btn-primary block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.bookSession}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
