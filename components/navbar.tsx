"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span className="text-primary-foreground font-bold text-lg">FB</span>
            </div>
            <span className="font-bold text-xl text-foreground">Food Bridge</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors duration-200 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors duration-200 relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors duration-200 relative group">
              How it Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/impact" className="text-foreground/80 hover:text-foreground transition-colors duration-200 relative group">
              Impact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 flex flex-col gap-4">
            <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors py-2">
              Home
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors py-2">
              About Us
            </Link>
            <Link href="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors py-2">
              How it Works
            </Link>
            <Link href="/impact" className="text-foreground/80 hover:text-foreground transition-colors py-2">
              Impact
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/login">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
