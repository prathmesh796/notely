import "./LandingPage.css";

interface LandingPageProps {
    onSignIn: () => void;
    onSignUp: () => void;
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
    return (
        <div className="lp-root">
            {/* Background orbs */}
            <div className="lp-orb lp-orb-1" />
            <div className="lp-orb lp-orb-2" />
            <div className="lp-orb lp-orb-3" />

            {/* Nav */}
            <nav className="lp-nav">
                <div className="lp-nav-brand">
                    <div className="lp-nav-logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <span className="lp-nav-name">Notely</span>
                </div>
                <div className="lp-nav-actions">
                    <button id="nav-signin" className="lp-nav-btn lp-nav-btn-ghost" onClick={onSignIn}>
                        Sign In
                    </button>
                    <button id="nav-signup" className="lp-nav-btn lp-nav-btn-solid" onClick={onSignUp}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="lp-hero">
                <div className="lp-badge">
                    <span className="lp-badge-dot" />
                    Your thoughts, beautifully organised
                </div>

                <h1 className="lp-hero-title">
                    Write. Think.
                    <br />
                    <span className="lp-hero-gradient">Remember.</span>
                </h1>

                <p className="lp-hero-subtitle">
                    A minimal, powerful notes app backed by a blazing-fast Cloudflare Worker.
                    Capture ideas in rich markdown — from anywhere, instantly.
                </p>

                <div className="lp-hero-cta">
                    <button id="hero-signup" className="lp-btn lp-btn-primary" onClick={onSignUp}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                        Create Free Account
                    </button>
                    <button id="hero-signin" className="lp-btn lp-btn-secondary" onClick={onSignIn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Sign In
                    </button>
                </div>

                {/* floating demo card */}
                <div className="lp-demo-card">
                    <div className="lp-demo-topbar">
                        <span className="lp-demo-dot" style={{ background: "#ff5f57" }} />
                        <span className="lp-demo-dot" style={{ background: "#febc2e" }} />
                        <span className="lp-demo-dot" style={{ background: "#28c840" }} />
                        <span className="lp-demo-title">My Notes</span>
                    </div>
                    <div className="lp-demo-body">
                        <div className="lp-demo-note lp-demo-note-active">
                            <span className="lp-demo-note-dot lp-dn-purple" />
                            <div>
                                <p className="lp-demo-note-title">Project ideas 💡</p>
                                <p className="lp-demo-note-preview">Build a markdown-first note app with...</p>
                            </div>
                        </div>
                        <div className="lp-demo-note">
                            <span className="lp-demo-note-dot lp-dn-blue" />
                            <div>
                                <p className="lp-demo-note-title">Weekend reading 📚</p>
                                <p className="lp-demo-note-preview">Clean Architecture, Deep Work, and...</p>
                            </div>
                        </div>
                        <div className="lp-demo-note">
                            <span className="lp-demo-note-dot lp-dn-green" />
                            <div>
                                <p className="lp-demo-note-title">Meeting notes ✍️</p>
                                <p className="lp-demo-note-preview">Q2 roadmap: ship auth by Feb 28...</p>
                            </div>
                        </div>
                        <div className="lp-demo-editor">
                            <p className="lp-demo-h1"># Project ideas 💡</p>
                            <p className="lp-demo-p">Build a **markdown-first** notes app...</p>
                            <p className="lp-demo-p">- Real-time collaboration</p>
                            <p className="lp-demo-p">- Cloud sync via CF Workers</p>
                            <span className="lp-demo-cursor" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="lp-features">
                {[
                    {
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        ),
                        title: "Rich Markdown",
                        desc: "Write in markdown with live preview. Headers, lists, code blocks — everything you need.",
                        color: "lp-feat-purple",
                    },
                    {
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                            </svg>
                        ),
                        title: "Instant Sync",
                        desc: "Your notes are saved to the edge via Cloudflare Workers — sub-10 ms globally.",
                        color: "lp-feat-blue",
                    },
                    {
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        ),
                        title: "Secure by Default",
                        desc: "JWT-based auth, bcrypt-hashed passwords. Your data stays private, always.",
                        color: "lp-feat-green",
                    },
                ].map((f) => (
                    <div className="lp-feat-card" key={f.title}>
                        <div className={`lp-feat-icon ${f.color}`}>{f.icon}</div>
                        <h3 className="lp-feat-title">{f.title}</h3>
                        <p className="lp-feat-desc">{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* Footer CTA */}
            <section className="lp-footer-cta">
                <h2 className="lp-footer-cta-title">Ready to start writing?</h2>
                <p className="lp-footer-cta-sub">Free forever. No credit card required.</p>
                <button id="footer-signup" className="lp-btn lp-btn-primary lp-btn-lg" onClick={onSignUp}>
                    Get Started — it's free
                </button>
            </section>

            <footer className="lp-footer">
                <span>© {new Date().getFullYear()} Notely. Built with ❤️ &amp; Cloudflare Workers.</span>
            </footer>
        </div>
    );
}
