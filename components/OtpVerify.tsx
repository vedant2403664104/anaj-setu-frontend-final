"use client";

import { useEffect, useRef, useState } from "react";
import { verifyOtp, sendOtp } from "@/lib/api";

interface OtpVerifyProps {
    phone: string;
    purpose: string;
    onSuccess: () => void;
}

export default function OtpVerify({ phone, purpose, onSuccess }: OtpVerifyProps) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputs = useRef<HTMLInputElement[]>([]);

    // 30s cooldown timer
    useEffect(() => {
        if (cooldown === 0) { setCanResend(true); return; }
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // Auto-focus first box
    useEffect(() => { inputs.current[0]?.focus(); }, []);

    const handleChange = (val: string, idx: number) => {
        if (!/^\d*$/.test(val)) return; // only digits
        const next = [...otp];
        next[idx] = val.slice(-1);
        setOtp(next);
        if (val && idx < 5) inputs.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputs.current[idx - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const code = otp.join("");
        if (code.length < 6) { setError("Please enter all 6 digits"); return; }
        setLoading(true);
        setError("");
        const ok = await verifyOtp(phone, code, purpose);
        setLoading(false);
        if (ok) {
            onSuccess();
        } else {
            setError("Invalid OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        }
    };

    const handleResend = async () => {
        setCanResend(false);
        setCooldown(30);
        setError("");
        await sendOtp(phone, purpose);
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Verify Your Phone</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    We sent a 6-digit OTP to <span className="font-medium text-foreground">{phone}</span>
                </p>
            </div>

            {/* 6-digit OTP boxes */}
            <div className="flex gap-3">
                {otp.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={(el) => { if (el) inputs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg
                       border-input bg-background focus:border-primary focus:outline-none
                       transition-colors"
                    />
                ))}
            </div>

            {/* Error message */}
            {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
            )}

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground
                   font-semibold text-base hover:bg-primary/90 transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend button with cooldown */}
            <div className="text-sm text-muted-foreground">
                {canResend ? (
                    <button
                        onClick={handleResend}
                        className="text-primary font-semibold hover:underline"
                    >
                        Resend OTP
                    </button>
                ) : (
                    <span>
                        Resend OTP in <span className="font-bold text-foreground">{cooldown}s</span>
                    </span>
                )}
            </div>
        </div>
    );
}