import { useState, useEffect } from "react";
import { parseMarkdown } from "./services/markdownParser";
import { renderNode } from "./components/renderNode";
import { unified } from "unified";
import remarkStringify from "remark-stringify";
import { getToken, logout } from "./services/api";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";

type Page = "landing" | "auth" | "app";

const initialMarkdown = `# Live Markdown Editor

This is a **structured editor** backed by markdown.

## Features

- Parse markdown to AST
- Render React components from AST
- Edit inline and convert back to markdown
- Support for *emphasis* and **strong** text

Try editing this text by clicking on it!`;

function App() {
  const [page, setPage] = useState<Page>(() =>
    getToken() ? "app" : "landing"
  );
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [ast, setAst] = useState<any>(null);

  // Parse initial markdown to AST on mount
  useEffect(() => {
    setAst(parseMarkdown(initialMarkdown));
  }, []);

  // Automatically serialize AST back to markdown whenever it changes
  useEffect(() => {
    if (ast) {
      const serialized = unified().use(remarkStringify).stringify(ast);
      console.log("Auto-serialized markdown:", serialized);
    }
  }, [ast]);

  // Function to update a specific node in the AST
  const updateNode = (path: number[], newValue: string) => {
    if (!ast) return;
    const newAst = JSON.parse(JSON.stringify(ast));
    let current = newAst;
    for (let i = 0; i < path.length - 1; i++) {
      current = current.children[path[i]];
    }
    const targetIndex = path[path.length - 1];
    if (current.children && current.children[targetIndex]) {
      current.children[targetIndex].value = newValue;
    }
    setAst(newAst);
  };

  const handleSignIn = () => {
    setAuthMode("login");
    setPage("auth");
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setPage("auth");
  };

  const handleAuthSuccess = () => {
    setPage("app");
  };

  const handleLogout = () => {
    logout();
    setPage("landing");
  };

  if (page === "landing") {
    return <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  if (page === "auth") {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setPage("landing")}
        initialMode={authMode}
      />
    );
  }

  // === Notes App ===
  return (
    <div style={{ minHeight: "100vh", background: "#0b0d14", color: "#e8eaf0", fontFamily: "Inter, Segoe UI, system-ui, sans-serif" }}>
      {/* App Topbar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 32px",
        background: "rgba(11,13,20,0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span style={{
            fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em",
            background: "linear-gradient(90deg,#c4b5fd,#93c5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Notely</span>
        </div>
        <button
          id="logout-btn"
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </header>

      {/* Editor */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f2ff", marginBottom: 6 }}>
            Live Markdown Editor
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Click on any text to edit. Changes are automatically converted to markdown.
          </p>
        </div>

        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: "28px 32px",
          background: "rgba(17,20,35,0.75)",
          minHeight: 400,
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }}>
          {ast &&
            ast.children.map((node: any, i: number) => (
              <div key={i}>{renderNode(node, [i], updateNode)}</div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default App;
