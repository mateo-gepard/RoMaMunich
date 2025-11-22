'use client'

import Link from 'next/link'
import { Award, Users, Target, Heart, MapPin, Mail, Phone } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { value: '10+', label: 'Elite-Mentoren' },
    { value: '50+', label: 'Zufriedene Schüler' },
    { value: '100%', label: 'Persönliche Betreuung' },
    { value: '1. Stunde', label: 'Kostenlos' },
  ]

  const values = [
    {
      icon: Award,
      title: 'Qualität',
      description: 'Nur die besten Schüler Münchens mit nachgewiesenen Erfolgen',
    },
    {
      icon: Users,
      title: 'Nähe',
      description: 'Altersnahe Mentoren verstehen die Herausforderungen von heute',
    },
    {
      icon: Target,
      title: 'Struktur',
      description: 'Professionelle Prozesse und messbare Fortschritte',
    },
    {
      icon: Heart,
      title: 'Leidenschaft',
      description: 'Unsere Mentoren lieben es, Wissen zu teilen',
    },
  ]

  const team = [
    {
      name: 'Max Mustermann',
      role: 'Gründer & CEO',
      bio: 'Ehemaliger Mathe-Olympiade-Teilnehmer und TUM-Absolvent',
    },
    {
      name: 'Sophie Schmidt',
      role: 'Head of Mentor Relations',
      bio: 'Pädagogik-Expertin mit 10+ Jahren Erfahrung',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20">
        <div className="container-premium">
          <Link
            href="/"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple">
            Über RoMa Munich
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Wir bringen Elite-Fachkompetenz und altersnahe pädagogische Zugänglichkeit zusammen.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="container-premium -mt-16">
        <div className="bg-white rounded-2xl shadow-premium p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="container-premium py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-navy-900 mb-6 text-center">
            Unsere Mission
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              RoMa Munich wurde gegründet, um eine Lücke im Münchner Bildungsmarkt zu schließen: 
              Es gab keine Plattform, die systematisch die besten Schüler der Stadt als Mentoren 
              zusammenbringt – Olympiade-Sieger, Frühstudierende und High-Achievers, die nicht 
              nur fachlich brillant sind, sondern auch die Sprache der heutigen Generation sprechen.
            </p>
            <p>
              Wir glauben, dass die besten Mentoren oft diejenigen sind, die selbst noch in der 
              Schule oder gerade im Studium sind. Sie kennen die aktuellen Anforderungen, verstehen 
              moderne Lernmethoden und können auf Augenhöhe motivieren.
            </p>
            <p>
              Bei RoMa Munich setzen wir auf Qualität statt Quantität. Unsere Mentoren durchlaufen 
              einen strengen Auswahlprozess und werden kontinuierlich begleitet, um höchste 
              Standards zu garantieren.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="container-premium">
          <h2 className="text-4xl font-bold text-navy-900 mb-12 text-center">
            Unsere Werte
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-purple-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container-premium py-16">
        <h2 className="text-4xl font-bold text-navy-900 mb-12 text-center">
          Unser Team
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {member.name?.split(' ').map(n => n[0]).join('') || '??'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-1">
                {member.name}
              </h3>
              <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-navy-900 text-white py-16">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Kontaktiere uns</h2>
            <p className="text-xl text-gray-300 mb-8">
              Hast du Fragen? Wir sind für dich da!
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Mail size={24} />
                </div>
                <a href="mailto:info@roma-munich.de" className="text-purple-400 hover:text-purple-300">
                  info@roma-munich.de
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Phone size={24} />
                </div>
                <a href="tel:+498912345678" className="text-purple-400 hover:text-purple-300">
                  +49 89 1234 5678
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <MapPin size={24} />
                </div>
                <p className="text-gray-300">
                  Leopoldstraße 123
                  <br />
                  80802 München
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Link
                href="/matching"
                className="inline-block px-8 py-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
              >
                Jetzt Mentor finden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

