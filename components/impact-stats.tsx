"use client"

import { TrendingUp, Users, Utensils, Award } from "lucide-react"

const stats = [
  {
    icon: Utensils,
    value: "50,000+",
    label: "Meals Distributed",
    description: "Nutritious meals delivered to those in need"
  },
  {
    icon: Users,
    value: "200+",
    label: "Partner Organizations",
    description: "NGOs and trusts across the country"
  },
  {
    icon: TrendingUp,
    value: "10,000 kg",
    label: "Food Waste Prevented",
    description: "Keeping food out of landfills"
  },
  {
    icon: Award,
    value: "500+",
    label: "CSR Certificates",
    description: "Issued to corporate donors"
  }
]

export function ImpactStats() {
  return (
    <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Impact So Far
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Together, we are making a real difference in the fight against hunger and food waste.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-primary-foreground/70">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
