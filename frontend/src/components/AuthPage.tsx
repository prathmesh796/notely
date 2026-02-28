import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import "./AuthPage.css";

interface AuthPageProps {
    onAuthSuccess: () => void;
    onBack?: () => void;
    initialMode?: "login" | "signup";
}

export default function AuthPage({ onAuthSuccess, onBack, initialMode = "login" }: AuthPageProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    };

    const switchMode = (next: "login" | "signup") => {
        reset();
        setMode(next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        if (mode === "signup") {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters.");
                return;
            }
        }

        setLoading(true);
        try {
            if (mode === "login") {
                await loginUser(email, password);
                onAuthSuccess();
            } else {
                await registerUser(email, password);
                setSuccess("Account created! You can now sign in.");
                setTimeout(() => switchMode("login"), 1500);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* ===== AUTH BACKGROUND ===== */
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden p-6"
            style={{ background: "#0b0d14", fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif' }}
        >
            {onBack && (
                /* ===== BACK BUTTON ===== */
                <button
                    id="auth-back-btn"
                    className="fixed top-[22px] left-6 z-200 flex items-center gap-1.5 px-4 py-2 rounded-lg text-[#a6adc8] text-[0.82rem] font-semibold cursor-pointer transition-all duration-200 hover:text-white"
                    style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                    onClick={onBack}
                    type="button"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </button>
            )}

            {/* ===== ANIMATED BLOBS ===== */}
            {/* Blob 1 */}
            <div
                className="anim-blob fixed rounded-full pointer-events-none z-0"
                style={{
                    width: 500, height: 500,
                    background: "radial-gradient(circle, hsla(260,80%,55%,0.2), transparent 70%)",
                    top: -160, left: -160,
                    filter: "blur(80px)",
                }}
            />
            {/* Blob 2 */}
            <div
                className="anim-blob-delay4 fixed rounded-full pointer-events-none z-0"
                style={{
                    width: 420, height: 420,
                    background: "radial-gradient(circle, hsla(210,90%,60%,0.16), transparent 70%)",
                    bottom: -120, right: -120,
                    filter: "blur(80px)",
                }}
            />
            {/* Blob 3 */}
            <div
                className="anim-blob-delay7 fixed rounded-full pointer-events-none z-0"
                style={{
                    width: 300, height: 300,
                    background: "radial-gradient(circle, hsla(170,80%,50%,0.12), transparent 70%)",
                    top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    filter: "blur(80px)",
                }}
            />

            {/* ===== CARD ===== */}
            <div
                className="anim-card-in relative z-10 w-full max-w-[430px] rounded-[20px] px-9 py-10"
                style={{
                    background: "rgba(17,20,35,0.88)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,58,237,0.08)",
                    backdropFilter: "blur(16px)",
                }}
            >
                {/* ===== BRAND ===== */}
                <div className="flex items-center gap-2.5 justify-center mb-7">
                    {/* Logo */}
                    <div
                        className="w-10 h-10 rounded-[11px] flex items-center justify-center text-white"
                        style={{
                            background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                            boxShadow: "0 4px 16px rgba(124,58,237,0.5)",
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    {/* Brand name */}
                    <span
                        className="text-[1.3rem] font-extrabold tracking-[-0.03em]"
                        style={{
                            background: "linear-gradient(90deg,#c4b5fd,#93c5fd)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Notes
                    </span>
                </div>

                {/* ===== TABS ===== */}
                <div
                    className="relative flex rounded-[10px] p-1 mb-7 overflow-hidden"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                    }}
                >
                    {/* Sliding indicator */}
                    <div
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[7px] pointer-events-none transition-transform duration-280 ease-[cubic-bezier(.22,.8,.29,1)] ${mode === "signup" ? "tab-slider-right" : ""}`}
                        style={{
                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                            boxShadow: "0 3px 12px rgba(124,58,237,0.4)",
                        }}
                    />
                    <button
                        id="tab-login"
                        className={`flex-1 py-[9px] border-none bg-transparent text-sm font-semibold cursor-pointer rounded-[7px] transition-colors duration-200 relative z-10 ${mode === "login" ? "text-white" : "text-gray-500 hover:text-gray-400"}`}
                        onClick={() => switchMode("login")}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        id="tab-signup"
                        className={`flex-1 py-[9px] border-none bg-transparent text-sm font-semibold cursor-pointer rounded-[7px] transition-colors duration-200 relative z-10 ${mode === "signup" ? "text-white" : "text-gray-500 hover:text-gray-400"}`}
                        onClick={() => switchMode("signup")}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {/* ===== TITLES ===== */}
                <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-[#f0f2ff] mb-1.5">
                    {mode === "login" ? "Welcome back" : "Create account"}
                </h1>
                <p className="text-sm text-gray-500 mb-7">
                    {mode === "login"
                        ? "Sign in to access your notes"
                        : "Get started with a free account"}
                </p>

                {/* ===== FORM ===== */}
                <form id="auth-form" className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    {/* Email field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="auth-email" className="text-[0.8rem] font-semibold text-[#a6adc8] tracking-wide">
                            Email address
                        </label>
                        <div className="relative">
                            <svg
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none"
                                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                id="auth-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full pl-[42px] pr-3.5 py-[11px] rounded-[10px] text-[#e8eaf0] text-[0.9rem] outline-none transition-all duration-200 placeholder:text-[#374151]"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    fontFamily: "inherit",
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.55)";
                                    e.currentTarget.style.background = "rgba(124,58,237,0.05)";
                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="auth-password" className="text-[0.8rem] font-semibold text-[#a6adc8] tracking-wide">
                            Password
                        </label>
                        <div className="relative">
                            <svg
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none"
                                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="auth-password"
                                type="password"
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full pl-[42px] pr-3.5 py-[11px] rounded-[10px] text-[#e8eaf0] text-[0.9rem] outline-none transition-all duration-200 placeholder:text-[#374151]"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    fontFamily: "inherit",
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.55)";
                                    e.currentTarget.style.background = "rgba(124,58,237,0.05)";
                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                        </div>
                    </div>

                    {/* ===== ANIMATED FIELD (confirm password) ===== */}
                    {mode === "signup" && (
                        <div className="anim-slide-down flex flex-col gap-1.5">
                            <label htmlFor="auth-confirm-password" className="text-[0.8rem] font-semibold text-[#a6adc8] tracking-wide">
                                Confirm password
                            </label>
                            <div className="relative">
                                <svg
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none"
                                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="M9 12l2 2 4-4" />
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    id="auth-confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-[42px] pr-3.5 py-[11px] rounded-[10px] text-[#e8eaf0] text-[0.9rem] outline-none transition-all duration-200 placeholder:text-[#374151]"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        fontFamily: "inherit",
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = "rgba(124,58,237,0.55)";
                                        e.currentTarget.style.background = "rgba(124,58,237,0.05)";
                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* ===== ALERTS ===== */}
                    {error && (
                        <div
                            className="anim-fade-in flex items-center gap-2 px-3.5 py-2.5 rounded-[9px] text-[0.83rem] font-medium text-[#f87171]"
                            role="alert"
                            style={{
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.25)",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="anim-fade-in flex items-center gap-2 px-3.5 py-2.5 rounded-[9px] text-[0.83rem] font-medium text-[#34d399]"
                            role="status"
                            style={{
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.25)",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* ===== SUBMIT ===== */}
                    <button
                        id="auth-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center mt-1 py-[13px] rounded-[10px] border-none text-white text-[0.95rem] font-bold tracking-wide cursor-pointer transition-all duration-200 disabled:opacity-65 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                            fontFamily: "inherit",
                        }}
                        onMouseEnter={e => {
                            if (!loading) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.55)";
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)";
                        }}
                    >
                        {loading ? (
                            /* ===== SPINNER ===== */
                            <span
                                className="anim-spin inline-block w-[18px] h-[18px] rounded-full"
                                style={{
                                    border: "2.5px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "#fff",
                                }}
                            />
                        ) : mode === "login" ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* ===== SWITCH ===== */}
                <p className="text-center text-[0.83rem] text-gray-500 mt-5">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        id="auth-switch-btn"
                        className="bg-transparent border-none text-[0.83rem] font-bold text-[#a78bfa] cursor-pointer p-0 transition-colors duration-200 hover:text-[#c4b5fd] hover:underline"
                        style={{ fontFamily: "inherit" }}
                        onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
