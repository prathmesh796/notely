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
        <div className="auth-bg">
            {onBack && (
                <button id="auth-back-btn" className="auth-back-btn" onClick={onBack} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </button>
            )}
            {/* Animated blobs */}
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />
            <div className="auth-blob auth-blob-3" />

            <div className="auth-card">
                {/* Logo / Brand */}
                <div className="auth-brand">
                    <div className="auth-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <span className="auth-brand-name">Notes</span>
                </div>

                {/* Tab switcher */}
                <div className="auth-tabs">
                    <button
                        id="tab-login"
                        className={`auth-tab ${mode === "login" ? "active" : ""}`}
                        onClick={() => switchMode("login")}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        id="tab-signup"
                        className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                        onClick={() => switchMode("signup")}
                        type="button"
                    >
                        Sign Up
                    </button>
                    <div className={`auth-tab-slider ${mode === "signup" ? "right" : ""}`} />
                </div>

                <h1 className="auth-title">
                    {mode === "login" ? "Welcome back" : "Create account"}
                </h1>
                <p className="auth-subtitle">
                    {mode === "login"
                        ? "Sign in to access your notes"
                        : "Get started with a free account"}
                </p>

                <form id="auth-form" className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="auth-field">
                        <label htmlFor="auth-email">Email address</label>
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                id="auth-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="auth-password">Password</label>
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="auth-password"
                                type="password"
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {mode === "signup" && (
                        <div className="auth-field auth-field-animated">
                            <label htmlFor="auth-confirm-password">Confirm password</label>
                            <div className="auth-input-wrapper">
                                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="auth-alert auth-alert-error" role="alert">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-alert auth-alert-success" role="status">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <button
                        id="auth-submit"
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-spinner" />
                        ) : mode === "login" ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        id="auth-switch-btn"
                        className="auth-switch-btn"
                        onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
