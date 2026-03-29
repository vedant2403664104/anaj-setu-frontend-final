"use client"

import { ClipboardList, MapPin, Truck, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "Register & List",
    description: "Donors register and list available surplus food with details like quantity, type, and pickup location."
  },
  {
    icon: MapPin,
    title: "Match & Connect",
    description: "Our system matches donors with nearby NGOs/Trusts who can best utilize the food donation."
  },
  {
    icon: Truck,
    title: "Pickup & Deliver",
    description: "Delivery partners pick up the food from donors and safely transport it to the receiving organization."
  },
  {
    icon: CheckCircle,
    title: "Impact & Track",
    description: "Track your contribution, receive certificates, and see the real impact of your donation."
  }
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Food Bridge Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple four-step process to connect surplus food with those who need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border">
                  <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-border transform rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
