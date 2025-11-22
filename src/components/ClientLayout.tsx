'use client'

import SessionProvider from '@/components/providers/SessionProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

