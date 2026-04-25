"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck, Bell, Settings, LogOut, Package, MapPin, Clock,
  CheckCircle2, Users, TrendingUp, ChefHat, Flame, Calendar,
  X, Loader2, AlertCircle, Search, Filter, ArrowRight, Heart, Leaf, Timer, Map,
  ArrowUpDown, ArrowDownUp, SortAsc, Star, MessageSquare, ThumbsUp,
} from "lucide-react";
import { FeedbackSection } from "@/components/feedback/FeedbackSection";
import type { FeedbackData } from "@/lib/types";
import { BASE_URL } from "@/lib/api-base";

interface FoodListing {
  id: number;
  foodName: string;
  quantity: string;
  donorName?: string;
  pickupAddress: string;
  expiryTime: string;
  postedAt?: string;
  createdAt?: string;
  status: "AVAILABLE" | "CLAIMED" | "DELIVERED";
  latitude?: number;
  longitude?: number;
}

// FeedbackData is imported from @/lib/types

const statusConfig = {
  AVAILABLE: { label: "Available", style: "bg-green-100 text-green-700 border border-green-200", dot: "bg-green-500 animate-pulse" },
  CLAIMED: { label: "Claimed", style: "bg-orange-100 text-orange-700 border border-orange-200", dot: "bg-orange-500" },
  DELIVERED: { label: "Delivered", style: "bg-blue-100 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
};

// ✅ NEW: Sort options
const SORT_OPTIONS = [
  { key: "newest", label: "Newest First", icon: "🕐" },
  { key: "oldest", label: "Oldest First", icon: "🕰️" },
  { key: "qty_high", label: "Quantity: High to Low", icon: "📦" },
  { key: "qty_low", label: "Quantity: Low to High", icon: "📉" },
  { key: "expiry", label: "Expiring Soon", icon: "⏰" },
];

function CountdownTimer({ createdAt }: { createdAt?: string }) {
  const [secondsLeft, setSecondsLeft] = useState(900);
  useEffect(() => {
    if (createdAt) {
      const expiry = new Date(createdAt).getTime() + 15 * 60 * 1000;
      const update = () => setSecondsLeft(Math.max(0, Math.floor((expiry - Date.now()) / 1000)));
      update();
      const t = setInterval(update, 1000);
      return () => clearInterval(t);
    }
  }, [createdAt]);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isUrgent = secondsLeft < 180;
  return (
    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${isUrgent ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
      <Timer size={11} />{secondsLeft === 0 ? "Expired" : `${mins}:${secs.toString().padStart(2, "0")} left`}
    </span>
  );
}

// ✅ NEW: Feedback Modal Component
function FeedbackModal({ item, onSubmit, onClose }: { item: FoodListing; onSubmit: (data: FeedbackData) => void; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (rating === 0) return;
    onSubmit({ listingId: item.id, foodName: item.foodName, rating, comment });
    setSubmitted(true);
    setTimeout(() => { onClose(); }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-7 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-extrabold text-xl">Give Feedback</h2>
            <p className="text-green-100 text-xs mt-0.5">Rate your experience for <span className="font-bold">{item.foodName}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"><X size={16} className="text-white" /></button>
        </div>
        <div className="px-7 py-6 space-y-5">
          {submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ThumbsUp size={32} className="text-green-600" />
              </div>
              <p className="font-extrabold text-green-700 text-lg">Thank you! 🙏</p>
              <p className="text-xs text-gray-400 mt-1">Your feedback helps us improve.</p>
            </div>
          ) : (
            <>
              {/* Star Rating */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">How was the food quality?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110">
                      <Star size={36} className={`transition-colors ${star <= (hovered || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                    {["", "Poor 😞", "Fair 😐", "Good 🙂", "Great 😊", "Excellent! 🌟"][rating]}
                  </p>
                )}
              </div>
              {/* Comment Box */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Any comments? <span className="text-gray-400 font-normal">(optional)</span></p>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Was the food fresh? Was the donor helpful?..."
                  rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none transition" />
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={rating === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold shadow-md shadow-green-200 transition-all">
                  <MessageSquare size={15} /> Submit Feedback
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ MAP COMPONENT (unchanged)
function FoodMap({ listings }: { listings: FoodListing[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;
      if (!mapRef.current || mapInstanceRef.current) return;
      const map = L.map(mapRef.current).setView([19.0760, 72.8777], 11);
      mapInstanceRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      const greenIcon = L.divIcon({
        html: `<div style="background:#16a34a;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32], className: "",
      });
      listings.forEach((listing) => {
        if (listing.latitude && listing.longitude) {
          L.marker([listing.latitude, listing.longitude], { icon: greenIcon }).addTo(map).bindPopup(`
            <div style="font-family:sans-serif;min-width:180px">
              <p style="font-weight:800;font-size:14px;margin:0 0 4px">🍲 ${listing.foodName}</p>
              <p style="font-size:12px;color:#555;margin:0 0 2px">📦 ${listing.quantity}</p>
              <p style="font-size:12px;color:#555;margin:0 0 2px">📍 ${listing.pickupAddress}</p>
              <p style="font-size:12px;color:#555;margin:0">⏰ Best before ${listing.expiryTime}</p>
            </div>`);
        }
      });
    };
    document.head.appendChild(script);
    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings]);

  const withCoords = listings.filter((l) => l.latitude && l.longitude).length;
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-7 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2"><Map size={18} className="text-green-600" /> Nearby Food Map</h2>
          <p className="text-xs text-gray-400 mt-0.5">{withCoords} listing{withCoords !== 1 ? "s" : ""} with location data</p>
        </div>
        {withCoords === 0 && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-semibold">📍 No location data yet</span>
        )}
      </div>
      <div ref={mapRef} style={{ height: "380px", width: "100%" }} />
    </div>
  );
}

