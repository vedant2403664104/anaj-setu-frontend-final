"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Package,
  MapPin,
  Clock,
  ChefHat,
  Bell,
  LogOut,
  Loader2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Inbox,
  ShieldCheck,
} from "lucide-react";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  role: string;
  isVerified: number;
  address?: string | null;
  createdAt: string;
}

interface FoodListing {
  id: number;
  donor: User;
  title: string;
  description?: string | null;
  quantity: number;
  quantityUnit: string;
  foodType: string;
  pickupAddress: string;
  expiryTime: string;
  pickupDeadline: string;
  status: "AVAILABLE" | string;
  createdAt: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const NGO_ID = 1; // Replace with session/auth context in production
const API_BASE = "http://localhost:8081/api";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeUrgency(expiryIso: string): {
  label: string;
  style: string;
  barWidth: string;
} {
  const now = Date.now();
  const expiry = new Date(expiryIso).getTime();
  const diffMs = expiry - now;
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffHrs <= 0)
    return {
      label: "Expired",
      style: "text-red-600 bg-red-50 border-red-200",
      barWidth: "w-0",
    };
  if (diffHrs <= 2)
    return {
      label: `${Math.round(diffHrs * 60)}m left`,
      style: "text-red-500 bg-red-50 border-red-200",
      barWidth: "w-1/6",
    };
  if (diffHrs <= 6)
    return {
      label: `${Math.floor(diffHrs)}h left`,
      style: "text-orange-500 bg-orange-50 border-orange-200",
      barWidth: "w-2/6",
    };
  if (diffHrs <= 12)
    return {
      label: `${Math.floor(diffHrs)}h left`,
      style: "text-yellow-600 bg-yellow-50 border-yellow-200",
      barWidth: "w-3/6",
    };
  return {
    label: `${Math.floor(diffHrs)}h left`,
    style: "text-green-600 bg-green-50 border-green-200",
    barWidth: "w-5/6",
  };
}

const foodTypeConfig: Record<
  string,
  { emoji: string; style: string }
