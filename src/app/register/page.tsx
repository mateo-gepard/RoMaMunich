'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      return
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }

    setLoading(true)

    const { error: signUpError } = await signUp(email, password, fullName)

    if (signUpError) {
      setError(signUpError.message || 'Fehler bei der Registrierung')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 pt-24 pb-20">
        <div className="container-premium">
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Registrieren
              </h1>
              <p className="text-gray-300 mb-8 text-center">
                Erstelle dein RoMa Munich Konto
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Vollständiger Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Max Mustermann"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-Mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="deine@email.de"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Passwort
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Passwort bestätigen
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:from-purple-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registrierung läuft...' : 'Konto erstellen'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Bereits ein Konto?{' '}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                    Jetzt anmelden
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

