const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

// ── Step 1: Send OTP ──────────────────────────────────────────
export async function sendOtp(phone: string, purpose: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/users/signup/initiate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });
        return res.ok;
    } catch (e) {
        console.error("sendOtp error:", e);
        return false;
    }
}

// ── Step 2: Verify OTP (just returns true — verify happens in complete) ───
export async function verifyOtp(phone: string, otp: string, purpose: string) {
    // We store OTP and verify it inside signupComplete
    // Return true to proceed to account creation
    return true;
}

// ── Step 3: Complete Signup (sends OTP + creates account) ────
export async function signupComplete(payload: {
    phone: string;
    otp: string;
    name: string;
    role: string;
    address?: string;
}) {
    try {
        const res = await fetch(`${BASE_URL}/api/users/signup/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const text = await res.text();
        console.log("Signup status:", res.status);
        console.log("Signup response:", text);

        if (!res.ok) return null;
        return JSON.parse(text);
    } catch (e) {
        console.error("signupComplete error:", e);
        return null;
    }
}