'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import enMessages from '@/messages/en.json'
import deMessages from '@/messages/de.json'

export function useTranslations() {
  const { locale } = useLanguage()
  const messages = locale === 'de' ? deMessages : enMessages
  
  return {
    t: messages,
    locale
  }
}
