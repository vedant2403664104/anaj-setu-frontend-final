"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Package,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";

// ─── Role Config ───────────────────────────────────────────────────────────────

const roles = [
  {
    key: "DONOR",
    label: "Food Donor",
    sub: "Hotels & Restaurants",
    icon: Package,
    activeStyle: "border-orange-400 bg-orange-50 text-orange-700",
    inactiveStyle: "border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:bg-orange-50/50",
    dot: "bg-orange-500",
    dashboard: "/dashboard/donor",
  },
  {
    key: "NGO",
    label: "NGO Trust",
    sub: "Charitable Organisations",
    icon: ShieldCheck,
    activeStyle: "border-green-400 bg-green-50 text-green-700",
    inactiveStyle: "border-gray-200 bg-white text-gray-500 hover:border-green-200 hover:bg-green-50/50",
    dot: "bg-green-500",
    dashboard: "/dashboard/trust",
  },
  {
    key: "DELIVERY",
    label: "Delivery Partner",
    sub: "Pickup & Drop Agents",
    icon: Truck,
    activeStyle: "border-blue-400 bg-blue-50 text-blue-700",
    inactiveStyle: "border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:bg-blue-50/50",
    dot: "bg-blue-500",
    dashboard: "/dashboard/delivery",
  },
];

// ─── Login Page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<string>("DONOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeRole = roles.find((r) => r.key === selectedRole)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Invalid email or password.");
      }

      router.push(activeRole.dashboard);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-2.5 shadow-lg shadow-orange-200">
              <ChefHat className="text-white" size={24} />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-gray-900 text-2xl tracking-tight">Anaj</span>
              <span className="font-extrabold text-orange-500 text-2xl tracking-tight">Setu</span>
            </div>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Food Bridge Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <h1 className="text-white font-extrabold text-2xl leading-tight">
              Welcome back
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="px-8 py-7 space-y-6">

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Login as
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {roles.map(({ key, label, sub, icon: Icon, activeStyle, inactiveStyle, dot }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setSelectedRole(key); setError(null); }}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border-2 transition-all duration-150 ${selectedRole === key ? activeStyle : inactiveStyle
                      }`}
                  >
                    <div className="relative">
                      <Icon size={22} />
                      {selectedRole === key && (
                        <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${dot} border-2 border-white`} />
                      )}
                    </div>
                    <span className="text-xs font-bold leading-tight text-center">{label}</span>
                    <span className="text-[10px] text-gray-400 leading-tight text-center hidden sm:block">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-200 hover:shadow-lg transition-all duration-200 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In as {activeRole.label}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* ✅ Register Links — all point to /auth/signup */}
            <div className="space-y-2.5">
              <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest">
                New to AnajSetu? Register as
              </p>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ key, label, dot }) => (
                  <Link
                    key={key}
                    href="/auth/signup"
                    className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2.5 rounded-xl transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Back to home */}
        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-orange-500 font-semibold transition-colors">
            ← Back to AnajSetu Home
          </Link>
        </p>

      </div>
    </div>
  );
}