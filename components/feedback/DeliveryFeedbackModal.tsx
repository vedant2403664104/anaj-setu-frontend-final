"use client";

import { useState } from "react";
import {
  X,
  Star,
  MessageSquare,
  ThumbsUp,
  Loader2,
  AlertCircle,
  ChefHat,
  ShieldCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api-base";
import type { CreateFeedbackPayload } from "@/lib/types";

export type ReceiverType = "DONOR" | "NGO";

export interface DeliveryFeedbackModalProps {
  listingId: number;
  foodName: string;
  receiverType: ReceiverType;
  receiverName?: string;
  receiverId: number;
  giverId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RATING_LABELS = ["", "Poor 😞", "Fair 😐", "Good 🙂", "Great 😊", "Excellent! 🌟"];

const THEME = {
  DONOR: {
    headerBg: "bg-gradient-to-r from-orange-500 to-orange-600",
    submitBg: "bg-orange-500 hover:bg-orange-600 shadow-orange-200 disabled:shadow-none",
    thumbBg: "bg-orange-100",
    thumbColor: "text-orange-500",
    thankColor: "text-orange-600",
    ringColor: "focus:ring-orange-400",
    icon: <ChefHat size={13} className="text-orange-400" />,
    title: "Rate Donor",
    question: "How was the pickup experience?",
    hint: "Rate packaging readiness, address clarity, wait time, and donor coordination.",
    placeholder: "Was the food ready on time? Was the address easy to find?...",
  },
  NGO: {
    headerBg: "bg-gradient-to-r from-green-600 to-green-700",
    submitBg: "bg-green-600 hover:bg-green-700 shadow-green-200 disabled:shadow-none",
    thumbBg: "bg-green-100",
    thumbColor: "text-green-600",
    thankColor: "text-green-700",
    ringColor: "focus:ring-green-400",
    icon: <ShieldCheck size={13} className="text-green-500" />,
    title: "Rate NGO",
    question: "How was the drop-off experience?",
    hint: "Rate receiving coordination, handoff smoothness, team availability, and response time.",
    placeholder: "Was the NGO team present? Was the handoff smooth?...",
  },
} as const;

export function DeliveryFeedbackModal({
  listingId,
  foodName,
  receiverType,
  receiverName,
  receiverId,
  giverId,
  onClose,
  onSuccess,
}: DeliveryFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const t = THEME[receiverType];

  async function handleSubmit() {
    if (rating === 0) return;
    setLoading(true);
    setError(null);

    try {
      const payload = {
        listingId,
        fromUserId: giverId,
        fromUserRole: "DRIVER",
        toUserId: receiverId,
        toUserRole: receiverType,
        feedbackType: "DELIVERY",
        rating,
        comment: comment.trim() || undefined,
      };

      await apiFetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      setTimeout(onSuccess, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className={`${t.headerBg} px-7 py-5 flex items-center justify-between`}>
          <div>
            <h2 className="text-white font-extrabold text-xl">{t.title}</h2>
            <p className="text-white/80 text-xs mt-0.5">
              Feedback for <span className="font-bold">{foodName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close feedback modal"
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className={`w-16 h-16 ${t.thumbBg} rounded-full flex items-center justify-center mb-4`}>
                <ThumbsUp size={32} className={t.thumbColor} />
              </div>
              <p className={`font-extrabold ${t.thankColor} text-lg`}>Thank you! 🙏</p>
              <p className="text-xs text-gray-400 mt-1">Your feedback helps improve the platform.</p>
            </div>
          ) : (
            <>
              {receiverName && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                  {t.icon}
                  <span>
                    Reviewing:{" "}
                    <span className="font-semibold text-gray-700">{receiverName}</span>
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                {t.hint}
              </p>

              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">{t.question}</p>
                <div className="flex gap-2 justify-center" role="group" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={`transition-colors ${star <= (hovered || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                    {RATING_LABELS[rating]}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Comments <span className="text-gray-400 font-normal">(optional)</span>
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.placeholder}
                  rows={3}
                  aria-label="Feedback comment"
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 ${t.ringColor} resize-none transition`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold shadow-md transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none ${t.submitBg}`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={15} /> Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}