import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { RoleSelection } from "@/components/role-selection"
import { ImpactStats } from "@/components/impact-stats"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RoleSelection />
      <HowItWorks />
      <ImpactStats />
      <Footer />
    </main>
  )
}
