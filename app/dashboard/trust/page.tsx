"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck, Bell, Settings, LogOut, Package, MapPin, Clock,
  CheckCircle2, Users, TrendingUp, ChefHat, Flame, Calendar,
  X, Loader2, AlertCircle, Search, Filter, ArrowRight, Heart, Leaf, Timer,
} from "lucide-react";

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
}

const statusConfig = {
  AVAILABLE: { label: "Available", style: "bg-green-100 text-green-700 border border-green-200", dot: "bg-green-500 animate-pulse" },
  CLAIMED: { label: "Claimed", style: "bg-orange-100 text-orange-700 border border-orange-200", dot: "bg-orange-500" },
  DELIVERED: { label: "Delivered", style: "bg-blue-100 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
};

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

function ClaimModal({ listing, onConfirm, onClose }: { listing: FoodListing; onConfirm: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setError(null);
    setLoading(true);
    try {
      const stored = sessionStorage.getItem("anajsetu_user");
      const user = stored ? JSON.parse(stored) : {};

      // ✅ FIXED — use userId first, fallback to id
      const resolvedNgoId = user.userId || user.id;

      if (!resolvedNgoId) {
        throw new Error("Session expired. Please login again.");
      }

      const res = await fetch(
        `http://localhost:8081/api/food-listings/${listing.id}/claim/${resolvedNgoId}`,
        { method: "PUT" }
      );
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
  const [activeTab, setActiveTab] = useState<"BROWSE" | "MY_CLAIMS">("BROWSE");
  const [searchQuery, setSearchQuery] = useState("");
  const [trustName, setTrustName] = useState("Your Organisation");
  const [userName, setUserName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [deliveryOtpSent, setDeliveryOtpSent] = useState(false);
  const [lastClaimedName, setLastClaimedName] = useState("");
  const [ngoId, setNgoId] = useState<number>(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("anajsetu_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.contactName || user.name || "");
      setTrustName(user.orgName || user.name || "Your Organisation");
      setNgoId(user.userId || user.id || 0); // ✅ FIXED
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

  const avatarLetter = trustName?.charAt(0)?.toUpperCase() || "T";
  const available = listings.filter((l) => l.status === "AVAILABLE");
  const delivered = myClaims.filter((c) => c.status === "DELIVERED").length;
  const filteredAvailable = available.filter((l) =>
    l.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.donorName || "").toLowerCase().includes(searchQuery.toLowerCase())
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

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-7 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-1.5">
              {[{ key: "BROWSE", label: "Browse Food", count: available.length }, { key: "MY_CLAIMS", label: "My Claims", count: myClaims.length }].map(({ key, label, count }) => (
                <button key={key} onClick={() => setActiveTab(key as "BROWSE" | "MY_CLAIMS")}
                  className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 ${activeTab === key ? "bg-green-600 text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"}`}>
                  {label}<span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>
                </button>
              ))}
            </div>
            {activeTab === "BROWSE" && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search food or donor..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition w-52" />
              </div>
            )}
          </div>

          {activeTab === "BROWSE" && (
            <div className="px-7 py-5 space-y-3">
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
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Leaf size={20} className="text-green-600" /></div>
          <div>
            <p className="text-sm font-bold text-green-800">Community Impact — {trustName}</p>
            <p className="text-xs text-green-600 mt-0.5"><span className="font-bold">{trustName}</span> has helped serve <span className="font-bold">{delivered * 40}+ meals</span> through AnajSetu. 🙏</p>
          </div>
        </div>
      </main>
      {claimTarget && <ClaimModal listing={claimTarget} onConfirm={handleClaimConfirmed} onClose={() => setClaimTarget(null)} />}
    </div>
  );
}