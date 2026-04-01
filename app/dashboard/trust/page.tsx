"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  ChefHat,
  Flame,
  Calendar,
  X,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Heart,
  Leaf,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FoodListing {
  id: number;
  foodName: string;
  quantity: string;
  donorName: string;
  pickupAddress: string;
  expiryTime: string;
  postedAt: string;
  status: "AVAILABLE" | "CLAIMED";
  mealsCount: number;
}

interface ClaimedItem {
  id: number;
  foodName: string;
  quantity: string;
  donorName: string;
  pickupAddress: string;
  claimedAt: string;
  deliveryStatus: "PENDING" | "IN_TRANSIT" | "DELIVERED";
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockAvailable: FoodListing[] = [
  {
    id: 1,
    foodName: "Paneer Butter Masala & Naan",
    quantity: "35 meals",
    donorName: "Saffron Grand Hotel",
    pickupAddress: "12, MG Road, Bandra West, Mumbai",
    expiryTime: "10:30 PM",
    postedAt: "30 mins ago",
    status: "AVAILABLE",
    mealsCount: 35,
  },
  {
    id: 2,
    foodName: "Veg Thali (Dal, Rice, Roti)",
    quantity: "60 meals",
    donorName: "Hotel Annapoorna",
    pickupAddress: "45, Linking Road, Santacruz, Mumbai",
    expiryTime: "11:00 PM",
    postedAt: "1 hr ago",
    status: "AVAILABLE",
    mealsCount: 60,
  },
  {
    id: 3,
    foodName: "Chole Bhature",
    quantity: "20 meals",
    donorName: "Punjab Da Dhaba",
    pickupAddress: "7, SV Road, Andheri West, Mumbai",
    expiryTime: "9:45 PM",
    postedAt: "2 hrs ago",
    status: "AVAILABLE",
    mealsCount: 20,
  },
];

const mockClaimed: ClaimedItem[] = [
  {
    id: 101,
    foodName: "Dal Makhani & Rice",
    quantity: "40 meals",
    donorName: "Spice Garden Restaurant",
    pickupAddress: "22, Hill Road, Bandra",
    claimedAt: "Today, 5:30 PM",
    deliveryStatus: "IN_TRANSIT",
  },
  {
    id: 102,
    foodName: "Biryani",
    quantity: "50 meals",
    donorName: "Grand Hyatt Mumbai",
    pickupAddress: "Off Western Express Highway",
    claimedAt: "Yesterday, 7:00 PM",
    deliveryStatus: "DELIVERED",
  },
];

// ─── Delivery Status Config ────────────────────────────────────────────────────

const deliveryConfig = {
  PENDING: {
    label: "Pickup Pending",
    style: "bg-amber-100 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  IN_TRANSIT: {
    label: "In Transit",
    style: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
  DELIVERED: {
    label: "Delivered",
    style: "bg-green-100 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
};

// ─── Claim Confirm Modal ───────────────────────────────────────────────────────

function ClaimModal({
  listing,
  onConfirm,
  onClose,
}: {
  listing: FoodListing;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8081/api/food-listings/${listing.id}/claim`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed to claim listing. Try again.");
      onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-7 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-extrabold text-xl">Confirm Claim</h2>
            <p className="text-green-100 text-xs mt-0.5">You are about to claim this food listing</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4">

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Listing Summary */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Flame size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{listing.foodName}</p>
                <p className="text-xs text-gray-500">{listing.quantity}</p>
              </div>
            </div>
            <div className="space-y-1.5 pt-1 border-t border-green-100">
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <ChefHat size={12} className="text-green-500" />
                <span className="font-semibold">Donor:</span> {listing.donorName}
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} className="text-green-500" />
                {listing.pickupAddress}
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} className="text-green-500" />
                Best before {listing.expiryTime}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            By claiming this listing, you confirm that your organisation will arrange
            pickup within the time window. A delivery partner will be notified.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClaim}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-bold shadow-md shadow-green-200 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  Claim Food
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRUST DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export default function TrustDashboard() {
  const [available, setAvailable] = useState<FoodListing[]>(mockAvailable);
  const [claimed, setClaimed] = useState<ClaimedItem[]>(mockClaimed);
  const [claimTarget, setClaimTarget] = useState<FoodListing | null>(null);
  const [activeTab, setActiveTab] = useState<"BROWSE" | "MY_CLAIMS">("BROWSE");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats
  const totalClaimed = claimed.length;
  const inTransit = claimed.filter((c) => c.deliveryStatus === "IN_TRANSIT").length;
  const delivered = claimed.filter((c) => c.deliveryStatus === "DELIVERED").length;
  const totalMeals = mockAvailable.reduce((s, l) => s + l.mealsCount, 0);

  // Search filter
  const filteredAvailable = available.filter((l) =>
    l.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.donorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleClaimConfirmed() {
    if (!claimTarget) return;
    // Remove from available, add to claimed list
    setAvailable((prev) => prev.filter((l) => l.id !== claimTarget.id));
    setClaimed((prev) => [
      {
        id: claimTarget.id,
        foodName: claimTarget.foodName,
        quantity: claimTarget.quantity,
        donorName: claimTarget.donorName,
        pickupAddress: claimTarget.pickupAddress,
        claimedAt: "Just now",
        deliveryStatus: "PENDING",
      },
      ...prev,
    ]);
    setClaimTarget(null);
    setActiveTab("MY_CLAIMS");
  }

  return (
    <div className="min-h-screen bg-green-50/30">

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-2 shadow-md shadow-green-200">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">Anaj</span>
              <span className="font-extrabold text-green-600 text-lg tracking-tight">Setu</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors" aria-label="Notifications">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
            </button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors" aria-label="Settings">
              <Settings size={16} className="text-gray-500" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-800">Asha Trust</p>
                <p className="text-[11px] text-green-600 font-semibold">NGO Partner</p>
              </div>
            </div>
            <Link
              href="/auth/login"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors"
              aria-label="Logout"
            >
              <LogOut size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── WELCOME BANNER ─────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-green-600 via-green-600 to-green-700 rounded-3xl px-8 py-7 overflow-hidden shadow-lg shadow-green-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

          <div className="relative flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">
                Welcome back 🙏
              </p>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
                Asha Charitable Trust
              </h1>
              <p className="text-green-100 text-sm max-w-sm leading-relaxed">
                {available.length} food listing{available.length !== 1 ? "s" : ""} are available right now.
                Claim what your shelter needs today.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-2xl px-5 py-3">
              <Heart size={18} className="text-green-200 fill-green-200" />
              <div>
                <p className="text-white font-extrabold text-xl leading-tight">{totalMeals}+</p>
                <p className="text-green-200 text-xs font-medium">meals available</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Available Listings",
              value: available.length,
              icon: Package,
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },
            {
              label: "Total Claimed",
              value: totalClaimed,
              icon: CheckCircle2,
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
            {
              label: "In Transit",
              value: inTransit,
              icon: TrendingUp,
              iconBg: "bg-amber-100",
              iconColor: "text-amber-600",
            },
            {
              label: "Delivered",
              value: delivered,
              icon: Users,
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600",
            },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`${iconBg} rounded-xl p-3 flex-shrink-0`}>
                <Icon size={20} className={iconColor} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Tab Header */}
          <div className="px-7 pt-6 pb-0 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap pb-4">
            <div className="flex gap-1.5">
              {[
                { key: "BROWSE", label: "Browse Food", count: available.length },
                { key: "MY_CLAIMS", label: "My Claims", count: totalClaimed },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as "BROWSE" | "MY_CLAIMS")}
                  className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 ${activeTab === key
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                    }`}
                >
                  {label}
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search (Browse tab only) */}
            {activeTab === "BROWSE" && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food or donor..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition w-52"
                />
              </div>
            )}
          </div>

          {/* ── BROWSE TAB ────────────────────────────────────────────────── */}
          {activeTab === "BROWSE" && (
            <div className="px-7 py-5 space-y-3">
              {filteredAvailable.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                    <Filter size={26} className="text-green-300" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">No listings found</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    {searchQuery
                      ? "No results match your search. Try a different keyword."
                      : "All food has been claimed! Check back soon for new listings."}
                  </p>
                </div>
              ) : (
                filteredAvailable.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-start gap-4 bg-gray-50 hover:bg-green-50/60 border border-gray-100 hover:border-green-200 rounded-2xl px-5 py-5 transition-all duration-150 group"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Flame size={18} className="text-green-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{listing.foodName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 font-semibold">{listing.quantity}</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Available
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <ChefHat size={11} className="text-green-500" />
                          {listing.donorName}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} />
                          {listing.pickupAddress}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} />
                          Best before {listing.expiryTime}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />
                          Posted {listing.postedAt}
                        </span>
                      </div>
                    </div>

                    {/* Claim Button */}
                    <button
                      onClick={() => setClaimTarget(listing)}
                      className="flex-shrink-0 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-green-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Claim
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── MY CLAIMS TAB ─────────────────────────────────────────────── */}
          {activeTab === "MY_CLAIMS" && (
            <div className="px-7 py-5 space-y-3">
              {claimed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 size={26} className="text-green-300" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">No claims yet</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Go to Browse Food and claim your first listing.
                  </p>
                  <button
                    onClick={() => setActiveTab("BROWSE")}
                    className="mt-5 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-green-200 transition-colors"
                  >
                    Browse Listings
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                claimed.map((item) => {
                  const ds = deliveryConfig[item.deliveryStatus];
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 bg-gray-50 hover:bg-green-50/40 border border-gray-100 rounded-2xl px-5 py-5 transition-all duration-150"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package size={18} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{item.foodName}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{item.quantity}</p>
                          </div>
                          <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${ds.style}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ds.dot}`} />
                            {ds.label}
                          </span>
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <ChefHat size={11} className="text-green-500" />
                            {item.donorName}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={11} />
                            {item.pickupAddress}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={11} />
                            Claimed {item.claimedAt}
                          </span>
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-3 flex items-center gap-2">
                          {["PENDING", "IN_TRANSIT", "DELIVERED"].map((step, idx) => {
                            const steps = ["PENDING", "IN_TRANSIT", "DELIVERED"];
                            const curIndex = steps.indexOf(item.deliveryStatus);
                            const isActive = idx <= curIndex;
                            return (
                              <div key={step} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-gray-200"
                                  }`} />
                                {idx < 2 && (
                                  <div className={`w-8 h-0.5 rounded-full ${isActive && idx < curIndex ? "bg-green-400" : "bg-gray-200"
                                    }`} />
                                )}
                              </div>
                            );
                          })}
                          <span className="text-[10px] text-gray-400 ml-1 font-medium">{ds.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ── IMPACT FOOTER ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">Your Community Impact</p>
            <p className="text-xs text-green-600 mt-0.5">
              Asha Charitable Trust has helped serve{" "}
              <span className="font-bold">{delivered * 40}+ meals</span> to families in need
              through AnajSetu this month.
            </p>
          </div>
        </div>

      </main>

      {/* ── CLAIM MODAL ────────────────────────────────────────────────────── */}
      {claimTarget && (
        <ClaimModal
          listing={claimTarget}
          onConfirm={handleClaimConfirmed}
          onClose={() => setClaimTarget(null)}
        />
      )}
    </div>
  );
}