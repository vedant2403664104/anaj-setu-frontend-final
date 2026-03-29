"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Users, Truck } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full w-fit">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Reducing Food Waste, Feeding Lives</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Bridge the Gap Between{" "}
              <span className="text-primary">Surplus Food</span> and{" "}
              <span className="text-accent">Hungry Hearts</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Food Bridge connects restaurants, hotels, and individuals with excess food to NGOs and communities in need. 
              Together, we can eliminate hunger and reduce food waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Donating <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn How it Works
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 pt-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">50K+</span>
                <span className="text-sm text-muted-foreground">Meals Delivered</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">200+</span>
                <span className="text-sm text-muted-foreground">Partner NGOs</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">500+</span>
                <span className="text-sm text-muted-foreground">Active Donors</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-6" />
              <div className="absolute inset-0 bg-accent/20 rounded-3xl transform -rotate-3" />
              <div className="relative bg-card rounded-3xl p-8 shadow-xl border border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Donate Food</span>
                  </div>
                  <div className="bg-accent/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <span className="font-medium text-foreground">Join as NGO</span>
                  </div>
                  <div className="col-span-2 bg-muted rounded-2xl p-6 flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
                      <Truck className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground block">Become a Delivery Partner</span>
                      <span className="text-sm text-muted-foreground">Help us reach more people</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
