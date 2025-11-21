'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Sparkles, Calculator, Atom, Beaker, Monitor, Dna, BookOpen, Globe, Library } from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5 | 6

interface MatchingData {
  subject?: string
  level?: string
  goal?: string
  learningStyle?: string
  urgency?: string
  language?: string
  email?: string
}

export default function MatchingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<MatchingData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subjects = [
    { id: 'math', label: 'Mathematik', icon: Calculator },
    { id: 'physics', label: 'Physik', icon: Atom },
    { id: 'chemistry', label: 'Chemie', icon: Beaker },
    { id: 'cs', label: 'Informatik', icon: Monitor },
    { id: 'biology', label: 'Biologie', icon: Dna },
    { id: 'german', label: 'Deutsch', icon: BookOpen },
    { id: 'english', label: 'Englisch', icon: Globe },
    { id: 'other', label: 'Anderes Fach', icon: Library },
  ]

  const levels = [
    { id: 'middle', label: 'Mittelschule / Realschule' },
    { id: 'gymnasium', label: 'Gymnasium (5-11)' },
    { id: 'abitur', label: 'Abitur-Vorbereitung' },
    { id: 'ib', label: 'International Baccalaureate' },
    { id: 'competition', label: 'Wettbewerbs-Vorbereitung' },
    { id: 'university', label: 'Universität / Frühstudium' },
  ]

  const goals = [
    { id: 'grades', label: 'Notenverbesserung', description: 'Von 4 auf 2 oder besser' },
    { id: 'understanding', label: 'Tieferes Verständnis', description: 'Konzepte wirklich verstehen' },
    { id: 'exam', label: 'Prüfungsvorbereitung', description: 'Abitur, IB, Klassenarbeit' },
    { id: 'competition', label: 'Olympiade / Wettbewerb', description: 'Mathematik-Olympiade, Jugend forscht, etc.' },
    { id: 'passion', label: 'Begeisterung wecken', description: 'Freude am Fach entwickeln' },
  ]

  const learningStyles = [
    { id: 'visual', label: 'Visuell', description: 'Lernen durch Bilder, Diagramme, Videos' },
    { id: 'structured', label: 'Strukturiert', description: 'Schritt-für-Schritt, klare Pläne' },
    { id: 'practical', label: 'Praktisch', description: 'Hands-on, Experimente, Projekte' },
    { id: 'conversational', label: 'Gesprächig', description: 'Diskussion, Fragen, Dialog' },
  ]

  const urgencies = [
    { id: 'immediate', label: 'Sofort', description: 'Innerhalb 48 Stunden' },
    { id: 'week', label: 'Diese Woche', description: 'In 7 Tagen' },
    { id: 'month', label: 'Diesen Monat', description: 'In 30 Tagen' },
    { id: 'flexible', label: 'Flexibel', description: 'Kein Zeitdruck' },
  ]

  const languages = [
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'both', label: 'Beide / Both', flag: '🌍' },
  ]

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Here you would send formData to your API
    console.log('Submitting:', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to results page
    router.push('/matching/results')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">
                Welches Fach?
              </h2>
              <p className="text-gray-600">
                Wähle das Hauptfach für dein Mentoring
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map((subject) => {
                const IconComponent = subject.icon
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setFormData({ ...formData, subject: subject.id })
                      handleNext()
                    }}
                    className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-navy-600 hover:shadow-lg transition-all duration-200 text-center group"
                  >
                    <div className="mb-3 flex justify-center">
                      <IconComponent size={40} className="text-navy-600 group-hover:text-navy-700" />
                    </div>
                    <div className="font-semibold text-navy-900 group-hover:text-navy-600">
                      {subject.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">
                Welches Niveau?
              </h2>
              <p className="text-gray-600">
                Damit wir den passenden Mentor finden
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    setFormData({ ...formData, level: level.id })
                    handleNext()
                  }}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-navy-600 hover:shadow-lg transition-all duration-200 text-left font-semibold text-navy-900 hover:text-navy-600"
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">
                Was ist dein Ziel?
              </h2>
              <p className="text-gray-600">
                Was möchtest du erreichen?
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => {
                    setFormData({ ...formData, goal: goal.id })
                    handleNext()
                  }}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-navy-600 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="font-bold text-navy-900 mb-1">
                    {goal.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {goal.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">
                Wie lernst du am besten?
              </h2>
              <p className="text-gray-600">
                Damit dein Mentor sich optimal vorbereitet
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {learningStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setFormData({ ...formData, learningStyle: style.id })
                    handleNext()
                  }}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-navy-600 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="font-bold text-navy-900 mb-1">
                    {style.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">
                Wie dringend?
              </h2>
              <p className="text-gray-600">
                Wann möchtest du starten?
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {urgencies.map((urgency) => (
                <button
                  key={urgency.id}
                  onClick={() => {
                    setFormData({ ...formData, urgency: urgency.id })
                    handleNext()
                  }}
                  className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-navy-600 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="font-bold text-navy-900 mb-1">
                    {urgency.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {urgency.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">
                Sprache & Kontakt
              </h2>
              <p className="text-gray-600">
                Letzter Schritt!
              </p>
            </div>
            <div className="max-w-xl mx-auto space-y-6">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-3">
                  Bevorzugte Unterrichtssprache
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() =>
                        setFormData({ ...formData, language: lang.id })
                      }
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        formData.language === lang.id
                          ? 'border-navy-600 bg-navy-50'
                          : 'border-gray-200 hover:border-navy-400'
                      }`}
                    >
                      <div className="text-3xl mb-2">{lang.flag}</div>
                      <div className="text-sm font-semibold text-navy-900">
                        {lang.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-3">
                  Deine E-Mail-Adresse
                </label>
                <input
                  type="email"
                  placeholder="name@beispiel.de"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-standard"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Wir senden dir die perfekten Mentor-Matches
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!formData.language || !formData.email || isSubmitting}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Matching läuft...'
                ) : (
                  <>
                    <Sparkles className="inline mr-2" size={20} />
                    Perfekte Mentoren finden
                  </>
                )}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-navy-900">
              Schritt {currentStep} von 6
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / 6) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-navy-600 to-gold-500 transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep > 1 && currentStep < 6 && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-navy-600 font-semibold hover:text-navy-800"
            >
              <ChevronLeft size={20} />
              <span>Zurück</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 text-gray-400 font-semibold"
            >
              <span>Überspringen</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
