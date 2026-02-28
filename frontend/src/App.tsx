import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { getToken, logout } from "./services/api";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";

type Page = "landing" | "auth" | "app";

function App() {
  const [page, setPage] = useState<Page>(() =>
    getToken() ? "app" : "landing"
  );

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
