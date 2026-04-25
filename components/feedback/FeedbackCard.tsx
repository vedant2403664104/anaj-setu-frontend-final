"use client";

import { MessageSquare, User } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Feedback } from "@/lib/types";

type AccentColor = "orange" | "green" | "blue";

interface FeedbackCardProps {
  feedback: Feedback;
  /** Which side is "us": "given" means we gave it, "received" means we received it */
  perspective: "given" | "received";
  accentColor?: AccentColor;
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

const accentStyles: Record<AccentColor, {
  dot: string;
  badge: string;
  border: string;
}> = {
  orange: {
    dot: "bg-orange-400",
    badge: "bg-orange-50 text-orange-600 border-orange-200",
    border: "hover:border-orange-100",
  },
  green: {
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200",
    border: "hover:border-green-100",
  },
  blue: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    border: "hover:border-blue-100",
  },
};

function formatDate(raw?: string): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

/**
 * Resolves the display name of the person who sent the feedback.
 * Priority: fromUserName → "ROLE #id" → giverName → "Anonymous"
 */
function getSenderLabel(feedback: Feedback): string {
  if (feedback.fromUserName?.trim()) return feedback.fromUserName.trim();
  if (feedback.fromUserRole && feedback.fromUserId != null) {
    return `${feedback.fromUserRole} #${feedback.fromUserId}`;
  }
  if (feedback.giverName?.trim()) return feedback.giverName.trim();
  return "Anonymous";
}

export function FeedbackCard({
  feedback,
  perspective,
  accentColor = "orange",
}: FeedbackCardProps) {
  const styles = accentStyles[accentColor];
  const rating = feedback.rating ?? 0;
  const foodName = feedback.foodName ?? feedback.listingTitle ?? "Food listing";
  const date = formatDate(feedback.createdAt);

  // For "received" cards: show who sent the feedback using the new backend fields.
  // For "given" cards: show who received it (unchanged behaviour).
  const partyLabel = perspective === "given"
    ? feedback.receiverName
    : getSenderLabel(feedback);

  const partyPrefix = perspective === "given" ? "To" : "From";

  return (
    <div
      className={`bg-gray-50 border border-gray-100 ${styles.border} rounded-2xl px-5 py-4 transition-colors duration-150 space-y-2`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Accent dot */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${styles.dot}`} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{foodName}</p>
            {partyLabel && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <User size={11} />
                {partyPrefix}: <span className="font-medium text-gray-600 ml-0.5">{partyLabel}</span>
              </p>
            )}
          </div>
        </div>

        {/* Stars + numeric badge */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StarRating rating={rating} size={14} />
          {rating > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {ratingLabels[rating] ?? rating}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      {feedback.comment && (
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <MessageSquare size={12} className="flex-shrink-0 mt-0.5 text-gray-400" />
          <p className="leading-relaxed">{feedback.comment}</p>
        </div>
      )}

      {/* Date */}
      {date && (
        <p className="text-[11px] text-gray-300 text-right">{date}</p>
      )}
    </div>
  );
}
