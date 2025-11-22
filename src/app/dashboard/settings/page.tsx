'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, User, Mail, Phone, Lock, Globe, Bell } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'de',
    emailNotifications: true,
    smsNotifications: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        language: 'de',
        emailNotifications: true,
        smsNotifications: false,
      })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call to update settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Einstellungen erfolgreich gespeichert!')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Fehler beim Speichern der Einstellungen')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container-premium py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-navy-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-navy-900">Einstellungen</h1>
          </div>
        </div>
      </header>

      <div className="container-premium py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
              <User size={24} />
              Profil
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
              <Globe size={24} />
              Sprache
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bevorzugte Sprache
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
              <Bell size={24} />
              Benachrichtigungen
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">E-Mail Benachrichtigungen</p>
                  <p className="text-sm text-gray-500">
                    Erhalten Sie Updates zu Sessions per E-Mail
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) =>
                    setFormData({ ...formData, emailNotifications: e.target.checked })
                  }
                  className="w-5 h-5 text-navy-600 rounded focus:ring-2 focus:ring-navy-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">SMS Benachrichtigungen</p>
                  <p className="text-sm text-gray-500">
                    Erhalten Sie Erinnerungen per SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.smsNotifications}
                  onChange={(e) =>
                    setFormData({ ...formData, smsNotifications: e.target.checked })
                  }
                  className="w-5 h-5 text-navy-600 rounded focus:ring-2 focus:ring-navy-600"
                />
              </label>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
              <Lock size={24} />
              Sicherheit
            </h2>
            <Link
              href="/dashboard/settings/change-password"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Passwort ändern
            </Link>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

