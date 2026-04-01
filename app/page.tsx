"use client";

import Link from "next/link";
import {
  ChefHat,
  Heart,
  ArrowRight,
  Utensils,
  Building2,
  Truck,
  Leaf,
  Users,
  TrendingDown,
  Star,
  CheckCircle2,
  Globe,
  Package,
  ShieldCheck,
} from "lucide-react";

// ─── Hero CTA Cards ────────────────────────────────────────────────────────────

const heroCards = [
  {
    icon: Package,
    action: "Donate Food",
    role: "For Restaurants & Hotels",
    desc: "List your surplus meals in 60 seconds and help feed communities.",
    href: "/auth/login",           // ✅ was /dashboard/donor
    gradient: "from-orange-500 to-orange-600",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    hoverRing: "hover:ring-orange-300",
    tag: "Donor",
    tagStyle: "bg-orange-100 text-orange-700",
  },
  {
    icon: ShieldCheck,
    action: "Claim Food",
    role: "For NGOs & Trusts",
    desc: "Browse real-time listings and claim available food for your shelter.",
    href: "/auth/login",           // ✅ was /dashboard/trust
    gradient: "from-green-600 to-green-700",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    hoverRing: "hover:ring-green-300",
    tag: "NGO Trust",
    tagStyle: "bg-green-100 text-green-700",
  },
  {
    icon: Truck,
    action: "Deliver Food",
    role: "For Delivery Partners",
    desc: "Accept delivery tasks and complete handoffs with secure OTP verification.",
    href: "/auth/login",           // ✅ was /dashboard/delivery
    gradient: "from-blue-600 to-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverRing: "hover:ring-blue-300",
    tag: "Delivery",
    tagStyle: "bg-blue-100 text-blue-700",
  },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "12,400+", label: "Meals Rescued", icon: Utensils },
  { value: "380+", label: "Donor Partners", icon: ChefHat },
  { value: "95+", label: "NGOs Connected", icon: Building2 },
  { value: "4.2T", label: "CO₂ Saved (kg)", icon: Leaf },
];

// ─── How It Works ──────────────────────────────────────────────────────────────

const steps = [
  {
    icon: Package,
    color: "bg-orange-100 text-orange-600",
    border: "border-orange-200",
    step: "01",
    title: "Donor Lists Food",
    desc: "Restaurants and hotels post surplus meals with pickup details in under 60 seconds.",
  },
  {
    icon: Building2,
    color: "bg-green-100 text-green-600",
    border: "border-green-200",
    step: "02",
    title: "NGO Claims It",
    desc: "Verified NGOs browse available listings in real-time and claim what they need.",
  },
  {
    icon: Truck,
    color: "bg-blue-100 text-blue-600",
    border: "border-blue-200",
    step: "03",
    title: "Delivery & OTP Handoff",
    desc: "A delivery partner picks up and drops off using secure 4-digit OTP verification.",
  },
];

// ─── Features ──────────────────────────────────────────────────────────────────

