'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function Navbar() {
  const { t } = useTranslations()
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
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20'
          : 'bg-transparent text-white'
      }`}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#081525"/>
                <line x1="35" y1="65" x2="65" y2="35" stroke="#6E56CF" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="35" cy="65" r="6" fill="#6E56CF"/>
                <circle cx="65" cy="35" r="6" fill="#6E56CF"/>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`font-bold text-lg sm:text-xl ${isScrolled ? 'text-navy-900' : 'text-white'}`}>
                <span className="text-[#6E56CF]">Ro</span>Ma
              </span>
              <span className={`text-[10px] sm:text-xs font-medium tracking-wider ${isScrolled ? 'text-navy-700' : 'text-gray-300'}`}>
                ACADEMIC MENTORING
              </span>
            </div>
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
            <Link
              href="/login"
              className={`font-medium transition-colors ${
                isScrolled ? 'text-navy-700 hover:text-navy-900' : 'text-white hover:text-gray-200'
              }`}
            >
              Anmelden
            </Link>
            <a
              href="/buchen"
              className="btn-primary"
            >
              {t.navbar.bookSession}
            </a>
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
                  <Link
                    href="/login"
                    className="block text-navy-700 font-medium px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <a
                    href="/buchen"
                    className="btn-primary block text-center py-3.5 active:scale-95 transition-transform"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.navbar.bookSession}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

