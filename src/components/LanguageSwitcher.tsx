'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => setLocale('de')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          locale === 'de'
            ? 'bg-teal-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          locale === 'en'
            ? 'bg-teal-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  )
}
