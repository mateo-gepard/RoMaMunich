'use client'

import Link from 'next/link'
import { ArrowRight, Award, Users, TrendingUp } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

export default function HeroSection() {
  const { t } = useTranslations()

  const stats = [
    { icon: Award, label: t.hero.stats.mentors, value: '10+' },
    { icon: Users, label: t.hero.stats.students, value: '50+' },
    { icon: TrendingUp, label: t.hero.stats.progress, value: '100%' },
  ]

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container-premium relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-8 animate-fadeInUp">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-teal-300 text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-serif font-bold text-white mb-4">
                {t.hero.headline}
                <br />
                <span className="text-gradient-teal">{t.hero.subheadline}</span>
              </h1>
              <p className="text-xl text-gray-300 font-medium">
                {t.hero.description}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              {t.hero.bodyText}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/matching"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-400 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              >
                <span>{t.hero.cta}</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/mentors"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-200"
              >
                <span>{t.hero.learnMore}</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="space-y-2">
                    <Icon className="text-teal-500" size={24} />
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative lg:block hidden">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-premium">
              {/* Placeholder for mentor portrait */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center">
                <div className="text-center text-white space-y-4">
                  <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Award size={64} className="text-gold-500" />
                  </div>
                  <p className="text-lg font-medium px-8">
                    Professional mentor portrait
                    <br />
                    (Replace with actual image)
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Achievement Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-premium p-6 max-w-xs">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Award className="text-teal-600" size={24} />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-navy-900 mb-1">
                    1. Preis
                  </div>
                  <div className="text-sm text-gray-600">
                    Bundesweite Mathematik-Olympiade 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
