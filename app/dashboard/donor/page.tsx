"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Package, Wallet, Award, Bell, Settings, LogOut, Plus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const donations = [
  {
    id: 1,
    type: "Biryani",
    quantity: "100 meals",
    date: "Mar 28, 2024",
    status: "Delivered",
    recipient: "Hope Foundation"
  },
  {
    id: 2,
    type: "Rice & Dal",
    quantity: "50 meals",
    date: "Mar 25, 2024",
    status: "Delivered",
    recipient: "City Shelter"
  },
  {
    id: 3,
    type: "Mixed Food",
    quantity: "75 meals",
    date: "Mar 20, 2024",
    status: "Delivered",
    recipient: "Care Trust"
  }
]

export default function DonorDashboard() {
  const [showDonateForm, setShowDonateForm] = useState(false)
  const [donationType, setDonationType] = useState<"food" | "money" | null>(null)
  const [foodForm, setFoodForm] = useState({
    foodType: "",
    quantity: "",
    expiryTime: "",
    description: ""
  })

  const handleFoodDonation = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Food donation:", foodForm)
    setShowDonateForm(false)
    setDonationType(null)
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
          <Link href="/dashboard/donor" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary">
            <Heart className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/donor/donations" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Package className="h-5 w-5" />
            My Donations
          </Link>
          <Link href="/dashboard/donor/monetary" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Wallet className="h-5 w-5" />
            Monetary Donations
          </Link>
          <Link href="/dashboard/donor/certificates" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Award className="h-5 w-5" />
            Certificates
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">Grand Hotel</p>
              <p className="text-xs text-muted-foreground">Donor Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-foreground">Donor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Grand Hotel</p>
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
          {/* Donation Type Selection */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Dialog open={showDonateForm && donationType === "food"} onOpenChange={(open) => { setShowDonateForm(open); if (!open) setDonationType(null); }}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group" onClick={() => { setDonationType("food"); setShowDonateForm(true); }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">Donate Food</h3>
                        <p className="text-muted-foreground">Share surplus food with those in need</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Donate Food</DialogTitle>
                  <DialogDescription>Fill in the details of the food you want to donate</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFoodDonation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="foodType">Food Type</Label>
                    <Select value={foodForm.foodType} onValueChange={(value) => setFoodForm({ ...foodForm, foodType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select food type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cooked">Cooked Food</SelectItem>
                        <SelectItem value="raw">Raw Ingredients</SelectItem>
                        <SelectItem value="packaged">Packaged Food</SelectItem>
                        <SelectItem value="fruits">Fruits & Vegetables</SelectItem>
                        <SelectItem value="dairy">Dairy Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (Number of meals)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 50"
                      value={foodForm.quantity}
                      onChange={(e) => setFoodForm({ ...foodForm, quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryTime">Best Before</Label>
                    <Input
                      id="expiryTime"
                      type="datetime-local"
                      value={foodForm.expiryTime}
                      onChange={(e) => setFoodForm({ ...foodForm, expiryTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the food"
                      value={foodForm.description}
                      onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Donation
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-accent/50 group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Wallet className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Donate Money</h3>
                    <p className="text-muted-foreground">Contribute to meal distribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Donated</p>
                    <p className="text-2xl font-bold text-foreground">225</p>
                    <p className="text-xs text-muted-foreground">meals</p>
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
                    <p className="text-sm text-muted-foreground">Monetary</p>
                    <p className="text-2xl font-bold text-foreground">Rs. 15,000</p>
                    <p className="text-xs text-muted-foreground">contributed</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">NGOs Helped</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">organizations</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">CSR certs</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Your food donation history</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{donation.type}</p>
                        <p className="text-sm text-muted-foreground">{donation.quantity} to {donation.recipient}</p>
                        <p className="text-xs text-muted-foreground">{donation.date}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {donation.status}
                    </Badge>
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
