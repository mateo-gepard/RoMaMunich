import HeroSection from '@/components/marketing/HeroSection'
import ValueProposition from '@/components/marketing/ValueProposition'
import TutorShowcase from '@/components/marketing/TutorShowcase'
import HowItWorks from '@/components/marketing/HowItWorks'
import Testimonials from '@/components/marketing/Testimonials'
import Pricing from '@/components/marketing/Pricing'
import CTA from '@/components/marketing/CTA'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <TutorShowcase />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
