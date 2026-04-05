"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ChefHat, Package, Plus, Bell, Settings, LogOut, TrendingUp,
  CheckCircle2, Clock, Users, X, MapPin, Calendar, ChevronRight,
  Flame, Leaf, AlertCircle, Loader2, Building2,
} from "lucide-react";

interface Listing {
  id: number;
  foodName: string;
  quantity: string;
  pickupAddress: string;
  expiryTime: string;
  status: "AVAILABLE" | "CLAIMED" | "DELIVERED";
  createdAt?: string;
  postedAt?: string;
  claimedBy?: { id: number; name: string; phone?: string } | string; // ← updated
  donorId?: number;
}
const statusConfig = {
  AVAILABLE: { label: "Available", style: "bg-green-100 text-green-700 border border-green-200", dot: "bg-green-500" },
  CLAIMED: { label: "Claimed", style: "bg-orange-100 text-orange-700 border border-orange-200", dot: "bg-orange-500" },
  DELIVERED: { label: "Delivered", style: "bg-blue-100 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
};

function DonateModal({ onClose, defaultAddress, donorId, onSuccess }: {
  onClose: () => void; defaultAddress: string; donorId: number; onSuccess: () => void;
}) {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupAddress, setPickupAddress] = useState(defaultAddress);
  const [expiryTime, setExpiryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!foodName || !quantity || !pickupAddress || !expiryTime) {
      setError("Please fill all required fields.");
      return;
    }

    const stored = sessionStorage.getItem("anajsetu_user");
    const user = stored ? JSON.parse(stored) : {};
    const resolvedDonorId = user.userId || user.id || donorId;

    console.log("Submitting with donorId:", resolvedDonorId);

    if (!resolvedDonorId) {
      setError("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/food-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token || ""}`,
        },
        body: JSON.stringify({
          foodName,
          quantityStr: quantity,
          quantity: parseInt(quantity) || 0,
          pickupAddress,
          expiryTime,
          notes,
          donorId: resolvedDonorId,
          status: "AVAILABLE",
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create listing.");
      }
      setSuccess(true);
      onSuccess();
      setTimeout(onClose, 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden" style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
        <div className="px-6 pt-4 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center"><Flame size={18} className="text-orange-500" /></div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg leading-tight">Donate Food</h2>
              <p className="text-xs text-gray-400">Fill in your surplus food details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"><X size={16} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {success && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
              <CheckCircle2 size={16} />
              <span className="font-semibold">Listing created! Nearby NGOs will be notified. 🎉</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} /><span>{error}</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Food Name <span className="text-orange-500">*</span></label>
            <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Dal Rice, Biryani, Roti Sabzi"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Quantity <span className="text-orange-500">*</span></label>
            <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50 meals, 10 kg"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pickup Address <span className="text-orange-500">*</span></label>
            <textarea value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Full address with landmark" rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Best Before <span className="text-orange-500">*</span></label>
            <input type="time" value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Notes <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Contains dairy, packed in boxes..." rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none" />
          </div>
          <button type="submit" disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all">
            {loading ? <><Loader2 size={16} className="animate-spin" />Creating listing...</>
              : success ? <><CheckCircle2 size={16} />Created!</>
              : <><Plus size={16} />Post Food Listing</>}
          </button>
        </form>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>,
    document.body
  );
}

export default function DonorDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "AVAILABLE" | "CLAIMED" | "DELIVERED">("ALL");
  const [restaurantName, setRestaurantName] = useState("Your Restaurant");
  const [contactName, setContactName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [donorId, setDonorId] = useState<number>(0);

  // ✅ FIX: tagline moved to state to avoid hydration mismatch
  const [tagline, setTagline] = useState("Your generosity turns leftovers into lifelines. 🍱");

  useEffect(() => {
    const stored = sessionStorage.getItem("anajsetu_user");
    if (stored) {
      const user = JSON.parse(stored);
      setContactName(user.contactName || user.name || "");
      setRestaurantName(user.orgName || user.name || "Your Restaurant");
      setDonorId(user.userId || user.id || 0);
      if (user.address) {
        const parts = user.address.split(" | ");
        setRestaurantAddress(parts[1] || user.address || "");
      }
      setIsFirstVisit(!user.hasVisited);
      sessionStorage.setItem("anajsetu_user", JSON.stringify({ ...user, hasVisited: true }));
    }
  }, []);

  // ✅ FIX: random tagline picked only on client after mount
  useEffect(() => {
    const taglines = [
      "Your generosity turns leftovers into lifelines. 🍱",
      "One donation feeds a family tonight. Thank you! 🙏",
      "Every meal shared is a life touched. Keep going! ❤️",
      "Your kitchen surplus is someone's hope. 🌟",
    ];
    setTagline(taglines[Math.floor(Math.random() * taglines.length)]);
  }, []);

  const fetchListings = useCallback(async () => {
    if (!donorId) return;
    try {
      const res = await fetch(`http://localhost:8081/api/food-listings/donor/${donorId}`);
      if (res.ok) setListings(await res.json());
    } catch { }
    finally { setLoading(false); }
  }, [donorId]);

  useEffect(() => {
    if (donorId) {
      fetchListings();
      const interval = setInterval(fetchListings, 15000);
      return () => clearInterval(interval);
    }
  }, [donorId, fetchListings]);

  const avatarLetter = restaurantName?.charAt(0)?.toUpperCase() || "R";
  const totalDonations = listings.length;
  const available = listings.filter((l) => l.status === "AVAILABLE").length;
  const claimed = listings.filter((l) => l.status === "CLAIMED").length;
  const delivered = listings.filter((l) => l.status === "DELIVERED").length;
  const filteredListings = activeTab === "ALL" ? listings : listings.filter((l) => l.status === activeTab);

  async function deleteListing(id: number) {
    try {
      await fetch(`http://localhost:8081/api/food-listings/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch { alert("Failed to delete listing."); }
  }

  const tabs = [
    { key: "ALL" as const, label: "All", count: totalDonations },
    { key: "AVAILABLE" as const, label: "Available", count: available },
    { key: "CLAIMED" as const, label: "Claimed", count: claimed },
    { key: "DELIVERED" as const, label: "Delivered", count: delivered },
  ];

  return (
    <div className="min-h-screen bg-orange-50/40">
      <header className="sticky top-0 bg-white border-b border-gray-100 shadow-sm" style={{ zIndex: 100 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2 shadow-md shadow-orange-200"><ChefHat className="text-white" size={18} /></div>
            <div className="leading-tight">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">Anaj</span>
              <span className="font-extrabold text-orange-500 text-lg tracking-tight">Setu</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white" />
            </button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"><Settings size={16} className="text-gray-500" /></button>
            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xs font-bold">{avatarLetter}</div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-800">{restaurantName}</p>
                <p className="text-[11px] text-orange-500 font-semibold">Food Donor</p>
              </div>
            </div>
            <Link href="/auth/login" className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors">
              <LogOut size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 rounded-3xl px-8 py-7 overflow-hidden shadow-lg shadow-orange-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-1">{isFirstVisit ? "Welcome to AnajSetu! 🎉" : "Welcome back! 👋"}</p>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight mb-1">{restaurantName}</h1>
              {contactName && <p className="text-orange-200 text-xs font-semibold mb-2"><Building2 size={11} className="inline mr-1" />{contactName}</p>}
              <p suppressHydrationWarning className="text-orange-100 text-sm max-w-sm leading-relaxed">{tagline}</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-white text-orange-600 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
              <Plus size={18} />Donate Food
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Donations", value: totalDonations, icon: Package, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
            { label: "Available Right Now", value: available, icon: CheckCircle2, iconBg: "bg-green-100", iconColor: "text-green-600" },
            { label: "Claimed by NGOs", value: claimed, icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            { label: "Delivered", value: delivered, icon: TrendingUp, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`${iconBg} rounded-xl p-3 flex-shrink-0`}><Icon size={20} className={iconColor} /></div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Listings */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-7 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Your Donations</h2>
              <p className="text-sm text-gray-400 mt-0.5">{filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} found</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-2 rounded-xl transition-colors">
              <Plus size={14} />New Listing
            </button>
          </div>
          <div className="px-7 pt-4 flex gap-1.5 flex-wrap">
            {tabs.map(({ key, label, count }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-150 ${activeTab === key ? "bg-orange-500 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"}`}>
                {label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>
              </button>
            ))}
          </div>
          <div className="px-7 py-5 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 size={28} className="text-orange-400 animate-spin mb-3" />
                <p className="text-sm text-gray-400 font-medium">Loading your donations...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4"><Package size={28} className="text-orange-300" /></div>
                <h3 className="font-bold text-gray-700 mb-1">No donations yet</h3>
                <p className="text-sm text-gray-400 max-w-xs">Click Donate Food to list your first donation.</p>
                <button onClick={() => setShowModal(true)}
                  className="mt-5 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-colors">
                  <Plus size={15} />Donate Food
                </button>
              </div>
            ) : (
              filteredListings.map((listing) => {
                const st = statusConfig[listing.status];
                return (
                  <div key={listing.id} className="flex items-start gap-4 bg-gray-50 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-100 rounded-2xl px-5 py-4 transition-all duration-150 group">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"><Flame size={18} className="text-orange-500" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{listing.foodName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{listing.quantity}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${st.style}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{listing.pickupAddress}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />Best before {listing.expiryTime}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11} />{listing.createdAt || listing.postedAt || "Just now"}</span>
                      </div>
                      {listing.claimedBy && (
  <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
    <CheckCircle2 size={11} />Claimed by {
      typeof listing.claimedBy === "object"
        ? (listing.claimedBy as { name?: string }).name || "NGO"
        : listing.claimedBy
    }
  </div>
)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {listing.status === "AVAILABLE" && (
                        <button onClick={() => deleteListing(listing.id)}
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center transition-colors">
                          <X size={13} className="text-red-500" />
                        </button>
                      )}
                      <button className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <ChevronRight size={13} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Impact */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Leaf size={20} className="text-green-600" /></div>
          <div>
            <p className="text-sm font-bold text-green-800">Environmental Impact — {restaurantName}</p>
            <p className="text-xs text-green-600 mt-0.5">
              You have helped save <span className="font-bold">{delivered * 40}+ meals</span> from going to waste and reduced <span className="font-bold">{delivered * 12} kg of CO2</span> this month. 🌱
            </p>
          </div>
        </div>
      </main>

      {showModal && (
        <DonateModal
          onClose={() => setShowModal(false)}
          defaultAddress={restaurantAddress}
          donorId={donorId}
          onSuccess={fetchListings}
        />
      )}
    </div>
  );
}