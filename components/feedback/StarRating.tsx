"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;      // 1–5
  maxStars?: number;   // default 5
  size?: number;       // icon size, default 16
}

/**
 * Read-only star rating display.
 * Filled stars use amber/yellow, empty stars are light gray.
 */
export function StarRating({ rating, maxStars = 5, size = 16 }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(maxStars, Math.round(rating)));

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${clamped} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < clamped
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </span>
  );
}
