"use client"

import { Building2, Heart, Truck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const roles = [
  {
    title: "Trust / NGO",
    description: "Register your organization to receive food donations and distribute to those in need.",
    icon: Building2,
    href: "/register/trust",
    color: "bg-primary",
    features: ["Receive food donations", "Track distributions", "Generate impact reports"]
  },
  {
    title: "Donor",
    description: "Donate surplus food or contribute monetarily to support our cause.",
    icon: Heart,
    href: "/register/donor",
    color: "bg-accent",
    features: ["Donate food easily", "Monetary contributions", "Get CSR certificates"]
  },
  {
    title: "Delivery Partner",
    description: "Join our delivery network and help transport food from donors to NGOs.",
    icon: Truck,
    href: "/register/delivery",
    color: "bg-foreground",
    features: ["Flexible schedule", "Earn per delivery", "Make a difference"]
  }
]

export function RoleSelection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join the Movement
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose how you want to contribute to reducing food waste and feeding those in need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {roles.map((role) => (
            <Card key={role.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <role.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription className="text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={role.href}>
                  <Button className="w-full" variant={role.title === "Donor" ? "default" : "outline"}>
                    Register as {role.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
