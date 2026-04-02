"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChefHat, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle,
    Package, ShieldCheck, Truck, ArrowRight, User, Phone,
    CheckCircle2, RotateCcw, MapPin, Building2,
} from "lucide-react";
import { sendOtp, signupComplete } from "@/lib/api";

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

// ─── OTP Screen ────────────────────────────────────────────────────────────────

function OtpScreen({
    phone, onSuccess, onBack,
}: {
    phone: string;
    onSuccess: (otp: string) => Promise<boolean>; // ✅ returns boolean now
    onBack: () => void;
}) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (cooldown === 0) { setCanResend(true); return; }
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    useEffect(() => { inputRefs.current[0]?.focus(); }, []);

    const handleChange = (val: string, idx: number) => {
        if (!/^\d*$/.test(val)) return;
        const next = [...otp];
        next[idx] = val.slice(-1);
        setOtp(next);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    // ✅ FIXED — stays on OTP screen and shows error if verification fails
    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < 6) { setError("Please enter all 6 digits."); return; }
        setError("");
        setLoading(true);
        const ok = await onSuccess(code);
        if (!ok) {
            setError("Invalid OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            setTimeout(() => inputRefs.current[0]?.focus(), 50);
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setCanResend(false);
        setCooldown(30);
        setError("");
        setOtp(["", "", "", "", "", ""]);
        await sendOtp(phone, "SIGNUP");
        inputRefs.current[0]?.focus();
    };

    // ✅ Allow paste of 6-digit OTP
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 0) return;
        const next = [...otp];
        pasted.split("").forEach((char, i) => { next[i] = char; });
        setOtp(next);
        const focusIdx = Math.min(pasted.length, 5);
        setTimeout(() => inputRefs.current[focusIdx]?.focus(), 10);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
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

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                        <h1 className="text-white font-extrabold text-2xl">Verify Your Phone</h1>
                        <p className="text-orange-100 text-sm mt-1">
                            OTP sent to <span className="font-bold text-white">{phone}</span>
                        </p>
                    </div>

                    <div className="px-8 py-8 flex flex-col items-center gap-6">
                        {/* ✅ Paste handler on the container */}
                        <div className="flex gap-3" onPaste={handlePaste}>
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, idx)}
                                    onKeyDown={(e) => handleKeyDown(e, idx)}
                                    className={`w-11 h-14 text-center text-xl font-bold border-2 rounded-xl bg-gray-50 text-gray-900 transition-all focus:outline-none focus:ring-2 ${error
                                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
                                        }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 w-full">
                                <AlertCircle size={15} className="flex-shrink-0" /><span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={loading || otp.join("").length < 6}
                            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-200 transition-all">
                            {loading
                                ? <><Loader2 size={17} className="animate-spin" />Verifying...</>
                                : <><CheckCircle2 size={17} />Verify & Create Account</>}
                        </button>

                        <div className="flex flex-col items-center gap-2 text-sm">
                            {canResend ? (
                                <button onClick={handleResend} className="flex items-center gap-1.5 text-orange-500 font-bold hover:underline">
                                    <RotateCcw size={13} />Resend OTP
                                </button>
                            ) : (
                                <p className="text-gray-400">
                                    Resend in <span className="font-bold text-gray-600">{cooldown}s</span>
                                </p>
                            )}
                            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-xs">
                                ← Go back &amp; edit details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Signup Page ───────────────────────────────────────────────────────────────

export default function SignupPage() {
    const router = useRouter();

    const [step, setStep] = useState<"form" | "otp">("form");
    const [selectedRole, setSelectedRole] = useState("DONOR");

    // ── Common fields ──────────────────────────────────────────────────────────
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ── DONOR specific ─────────────────────────────────────────────────────────
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");

    // ── NGO specific ───────────────────────────────────────────────────────────
    const [ngoName, setNgoName] = useState("");
    const [ngoAddress, setNgoAddress] = useState("");

    // ── DELIVERY specific ──────────────────────────────────────────────────────
    const [deliveryArea, setDeliveryArea] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeRole = roles.find((r) => r.key === selectedRole)!;

    function getStrength(p: string) {
        if (p.length === 0) return { label: "", color: "", width: "w-0" };
        if (p.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
        if (p.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
        if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Fair", color: "bg-yellow-400", width: "w-3/4" };
        return { label: "Strong", color: "bg-green-500", width: "w-full" };
    }
    const strength = getStrength(password);

    // ✅ Build address string — includes org name so dashboard can read it
    function buildAddress(): string {
        if (selectedRole === "DONOR") return `${restaurantName} | ${restaurantAddress}`;
        if (selectedRole === "NGO") return `${ngoName} | ${ngoAddress}`;
        if (selectedRole === "DELIVERY") return deliveryArea;
        return "";
    }

    // ✅ Build org name so we can save it separately to sessionStorage
    function buildOrgName(): string {
        if (selectedRole === "DONOR") return restaurantName;
        if (selectedRole === "NGO") return ngoName;
        if (selectedRole === "DELIVERY") return deliveryArea;
        return "";
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!fullName.trim()) { setError("Please enter your full name."); return; }
        if (!phone.trim()) { setError("Please enter your phone number."); return; }
        if (!email.trim()) { setError("Please enter your email address."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }

        if (selectedRole === "DONOR") {
            if (!restaurantName.trim()) { setError("Please enter your restaurant/hotel name."); return; }
            if (!restaurantAddress.trim()) { setError("Please enter your restaurant address."); return; }
        }
        if (selectedRole === "NGO") {
            if (!ngoName.trim()) { setError("Please enter your NGO/Trust name."); return; }
            if (!ngoAddress.trim()) { setError("Please enter your NGO address."); return; }
        }
        if (selectedRole === "DELIVERY") {
            if (!deliveryArea.trim()) { setError("Please enter your delivery area."); return; }
        }

        setLoading(true);
        const sent = await sendOtp(phone, "SIGNUP");
        setLoading(false);

        if (sent) {
            setStep("otp");
        } else {
            setError("Failed to send OTP. Please check your phone number.");
        }
    }

    // ✅ FIXED — returns boolean, stays on OTP screen on failure
    async function handleOtpSuccess(otpCode: string): Promise<boolean> {
        const result = await signupComplete({
            phone,
            otp: otpCode,
            name: fullName,
            role: selectedRole,
            address: buildAddress(),
        });

        if (result) {
            // ✅ Save API result + extra fields for dashboard to read
            sessionStorage.setItem("anajsetu_user", JSON.stringify({
                ...result,
                orgName: buildOrgName(),      // ← restaurant / NGO / area name
                address: buildAddress(),       // ← full address string
                contactName: fullName,         // ← contact person name
            }));
            router.push(activeRole.dashboard);
            return true;
        }
        return false; // ← OTP screen shows "Invalid OTP"
    }

    if (step === "otp") {
        return <OtpScreen phone={phone} onSuccess={handleOtpSuccess} onBack={() => setStep("form")} />;
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

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                        <h1 className="text-white font-extrabold text-2xl">Create your account</h1>
                        <p className="text-orange-100 text-sm mt-1">Join AnajSetu and start making a difference today</p>
                    </div>

                    <div className="px-8 py-7 space-y-6">

                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">I am registering as</label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {roles.map(({ key, label, sub, icon: Icon, activeStyle, activeLabelStyle, inactiveStyle, iconBg, iconColor, dot }) => (
                                    <button key={key} type="button"
                                        onClick={() => { setSelectedRole(key); setError(null); }}
                                        className={`flex flex-col items-center gap-1.5 px-2 py-3.5 rounded-2xl border-2 transition-all duration-150 ${selectedRole === key ? activeStyle : inactiveStyle}`}>
                                        <div className={`${iconBg} rounded-xl p-2 relative`}>
                                            <Icon size={20} className={iconColor} />
                                            {selectedRole === key && <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${dot} border-2 border-white`} />}
                                        </div>
                                        <span className={`text-xs font-bold leading-tight text-center ${selectedRole === key ? activeLabelStyle : "text-gray-600"}`}>{label}</span>
                                        <span className="text-[10px] text-gray-400 leading-tight text-center hidden sm:block">{sub}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-x-4 gap-y-1">
                                {activeRole.perks.map((perk) => (
                                    <span key={perk} className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <CheckCircle2 size={11} className="text-green-500 flex-shrink-0" />{perk}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {error && (
                                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                    <AlertCircle size={16} className="flex-shrink-0" /><span>{error}</span>
                                </div>
                            )}

                            {/* ── DONOR FIELDS ──────────────────────────────── */}
                            {selectedRole === "DONOR" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant / Hotel Name</label>
                                        <div className="relative">
                                            <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
                                                placeholder="e.g. Saffron Grand Hotel"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Address</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input type="text" value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)}
                                                placeholder="e.g. 12, MG Road, Bandra West, Mumbai"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── NGO FIELDS ────────────────────────────────── */}
                            {selectedRole === "NGO" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">NGO / Trust Name</label>
                                        <div className="relative">
                                            <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input type="text" value={ngoName} onChange={(e) => setNgoName(e.target.value)}
                                                placeholder="e.g. Seva Foundation"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">NGO Address</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input type="text" value={ngoAddress} onChange={(e) => setNgoAddress(e.target.value)}
                                                placeholder="e.g. 34, Dharavi Road, Mumbai"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── DELIVERY FIELDS ───────────────────────────── */}
                            {selectedRole === "DELIVERY" && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Area / Zone</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input type="text" value={deliveryArea} onChange={(e) => setDeliveryArea(e.target.value)}
                                            placeholder="e.g. Bandra, Andheri, Kurla"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
                                    </div>
                                </div>
                            )}

                            {/* ── COMMON FIELDS ─────────────────────────────── */}

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    {selectedRole === "NGO" ? "Contact Person Name" : "Full Name"}
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                                        placeholder={selectedRole === "NGO" ? "Your name (contact person)" : "Priya Sharma"}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type={showPass ? "text" : "password"} value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                    <button type="button" onClick={() => setShowPass((p) => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                                        </div>
                                        <p className="text-xs text-gray-400">Strength: <span className="font-semibold text-gray-600">{strength.label}</span></p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type={showConfirm ? "text" : "password"} value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="Re-enter password"
                                        className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${confirm.length > 0 ? password === confirm ? "border-green-400 focus:ring-green-400" : "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-orange-400"}`} />
                                    <button type="button" onClick={() => setShowConfirm((p) => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirm.length > 0 && password !== confirm && (
                                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />Passwords do not match</p>
                                )}
                                {confirm.length > 0 && password === confirm && (
                                    <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><CheckCircle2 size={11} />Passwords match</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-200 hover:shadow-lg transition-all mt-2">
                                {loading
                                    ? <><Loader2 size={17} className="animate-spin" />Sending OTP...</>
                                    : <>Send OTP &amp; Continue <ArrowRight size={16} /></>}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400 font-medium">already registered?</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        <Link href="/auth/login"
                            className="flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-600 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 py-3 rounded-xl transition-all">
                            Sign in to existing account <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    <Link href="/" className="hover:text-orange-500 font-semibold transition-colors">← Back to AnajSetu Home</Link>
                </p>
            </div>
        </div>
    );
}