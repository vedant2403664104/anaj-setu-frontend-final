/**
 * types.ts
 * Shared TypeScript interfaces for the AnajSetu frontend.
 * Centralises types that were previously duplicated across dashboard pages.
 */

// ─── Auth / Session ────────────────────────────────────────────────────────────

export interface SessionUser {
  userId?: number;
  id?: number;
  name?: string;
  contactName?: string;
  orgName?: string;
  role?: "DONOR" | "TRUST" | "DELIVERY" | "NGO";
  phone?: string;
  address?: string;
  token?: string;
  hasVisited?: boolean;
}

// ─── Feedback ──────────────────────────────────────────────────────────────────

/**
 * The shape sent to POST /api/feedback
 */
export interface CreateFeedbackPayload {
  listingId: number;
  /** The user ID who is giving the feedback */
  giverId?: number;
  /** The user ID who is receiving the feedback (NGO id, donor id, etc.) */
  receiverId?: number;
  rating: number;
  comment?: string;
}

/**
 * Used locally before sending — includes foodName for the modal header.
 * Replaces the duplicated FeedbackData in donor/trust pages.
 */
export interface FeedbackData {
  listingId: number;
  foodName: string;
  rating: number;
  comment: string;
}

/**
 * Shape returned by GET /api/feedback/* endpoints (FeedbackResponseDto).
 * All fields are optional to be resilient against partial backend responses.
 *
 * The backend now resolves sender identity and returns it as:
 *   fromUserName  — display name of the user who submitted the feedback
 *   fromUserRole  — their role (e.g. "NGO", "DRIVER", "DONOR")
 *   fromUserId    — their numeric user ID
 *   toUserId      — recipient user ID
 *   toUserRole    — recipient role
 */
export interface Feedback {
  id?: number;
  listingId?: number;
  listingTitle?: string;   // may be returned as foodName alias
  foodName?: string;

  // ── New canonical sender/receiver fields (FeedbackResponseDto) ────────────
  fromUserId?: number;
  fromUserRole?: string;
  fromUserName?: string;
  toUserId?: number;
  toUserRole?: string;

  // ── Legacy fields kept for backward compatibility ──────────────────────────
  giverId?: number;
  giverName?: string;
  receiverId?: number;
  receiverName?: string;
  giverRole?: string;

  rating?: number;
  comment?: string;
  createdAt?: string;
  feedbackType?: string;
}
