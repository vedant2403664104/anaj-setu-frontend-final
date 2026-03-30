"use client"

import { useState } from "react"
import Link from "next/link"
import { Truck, MapPin, Package, Wallet, Bell, Settings, LogOut, Navigation, Phone, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const pendingPickups = [
  {
    id: 1,
    donor: "Grand Hotel",
    donorAddress: "123 Main Street, Downtown",
    recipient: "Hope Foundation",
    recipientAddress: "456 Oak Avenue, East Side",
    type: "Biryani",
    quantity: "50 meals",
    distance: "4.2 km",
    payment: "Rs. 150",
    status: "pending"
  },
  {
    id: 2,
    donor: "City Restaurant",
    donorAddress: "789 Food Lane, Central",
    recipient: "Care Trust",
    recipientAddress: "321 Help Street, West Side",
    type: "Rice & Curry",
    quantity: "30 meals",
    distance: "2.8 km",
    payment: "Rs. 100",
    status: "pending"
  }
]

export default function DeliveryDashboard() {
  const [activePickup, setActivePickup] = useState<typeof pendingPickups[0] | null>(null)
  const [pickupStage, setPickupStage] = useState<"select" | "pickup" | "deliver" | "complete">("select")
  const [sliderValue, setSliderValue] = useState(0)

  const [otpCode, setOtpCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const verifyHandshake = async () => {
      try {
          const response = await fetch("http://localhost:8081/api/otp/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ otpCode: otpCode })
          });
          const data = await response.json();
          if (data.status === "success") {
              setVerificationMessage("Success! Food handover authorized.");
              setPickupStage("deliver"); // This moves the UI to the next screen!
          } else {
              setVerificationMessage("Error: Invalid OTP.");
          }
      } catch (error) {
          setVerificationMessage("Error connecting to server.");
      }
  };

  const handleAcceptPickup = (pickup: typeof pendingPickups[0]) => {
    setActivePickup(pickup)
    setPickupStage("pickup")
  }

  const handleSlideConfirm = () => {
    if (sliderValue >= 90) {
      if (pickupStage === "pickup") {
        setPickupStage("deliver")
        setSliderValue(0)
      } else if (pickupStage === "deliver") {
        setPickupStage("complete")
      }
    }
  }

  const handleNextPickup = () => {
    setActivePickup(null)
    setPickupStage("select")
    setSliderValue(0)
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
          <Link href="/dashboard/delivery" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/delivery/pickups" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Package className="h-5 w-5" />
            My Pickups
          </Link>
          <Link href="/dashboard/delivery/earnings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <Wallet className="h-5 w-5" />
            Earnings
          </Link>
          <Link href="/dashboard/delivery/map" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <MapPin className="h-5 w-5" />
            Live Map
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">Rahul Kumar</p>
              <p className="text-xs text-muted-foreground">Delivery Partner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-foreground">Delivery Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Rahul</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">Online</Badge>
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
                    <p className="text-sm text-muted-foreground">Today&apos;s Deliveries</p>
                    <p className="text-2xl font-bold text-foreground">8</p>
                    <p className="text-xs text-muted-foreground">completed</p>
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
                    <p className="text-sm text-muted-foreground">Today&apos;s Earnings</p>
                    <p className="text-2xl font-bold text-foreground">Rs. 850</p>
                    <p className="text-xs text-muted-foreground">earned</p>
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
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="text-2xl font-bold text-foreground">24.5 km</p>
                    <p className="text-xs text-muted-foreground">traveled</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Navigation className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold text-foreground">4.8</p>
                    <p className="text-xs text-muted-foreground">out of 5</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Pickup or Map View */}
          {activePickup ? (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {pickupStage === "pickup" && "Pickup Location"}
                      {pickupStage === "deliver" && "Delivery Location"}
                      {pickupStage === "complete" && "Delivery Complete"}
                    </CardTitle>
                    <CardDescription>
                      {pickupStage === "pickup" && `Pick up from ${activePickup.donor}`}
                      {pickupStage === "deliver" && `Deliver to ${activePickup.recipient}`}
                      {pickupStage === "complete" && "Great job! Delivery completed successfully."}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {activePickup.payment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pickupStage !== "complete" ? (
                  <>
                    {/* Map Placeholder */}
                    <div className="bg-muted rounded-xl h-64 mb-6 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                      <div className="text-center relative z-10">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="font-medium text-foreground">
                          {pickupStage === "pickup" ? activePickup.donorAddress : activePickup.recipientAddress}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{activePickup.distance} away</p>
                      </div>
                      {/* Decorative map lines */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-0 right-0 h-px bg-border" />
                        <div className="absolute top-2/4 left-0 right-0 h-px bg-border" />
                        <div className="absolute top-3/4 left-0 right-0 h-px bg-border" />
                        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-border" />
                        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-border" />
                        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-border" />
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {pickupStage === "pickup" ? activePickup.donor : activePickup.recipient}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pickupStage === "pickup" ? activePickup.donorAddress : activePickup.recipientAddress}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                    </div>

                    {/* Food Details */}
                    <div className="p-4 bg-muted/50 rounded-lg mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Package Details</p>
                      <p className="font-medium text-foreground">{activePickup.type} - {activePickup.quantity}</p>
                    </div>

                   {/* Real OTP Input Box */}
                    <div className="flex flex-col gap-3 mt-4">
                        <input 
                            type="text" 
                            placeholder="Enter 4-digit OTP" 
                            maxLength={4}
                            className="border-2 border-gray-300 p-3 rounded-md text-center text-2xl tracking-[1em] text-black font-bold focus:border-green-600 focus:outline-none"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                        />
                        <button 
                            onClick={verifyHandshake}
                            className="bg-green-600 text-white p-4 rounded-md font-bold text-lg hover:bg-green-700 transition"
                        >
                            Verify Code & Complete Pickup
                        </button>
                        {verificationMessage && (
                            <p className={`text-center font-bold text-lg ${verificationMessage.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                                {verificationMessage}
                            </p>
                        )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Delivery Completed!</h3>
                    <p className="text-muted-foreground mb-4">You earned {activePickup.payment} for this delivery.</p>
                    <div className="p-4 bg-muted/50 rounded-lg mb-6 max-w-sm mx-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount Received:</span>
                        <span className="font-bold text-foreground">{activePickup.payment}</span>
                      </div>
                    </div>
                    <Button onClick={handleNextPickup} size="lg">
                      Next Pickup
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Pending Pickups List */
            <Card>
              <CardHeader>
                <CardTitle>Available Pickups</CardTitle>
                <CardDescription>Select a pickup to start delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPickups.map((pickup) => (
                    <div key={pickup.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">{pickup.type}</p>
                          <p className="text-sm text-muted-foreground">{pickup.quantity}</p>
                        </div>
                        <Badge variant="secondary">{pickup.payment}</Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-muted-foreground">From:</span>
                          <span className="text-foreground">{pickup.donor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span className="text-muted-foreground">To:</span>
                          <span className="text-foreground">{pickup.recipient}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{pickup.distance}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleAcceptPickup(pickup)} 
                        className="w-full"
                      >
                        Accept Pickup
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
