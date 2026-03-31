"use client";

import { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Package,
  PlusCircle,
  X,
  ChefHat,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface User {
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

export interface FoodListing {
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

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockUser: User = {
  id: 1,
  name: "Rajesh Kumar",
  email: "rajesh@saffronhotel.com",
  password: "",
  phone: "+91-9876543210",
  role: "DONOR",
  isVerified: 1,
  address: "12, Marine Drive, Mumbai, Maharashtra",
  createdAt: "2024-01-15T10:30:00Z",
};

const mockDonations: FoodListing[] = [
  {
    id: 101,
    donor: mockUser,
    title: "Fresh Paneer Curry & Rice",
    description: "Leftover from wedding banquet, freshly prepared.",
    quantity: 25,
    quantityUnit: "kg",
    foodType: "VEG",
    pickupAddress: "12, Marine Drive, Mumbai",
    expiryTime: "2025-07-01T20:00:00Z",
    pickupDeadline: "2025-07-01T18:00:00Z",
    status: "AVAILABLE",
    createdAt: "2025-07-01T12:00:00Z",
  },
  {
    id: 102,
    donor: mockUser,
    title: "Assorted Dinner Plates",
    description: "Mixed veg and non-veg from corporate lunch.",
    quantity: 40,
    quantityUnit: "plates",
    foodType: "NON-VEG",
    pickupAddress: "56, BKC, Bandra East, Mumbai",
    expiryTime: "2025-07-01T22:00:00Z",
    pickupDeadline: "2025-07-01T19:30:00Z",
    status: "AVAILABLE",
    createdAt: "2025-07-01T14:00:00Z",
  },
  {
    id: 103,
    donor: mockUser,
    title: "Bakery Bread & Pastries",
    description: "End-of-day bakery surplus.",
    quantity: 15,
    quantityUnit: "packets",
    foodType: "VEG",
    pickupAddress: "8, Hill Road, Bandra West, Mumbai",
    expiryTime: "2025-07-02T08:00:00Z",
    pickupDeadline: "2025-07-01T21:00:00Z",
    status: "ASSIGNED",
    createdAt: "2025-07-01T16:00:00Z",
  },
];

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

function getStatusStyle(status: string): string {
  switch (status.toUpperCase()) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700 border border-green-200";
    case "ASSIGNED":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "PICKED_UP":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "DELIVERED":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
}

// ─── Donate Modal ──────────────────────────────────────────────────────────────

interface DonateFormData {
  title: string;
  foodType: string;
  quantity: string;
  quantityUnit: string;
  pickupAddress: string;
  expiryTime: string;
}

const initialForm: DonateFormData = {
  title: "",
  foodType: "VEG",
  quantity: "",
  quantityUnit: "kg",
  pickupAddress: "",
  expiryTime: "",
};

interface DonateModalProps {
  onClose: () => void;
  onSuccess: (listing: FoodListing) => void;
  donor: User;
}

function DonateModal({ onClose, onSuccess, donor }: DonateModalProps) {
  const [form, setForm] = useState<DonateFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.quantity || !form.pickupAddress || !form.expiryTime) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
    const payload = {
    donorId: donor.id,        
    title: form.title,
    foodType: form.foodType,  
    quantity: Number(form.quantity), 
    quantityUnit: form.quantityUnit,
    pickupAddress: form.pickupAddress,
    expiryTime: new Date(form.expiryTime).toISOString(),
    pickupDeadline: new Date(form.expiryTime).toISOString(),
    status: "AVAILABLE"
};

      const res = await fetch("http://localhost:8081/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to create donation.");
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {

        const created: FoodListing = await res.json();
        onSuccess(created);
      } else {
        console.warn("Server did not return JSON. Closing modal anyway.");
        onSuccess({ ...payload, id: Math.random(), donor: donor, status: "AVAILABLE", createdAt: new Date().toISOString() } as FoodListing);
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <ChefHat className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                Donate Food
              </h2>
              <p className="text-orange-100 text-xs mt-0.5">
                Help bridge the food gap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Food Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Fresh Dal & Roti"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 transition"
            />
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Food Type <span className="text-red-500">*</span>
            </label>
            <select
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            >
              <option value="VEG">🥦 Vegetarian</option>
              <option value="NON-VEG">🍗 Non-Vegetarian</option>
              <option value="VEGAN">🌱 Vegan</option>
              <option value="JAIN">🌼 Jain</option>
            </select>
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 20"
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                name="quantityUnit"
                value={form.quantityUnit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              >
                <option value="kg">kg</option>
                <option value="plates">Plates</option>
                <option value="packets">Packets</option>
              </select>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Pickup Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              placeholder="e.g. 12, Marine Drive, Mumbai"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 transition"
            />
          </div>

          {/* Expiry Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Expiry Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="expiryTime"
              value={form.expiryTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold text-sm transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Submit Donation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Donation Card ─────────────────────────────────────────────────────────────

function DonationCard({ listing }: { listing: FoodListing }) {
  const foodTypeEmoji: Record<string, string> = {
    VEG: "🥦",
    "NON-VEG": "🍗",
    VEGAN: "🌱",
    JAIN: "🌼",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      {/* Card Top Accent */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-yellow-400" />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 rounded-xl p-2.5 group-hover:bg-orange-100 transition-colors">
              <Package className="text-orange-500" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {listing.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                ID #{listing.id}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusStyle(
              listing.status
            )}`}
          >
            {listing.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-1.5">
              <Package size={13} className="text-gray-400" />
            </div>
            <span>
              <span className="font-semibold text-gray-800">
                {listing.quantity} {listing.quantityUnit}
              </span>
              &nbsp;·&nbsp;
              <span className="text-gray-500">
                {foodTypeEmoji[listing.foodType] ?? "🍽️"} {listing.foodType}
              </span>
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-1.5 mt-0.5 flex-shrink-0">
              <MapPin size={13} className="text-gray-400" />
            </div>
            <span className="line-clamp-1 text-gray-600">
              {listing.pickupAddress}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="bg-gray-50 rounded-lg p-1.5 flex-shrink-0">
              <Clock size={13} className="text-gray-400" />
            </div>
            <span>
              Expires:{" "}
              <span className="font-medium text-gray-700">
                {formatDateTime(listing.expiryTime)}
              </span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Listed {formatDateTime(listing.createdAt)}
          </span>
          <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ────────────────────────────────────────────────────────────────

function StatsCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DonorDashboard() {
  const [donations, setDonations] = useState<FoodListing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useState<User>(mockUser);

useEffect(() => {
    async function fetchRealDonations() {
      try {
        const response = await fetch('http://localhost:8081/api/listings/available');
        
        if (response.ok) {
          const realData = await response.json();
          setDonations(realData);
        } else {
          console.error("Failed to fetch data from the backend.");
        }
      } catch (error) {
        console.error("Backend is offline. Is Java running?", error);
      }
    }

    fetchRealDonations();
  }, []); 

  function handleNewDonation(listing: FoodListing) {
    setDonations((prev) => [listing, ...prev]);
  }

  const availableCount = donations.filter((d) => d.status === "AVAILABLE").length;
  const totalQty = donations.reduce((acc, d) => acc + d.quantity, 0);

  return (
    <div className="min-h-screen bg-orange-50">
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-xs text-orange-500 font-medium">Donor</p>
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
        {/* Hero CTA */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-500 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg shadow-orange-200">
          <div>
            <p className="text-orange-100 text-sm font-medium uppercase tracking-widest mb-1">
              Welcome back 👋
            </p>
            <h1 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight">
              {user.name}
            </h1>
            <p className="text-orange-100 mt-1.5 text-sm max-w-sm">
              Every meal you donate bridges the gap between waste and hope.
              Start a new donation today.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap text-sm"
          >
            <PlusCircle size={18} />
            Donate Food
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Total Donations"
            value={donations.length}
            icon={Package}
            color="bg-gradient-to-br from-orange-400 to-orange-600"
          />
          <StatsCard
            label="Available Right Now"
            value={availableCount}
            icon={CheckCircle2}
            color="bg-gradient-to-br from-green-400 to-green-600"
          />
          <StatsCard
            label="Total Quantity (all units)"
            value={`${totalQty}+`}
            icon={ChefHat}
            color="bg-gradient-to-br from-yellow-400 to-orange-500"
          />
        </div>

        {/* Donations Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Active Donations
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {donations.length} listing{donations.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">New Donation</span>
            </button>
          </div>

          {donations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-center">
              <div className="bg-orange-50 rounded-full p-5 mb-4">
                <Package className="text-orange-300" size={36} />
              </div>
              <h3 className="font-bold text-gray-700 text-lg">
                No donations yet
              </h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                Click "Donate Food" to list your first donation and make an
                impact today.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {donations.map((listing) => (
                <DonationCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Donate Modal ── */}
      {isModalOpen && (
        <DonateModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleNewDonation}
          donor={user}
        />
      )}
    </div>
  );
}