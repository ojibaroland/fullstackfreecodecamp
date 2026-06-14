"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(212,168,67,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.08) 0%, transparent 60%)" }} />
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            "--duration": `${Math.random() * 4 + 2}s`,
            "--delay": `${Math.random() * 4}s`,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* Back nav */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors">
        <span>←</span> Back to Lineage
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-10 animate-fadeInUp">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #d4a843, #8b5cf6)" }}>
              <span className="text-2xl">🌳</span>
            </div>
            <h1 className="text-2xl font-black text-gold-gradient">Lineage</h1>
            <p className="text-gray-500 text-sm mt-1">Your collaborative family archive</p>
          </div>

          {!sent ? (
            <>
              <h2 className="text-xl font-bold text-center mb-2">Welcome back</h2>
              <p className="text-gray-400 text-sm text-center mb-8">
                Enter your email and we&apos;ll send a magic link — no password needed.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(212,168,67,0.2)",
                      color: "#f0ece3",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(212,168,67,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(212,168,67,0.2)")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3 rounded-xl text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending magic link…
                    </>
                  ) : (
                    "Send Magic Link ✦"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-gray-600 text-center">
                  By continuing you agree to our{" "}
                  <span className="text-amber-400/70 cursor-pointer hover:text-amber-400">Terms</span>{" "}
                  and{" "}
                  <span className="text-amber-400/70 cursor-pointer hover:text-amber-400">Privacy Policy</span>.
                  Your family data is encrypted at rest.
                </p>
              </div>

              {/* Demo shortcut */}
              <div className="mt-4 text-center">
                <Link href="/dashboard"
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2">
                  Skip auth — view demo dashboard →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center animate-fadeInUp">
              <div className="text-6xl mb-6">✉️</div>
              <h2 className="text-xl font-bold mb-3">Check your inbox</h2>
              <p className="text-gray-400 text-sm mb-4">
                We sent a magic link to{" "}
                <span className="text-amber-400 font-semibold">{email}</span>.
                Click it to sign in — it expires in 10 minutes.
              </p>
              <div className="glass-light rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500">
                  Don&apos;t see it? Check your spam folder or{" "}
                  <button
                    className="text-amber-400 hover:underline"
                    onClick={() => setSent(false)}
                  >
                    try again
                  </button>.
                </p>
              </div>
              <Link href="/dashboard"
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2">
                Continue to demo dashboard →
              </Link>
            </div>
          )}
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-gray-600 mt-6">
          🔒 Magic links are single-use and expire in 10 min. No password stored.
        </p>
      </div>
    </main>
  );
}
