"use client";

import { useState } from "react";
import Link from "next/link";

const FAMILIES = [
  {
    id: "johnson",
    name: "Johnson Family",
    members: 12,
    generations: 3,
    media: 47,
    timeLocks: 3,
    lastActive: "2 hours ago",
    color: "#d4a843",
  },
  {
    id: "okafor",
    name: "Okafor Family",
    members: 8,
    generations: 2,
    media: 23,
    timeLocks: 1,
    lastActive: "Yesterday",
    color: "#8b5cf6",
  },
];

const RECENT_ACTIVITY = [
  { icon: "📸", text: "Uncle David added 3 photos to his profile", time: "2h ago", family: "Johnson" },
  { icon: "⏳", text: "Time-lock opens: Letter to Mia on her 30th birthday", time: "In 8 days", family: "Johnson" },
  { icon: "✅", text: "Liam Johnson claimed his person node (verified by 2 relatives)", time: "Yesterday", family: "Johnson" },
  { icon: "🌳", text: "Sarah Johnson added partner relationship with Robert", time: "3 days ago", family: "Johnson" },
  { icon: "📹", text: "New video uploaded: Christmas 1998 — 8mm Transfer", time: "5 days ago", family: "Okafor" },
  { icon: "🔐", text: "Time-lock created: To be opened on Dec 31, 2030", time: "1 week ago", family: "Johnson" },
];

const QUICK_STATS = [
  { label: "Family Members", value: "20", icon: "👥" },
  { label: "Media Items", value: "70", icon: "📸" },
  { label: "Time-Locks", value: "4", icon: "⏳" },
  { label: "Generations", value: "3", icon: "🌳" },
];

export default function DashboardPage() {
  const [showNewFamily, setShowNewFamily] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col glass border-r border-amber-400/10 p-6" style={{ minHeight: "100vh" }}>
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #d4a843, #8b5cf6)" }} />
          <span className="font-black text-lg text-gold-gradient">Lineage</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {[
            { label: "Dashboard", icon: "⌂", href: "/dashboard", active: true },
            { label: "Johnson Family", icon: "🌳", href: "/family/johnson/tree" },
            { label: "Okafor Family", icon: "🌳", href: "/family/okafor/tree" },
            { label: "My Profile", icon: "👤", href: "/person/liam" },
            { label: "Time-Locks", icon: "⏳", href: "/dashboard/timelocks" },
            { label: "Export Archive", icon: "📦", href: "/family/johnson/export" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-sm font-bold text-amber-400">
              L
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Liam Johnson</p>
              <p className="text-xs text-gray-500">liam@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">Welcome back, <span className="text-gold-gradient">Liam</span></h1>
            <p className="text-gray-400 text-sm">Your family archives across 2 families</p>
          </div>
          <button
            onClick={() => setShowNewFamily(true)}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            + New Family
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {QUICK_STATS.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-fadeInUp" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-gold-gradient">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Families */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold mb-4">Your Families</h2>
            {FAMILIES.map((f, i) => (
              <div key={f.id} className="glass rounded-2xl p-6 hover:border-amber-400/20 transition-all group animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      🌳
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{f.name}</h3>
                      <p className="text-xs text-gray-500">Last active {f.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/family/${f.id}/tree`}
                      className="btn-outline-gold px-4 py-1.5 rounded-lg text-xs font-semibold">
                      View Tree
                    </Link>
                    <Link href={`/family/${f.id}/invite`}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>
                      Invite
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Members", value: f.members },
                    { label: "Generations", value: f.generations },
                    { label: "Media", value: f.media },
                    { label: "Time-Locks", value: f.timeLocks },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="text-xl font-black" style={{ color: f.color }}>{stat.value}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add family card */}
            <button
              onClick={() => setShowNewFamily(true)}
              className="w-full glass rounded-2xl p-6 border-dashed border-amber-400/20 hover:border-amber-400/40 transition-all text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">+</div>
              <p className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors">Create a new family archive</p>
            </button>
          </div>

          {/* Activity feed */}
          <div>
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="glass rounded-xl p-4 animate-slideInRight"
                  style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                  <div className="flex gap-3">
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 leading-relaxed">{a.text}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-gray-600">{a.time}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843" }}>
                          {a.family}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time-lock countdown */}
        <div className="mt-8 glass rounded-2xl p-6 border" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>⏳</span> Upcoming Time-Locks
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Letter to Mia — 30th Birthday", date: "Jun 21, 2026", days: 8, status: "LOCKED" },
              { title: "Wedding Anniversary Video", date: "Sep 14, 2026", days: 93, status: "LOCKED" },
              { title: "To be opened: Jan 1, 2030", date: "Jan 1, 2030", days: 1298, status: "LOCKED" },
            ].map((lock, i) => (
              <div key={i} className="glass-light rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-gray-300 leading-snug">{lock.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                    style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>
                    {lock.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{lock.date}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(139,92,246,0.2)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${Math.max(5, 100 - (lock.days / 1300) * 100)}%`,
                      background: "linear-gradient(90deg, #8b5cf6, #a78bfa)"
                    }} />
                  </div>
                  <span className="text-xs text-violet-400 font-mono">{lock.days}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* New Family Modal */}
      {showNewFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass rounded-3xl p-8 w-full max-w-md animate-fadeInUp">
            <h2 className="text-xl font-black mb-6">Create New Family Archive</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Family Name</label>
                <input
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  placeholder="e.g. Martinez Family"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.2)", color: "#f0ece3" }}
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500">
                You&apos;ll be the first member. Invite relatives by email after creation.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowNewFamily(false)}
                  className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold">
                  Cancel
                </button>
                <Link href="/family/new-family/tree"
                  className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold text-center block">
                  Create Family →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
