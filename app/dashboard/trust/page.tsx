"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Package, Users, TrendingUp, Bell, Settings, LogOut, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const availableFood = [
  {
    id: 1,
    donor: "Grand Hotel",
    type: "Cooked Food",
    quantity: "50 meals",
    expiry: "Today, 8 PM",
    distance: "2.5 km",
    status: "available"
  },
  {
    id: 2,
    donor: "City Restaurant",
    type: "Rice & Curry",
    quantity: "30 meals",
    expiry: "Today, 9 PM",
    distance: "1.2 km",
    status: "available"
  },
  {
    id: 3,
    donor: "Corporate Cafeteria",
    type: "Mixed Food",
    quantity: "100 meals",
    expiry: "Tomorrow, 12 PM",
    distance: "5 km",
    status: "available"
  }
]

const claimedFood = [
  {
    id: 4,
    donor: "Wedding Hall",
    type: "Biryani",
    quantity: "200 meals",
    status: "In Transit",
    eta: "30 mins"
  }
]

export default function TrustDashboard() {
  const [foodList, setFoodList] = useState(availableFood)

  const handleClaim = (id: number) => {
    setFoodList(foodList.filter(item => item.id !== id))
    // In real app, this would call an API
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">FB</span>
            </div>
            <span className="font-bold text-lg text-foreground">Food Bridge</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          <Link href="/dashboard/trust" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/trust/food" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Package className="h-5 w-5" />
            Food Resources
          </Link>
          <Link href="/dashboard/trust/requests" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Users className="h-5 w-5" />
            My Requests
          </Link>
          <Link href="/dashboard/trust/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <TrendingUp className="h-5 w-5" />
            Reports
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">Hope Foundation</p>
              <p className="text-xs text-muted-foreground">Trust Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Hope Foundation</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Received</p>
                    <p className="text-2xl font-bold text-foreground">1,250</p>
                    <p className="text-xs text-muted-foreground">meals this month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">People Fed</p>
                    <p className="text-2xl font-bold text-foreground">3,500</p>
                    <p className="text-xs text-muted-foreground">this month</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Donors</p>
                    <p className="text-2xl font-bold text-foreground">45</p>
                    <p className="text-xs text-muted-foreground">connected</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Pickups</p>
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">awaiting</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Food */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Food Resources</CardTitle>
              <CardDescription>Claim food donations from nearby donors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {foodList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.donor}</p>
                        <p className="text-sm text-muted-foreground">{item.type} - {item.quantity}</p>
                        <p className="text-xs text-muted-foreground">Expires: {item.expiry} | {item.distance} away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleClaim(item.id)}>
                        <Check className="h-4 w-4 mr-1" /> Claim
                      </Button>
                      <Button size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {foodList.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No available food resources at the moment.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Claimed Food */}
          <Card>
            <CardHeader>
              <CardTitle>Incoming Deliveries</CardTitle>
              <CardDescription>Food donations on their way to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claimedFood.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.donor}</p>
                        <p className="text-sm text-muted-foreground">{item.type} - {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{item.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">ETA: {item.eta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
