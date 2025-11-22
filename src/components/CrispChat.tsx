'use client'

import { useEffect } from 'react'

export default function CrispChat() {
  useEffect(() => {
    // Crisp Chat Integration
    // Registriere dich kostenlos auf https://crisp.chat
    // und ersetze 'YOUR_WEBSITE_ID' mit deiner Website ID
    
    if (typeof window !== 'undefined') {
      ;(window as any).$crisp = []
      ;(window as any).CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || 'YOUR_WEBSITE_ID'

      const script = document.createElement('script')
      script.src = 'https://client.crisp.chat/l.js'
      script.async = true
      document.getElementsByTagName('head')[0].appendChild(script)
    }
  }, [])

  return null
}

