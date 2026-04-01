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
    User,
    Phone,
    CheckCircle2,
} from "lucide-react";

// ─── Role Config ───────────────────────────────────────────────────────────────

const roles = [
    {
        key: "DONOR",
        label: "Food Donor",
        sub: "Hotels & Restaurants",
        icon: Package,
        activeStyle: "border-orange-400 bg-orange-50",
        activeLabelStyle: "text-orange-700",
        inactiveStyle: "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/40",
        dot: "bg-orange-500",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        dashboard: "/dashboard/donor",
        perks: ["List surplus food in 60s", "Real-time NGO matching", "Impact tracker"],
    },
    {
        key: "NGO",
        label: "NGO Trust",
        sub: "Charitable Organisations",
        icon: ShieldCheck,
        activeStyle: "border-green-400 bg-green-50",
        activeLabelStyle: "text-green-700",
        inactiveStyle: "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/40",
        dot: "bg-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        dashboard: "/dashboard/trust",
        perks: ["Browse live food listings", "One-click claim system", "Delivery tracking"],
    },
    {
        key: "DELIVERY",
        label: "Delivery Partner",
        sub: "Pickup & Drop Agents",
        icon: Truck,
        activeStyle: "border-blue-400 bg-blue-50",
        activeLabelStyle: "text-blue-700",
        inactiveStyle: "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40",
        dot: "bg-blue-500",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        dashboard: "/dashboard/delivery",
        perks: ["Accept nearby tasks", "OTP-secured handoffs", "Delivery history"],
    },
];

// ─── Signup Page ───────────────────────────────────────────────────────────────

export default function SignupPage() {
    const router = useRouter();

    const [selectedRole, setSelectedRole] = useState("DONOR");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeRole = roles.find((r) => r.key === selectedRole)!;

    // ── Password strength ──────────────────────────────────────────────────────
    function getStrength(p: string): { label: string; color: string; width: string } {
        if (p.length === 0) return { label: "", color: "", width: "w-0" };
        if (p.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
        if (p.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
        if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
            return { label: "Fair", color: "bg-yellow-400", width: "w-3/4" };
        return { label: "Strong", color: "bg-green-500", width: "w-full" };
    }
    const strength = getStrength(password);

    // ── Submit ─────────────────────────────────────────────────────────────────
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!fullName.trim()) { setError("Please enter your full name."); return; }
        if (!phone.trim()) { setError("Please enter your phone number."); return; }
        if (!email.trim()) { setError("Please enter a valid email."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }

        setLoading(true);

        // ✅ FIXED — routes to the correct dashboard based on selected role
        setTimeout(() => {
            router.push(activeRole.dashboard);
        }, 1200);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">

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

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                        <h1 className="text-white font-extrabold text-2xl leading-tight">
                            Create your account
                        </h1>
                        <p className="text-orange-100 text-sm mt-1">
                            Join AnajSetu and start making a difference today
                        </p>
                    </div>

                    <div className="px-8 py-7 space-y-6">

                        {/* ── Role Selector ── */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                I am registering as
                            </label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {roles.map(({ key, label, sub, icon: Icon, activeStyle, activeLabelStyle, inactiveStyle, iconBg, iconColor, dot }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => { setSelectedRole(key); setError(null); }}
                                        className={`flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-2xl border-2 transition-all duration-150 ${selectedRole === key ? activeStyle : inactiveStyle
                                            }`}
                                    >
                                        <div className={`${iconBg} rounded-xl p-2 relative`}>
                                            <Icon size={20} className={iconColor} />
                                            {selectedRole === key && (
                                                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${dot} border-2 border-white`} />
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold leading-tight text-center ${selectedRole === key ? activeLabelStyle : "text-gray-600"
                                            }`}>
                                            {label}
                                        </span>
                                        <span className="text-[10px] text-gray-400 leading-tight text-center hidden sm:block">
                                            {sub}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Role Perks */}
                            <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-x-4 gap-y-1">
                                {activeRole.perks.map((perk) => (
                                    <span key={perk} className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <CheckCircle2 size={11} className="text-green-500 flex-shrink-0" />
                                        {perk}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Error Banner */}
                            {error && (
                                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Priya Sharma"
                                        autoComplete="name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
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
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="password"
                                        type={showPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        autoComplete="new-password"
                                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((p) => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={showPass ? "Hide password" : "Show password"}
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Strength bar */}
                                {password.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Strength: <span className="font-semibold text-gray-600">{strength.label}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="confirm"
                                        type={showConfirm ? "text" : "password"}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="Re-enter password"
                                        autoComplete="new-password"
                                        className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${confirm.length > 0
                                                ? password === confirm
                                                    ? "border-green-400 focus:ring-green-400"
                                                    : "border-red-300 focus:ring-red-400"
                                                : "border-gray-200 focus:ring-orange-400"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((p) => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={showConfirm ? "Hide password" : "Show password"}
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirm.length > 0 && password !== confirm && (
                                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                        <AlertCircle size={11} /> Passwords do not match
                                    </p>
                                )}
                                {confirm.length > 0 && password === confirm && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                        <CheckCircle2 size={11} /> Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-200 hover:shadow-lg transition-all duration-200 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={17} className="animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account as {activeRole.label}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400 font-medium">already registered?</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Login Link */}
                        <Link
                            href="/auth/login"
                            className="flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-600 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 py-3 rounded-xl transition-all duration-150"
                        >
                            Sign in to existing account
                            <ArrowRight size={14} />
                        </Link>

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
