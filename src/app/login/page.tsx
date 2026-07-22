"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        mode === "login" ? { username, password } : { username, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      if (data.user?.onboardingComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg noise-bg flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-bold text-lg mb-10 justify-center"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-lime shadow-limeglow rotate-45" />
          <span>
            Founders<span className="text-lime">Hook</span>
          </span>
        </Link>

        <div className="bg-panel card-border rounded-2xl p-8 shadow-glow animate-fade-up">
          {/* mode toggle */}
          <div className="flex bg-bg rounded-lg p-1 mb-8 font-mono text-sm">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === "login" ? "bg-purple text-white" : "text-muted hover:text-ink"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === "signup" ? "bg-lime text-bg" : "text-muted hover:text-ink"
              }`}
            >
              Sign up
            </button>
          </div>

          <h1 className="font-display font-bold text-2xl mb-1">
            {mode === "login" ? "Welcome back" : "Let's get you set up"}
          </h1>
          <p className="text-muted text-sm mb-6">
            {mode === "login"
              ? "Log in with your username and password."
              : "Create an account — we'll ask a few quick questions next."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ananya_builds"
                className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple placeholder:text-muted/50"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">
                  College email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple placeholder:text-muted/50"
                />
              </div>
            )}

            <div>
              <label className="block font-mono text-xs text-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple placeholder:text-muted/50"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 font-mono bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime text-bg font-display font-bold py-3 rounded-lg hover:shadow-limeglow transition-shadow disabled:opacity-50"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Log in"
                : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted text-xs mt-6 font-mono">
          {mode === "login" ? "New to Forge? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-lime hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
