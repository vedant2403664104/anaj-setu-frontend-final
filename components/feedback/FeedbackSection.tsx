"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { FeedbackList } from "./FeedbackList";
import { BASE_URL } from "@/lib/api-base";
import type { Feedback } from "@/lib/types";

type AccentColor = "orange" | "green" | "blue";
type ActiveTab   = "received" | "given";

interface FeedbackSectionProps {
  /** The resolved numeric user ID (from sessionStorage) */
  userId:       number;
  accentColor?: AccentColor;
}

// ─── Tab button styles per accent ─────────────────────────────────────────────

const activeTabStyles: Record<AccentColor, string> = {
  orange: "bg-orange-500 text-white shadow-sm",
  green:  "bg-green-600 text-white shadow-sm",
  blue:   "bg-blue-600 text-white shadow-sm",
};

const headerDotStyles: Record<AccentColor, string> = {
  orange: "bg-orange-500",
  green:  "bg-green-600",
  blue:   "bg-blue-600",
};

const headerIconStyles: Record<AccentColor, string> = {
  orange: "bg-orange-100 text-orange-500",
  green:  "bg-green-100 text-green-600",
  blue:   "bg-blue-100 text-blue-600",
};

// ─── Helper: fetch a list, return [] on failure ───────────────────────────────

async function safeFetchList(url: string): Promise<{ data: Feedback[]; error: string | null }> {
  try {
    const res = await fetch(url);
    if (res.status === 404 || res.status === 204) return { data: [], error: null };
    if (!res.ok) {
      return { data: [], error: `Server error (${res.status})` };
    }
    const json = await res.json();
    // Backend may return array directly or wrapped in { data: [...] }
    const list: Feedback[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
    return { data: list, error: null };
  } catch {
    return { data: [], error: "Could not load feedback. Check your connection." };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FeedbackSection({ userId, accentColor = "orange" }: FeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("received");

  const [received,        setReceived]        = useState<Feedback[]>([]);
  const [given,           setGiven]           = useState<Feedback[]>([]);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const [loadingGiven,    setLoadingGiven]    = useState(true);
  const [errorReceived,   setErrorReceived]   = useState<string | null>(null);
  const [errorGiven,      setErrorGiven]      = useState<string | null>(null);

  // ── Fetch both lists in parallel on mount (or when userId becomes available) ─
  const fetchFeedback = useCallback(async () => {
    if (!userId) return;

    setLoadingReceived(true);
    setLoadingGiven(true);

    const [rec, given] = await Promise.all([
      safeFetchList(`${BASE_URL}/api/feedback/received/${userId}`),
      safeFetchList(`${BASE_URL}/api/feedback/given/${userId}`),
    ]);

    setReceived(rec.data);
    setErrorReceived(rec.error);
    setLoadingReceived(false);

    setGiven(given.data);
    setErrorGiven(given.error);
    setLoadingGiven(false);
  }, [userId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Skip rendering entirely if userId is not resolved yet
  if (!userId) return null;

  const tabs: { key: ActiveTab; label: string; count: number }[] = [
    { key: "received", label: "Feedback Received", count: received.length },
    { key: "given",    label: "Feedback Given",    count: given.length    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-7 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${headerIconStyles[accentColor]}`}>
            <MessageSquare size={18} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Feedback</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ratings from the community</p>
          </div>
        </div>

        {/* Summary pill */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${headerDotStyles[accentColor]}`} />
          <span className="text-xs text-gray-500 font-medium">
            {received.length + given.length} total
          </span>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="px-7 pt-4 flex items-center gap-2 flex-wrap">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-150 ${
              activeTab === key
                ? activeTabStyles[accentColor]
                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
            }`}
          >
            {label}
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === key
                  ? "bg-white/25 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="px-7 py-5">
        {activeTab === "received" && (
          <FeedbackList
            items={received}
            loading={loadingReceived}
            error={errorReceived}
            perspective="received"
            accentColor={accentColor}
            onRetry={() => {
              setLoadingReceived(true);
              setErrorReceived(null);
              safeFetchList(`${BASE_URL}/api/feedback/received/${userId}`).then(({ data, error }) => {
                setReceived(data);
                setErrorReceived(error);
                setLoadingReceived(false);
              });
            }}
          />
        )}

        {activeTab === "given" && (
          <FeedbackList
            items={given}
            loading={loadingGiven}
            error={errorGiven}
            perspective="given"
            accentColor={accentColor}
            onRetry={() => {
              setLoadingGiven(true);
              setErrorGiven(null);
              safeFetchList(`${BASE_URL}/api/feedback/given/${userId}`).then(({ data, error }) => {
                setGiven(data);
                setErrorGiven(error);
                setLoadingGiven(false);
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