// ✅ ClaimModal (unchanged)
function ClaimModal({ listing, onConfirm, onClose }: { listing: FoodListing; onConfirm: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setError(null);
    setLoading(true);
    try {
      const stored = sessionStorage.getItem("anajsetu_user");
      const user = stored ? JSON.parse(stored) : {};
      const resolvedNgoId = user.userId || user.id;
      if (!resolvedNgoId) throw new Error("Session expired. Please login again.");
      const res = await fetch(`http://localhost:8081/api/food-listings/${listing.id}/claim/${resolvedNgoId}`, { method: "PUT" });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to claim listing.");
      }
      await fetch("http://localhost:8081/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user.phone, purpose: "DELIVERY" }),
      });
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
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-7 py-5 flex items-center justify-between">
          <div><h2 className="text-white font-extrabold text-xl">Confirm Claim</h2><p className="text-green-100 text-xs mt-0.5">You are about to claim this food listing</p></div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"><X size={16} className="text-white" /></button>
        </div>
        <div className="px-7 py-6 space-y-4">
          {error && <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3"><AlertCircle size={15} /><span>{error}</span></div>}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Flame size={18} className="text-green-600" /></div>
              <div><p className="font-bold text-gray-900 text-sm">{listing.foodName}</p><p className="text-xs text-gray-500">{listing.quantity}</p></div>
            </div>
            <div className="space-y-1.5 pt-1 border-t border-green-100">
              {listing.donorName && <p className="flex items-center gap-2 text-xs text-gray-500"><ChefHat size={12} className="text-green-500" /><span className="font-semibold">Donor:</span> {listing.donorName}</p>}
              <p className="flex items-center gap-2 text-xs text-gray-500"><MapPin size={12} className="text-green-500" />{listing.pickupAddress}</p>
              <p className="flex items-center gap-2 text-xs text-gray-500"><Clock size={12} className="text-green-500" />Best before {listing.expiryTime}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">By claiming, your organisation confirms pickup within the time window. A delivery OTP will be sent to your phone.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleClaim} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-bold shadow-md shadow-green-200 transition-all">
              {loading ? <><Loader2 size={15} className="animate-spin" />Claiming...</> : <><CheckCircle2 size={15} />Claim Food</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrustDashboard() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [myClaims, setMyClaims] = useState<FoodListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [claimTarget, setClaimTarget] = useState<FoodListing | null>(null);
  const [activeTab, setActiveTab] = useState<"BROWSE" | "MY_CLAIMS" | "MAP">("BROWSE");
  const [searchQuery, setSearchQuery] = useState("");
  const [trustName, setTrustName] = useState("Your Organisation");
  const [userName, setUserName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [deliveryOtpSent, setDeliveryOtpSent] = useState(false);
  const [lastClaimedName, setLastClaimedName] = useState("");
  const [ngoId, setNgoId] = useState<number>(0);

  // ✅ NEW: Sort state
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // ✅ NEW: Feedback state
  const [feedbackTarget, setFeedbackTarget] = useState<FoodListing | null>(null);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<number[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("anajsetu_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.contactName || user.name || "");
      setTrustName(user.orgName || user.name || "Your Organisation");
      setNgoId(user.userId || user.id || 0);
      setIsFirstVisit(!user.hasVisited);
      sessionStorage.setItem("anajsetu_user", JSON.stringify({ ...user, hasVisited: true }));
    }
  }, []);

  const fetchAvailable = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8081/api/food-listings/available");
      if (res.ok) setListings(await res.json());
    } catch { } finally { setLoadingListings(false); }
  }, []);

  const fetchMyClaims = useCallback(async () => {
    if (!ngoId) return;
    try {
      const res = await fetch(`http://localhost:8081/api/food-listings/ngo/${ngoId}`);
      if (res.ok) setMyClaims(await res.json());
    } catch { }
  }, [ngoId]);

  useEffect(() => {
    fetchAvailable();
    const i = setInterval(fetchAvailable, 15000);
    return () => clearInterval(i);
  }, [fetchAvailable]);

  useEffect(() => {
    if (ngoId) { fetchMyClaims(); const i = setInterval(fetchMyClaims, 15000); return () => clearInterval(i); }
  }, [ngoId, fetchMyClaims]);

  // ✅ NEW: Sort function
  function sortListings(items: FoodListing[]) {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.postedAt || 0).getTime() - new Date(a.createdAt || a.postedAt || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || a.postedAt || 0).getTime() - new Date(b.createdAt || b.postedAt || 0).getTime();
        case "qty_high":
          return parseInt(b.quantity) - parseInt(a.quantity);
        case "qty_low":
          return parseInt(a.quantity) - parseInt(b.quantity);
        case "expiry":
          return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
        default:
          return 0;
      }
    });
  }

  const avatarLetter = trustName?.charAt(0)?.toUpperCase() || "T";
  const available = listings.filter((l) => l.status === "AVAILABLE");
  const delivered = myClaims.filter((c) => c.status === "DELIVERED").length;

  // ✅ UPDATED: Apply search + sort
  const filteredAvailable = sortListings(
    available.filter((l) =>
      l.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.donorName || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function handleClaimConfirmed() {
    if (!claimTarget) return;
    setLastClaimedName(claimTarget.foodName);
    setDeliveryOtpSent(true);
    setClaimTarget(null);
    fetchAvailable();
    fetchMyClaims();
    setActiveTab("MY_CLAIMS");
  }

  // ✅ Feedback submit — wired to POST /api/feedback
  async function handleFeedbackSubmit(data: FeedbackData) {
    try {
      await fetch(`${BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: data.listingId,
          giverId:   ngoId,
          rating:    data.rating,
          comment:   data.comment,
        }),
      });
    } catch {
      // Persist UI state even if the request fails silently
    }
    setSubmittedFeedbacks((prev) => [...prev, data.listingId]);
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.label || "Sort";

  return (
    <div className="min-h-screen bg-green-50/30">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-2 shadow-md shadow-green-200"><ShieldCheck className="text-white" size={18} /></div>
            <div className="leading-tight"><span className="font-extrabold text-gray-900 text-lg tracking-tight">Anaj</span><span className="font-extrabold text-green-600 text-lg tracking-tight">Setu</span></div>
          </Link>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"><Bell size={16} className="text-gray-500" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border border-white" /></button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"><Settings size={16} className="text-gray-500" /></button>
            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">{avatarLetter}</div>
              <div className="leading-tight"><p className="text-sm font-bold text-gray-800">{trustName}</p><p className="text-[11px] text-green-600 font-semibold">NGO Partner</p></div>
            </div>
            <Link href="/auth/login" className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors"><LogOut size={15} className="text-gray-400 hover:text-red-500 transition-colors" /></Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-3xl px-8 py-7 overflow-hidden shadow-lg shadow-green-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">{isFirstVisit ? "Welcome to AnajSetu! 🙏" : "Welcome back! 🙏"}</p>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight mb-1">{trustName}</h1>
              {userName && trustName !== userName && <p className="text-green-200 text-xs font-semibold mb-2">Contact: {userName}</p>}
              <p className="text-green-100 text-sm max-w-sm">{available.length} listing{available.length !== 1 ? "s" : ""} available — each open for 15 minutes.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-2xl px-5 py-3">
              <Heart size={18} className="text-green-200 fill-green-200" />
              <div><p className="text-white font-extrabold text-xl leading-tight">{available.length}</p><p className="text-green-200 text-xs font-medium">listings available</p></div>
            </div>
          </div>
        </div>

        {/* OTP Banner */}
        {deliveryOtpSent && (
          <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><ShieldCheck size={20} className="text-green-600" /></div>
            <div className="flex-1">
              <p className="font-bold text-green-800 text-sm">Delivery OTP sent to your phone!</p>
              <p className="text-xs text-green-700 mt-0.5">You claimed <span className="font-bold">{lastClaimedName}</span>. Share OTP only with the delivery partner.</p>
            </div>
            <button onClick={() => setDeliveryOtpSent(false)} className="text-green-400 hover:text-green-600 mt-0.5"><X size={16} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Available Listings", value: available.length, icon: Package, iconBg: "bg-green-100", iconColor: "text-green-600" },
            { label: "Total Claimed", value: myClaims.length, icon: CheckCircle2, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            { label: "In Transit", value: myClaims.filter(c => c.status === "CLAIMED").length, icon: TrendingUp, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
            { label: "Delivered", value: delivered, icon: Users, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`${iconBg} rounded-xl p-3 flex-shrink-0`}><Icon size={20} className={iconColor} /></div>
              <div><p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p><p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p></div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-7 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-1.5">
              {[
                { key: "BROWSE", label: "Browse Food", count: available.length },
                { key: "MY_CLAIMS", label: "My Claims", count: myClaims.length },
                { key: "MAP", label: "🗺️ Map View", count: available.filter(l => l.latitude).length },
              ].map(({ key, label, count }) => (
                <button key={key} onClick={() => setActiveTab(key as "BROWSE" | "MY_CLAIMS" | "MAP")}
                  className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 ${activeTab === key ? "bg-green-600 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"}`}>
                  {label}<span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>
                </button>
              ))}
            </div>

            {/* ✅ NEW: Search + Sort Bar for BROWSE tab */}
            {activeTab === "BROWSE" && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search food or donor..."
                    className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition w-48" />
                </div>
                {/* ✅ Sort Dropdown */}
                <div className="relative">
                  <button onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-green-50 hover:border-green-300 text-sm font-semibold text-gray-600 transition-all">
                    <ArrowUpDown size={14} className="text-green-600" />
                    <span className="hidden sm:inline">{currentSortLabel}</span>
                    <span className="sm:hidden">Sort</span>
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">Sort By</p>
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.key} onClick={() => { setSortBy(opt.key); setShowSortMenu(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-left ${sortBy === opt.key ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}>
                          <span>{opt.icon}</span>{opt.label}
                          {sortBy === opt.key && <span className="ml-auto text-green-500">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* BROWSE TAB */}
          {activeTab === "BROWSE" && (
            <div className="px-7 py-5 space-y-3">
              {/* ✅ Sort info pill */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <SortAsc size={13} className="text-green-500" />
                  Sorted by: <span className="text-green-600 font-bold">{currentSortLabel}</span>
                  <span className="text-gray-300">·</span>
                  <span>{filteredAvailable.length} result{filteredAvailable.length !== 1 ? "s" : ""}</span>
                </span>
              </div>

              {loadingListings ? (
                <div className="flex flex-col items-center justify-center py-16"><Loader2 size={28} className="text-green-400 animate-spin mb-3" /><p className="text-sm text-gray-400">Loading available food...</p></div>
              ) : filteredAvailable.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4"><Filter size={26} className="text-green-300" /></div>
                  <h3 className="font-bold text-gray-700 mb-1">No listings found</h3>
                  <p className="text-sm text-gray-400 max-w-xs">{searchQuery ? "No results match your search." : "No food available right now. Check back soon!"}</p>
                </div>
              ) : (
                filteredAvailable.map((listing) => (
                  <div key={listing.id} className="flex items-start gap-4 bg-gray-50 hover:bg-green-50/60 border border-gray-100 hover:border-green-200 rounded-2xl px-5 py-5 transition-all duration-150">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"><Flame size={18} className="text-green-600" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div><h3 className="font-bold text-gray-900 text-sm">{listing.foodName}</h3><p className="text-xs text-gray-500 mt-0.5">{listing.quantity}</p></div>
                        <div className="flex items-center gap-2">
                          <CountdownTimer createdAt={listing.createdAt || listing.postedAt} />
                          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Available</span>
                        </div>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                        {listing.donorName && <span className="flex items-center gap-1 text-xs text-gray-400"><ChefHat size={11} className="text-green-500" />{listing.donorName}</span>}
                        <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{listing.pickupAddress}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />Best before {listing.expiryTime}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={11} />{listing.createdAt || listing.postedAt || "Recently"}</span>
                      </div>
                    </div>
                    <button onClick={() => setClaimTarget(listing)} className="flex-shrink-0 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-green-200 transition-all hover:-translate-y-0.5">
                      Claim <ArrowRight size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MY CLAIMS TAB */}
          {activeTab === "MY_CLAIMS" && (
            <div className="px-7 py-5 space-y-3">
              {myClaims.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={26} className="text-green-300" /></div>
                  <h3 className="font-bold text-gray-700 mb-1">No claims yet</h3>
                  <button onClick={() => setActiveTab("BROWSE")} className="mt-5 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-green-200 transition-colors">Browse Listings <ArrowRight size={14} /></button>
                </div>
              ) : (
                myClaims.map((item) => {
                  const ds = statusConfig[item.status] || statusConfig.CLAIMED;
                  const alreadyFeedback = submittedFeedbacks.includes(item.id);
                  return (
                    <div key={item.id} className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"><Package size={18} className="text-green-600" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div><h3 className="font-bold text-gray-900 text-sm">{item.foodName}</h3><p className="text-xs text-gray-500 mt-0.5">{item.quantity}</p></div>
                          <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${ds.style}`}><span className={`w-1.5 h-1.5 rounded-full ${ds.dot}`} />{ds.label}</span>
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                          {item.donorName && <span className="flex items-center gap-1 text-xs text-gray-400"><ChefHat size={11} className="text-green-500" />{item.donorName}</span>}
                          <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{item.pickupAddress}</span>
                        </div>

                        {/* ✅ NEW: Feedback button — only for DELIVERED items */}
                        {item.status === "DELIVERED" && (
                          <div className="mt-3">
                            {alreadyFeedback ? (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl w-fit">
                                <ThumbsUp size={12} /> Feedback Submitted ✓
                              </span>
                            ) : (
                              <button onClick={() => setFeedbackTarget(item)}
                                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors">
                                <Star size={12} className="fill-amber-400 text-amber-400" /> Give Feedback
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === "MAP" && (
            <div className="p-4"><FoodMap listings={available} /></div>
          )}
        </div>

        {/* Impact Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Leaf size={20} className="text-green-600" /></div>
          <div>
            <p className="text-sm font-bold text-green-800">Community Impact — {trustName}</p>
            <p className="text-xs text-green-600 mt-0.5"><span className="font-bold">{trustName}</span> has helped serve <span className="font-bold">{delivered * 40}+ meals</span> through AnajSetu. 🙏</p>
          </div>
        </div>

        {/* ── Feedback Section ───────────────────────────────────── */}
        {ngoId > 0 && (
          <FeedbackSection userId={ngoId} accentColor="green" />
        )}
      </main>

      {/* Modals */}
      {claimTarget && <ClaimModal listing={claimTarget} onConfirm={handleClaimConfirmed} onClose={() => setClaimTarget(null)} />}

      {/* ✅ NEW: Feedback Modal */}
      {feedbackTarget && (
        <FeedbackModal
          item={feedbackTarget}
          onSubmit={handleFeedbackSubmit}
          onClose={() => setFeedbackTarget(null)}
        />
      )}
    </div>
  );
}