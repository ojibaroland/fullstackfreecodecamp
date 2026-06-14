"use client";

import { useState } from "react";
import Link from "next/link";

const TIMELOCKS = [
  {
    id: "tl1",
    title: "Letter to Ella — Open on 18th Birthday",
    person: "Ella Johnson",
    personId: "ella",
    family: "Johnson Family",
    type: "TEXT",
    releaseAt: "2033-04-03T00:00:00Z",
    createdAt: "2024-06-13",
    status: "LOCKED",
    daysLeft: 2485,
    byUser: "Liam Johnson",
  },
  {
    id: "tl2",
    title: "Letter to Owen — Open on 18th Birthday",
    person: "Owen Johnson",
    personId: "owen",
    family: "Johnson Family",
    type: "TEXT",
    releaseAt: "2036-11-12T00:00:00Z",
    createdAt: "2024-06-13",
    status: "LOCKED",
    daysLeft: 3804,
    byUser: "Liam Johnson",
  },
  {
    id: "tl3",
    title: "Grandma Eleanor's Recipe Collection",
    person: "Eleanor Johnson",
    personId: "gm",
    family: "Johnson Family",
    type: "IMAGE",
    releaseAt: "2026-12-25T00:00:00Z",
    createdAt: "2025-12-01",
    status: "LOCKED",
    daysLeft: 195,
    byUser: "Robert Johnson",
  },
  {
    id: "tl4",
    title: "Dad's Message — When You Read This",
    person: "Liam Johnson",
    personId: "liam",
    family: "Johnson Family",
    type: "VIDEO",
    releaseAt: "2026-06-21T00:00:00Z",
    createdAt: "2025-06-21",
    status: "LOCKED",
    daysLeft: 8,
    byUser: "Robert Johnson",
  },
];

function CountdownRing({ daysLeft, maxDays = 3650 }: { daysLeft: number; maxDays?: number }) {
  const pct = Math.max(0, Math.min(1, 1 - daysLeft / maxDays));
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="4" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="#8b5cf6" strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="36" y="33" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700">
        {daysLeft > 999 ? `${Math.round(daysLeft / 365)}y` : `${daysLeft}d`}
      </text>
      <text x="36" y="46" textAnchor="middle" fill="rgba(156,163,175,0.6)" fontSize="7">
        {daysLeft > 365 ? "to unlock" : "days left"}
      </text>
    </svg>
  );
}

export default function TimelocksPage() {
  const [filter, setFilter] = useState<"ALL" | "LOCKED" | "RELEASED">("ALL");

  const filtered = TIMELOCKS.filter((t) => filter === "ALL" || t.status === filter);

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-amber-400/10 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
        <span className="text-gray-600">/</span>
        <span className="text-amber-400 text-sm font-semibold">Time-Locks</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <span>⏳</span> Time-Locked Memories
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Messages, photos, and videos encrypted server-side and scheduled for release at a future timestamp.
            </p>
          </div>
        </div>

        {/* Security banner */}
        <div className="glass rounded-2xl p-5 mb-8 border" style={{ borderColor: "rgba(139,92,246,0.25)" }}>
          <div className="flex items-start gap-4">
            <div className="text-2xl flex-shrink-0">🔐</div>
            <div>
              <p className="font-bold text-violet-300 mb-1">Server-Trust Time-Lock Model</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Each locked item is encrypted with a unique <strong>AES-256-GCM</strong> key on upload.
                The decryption key is stored server-side in a separate secrets store. A scheduled cron
                job checks for locks where <code className="text-violet-400 font-mono">releaseAt &lt;= now()</code>{" "}
                and transitions them to <code className="text-green-400 font-mono">RELEASED</code>, exposing the key.
                Content is <strong>never served</strong> before the release timestamp — enforced at the API layer.
              </p>
              <p className="text-xs text-amber-400/80 mt-2">
                ⚠ This is a company-held key model. A trustless threshold timelock (drand tlock) integration is planned.
                Until then, you are trusting Lineage to enforce release dates.
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["ALL", "LOCKED", "RELEASED"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === f ? "rgba(139,92,246,0.2)" : "rgba(26,31,53,0.8)",
                border: `1px solid ${filter === f ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: filter === f ? "#a78bfa" : "#9ca3af",
              }}>
              {f === "ALL" ? `All (${TIMELOCKS.length})` : f === "LOCKED" ? `🔐 Locked (${TIMELOCKS.filter(t => t.status === "LOCKED").length})` : `✅ Released (${TIMELOCKS.filter(t => t.status === "RELEASED").length})`}
            </button>
          ))}
        </div>

        {/* Time-lock cards */}
        <div className="space-y-4">
          {filtered.map((lock, i) => (
            <div key={lock.id} className="glass rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}>
              <div className="flex items-start gap-5">
                <CountdownRing daysLeft={lock.daysLeft} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-lg leading-snug">{lock.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span>For <Link href={`/person/${lock.personId}`} className="text-amber-400 hover:underline">{lock.person}</Link></span>
                        <span>·</span>
                        <span>{lock.family}</span>
                        <span>·</span>
                        <span>Created by {lock.byUser}</span>
                      </div>
                    </div>
                    <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{
                        background: lock.status === "LOCKED" ? "rgba(139,92,246,0.15)" : "rgba(16,185,129,0.15)",
                        color: lock.status === "LOCKED" ? "#a78bfa" : "#10b981",
                      }}>
                      {lock.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center mt-3">
                    <div className="text-xs">
                      <span className="text-gray-500">Type: </span>
                      <span className="text-amber-400">{lock.type}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Releases: </span>
                      <span className="text-violet-400 font-mono">{new Date(lock.releaseAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Created: </span>
                      <span className="text-gray-400">{lock.createdAt}</span>
                    </div>
                  </div>

                  {lock.daysLeft <= 30 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                      Opening soon in {lock.daysLeft} days!
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.max(2, (1 - lock.daysLeft / 3650) * 100)}%`,
                      background: lock.daysLeft <= 30
                        ? "linear-gradient(90deg, #f59e0b, #fde68a)"
                        : "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                    }} />
                </div>
                <span className="text-xs text-gray-600 font-mono whitespace-nowrap">
                  {lock.daysLeft > 365 ? `${(lock.daysLeft / 365).toFixed(1)}y remaining` : `${lock.daysLeft}d remaining`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-400">No {filter.toLowerCase()} time-locks</p>
          </div>
        )}
      </main>
    </div>
  );
}
