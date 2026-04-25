"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Truck,
  Bell,
  Settings,
  LogOut,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Flame,
  Loader2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Gift,
  ChefHat,
  Calendar,
  Star,
  ThumbsUp,
} from "lucide-react";
import { FeedbackSection } from "@/components/feedback/FeedbackSection";
import { DeliveryFeedbackModal } from "@/components/feedback/DeliveryFeedbackModal";
import type { ReceiverType } from "@/components/feedback/DeliveryFeedbackModal";

interface Assignment {
  id: number;
  foodName: string | null;
  title?: string | null;
  quantity: string | number;
  quantityStr?: string | null;
  donorId?: number | null;
  donorName?: string | null;
  ngoId?: number | null;
  claimedByName?: string | null;
  pickupAddress: string;
  expiryTime: string;
  createdAt?: string | null;
  postedAt?: string | null;
  status: "CLAIMED" | "DELIVERED";
  ngoPhone?: string | null;
}

function getNgoName(item: Assignment): string {
  return item.claimedByName || "";
}

function OtpInput({
  assignment,
  onDelivered,
}: {
  assignment: Assignment;
  onDelivered: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleVerify() {
    if (otp.length !== 6) {
      setError("Enter a 6-digit OTP.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: assignment.ngoPhone,
          otp,
          purpose: "DELIVERY",
        }),
      });

      const data = await res.json();

      if (!data.valid) {
        setError("Incorrect OTP. Ask the NGO to re-share.");
        return;
      }

      const res2 = await fetch(
        `http://localhost:8081/api/food-listings/${assignment.id}/deliver`,
        { method: "PUT" }
      );

      if (!res2.ok) {
        const msg = await res2.text();
        throw new Error(msg || "Failed to mark as delivered.");
      }

      onDelivered();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-200 transition-all hover:-translate-y-0.5"
      >
        <KeyRound size={13} />
        Enter Delivery OTP
      </button>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-200 pt-3 space-y-2">
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
          }
          placeholder="6-digit OTP"
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-center text-lg tracking-[0.4em] w-48 font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-green-200 transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 size={13} />
              Confirm
            </>
          )}
        </button>

        <button
          onClick={() => {
            setOpen(false);
            setError(null);
            setOtp("");
          }}
          className="text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className="text-[11px] text-gray-400">
        Ask the NGO representative to share the 6-digit OTP from their phone.
      </p>
    </div>
  );
}

