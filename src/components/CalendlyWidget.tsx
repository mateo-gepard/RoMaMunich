'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void
    }
  }
}

interface CalendlyWidgetProps {
  url: string
  type?: 'inline' | 'popup'
  buttonText?: string
  className?: string
}

export default function CalendlyWidget({ 
  url, 
  type = 'inline',
  buttonText = 'Termin buchen',
  className = ''
}: CalendlyWidgetProps) {
  useEffect(() => {
    // Load Calendly script if not already loaded
    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    }

    // Load Calendly CSS if not already loaded
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link')
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
  }, [])

  const handleClick = () => {
    if (window.Calendly && type === 'popup') {
      window.Calendly.initPopupWidget({ url })
    }
  }

  if (type === 'popup') {
    return (
      <button
        onClick={handleClick}
        className={className || 'px-8 py-4 bg-gradient-to-r from-[#6E56CF] to-[#8B7FD8] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'}
      >
        {buttonText}
      </button>
    )
  }

  return (
    <div 
      className={className || 'calendly-inline-widget w-full h-[700px] rounded-xl overflow-hidden'}
      data-url={url}
    />
  )
}
