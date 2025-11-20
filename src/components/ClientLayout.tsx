'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import SessionProvider from '@/components/providers/SessionProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </LanguageProvider>
  )
}