> = {
  VEG: { emoji: "🥦", style: "bg-green-50 text-green-700 border-green-200" },
  "NON-VEG": {
    emoji: "🍗",
    style: "bg-red-50 text-red-700 border-red-200",
  },
  VEGAN: { emoji: "🌱", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  JAIN: { emoji: "🌼", style: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

// ─── Toast Notification ────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  type: "success" | "conflict" | "error";
  onDismiss: () => void;
}

function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles = {
    success:
      "bg-green-600 border-green-700",
    conflict:
      "bg-orange-600 border-orange-700",
    error:
      "bg-red-600 border-red-700",
  };

  const icons = {
    success: <CheckCircle2 size={18} className="text-white flex-shrink-0" />,
    conflict: <AlertTriangle size={18} className="text-white flex-shrink-0" />,
    error: <AlertTriangle size={18} className="text-white flex-shrink-0" />,
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-white text-sm font-semibold shadow-2xl max-w-sm animate-in slide-in-from-top-2 duration-300 ${styles[type]}`}
    >
      {icons[type]}
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity text-white font-bold text-base"
      >
        ×
      </button>
    </div>
  );
}

// ─── Food Listing Card ─────────────────────────────────────────────────────────

interface FoodCardProps {
  listing: FoodListing;
  isClaiming: boolean;
  onClaim: (id: number) => void;
}

function FoodCard({ listing, isClaiming, onClaim }: FoodCardProps) {
  const urgency = getTimeUrgency(listing.expiryTime);
  const ft = foodTypeConfig[listing.foodType] ?? {
    emoji: "🍽️",
    style: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Urgency Bar */}
      <div className="h-1 bg-gray-100 w-full">
        <div
          className={`h-1 rounded-full transition-all duration-500 ${
            urgency.barWidth
          } ${
            urgency.barWidth === "w-1/6"
              ? "bg-red-500"
              : urgency.barWidth === "w-2/6"
              ? "bg-orange-500"
              : urgency.barWidth === "w-3/6"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 group-hover:bg-orange-100 rounded-xl p-2.5 transition-colors flex-shrink-0">
              <Package className="text-orange-500" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {listing.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                by {listing.donor?.name || "Anonymous Donor"}
              </p>
            </div>
          </div>

          {/* Food Type Badge */}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${ft.style}`}
          >
            {ft.emoji} {listing.foodType}
          </span>
        </div>

        {/* Description */}
        {listing.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 -mt-1">
            {listing.description}
          </p>
        )}

        {/* Info Rows */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-1.5 flex-shrink-0">
              <Package size={12} className="text-gray-400" />
            </div>
            <span className="font-semibold text-gray-800">
              {listing.quantity} {listing.quantityUnit}
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
              <MapPin size={12} className="text-gray-400" />
            </div>
            <span className="line-clamp-2 text-gray-600 leading-snug">
              {listing.pickupAddress}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <div className="bg-gray-50 rounded-lg p-1.5 flex-shrink-0">
              <Clock size={12} className="text-gray-400" />
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${urgency.style}`}
            >
              ⏱ {urgency.label}
            </span>
            <span className="text-xs text-gray-400">
              {formatDateTime(listing.expiryTime)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-1.5 flex-shrink-0">
              <Clock size={12} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-500">
              Pickup by{" "}
              <span className="font-medium text-gray-700">
                {formatDateTime(listing.pickupDeadline)}
              </span>
            </span>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={() => onClaim(listing.id)}
          disabled={isClaiming}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm hover:shadow-md"
        >
          {isClaiming ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Claiming…
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              Claim This Food
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
          <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="h-3 bg-gray-100 rounded-full w-4/6" />
      </div>
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  );
}

// ─── Toast State Interface ─────────────────────────────────────────────────────

interface ToastState {
  id: number;
  message: string;
  type: "success" | "conflict" | "error";
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TrustDashboard() {
  const [listings, setListings]         = useState<FoodListing[]>([]);
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [claimingId, setClaimingId]     = useState<number | null>(null);
  const [toasts, setToasts]             = useState<ToastState[]>([]);

  // ── Toast helpers ────────────────────────────────────────────────────────────

  function pushToast(message: string, type: ToastState["type"]) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // ── Fetch available listings ─────────────────────────────────────────────────

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/listings/available`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: FoodListing[] = await res.json();
      setListings(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load listings.";
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Claim handler ────────────────────────────────────────────────────────────

  async function handleClaim(id: number) {
    if (claimingId !== null) return; // Block parallel claims
    setClaimingId(id);

    try {
      const res = await fetch(
        `${API_BASE}/listings/${id}/claim/${NGO_ID}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 409) {
        // ── Conflict: another NGO beat us to it ──────────────────────────────
        pushToast(
          "Too late! Another NGO just claimed this.",
          "conflict"
        );
        // Remove the listing optimistically — it's gone either way
        setListings((prev) => prev.filter((l) => l.id !== id));
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.message ?? `Unexpected error (HTTP ${res.status})`
        );
      }

      // ── Success ──────────────────────────────────────────────────────────────
      setListings((prev) => prev.filter((l) => l.id !== id));
      pushToast(
        "Food claimed successfully! Coordinate pickup with the donor.",
        "success"
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      pushToast(`Claim failed: ${message}`, "error");
    } finally {
      setClaimingId(null);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ── Toast Layer ── */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onDismiss={() => dismissToast(t.id)}
          />
        ))}
      </div>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2">
                <ChefHat className="text-white" size={20} />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-gray-900 text-lg tracking-tight">
                  Anaj
                </span>
                <span className="font-extrabold text-orange-500 text-lg tracking-tight">
                  Setu
                </span>
                <p className="text-xs text-gray-400 -mt-0.5 hidden sm:block">
                  Food Bridge Platform
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                <Bell size={20} />
                {listings.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </button>
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  N
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-semibold text-gray-800">NGO Trust</p>
                  <p className="text-xs text-green-600 font-medium">Verified ✓</p>
                </div>
              </div>
              <button className="p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-green-200">
          <div>
            <p className="text-green-200 text-sm font-medium uppercase tracking-widest mb-1">
              NGO Dashboard
            </p>
            <h1 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight">
              Available Food Listings
            </h1>
            <p className="text-green-100 mt-1.5 text-sm max-w-sm">
              Claim available donations before they expire. Every meal counts.
            </p>
          </div>
          <button
            onClick={fetchListings}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 disabled:opacity-60 font-bold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="bg-orange-100 rounded-xl p-2.5">
              <Package className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{listings.length}</p>
              <p className="text-xs text-gray-500">Available Now</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="bg-red-100 rounded-xl p-2.5">
              <Clock className="text-red-600" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {
                  listings.filter((l) => {
                    const hrs =
                      (new Date(l.expiryTime).getTime() - Date.now()) /
                      3600000;
                    return hrs > 0 && hrs <= 2;
                  }).length
                }
              </p>
              <p className="text-xs text-gray-500">Expiring in 2h</p>
            </div>
          </div>
          <div className="hidden sm:flex bg-white rounded-2xl border border-gray-100 shadow-sm p-4 items-center gap-3">
            <div className="bg-green-100 rounded-xl p-2.5">
              <CheckCircle2 className="text-green-600" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {listings.filter((l) => l.foodType === "VEG").length}
              </p>
              <p className="text-xs text-gray-500">Vegetarian</p>
            </div>
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && fetchError && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 flex flex-col items-center text-center gap-4">
            <div className="bg-red-50 rounded-full p-5">
              <AlertTriangle className="text-red-400" size={36} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                Could not load listings
              </h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">{fetchError}</p>
            </div>
            <button
              onClick={fetchListings}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !fetchError && listings.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 flex flex-col items-center text-center gap-4">
            <div className="bg-orange-50 rounded-full p-6">
              <Inbox className="text-orange-300" size={40} />
            </div>
            <div>
              <h3 className="font-bold text-gray-700 text-xl">
                All caught up!
              </h3>
              <p className="text-gray-400 text-sm mt-1.5 max-w-xs">
                No food listings are available right now. Check back soon —
                donors post throughout the day.
              </p>
            </div>
            <button
              onClick={fetchListings}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw size={15} />
              Refresh Listings
            </button>
          </div>
        )}

        {/* ── Listings Grid ── */}
        {!loading && !fetchError && listings.length > 0 && (
          <>
            <div className="flex items-center justify-between -mb-2">
              <h2 className="text-lg font-bold text-gray-900">
                {listings.length} listing{listings.length !== 1 ? "s" : ""}{" "}
                available
              </h2>
              <span className="text-xs text-gray-400">
                Sorted by latest
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((listing) => (
                <FoodCard
                  key={listing.id}
                  listing={listing}
                  isClaiming={claimingId === listing.id}
                  onClaim={handleClaim}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}