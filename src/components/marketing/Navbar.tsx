'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Navbar() {
  const { data: session } = useSession()
  const { t, locale } = useTranslations()
  const { setLocale } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
              {t.navbar.mentors}
            </Link>
            <Link
              href="/how-it-works"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.navbar.howItWorks}
            </Link>
            <Link
              href="#pricing"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.navbar.pricing}
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {t.navbar.about}
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => setLocale('de')}
                className={`px-3 py-1 rounded-md font-medium text-sm transition-colors ${
                  locale === 'de'
                    ? 'bg-teal-500 text-white'
                    : isScrolled 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded-md font-medium text-sm transition-colors ${
                  locale === 'en'
                    ? 'bg-teal-500 text-white'
                    : isScrolled 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href={session ? "/dashboard" : "/login"}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              {session ? t.navbar.dashboard : t.navbar.login}
            </Link>

            <Link href="/matching" className="btn-primary">
              {t.navbar.bookSession}
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
                {t.navbar.mentors}
              </Link>
              <Link
                href="/how-it-works"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.navbar.howItWorks}
              </Link>
              <Link
                href="/pricing"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.navbar.pricing}
              </Link>
              <Link
                href="/about"
                className="text-navy-700 hover:text-navy-900 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.navbar.about}
              </Link>
              <div className="border-t border-gray-200 pt-4 px-4 space-y-3">
                {/* Language Switcher Mobile */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setLocale('de')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      locale === 'de'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    DE
                  </button>
                  <button
                    onClick={() => setLocale('en')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      locale === 'en'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    EN
                  </button>
                </div>
                
                <Link
                  href={session ? "/dashboard" : "/login"}
                  className="block text-navy-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {session ? t.navbar.dashboard : t.navbar.login}
                </Link>
                <Link
                  href="/matching"
                  className="btn-primary block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.navbar.bookSession}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
