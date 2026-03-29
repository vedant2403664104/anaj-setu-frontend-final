import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">FB</span>
              </div>
              <span className="font-bold text-xl text-foreground">Food Bridge</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Connecting surplus food with those who need it most. Together, we can eliminate hunger and reduce food waste.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Impact
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Get Involved</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register/donor" className="text-muted-foreground hover:text-foreground transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link href="/register/trust" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register NGO
                </Link>
              </li>
              <li>
                <Link href="/register/delivery" className="text-muted-foreground hover:text-foreground transition-colors">
                  Join as Delivery Partner
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2024 Food Bridge. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive" /> for a hunger-free world
          </p>
        </div>
      </div>
    </footer>
  )
}
