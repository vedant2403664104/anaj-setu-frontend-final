"use client";

import { Loader2, RefreshCcw, MessageSquare } from "lucide-react";
import { FeedbackCard } from "./FeedbackCard";
import type { Feedback } from "@/lib/types";

type AccentColor = "orange" | "green" | "blue";
type Perspective = "given" | "received";

interface FeedbackListProps {
  items:        Feedback[];
  loading:      boolean;
  error:        string | null;
  perspective:  Perspective;
  accentColor?: AccentColor;
  onRetry?:     () => void;
}

const emptyMessages: Record<Perspective, string> = {
  given:    "You haven't given any feedback yet.",
  received: "No feedback received yet.",
};

const loadingColors: Record<AccentColor, string> = {
  orange: "text-orange-400",
  green:  "text-green-400",
  blue:   "text-blue-400",
};

const retryColors: Record<AccentColor, string> = {
  orange: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100",
  green:  "text-green-700 bg-green-50 border-green-200 hover:bg-green-100",
  blue:   "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
};

export function FeedbackList({
  items,
  loading,
  error,
  perspective,
  accentColor = "orange",
  onRetry,
}: FeedbackListProps) {
  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 size={24} className={`animate-spin ${loadingColors[accentColor]}`} />
        <p className="text-sm text-gray-400">Loading feedback...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <p className="text-sm text-gray-500">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-colors ${retryColors[accentColor]}`}
          >
            <RefreshCcw size={13} /> Try again
          </button>
        )}
      </div>
    );
  }

  /* ── Empty ── */
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
          <MessageSquare size={22} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-400 font-medium">{emptyMessages[perspective]}</p>
      </div>
    );
  }

  /* ── List ── */
  return (
    <div className="space-y-3">
      {items.map((fb, idx) => (
        <FeedbackCard
          key={fb.id ?? idx}
          feedback={fb}
          perspective={perspective}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}
