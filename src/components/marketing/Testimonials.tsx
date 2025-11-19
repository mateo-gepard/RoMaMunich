'use client'

import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Anna Hoffmann',
      role: 'Mutter, Schwabing',
      rating: 5,
      text: 'Meine Tochter hatte in Mathe eine 4. Nach drei Monaten mit Max steht sie auf einer glatten 1. Er erklärt nicht nur den Stoff – er zeigt ihr, wie man denkt.',
      textEn:
        "My daughter had a 4 in math. After three months with Max, she's at a solid 1. He doesn't just explain the material – he shows her how to think.",
      result: 'Von 4 auf 1 in Mathematik',
      resultEn: 'From 4 to 1 in Mathematics',
    },
    {
      name: 'Michael Chen',
      role: 'Vater, Expat Family',
      rating: 5,
      text: 'We moved to Munich last year and needed high-quality tutoring in English. Sophie is phenomenal – our son actually looks forward to his sessions now.',
      textEn:
        'We moved to Munich last year and needed high-quality tutoring in English. Sophie is phenomenal – our son actually looks forward to his sessions now.',
      result: 'Abitur-Vorbereitung erfolgreich',
      resultEn: 'Abitur preparation successful',
    },
    {
      name: 'Stefanie Bauer',
      role: 'Mutter, Nymphenburg',
      rating: 5,
      text: 'Leon hat meinem Sohn nicht nur Chemie beigebracht, sondern echte Begeisterung für Naturwissenschaften geweckt. Das Dashboard ist super transparent.',
      textEn:
        "Leon didn't just teach my son chemistry, he sparked real enthusiasm for science. The dashboard is super transparent.",
      result: 'Jugend forscht Teilnahme',
      resultEn: 'Jugend forscht Participation',
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6">Das sagen Eltern</h2>
          <p className="text-xl text-gray-600">
            Echte Erfolgsgeschichten aus Münchner Familien
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-navy-50 to-white rounded-2xl p-8 shadow-soft hover:shadow-premium transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote size={64} className="text-navy-900" />
              </div>

              {/* Content */}
              <div className="relative space-y-4">
                {/* Stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="text-teal-500 fill-teal-500"
                      size={20}
                    />
                  ))}
                </div>

                {/* Result Badge */}
                <div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {testimonial.result}
                </div>

                {/* Text */}
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-bold text-navy-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-navy-900 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold text-teal-500 mb-2">
                100%
              </div>
              <div className="text-gray-300">
                Individueller Ansatz
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold text-teal-500 mb-2">
                Top
              </div>
              <div className="text-gray-300">
                Qualifizierte Mentoren
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold text-teal-500 mb-2">
                1:1
              </div>
              <div className="text-gray-300">
                Persönliche Betreuung
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
