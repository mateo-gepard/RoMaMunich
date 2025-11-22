import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Lato } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RoMa Munich – Premium 1:1 Mentoring von Münchens besten Schülern',
  description: 'Exklusive Nachhilfe durch Wettbewerbssieger, Frühstudierende und High-Achievers. Mathematik, Physik, Informatik und mehr – personalisiert, limitiert, hochwertig.',
  keywords: 'Nachhilfe München, Elite Tutoring, Mathematik-Olympiade, Physik-Olympiade, Frühstudium, Premium Mentoring',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    url: 'https://roma-munich.de',
    title: 'RoMa Munich – Premium 1:1 Mentoring',
    description: 'Exzellenz. Nähe. Struktur.',
    siteName: 'RoMa Munich',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${lato.variable}`}>
      <body className="font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a365d',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
