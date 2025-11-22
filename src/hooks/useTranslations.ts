'use client'

import deMessages from '@/messages/de.json'

export function useTranslations() {
  return {
    t: deMessages,
    locale: 'de'
  }
}

