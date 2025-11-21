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
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 -ml-2 sm:ml-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-navy-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">RM</span>
            </div>
            <span className="font-serif font-bold text-xl sm:text-2xl text-navy-900">
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
            className={`lg:hidden p-3 rounded-lg transition-colors ${
              isScrolled ? 'text-navy-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bg-white shadow-2xl border-t border-gray-200 animate-slideDown overflow-hidden">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex flex-col p-4 space-y-1">
                <Link
                  href="/mentors"
                  className="text-navy-700 hover:bg-gray-50 active:bg-gray-100 font-medium px-4 py-3.5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.navbar.mentors}
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-navy-700 hover:bg-gray-50 active:bg-gray-100 font-medium px-4 py-3.5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.navbar.howItWorks}
                </Link>
                <Link
                  href="#pricing"
                  className="text-navy-700 hover:bg-gray-50 active:bg-gray-100 font-medium px-4 py-3.5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.navbar.pricing}
                </Link>
                <Link
                  href="/about"
                  className="text-navy-700 hover:bg-gray-50 active:bg-gray-100 font-medium px-4 py-3.5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.navbar.about}
                </Link>
                
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                  {/* Language Switcher Mobile */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocale('de')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 ${
                        locale === 'de'
                          ? 'bg-teal-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      DE
                    </button>
                    <button
                      onClick={() => setLocale('en')}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 ${
                        locale === 'en'
                          ? 'bg-teal-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                  
                  <Link
                    href={session ? "/dashboard" : "/login"}
                    className="block text-navy-700 font-medium px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {session ? t.navbar.dashboard : t.navbar.login}
                  </Link>
                  <Link
                    href="/matching"
                    className="btn-primary block text-center py-3.5 active:scale-95 transition-transform"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.navbar.bookSession}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