export default function DeliveryDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [delivered, setDelivered] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETED">("PENDING");
  const [driverName, setDriverName] = useState("Driver");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [deliveryId, setDeliveryId] = useState<number>(0);

  const [feedbackModal, setFeedbackModal] = useState<{
    listing: Assignment;
    receiverType: ReceiverType;
  } | null>(null);

  const [ratedDonors, setRatedDonors] = useState<Set<number>>(new Set());
  const [ratedNgos, setRatedNgos] = useState<Set<number>>(new Set());
  const [feedbackKey, setFeedbackKey] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("anajsetu_user");
    if (stored) {
      const user = JSON.parse(stored);
      setDriverName(user.contactName || user.name || "Driver");
      setDeliveryId(user.userId || user.id || 0);
      setIsFirstVisit(!user.hasVisited);
      sessionStorage.setItem(
        "anajsetu_user",
        JSON.stringify({ ...user, hasVisited: true })
      );
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    if (!deliveryId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/food-listings/driver/${deliveryId}`
      );

      if (res.ok) {
        const all: Assignment[] = await res.json();
        setAssignments(all.filter((a) => a.status === "CLAIMED"));
        setDelivered(all.filter((a) => a.status === "DELIVERED"));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    if (deliveryId) {
      fetchAssignments();
      const i = setInterval(fetchAssignments, 15000);
      return () => clearInterval(i);
    } else {
      setLoading(false);
    }
  }, [deliveryId, fetchAssignments]);

  function markDelivered(id: number) {
    const item = assignments.find((a) => a.id === id);
    if (item) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setDelivered((prev) => [{ ...item, status: "DELIVERED" }, ...prev]);
    }
  }

  function handleFeedbackSuccess() {
    if (!feedbackModal) return;
    const { listing, receiverType } = feedbackModal;

    if (receiverType === "DONOR") {
      setRatedDonors((prev) => new Set(prev).add(listing.id));
    } else {
      setRatedNgos((prev) => new Set(prev).add(listing.id));
    }

    setFeedbackModal(null);
    setFeedbackKey((k) => k + 1);
  }

  const avatarLetter = driverName?.charAt(0)?.toUpperCase() || "D";
  const pending = assignments.length;
  const totalDone = delivered.length;

  return (
    <div className="min-h-screen bg-blue-50/30">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2 shadow-md shadow-blue-200">
              <Truck className="text-white" size={18} />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">
                Anaj
              </span>
              <span className="font-extrabold text-blue-600 text-lg tracking-tight">
                Setu
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
              <Bell size={16} className="text-gray-500" />
            </button>

            <button className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
              <Settings size={16} className="text-gray-500" />
            </button>

            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                {avatarLetter}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-800">{driverName}</p>
                <p className="text-[11px] text-blue-600 font-semibold">
                  Delivery Partner
                </p>
              </div>
            </div>

            <Link
              href="/auth/login"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors"
            >
              <LogOut
                size={15}
                className="text-gray-400 hover:text-red-500 transition-colors"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl px-8 py-7 overflow-hidden shadow-lg shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex items-center justify-between gap-6 flex-wrap">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                {isFirstVisit ? "Welcome aboard! 🚛" : "Ready to deliver? 🚛"}
              </p>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight mb-1">
                {driverName}
              </h1>
              <p className="text-blue-100 text-sm max-w-sm">
                {pending} pickup{pending !== 1 ? "s" : ""} waiting. Verify OTP on
                delivery.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-2xl px-5 py-3">
              <Gift size={18} className="text-blue-200" />
              <div>
                <p className="text-white font-extrabold text-xl leading-tight">
                  {totalDone}
                </p>
                <p className="text-blue-200 text-xs font-medium">
                  delivered today
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Pending Pickups",
              value: pending,
              icon: Package,
              iconBg: "bg-orange-100",
              iconColor: "text-orange-600",
            },
            {
              label: "Delivered Today",
              value: totalDone,
              icon: CheckCircle2,
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },
            {
              label: "Total Trips",
              value: pending + totalDone,
              icon: TrendingUp,
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },
          ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`${iconBg} rounded-xl p-3 flex-shrink-0`}>
                <Icon size={20} className={iconColor} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">
                  {value}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-7 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {[
                { key: "PENDING", label: "Pickups", count: pending },
                { key: "COMPLETED", label: "Delivered", count: totalDone },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as "PENDING" | "COMPLETED")}
                  className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 ${activeTab === key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                    }`}
                >
                  {label}
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === key
                        ? "bg-white/25 text-white"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 font-medium hidden sm:block">
              OTP verified delivery only
            </p>
          </div>

          {activeTab === "PENDING" && (
            <div className="px-7 py-5 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 size={28} className="text-blue-400 animate-spin mb-3" />
                  <p className="text-sm text-gray-400">Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <Truck size={26} className="text-blue-300" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">No pickups right now</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    You will see assignments here once an NGO claims a listing.
                  </p>
                </div>
              ) : (
                assignments.map((item) => {
                  const ngoName = getNgoName(item);

                  return (
                    <div
                      key={item.id}
                      className="bg-gray-50 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-200 rounded-2xl px-5 py-5 transition-all duration-150"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Flame size={18} className="text-blue-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm">
                                {item.foodName || item.title || "Food listing"}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.quantityStr || item.quantity}
                              </p>
                            </div>

                            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              Pickup Pending
                            </span>
                          </div>

                          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                            {item.donorName && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <ChefHat size={11} />
                                From: {item.donorName}
                              </span>
                            )}

                            {ngoName && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <ShieldCheck size={11} />
                                To: {ngoName}
                              </span>
                            )}

                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin size={11} />
                              {item.pickupAddress}
                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock size={11} />
                              Best before {item.expiryTime}
                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar size={11} />
                              {item.createdAt || item.postedAt || "Recently"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pl-14">
                        <OtpInput
                          assignment={item}
                          onDelivered={() => markDelivered(item.id)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "COMPLETED" && (
            <div className="px-7 py-5 space-y-3">
              {delivered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 size={26} className="text-green-300" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">No deliveries yet</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Your completed deliveries will appear here.
                  </p>
                </div>
              ) : (
                delivered.map((item) => {
                  const ngoName = getNgoName(item);

                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 bg-green-50/50 border border-green-100 rounded-2xl px-5 py-4"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={18} className="text-green-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {item.foodName || item.title || "Food listing"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.quantityStr || item.quantity}
                        </p>

                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={11} />
                            {item.pickupAddress}
                          </span>

                          {ngoName && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <ShieldCheck size={11} />
                              Delivered to: {ngoName}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.donorId ? (
                            ratedDonors.has(item.id) ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
                                <ThumbsUp size={12} /> Donor Rated ✓
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  setFeedbackModal({
                                    listing: item,
                                    receiverType: "DONOR",
                                  })
                                }
                                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                Rate Donor
                              </button>
                            )
                          ) : null}

                          {item.ngoId ? (
                            ratedNgos.has(item.id) ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                                <ThumbsUp size={12} /> NGO Rated ✓
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  setFeedbackModal({
                                    listing: item,
                                    receiverType: "NGO",
                                  })
                                }
                                className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                Rate NGO
                              </button>
                            )
                          ) : null}
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        Done
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-800">
              Delivery Impact — {driverName}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              You have delivered <span className="font-bold">{totalDone} orders</span>{" "}
              totalling an estimated <span className="font-bold">{totalDone * 40}+ meals</span>{" "}
              to people in need. 🚛❤️
            </p>
          </div>
        </div>

        {deliveryId > 0 && (
          <FeedbackSection key={feedbackKey} userId={deliveryId} accentColor="blue" />
        )}

        {feedbackModal && (
          <DeliveryFeedbackModal
            listingId={feedbackModal.listing.id}
            foodName={feedbackModal.listing.foodName || feedbackModal.listing.title || "Food listing"}
            receiverType={feedbackModal.receiverType}
            receiverName={
              feedbackModal.receiverType === "DONOR"
                ? feedbackModal.listing.donorName || undefined
                : feedbackModal.listing.claimedByName || undefined
            }
            receiverId={
              feedbackModal.receiverType === "DONOR"
                ? Number(feedbackModal.listing.donorId ?? 0)
                : Number(feedbackModal.listing.ngoId ?? 0)
            }
            giverId={deliveryId}
            onClose={() => setFeedbackModal(null)}
            onSuccess={handleFeedbackSuccess}
          />
        )}
      </main>
    </div>
  );
}