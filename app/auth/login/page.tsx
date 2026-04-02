"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChefHat, Phone, Loader2, AlertCircle,
  Package, ShieldCheck, Truck, ArrowRight,
  CheckCircle2, RotateCcw,
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

// ─── OTP Screen ────────────────────────────────────────────────────────────────

function OtpScreen({
  phone,
  onSuccess,
  onBack,
}: {
  phone: string;
  onSuccess: (otp: string) => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s countdown
  useEffect(() => {
    if (cooldown === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-focus first box
  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    setError("");
    onSuccess(code);
    setLoading(false);
  };

  const handleResend = async () => {
    setCanResend(false);
    setCooldown(30);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    // Call login initiate again
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"}/api/users/login/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    inputs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

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
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <h1 className="text-white font-extrabold text-2xl leading-tight">
              Verify Your Phone
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              We sent a 6-digit OTP to{" "}
              <span className="font-bold text-white">{phone}</span>
            </p>
          </div>

          <div className="px-8 py-8 flex flex-col items-center gap-6">

            {/* 6 OTP Boxes */}
            <div className="flex gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-11 h-14 text-center text-xl font-bold border-2 rounded-xl
                             bg-gray-50 text-gray-900 transition-all duration-150
                             focus:outline-none focus:border-orange-400 focus:ring-2
                             focus:ring-orange-100 border-gray-200"
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 w-full">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || otp.join("").length < 6}
              className="w-full flex items-center justify-center gap-2 bg-orange-500
                         hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold
                         text-sm py-3.5 rounded-xl shadow-md shadow-orange-200
                         hover:shadow-lg transition-all duration-200"
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" /> Verifying...</>
              ) : (
                <><CheckCircle2 size={17} /> Verify & Sign In</>
              )}
            </button>

            {/* Resend + Back */}
            <div className="flex flex-col items-center gap-2 text-sm">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="flex items-center gap-1.5 text-orange-500 font-bold hover:underline"
                >
                  <RotateCcw size={13} /> Resend OTP
                </button>
              ) : (
                <p className="text-gray-400">
                  Resend OTP in{" "}
                  <span className="font-bold text-gray-600">{cooldown}s</span>
                </p>
              )}
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
              >
                ← Go back & edit phone number
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [selectedRole, setSelectedRole] = useState<string>("DONOR");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeRole = roles.find((r) => r.key === selectedRole)!;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/login/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to send OTP.");
      }

      setStep("otp"); // ✅ Show OTP screen

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP → Login ───────────────────────────────────────────
  async function handleOtpSuccess(otpCode: string) {
    try {
      const res = await fetch(`${BASE_URL}/api/users/login/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpCode }),
      });

      const data = await res.json().catch(() => null);
      console.log("Login response:", data); // ← ADD THIS

      if (!res.ok) {
        setStep("form");
        setError(data?.message ?? "Invalid OTP.");
        return;
      }

      // ✅ Save FULL response to sessionStorage
      sessionStorage.setItem("anajsetu_user", JSON.stringify(data));
      console.log("Saved to session:", JSON.stringify(data)); // ← ADD THIS

      router.push(activeRole.dashboard);

    } catch (err) {
      setStep("form");
      setError("Login failed. Please try again.");
    }
  }

  // ── Show OTP Screen ──────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <OtpScreen
        phone={phone}
        onSuccess={handleOtpSuccess}
        onBack={() => setStep("form")}
      />
    );
  }

  // ── Show Login Form ──────────────────────────────────────────────────────
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
              Sign in with your phone number
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
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border-2 transition-all duration-150 ${selectedRole === key ? activeStyle : inactiveStyle}`}
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

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-200 hover:shadow-lg transition-all duration-200 mt-2"
              >
                {loading ? (
                  <><Loader2 size={17} className="animate-spin" /> Sending OTP...</>
                ) : (
                  <>Send OTP & Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register Links */}
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