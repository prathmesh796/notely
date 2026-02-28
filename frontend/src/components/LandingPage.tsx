import "./LandingPage.css";

interface LandingPageProps {
    onSignIn: () => void;
    onSignUp: () => void;
}

export default function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
    return (
        /* ===== ROOT ===== */
        <div
            className="min-h-screen text-[#e8eaf0] overflow-x-hidden relative"
            style={{ background: "#0b0d14", fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif' }}
        >
            {/* ===== ANIMATED ORBS ===== */}
            {/* Orb 1 */}
            <div
                className="anim-orb-1 fixed rounded-full pointer-events-none z-0"
                style={{
                    width: 560, height: 560,
                    background: "radial-gradient(circle, hsla(260,80%,55%,0.22), transparent 70%)",
                    top: -120, left: -160,
                    filter: "blur(90px)",
                }}
            />
            {/* Orb 2 */}
            <div
                className="anim-orb-2 fixed rounded-full pointer-events-none z-0"
                style={{
                    width: 480, height: 480,
                    background: "radial-gradient(circle, hsla(210,90%,60%,0.18), transparent 70%)",
                    top: 200, right: -140,
                    filter: "blur(90px)",
                }}
            />
            {/* Orb 3 */}
            <div
                className="anim-orb-3 fixed rounded-full pointer-events-none z-0"
                style={{
                    width: 400, height: 400,
                    background: "radial-gradient(circle, hsla(170,80%,50%,0.13), transparent 70%)",
                    bottom: 80, left: "30%",
                    filter: "blur(90px)",
                }}
            />

            {/* ===== NAV ===== */}
            <nav
                className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-12 py-4"
                style={{
                    background: "rgba(11,13,20,0.7)",
                    backdropFilter: "blur(18px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-white"
                        style={{
                            background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                            boxShadow: "0 4px 14px rgba(124,58,237,0.45)",
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <span
                        className="text-[1.2rem] font-bold tracking-[-0.02em] sm:inline hidden"
                        style={{
                            background: "linear-gradient(90deg,#c4b5fd,#93c5fd)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Notely
                    </span>
                </div>

                {/* Nav actions */}
                <div className="flex gap-2.5 items-center">
                    <button
                        id="nav-signin"
                        onClick={onSignIn}
                        className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 text-[#a6adc8] bg-transparent tracking-[0.01em] hover:text-white"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        id="nav-signup"
                        onClick={onSignUp}
                        className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 border-none text-white tracking-[0.01em] hover:-translate-y-px"
                        style={{
                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                            boxShadow: "0 3px 16px rgba(124,58,237,0.4)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 22px rgba(124,58,237,0.55)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 3px 16px rgba(124,58,237,0.4)")}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20">
                {/* Badge */}
                <div
                    className="anim-fade-in-down-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.8rem] font-medium text-[#c4b5fd] mb-7"
                    style={{
                        background: "rgba(124,58,237,0.12)",
                        border: "1px solid rgba(124,58,237,0.3)",
                    }}
                >
                    <span
                        className="anim-pulse inline-block w-[7px] h-[7px] rounded-full bg-[#7c3aed]"
                        style={{ boxShadow: "0 0 8px #7c3aed" }}
                    />
                    Your thoughts, beautifully organised
                </div>

                {/* Hero title */}
                <h1
                    className="anim-fade-in-down-1 font-extrabold tracking-[-0.035em] leading-[1.08] text-[#f0f2ff] mb-6"
                    style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
                >
                    Write. Think.
                    <br />
                    <span
                        className="anim-gradient"
                        style={{
                            background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Remember.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="anim-fade-in-down-2 max-w-[560px] text-[1.1rem] text-[#8892b0] leading-[1.7] mb-10">
                    A minimal, powerful notes app backed by a blazing-fast Cloudflare Worker.
                    Capture ideas in rich markdown — from anywhere, instantly.
                </p>

                {/* CTA buttons */}
                <div className="anim-fade-in-down-3 flex gap-3.5 flex-wrap justify-center mb-[72px]">
                    <button
                        id="hero-signup"
                        onClick={onSignUp}
                        className="inline-flex items-center gap-[9px] px-7 py-[13px] rounded-[10px] text-[0.95rem] font-semibold cursor-pointer border-none text-white transition-all duration-220 ease-out tracking-[0.01em] hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                            fontFamily: "inherit",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.6)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.45)")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                        Create Free Account
                    </button>
                    <button
                        id="hero-signin"
                        onClick={onSignIn}
                        className="inline-flex items-center gap-[9px] px-7 py-[13px] rounded-[10px] text-[0.95rem] font-semibold cursor-pointer text-[#c4b5fd] transition-all duration-220 ease-out tracking-[0.01em] hover:-translate-y-0.5"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            fontFamily: "inherit",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.borderColor = "rgba(164,148,255,0.4)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Sign In
                    </button>
                </div>

                {/* ===== DEMO CARD ===== */}
                <div
                    className="anim-float-card w-full max-w-[740px] rounded-2xl overflow-hidden"
                    style={{
                        background: "rgba(17,20,35,0.85)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {/* Topbar */}
                    <div
                        className="flex items-center gap-[7px] px-[18px] py-3"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                        <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                        <span className="flex-1 text-center text-[0.78rem] text-[#4a5568] font-medium">My Notes</span>
                    </div>

                    {/* Body */}
                    <div className="grid min-h-[200px]" style={{ gridTemplateColumns: "220px 1fr" }}>
                        {/* Note list */}
                        <div>
                            {/* Note – active */}
                            <div
                                className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-200"
                                style={{
                                    background: "rgba(124,58,237,0.1)",
                                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                                }}
                            >
                                <span
                                    className="inline-block w-2 h-2 rounded-full shrink-0 mt-[5px] bg-[#7c3aed]"
                                    style={{ boxShadow: "0 0 6px #7c3aed" }}
                                />
                                <div>
                                    <p className="text-[0.82rem] font-semibold text-[#c4b5fd] mb-[3px]">Project ideas 💡</p>
                                    <p className="text-[0.72rem] text-[#4a5568] whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                                        Build a markdown-first note app with...
                                    </p>
                                </div>
                            </div>
                            {/* Note 2 */}
                            <div
                                className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-200 hover:bg-white/3"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            >
                                <span
                                    className="inline-block w-2 h-2 rounded-full shrink-0 mt-[5px] bg-[#3b82f6]"
                                    style={{ boxShadow: "0 0 6px #3b82f6" }}
                                />
                                <div>
                                    <p className="text-[0.82rem] font-semibold text-[#c4b5fd] mb-[3px]">Weekend reading 📚</p>
                                    <p className="text-[0.72rem] text-[#4a5568] whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                                        Clean Architecture, Deep Work, and...
                                    </p>
                                </div>
                            </div>
                            {/* Note 3 */}
                            <div
                                className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-200 hover:bg-white/3"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            >
                                <span
                                    className="inline-block w-2 h-2 rounded-full shrink-0 mt-[5px] bg-[#10b981]"
                                    style={{ boxShadow: "0 0 6px #10b981" }}
                                />
                                <div>
                                    <p className="text-[0.82rem] font-semibold text-[#c4b5fd] mb-[3px]">Meeting notes ✍️</p>
                                    <p className="text-[0.72rem] text-[#4a5568] whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                                        Q2 roadmap: ship auth by Feb 28...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Editor pane */}
                        <div
                            className="p-5 text-left"
                            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <p className="text-[0.9rem] font-bold text-[#c4b5fd] mb-2.5"># Project ideas 💡</p>
                            <p className="text-[0.78rem] text-[#6b7280] leading-[1.8]">Build a **markdown-first** notes app...</p>
                            <p className="text-[0.78rem] text-[#6b7280] leading-[1.8]">- Real-time collaboration</p>
                            <p className="text-[0.78rem] text-[#6b7280] leading-[1.8]">- Cloud sync via CF Workers</p>
                            <span
                                className="anim-blink inline-block w-[2px] h-[15px] bg-[#7c3aed] ml-0.5 align-middle"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="relative z-10 grid gap-5 max-w-[1000px] mx-auto px-6 py-10 pb-20"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            >
                {[
                    {
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        ),
                        title: "Rich Markdown",
                        desc: "Write in markdown with live preview. Headers, lists, code blocks — everything you need.",
                        bg: "rgba(124,58,237,0.15)",
                        color: "#a78bfa",
                    },
                    {
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                            </svg>
                        ),
                        title: "Instant Sync",
                        desc: "Your notes are saved to the edge via Cloudflare Workers — sub-10 ms globally.",
                        bg: "rgba(59,130,246,0.15)",
                        color: "#60a5fa",
                    },
                    {
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        ),
                        title: "Secure by Default",
                        desc: "JWT-based auth, bcrypt-hashed passwords. Your data stays private, always.",
                        bg: "rgba(16,185,129,0.15)",
                        color: "#34d399",
                    },
                ].map(f => (
                    <div
                        key={f.title}
                        className="p-7 rounded-2xl transition-all duration-250 hover:-translate-y-1 cursor-default"
                        style={{
                            background: "rgba(17,20,35,0.7)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                            style={{ background: f.bg, color: f.color }}
                        >
                            {f.icon}
                        </div>
                        <h3 className="text-base font-bold text-[#e8eaf0] mb-2">{f.title}</h3>
                        <p className="text-sm text-[#6b7280] leading-[1.65]">{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* ===== FOOTER CTA ===== */}
            <section className="relative z-10 text-center px-6 py-[60px] pb-20">
                <h2
                    className="font-extrabold tracking-[-0.03em] text-[#f0f2ff] mb-3"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                >
                    Ready to start writing?
                </h2>
                <p className="text-base text-[#6b7280] mb-8">Free forever. No credit card required.</p>
                <button
                    id="footer-signup"
                    onClick={onSignUp}
                    className="inline-flex items-center gap-[9px] px-9 py-[15px] rounded-[10px] text-[1.05rem] font-semibold cursor-pointer border-none text-white transition-all duration-220 ease-out tracking-[0.01em] hover:-translate-y-0.5"
                    style={{
                        background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                        boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                        fontFamily: "inherit",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.6)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.45)")}
                >
                    Get Started — it's free
                </button>
            </section>

            {/* ===== FOOTER ===== */}
            <footer
                className="relative z-10 text-center p-5 text-[0.8rem] text-[#4a5568]"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
                <span>© {new Date().getFullYear()} Notely. Built with ❤️ &amp; Cloudflare Workers.</span>
            </footer>
        </div>
    );
}
