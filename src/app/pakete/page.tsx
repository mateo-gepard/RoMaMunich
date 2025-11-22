'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import { Package, Check, Clock, Star } from 'lucide-react'

const PACKAGES = [
  {
    id: '10_hours',
    name: '10-Stunden Paket',
    lessons: 10,
    price: 450,
    pricePerLesson: 45,
    popular: false,
    features: [
      '10 Einzelstunden à 60 Minuten',
      'Freie Tutor-Wahl',
      'Flexible Terminvereinbarung',
      '6 Monate gültig',
    ],
  },
  {
    id: '20_hours',
    name: '20-Stunden Paket',
    lessons: 20,
    price: 800,
    pricePerLesson: 40,
    popular: true,
    savings: 100,
    features: [
      '20 Einzelstunden à 60 Minuten',
      'Freie Tutor-Wahl',
      'Flexible Terminvereinbarung',
      '12 Monate gültig',
      '€100 sparen',
    ],
  },
  {
    id: '5_hours',
    name: '5-Stunden Paket',
    lessons: 5,
    price: 240,
    pricePerLesson: 48,
    popular: false,
    features: [
      '5 Einzelstunden à 60 Minuten',
      'Freie Tutor-Wahl',
      'Flexible Terminvereinbarung',
      '3 Monate gültig',
    ],
  },
]

export default function PackagesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/pakete')
    }
  }, [user, authLoading])

  const handlePurchase = async (packageData: typeof PACKAGES[0]) => {
    if (!user) {
      router.push('/login?redirect=/pakete')
      return
    }

    setLoading(true)
    setSelectedPackage(packageData.id)

    try {
      // Calculate expiry date
      const expiresAt = new Date()
      if (packageData.id === '5_hours') {
        expiresAt.setMonth(expiresAt.getMonth() + 3)
      } else if (packageData.id === '10_hours') {
        expiresAt.setMonth(expiresAt.getMonth() + 6)
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 12)
      }

      // Create package in database
      const { data, error } = await supabase.from('packages').insert({
        user_id: user.id,
        package_type: packageData.id,
        lessons_total: packageData.lessons,
        lessons_used: 0,
        price_paid: packageData.price,
        expires_at: expiresAt.toISOString(),
        active: true,
      }).select()

      if (error) throw error

      alert(`${packageData.name} erfolgreich gekauft! Du kannst jetzt Stunden buchen.`)
      router.push('/dashboard')
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Fehler beim Kauf. Bitte versuche es erneut oder kontaktiere den Support.')
    } finally {
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
        <div className="text-white text-xl">Laden...</div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 pt-24 pb-20">
        <div className="container-premium">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Wähle dein <span className="text-gradient-teal">Stundenpaket</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Buche flexible Stundenpakete und spare Geld. Nutze deine Stunden wann und wie du möchtest.
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all hover:scale-105 ${
                    pkg.popular
                      ? 'border-purple-500 shadow-2xl shadow-purple-500/20'
                      : 'border-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold rounded-full">
                        <Star size={16} />
                        <span>Beliebteste</span>
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                      <Package className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-bold text-white mb-1">
                      €{pkg.price}
                    </div>
                    <p className="text-sm text-gray-400">
                      €{pkg.pricePerLesson} pro Stunde
                    </p>
                    {pkg.savings && (
                      <p className="text-sm text-green-400 font-semibold mt-2">
                        Spare €{pkg.savings}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="text-purple-400 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading && selectedPackage === pkg.id}
                    className={`w-full py-4 font-bold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {loading && selectedPackage === pkg.id
                      ? 'Wird gekauft...'
                      : 'Jetzt kaufen'}
                  </button>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Warum ein Stundenpaket?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-4">
                    <Clock className="text-purple-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Flexibel nutzen</h3>
                  <p className="text-gray-300 text-sm">
                    Buche deine Stunden wann immer du sie brauchst
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-4">
                    <Package className="text-green-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Geld sparen</h3>
                  <p className="text-gray-300 text-sm">
                    Größere Pakete = niedrigerer Stundenpreis
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-4">
                    <Star className="text-blue-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Beste Qualität</h3>
                  <p className="text-gray-300 text-sm">
                    Alle Mentoren sind Top-Performer
                  </p>
                </div>
              </div>
            </div>

            {/* Trial Lesson CTA */}
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">
                Noch unsicher? Probiere erst eine <strong>kostenlose Probestunde</strong>!
              </p>
              <a
                href="/buchen"
                className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
              >
                Probestunde buchen
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