const features = [
  {
    icon: CheckCircle2,
    title: "OTP-Verified Handoffs",
    desc: "Every pickup and drop-off is secured with a unique 4-digit OTP — no food is ever lost in transit.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: TrendingDown,
    title: "Zero Food Waste Mission",
    desc: "Real-time listings ensure surplus food is claimed within hours, not thrown away at end of day.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Users,
    title: "Three-Sided Marketplace",
    desc: "Donors, NGOs, and Delivery Partners each get a tailored dashboard built for their workflow.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Globe,
    title: "Community Impact",
    desc: "Every meal bridged reduces landfill waste and greenhouse emissions — tracked and reported.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Head Chef, Saffron Grand Hotel",
    avatar: "PS",
    avatarBg: "bg-orange-500",
    quote:
      "Before AnajSetu, we threw away 30kg of food nightly. Now it feeds 80 families. This platform changed how we think about waste.",
    stars: 5,
  },
  {
    name: "Fr. Thomas Mathew",
    role: "Director, Asha Charitable Trust",
    avatar: "TM",
    avatarBg: "bg-green-600",
    quote:
      "We used to struggle to source consistent meals. AnajSetu gives us a live feed of available food — it is like a lifeline for our shelter.",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Delivery Partner, Mumbai Zone",
    avatar: "AM",
    avatarBg: "bg-blue-600",
    quote:
      "The OTP system is genius. I know every handoff is verified. It makes me feel like I am doing real, trusted community work.",
    stars: 5,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HERO CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface HeroCardProps {
  icon: React.ElementType;
  action: string;
  role: string;
  desc: string;
  href: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  hoverRing: string;
  tag: string;
  tagStyle: string;
}

function HeroCard({
  icon: Icon,
  action,
  role,
  desc,
  href,
  gradient,
  iconBg,
  iconColor,
  hoverRing,
  tag,
  tagStyle,
}: HeroCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl ring-2 ring-transparent ${hoverRing} hover:-translate-y-1 transition-all duration-200 overflow-hidden`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="flex flex-col gap-4 p-7 flex-1">
        <span className={`self-start text-xs font-bold px-3 py-1 rounded-full ${tagStyle}`}>
          {tag}
        </span>
        <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center`}>
          <Icon size={28} className={iconColor} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{action}</h3>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">{role}</p>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">{desc}</p>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <span className={`text-sm font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            Get Started
          </span>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
            <ArrowRight size={16} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2 shadow-md shadow-orange-200">
                <ChefHat className="text-white" size={20} />
              </div>
              <div className="leading-tight">
                <div>
                  <span className="font-extrabold text-gray-900 text-xl tracking-tight">Anaj</span>
                  <span className="font-extrabold text-orange-500 text-xl tracking-tight">Setu</span>
                </div>
                <p className="text-[10px] text-gray-400 -mt-0.5 hidden sm:block tracking-widest uppercase">
                  Food Bridge Platform
                </p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "How It Works", id: "how-it-works" },
                { label: "Impact", id: "impact" },
                { label: "Features", id: "features" },
              ].map(({ label, id }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/login"
                className="text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-150"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200/60 transition-all duration-150"
              >
                Sign Up
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full opacity-25 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 lg:pt-28 lg:pb-12">

          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              <Heart size={12} className="fill-orange-500 text-orange-500" />
              India's Food Rescue Network
            </div>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5 max-w-4xl mx-auto">
            Good Food Deserves{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                a Second Chance
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange-100 rounded-full -z-0 opacity-80" />
            </span>
            {" "}— Not a Landfill.
          </h1>

          <p className="text-center text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-14">
            AnajSetu connects restaurants with surplus food directly to NGOs and
            delivery partners — through a real-time, OTP-secured marketplace.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
            {heroCards.map((card) => (
              <HeroCard key={card.action} {...card} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-400">
            {[
              "Free to join",
              "OTP-verified handoffs",
              "Real-time listings",
              "Zero commission",
              "All 3 roles supported",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative -mb-px">
          <svg viewBox="0 0 1440 64" className="w-full fill-white block" preserveAspectRatio="none" height="64">
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center bg-orange-100 rounded-xl p-3 mb-3">
                  <Icon className="text-orange-600" size={22} />
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-gradient-to-b from-white to-orange-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-3">The Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Food rescued in 3 simple steps
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              From listing to delivery, the entire food rescue loop is completed in under 2 hours on average.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-orange-200 via-green-200 to-blue-200" />
            {steps.map(({ icon: Icon, color, border, step, title, desc }) => (
              <div key={step} className={`relative bg-white rounded-2xl border ${border} shadow-sm p-7 text-center hover:shadow-lg transition-shadow`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${color} mb-5`}>
                  <Icon size={28} />
                </div>
                <div className="absolute top-5 right-5 text-4xl font-black text-gray-100 select-none leading-none">{step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Built for trust at every step
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-start gap-5 bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`${bg} rounded-xl p-3 flex-shrink-0`}>
                  <Icon className={color} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section id="impact" className="bg-gradient-to-br from-green-50 to-orange-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-3">Real Stories</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Voices from the network
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, avatarBg, quote, stars }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5 hover:shadow-lg transition-shadow">
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <div className={`w-10 h-10 ${avatarBg} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-500 opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500 opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center bg-white/10 rounded-2xl p-4 mb-8">
            <Heart className="text-orange-400 fill-orange-400" size={32} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Stop the waste.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Start the bridge.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12">
            Join hundreds of donors, NGOs and delivery partners already using
            AnajSetu to rescue food and feed communities across India.
          </p>
          {/* ✅ Final CTA buttons also point to /auth/login */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {heroCards.map(({ icon: Icon, action, gradient }) => (
              <Link
                key={action}
                href="/auth/login"
                className={`group flex items-center justify-center gap-2.5 bg-gradient-to-r ${gradient} text-white font-bold text-sm px-6 py-4 rounded-2xl hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200`}
              >
                <Icon size={18} />
                {action}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-lg p-1.5">
              <ChefHat className="text-white" size={14} />
            </div>
            <span className="text-white font-extrabold text-sm">
              Anaj<span className="text-orange-400">Setu</span>
            </span>
          </div>
          <p className="text-xs text-center">
            Built with ❤️ to eliminate food waste across India. &copy;{" "}
            {new Date().getFullYear()} AnajSetu. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <Leaf size={13} className="text-green-500" />
            <span>Every meal matters.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}