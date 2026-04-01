"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ChefHat,
  Package,
  Plus,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  X,
  MapPin,
  Calendar,
  ChevronRight,
  Flame,
  Leaf,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Listing {
  id: number;
  foodName: string;
  quantity: string;
  pickupAddress: string;
  expiryTime: string;
  status: "AVAILABLE" | "CLAIMED" | "DELIVERED";
  createdAt: string;
  claimedBy?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockListings: Listing[] = [
  {
    id: 1,
    foodName: "Dal Makhani & Rice",
    quantity: "40 meals",
    pickupAddress: "12, MG Road, Bandra West, Mumbai",
    expiryTime: "10:00 PM",
    status: "CLAIMED",
    createdAt: "Today, 5:30 PM",
    claimedBy: "Asha Charitable Trust",
  },
  {
    id: 2,
    foodName: "Paneer Butter Masala",
    quantity: "25 meals",
    pickupAddress: "12, MG Road, Bandra West, Mumbai",
    expiryTime: "11:00 PM",
    status: "AVAILABLE",
    createdAt: "Today, 6:00 PM",
  },
  {
    id: 3,
    foodName: "Veg Biryani",
    quantity: "60 meals",
    pickupAddress: "12, MG Road, Bandra West, Mumbai",
    expiryTime: "9:30 PM",
    status: "DELIVERED",
    createdAt: "Yesterday, 7:00 PM",
    claimedBy: "Hope Foundation",
  },
];

// ─── Status Config ─────────────────────────────────────────────────────────────

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    style: "bg-green-100 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  CLAIMED: {
    label: "Claimed",
    style: "bg-orange-100 text-orange-700 border border-orange-200",
    dot: "bg-orange-500",
  },
  DELIVERED: {
    label: "Delivered",
    style: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
};

// ─── Donate Modal — Multi-Step ─────────────────────────────────────────────────

function DonateModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("meals");
  const [pickupAddress, setPickupAddress] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = ["Cooked Food", "Raw Ingredients", "Packaged Food", "Bakery", "Fruits & Veg", "Other"];
  const units = ["meals", "kg", "litres", "boxes", "packets"];

  const steps = [
    { id: "food", title: "What food are you donating?", subtitle: "Give it a clear name so NGOs know what to expect" },
    { id: "category", title: "Pick a category", subtitle: "This helps NGOs filter the right listings" },
    { id: "quantity", title: "How much food?", subtitle: "Enter the quantity so they can plan pickups" },
    { id: "address", title: "Where should they pick it up?", subtitle: "Provide the full address with a landmark" },
    { id: "expiry", title: "When does it expire?", subtitle: "Best-before date and time so food reaches people fresh" },
  ];

  const totalSteps = steps.length;
  const progressPct = ((step) / totalSteps) * 100;

  function canProceed() {
    if (step === 0) return foodName.trim().length > 0;
    if (step === 1) return category !== "";
    if (step === 2) return quantity.trim().length > 0;
    if (step === 3) return pickupAddress.trim().length > 0;
    if (step === 4) return expiryDate !== "" && expiryTime !== "";
    return true;
  }

  function handleNext() {
    if (!canProceed()) return;
    if (step < totalSteps - 1) setStep(step + 1);
    else handleSubmit();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/food-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName,
          category,
          quantity: `${quantity} ${unit}`,
          pickupAddress,
          expiryTime: `${expiryDate} ${expiryTime}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create listing. Please try again.");
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 99999 }}>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 w-full">
          <div
            className="h-1 bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 0 && !success && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors mr-1"
                aria-label="Go back"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              {success ? "Done!" : `Step ${step + 1} of ${totalSteps}`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* ── SUCCESS STATE ── */}
        {success ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Listing Posted! 🎉</h2>
              <p className="text-sm text-gray-400 mt-1">
                NGOs nearby will be notified. Thank you for your donation!
              </p>
            </div>
          </div>
        ) : (
          <div className="px-6 pt-3 pb-6">

            {/* Question */}
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {steps[step].title}
              </h2>
              <p className="text-xs text-gray-400 mt-1">{steps[step].subtitle}</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* ── STEP 0: Food Name ── */}
            {step === 0 && (
              <input
                autoFocus
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Dal Rice, Biryani, Roti Sabzi..."
                className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
            )}

            {/* ── STEP 1: Category ── */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-3 rounded-2xl border-2 text-sm font-bold text-left transition-all ${category === cat
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* ── STEP 2: Quantity + Unit ── */}
            {step === 2 && (
              <div className="space-y-3">
                <input
                  autoFocus
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. 40"
                  className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                />
                <div className="flex gap-2 flex-wrap">
                  {units.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${unit === u
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Address ── */}
            {step === 3 && (
              <textarea
                autoFocus
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. 12, Marine Drive, near XYZ landmark, Mumbai"
                rows={3}
                className="w-full px-4 py-4 text-base rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-white transition resize-none"
              />
            )}

            {/* ── STEP 4: Expiry Date + Time ── */}
            {step === 4 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    autoFocus
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-4 text-base rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Time</label>
                  <input
                    type="time"
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                    className="w-full px-4 py-4 text-base rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            {/* Next / Submit Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className={`mt-5 w-full flex items-center justify-center gap-2 font-extrabold text-sm py-4 rounded-2xl transition-all duration-200 ${canProceed() && !loading
                  ? "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-lg shadow-orange-200"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Posting...
                </>
              ) : step === totalSteps - 1 ? (
                <>
                  <Plus size={16} />
                  Post Food Listing
                </>
              ) : (
                <>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </>
              )}
            </button>

            {/* Hint */}
            {step < totalSteps - 1 && (
              <p className="text-center text-xs text-gray-300 mt-2">
                Press <kbd className="bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md font-mono text-[10px]">Enter ↵</kbd> to continue
              </p>
            )}

          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// DONOR DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export default function DonorDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [activeTab, setActiveTab] = useState<"ALL" | "AVAILABLE" | "CLAIMED" | "DELIVERED">("ALL");

  const totalDonations = listings.length;
  const available = listings.filter((l) => l.status === "AVAILABLE").length;
  const claimed = listings.filter((l) => l.status === "CLAIMED").length;
  const delivered = listings.filter((l) => l.status === "DELIVERED").length;

  const filteredListings =
    activeTab === "ALL" ? listings : listings.filter((l) => l.status === activeTab);

  function deleteListing(id: number) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  const tabs: { key: typeof activeTab; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: totalDonations },
    { key: "AVAILABLE", label: "Available", count: available },
    { key: "CLAIMED", label: "Claimed", count: claimed },
    { key: "DELIVERED", label: "Delivered", count: delivered },
  ];

  return (
    <div className="min-h-screen bg-orange-50/40">

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 bg-white border-b border-gray-100 shadow-sm" style={{ zIndex: 100 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2 shadow-md shadow-orange-200">
              <ChefHat className="text-white" size={18} />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">Anaj</span>
              <span className="font-extrabold text-orange-500 text-lg tracking-tight">Setu</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white" />
            </button>
            <button
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
              aria-label="Settings"
            >
              <Settings size={16} className="text-gray-500" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                R
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-800">Rajesh Kumar</p>
                <p className="text-[11px] text-orange-500 font-semibold">Donor</p>
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
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 rounded-3xl px-8 py-7 overflow-hidden shadow-lg shadow-orange-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
          <div className="relative flex items-center justify-between gap-6">
            <div>
              <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-1">
                Welcome back 👋
              </p>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight mb-2">
                Rajesh Kumar
              </h1>
              <p className="text-orange-100 text-sm max-w-sm leading-relaxed">
                Every meal you donate bridges the gap between waste and hope. Start a new donation today.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-white text-orange-600 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={18} />
              Donate Food
            </button>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Donations", value: totalDonations, icon: Package, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
            { label: "Available Right Now", value: available, icon: CheckCircle2, iconBg: "bg-green-100", iconColor: "text-green-600" },
            { label: "Claimed by NGOs", value: claimed, icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            { label: "Total Quantity", value: "0+", icon: TrendingUp, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
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

        {/* ── LISTINGS SECTION ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-7 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Your Donations</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              <Plus size={14} />
              New Listing
            </button>
          </div>

          {/* Tabs */}
          <div className="px-7 pt-4 flex gap-1.5 flex-wrap">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-150 ${activeTab === key
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                  }`}
              >
                {label}
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="px-7 py-5 space-y-3">
            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                  <Package size={28} className="text-orange-300" />
                </div>
                <h3 className="font-bold text-gray-700 mb-1">No donations yet</h3>
                <p className="text-sm text-gray-400 max-w-xs">
                  Click &ldquo;Donate Food&rdquo; to list your first donation and make an impact today.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-5 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-colors"
                >
                  <Plus size={15} />
                  Donate Food
                </button>
              </div>
            ) : (
              filteredListings.map((listing) => {
                const st = statusConfig[listing.status];
                return (
                  <div
                    key={listing.id}
                    className="flex items-start gap-4 bg-gray-50 hover:bg-orange-50/50 border border-gray-100 hover:border-orange-100 rounded-2xl px-5 py-4 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Flame size={18} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{listing.foodName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{listing.quantity}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${st.style}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} />{listing.pickupAddress}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} />Best before {listing.expiryTime}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />{listing.createdAt}
                        </span>
                      </div>
                      {listing.claimedBy && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          <CheckCircle2 size={11} />
                          Claimed by {listing.claimedBy}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {listing.status === "AVAILABLE" && (
                        <button
                          onClick={() => deleteListing(listing.id)}
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center transition-colors"
                          aria-label="Delete listing"
                        >
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

        {/* ── IMPACT FOOTER ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">Your Environmental Impact</p>
            <p className="text-xs text-green-600 mt-0.5">
              Based on your donations, you have helped reduce approximately{" "}
              <span className="font-bold">0 kg of CO₂</span> emissions and saved{" "}
              <span className="font-bold">0 meals</span> from going to waste.
            </p>
          </div>
        </div>

      </main>

      {/* ── DONATE MODAL ───────────────────────────────────────────────────── */}
      {showModal && <DonateModal onClose={() => setShowModal(false)} />}

    </div>
  );
}