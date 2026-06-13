"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import dynamic from "next/dynamic";

const FamilyTree3D = dynamic(() => import("@/components/tree/FamilyTree3D"), { ssr: false });

export default function TreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [view, setView] = useState<"tree" | "list">("tree");

  const familyName =
    id === "johnson" ? "Johnson Family"
    : id === "okafor" ? "Okafor Family"
    : `${id.charAt(0).toUpperCase() + id.slice(1)} Family`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-amber-400/10 px-6 py-4 flex items-center gap-4 z-20 flex-shrink-0">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Dashboard
        </Link>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, #d4a843, #8b5cf6)" }} />
          <h1 className="font-bold text-lg">{familyName}</h1>
          <span className="text-xs px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843" }}>
            11 members · 4 generations
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {(["tree", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="px-4 py-1.5 text-xs font-semibold transition-all"
                style={{
                  background: view === v ? "rgba(212,168,67,0.15)" : "transparent",
                  color: view === v ? "#d4a843" : "#9ca3af",
                }}>
                {v === "tree" ? "🌳 Tree" : "≡ List"}
              </button>
            ))}
          </div>

          <Link href={`/family/${id}/invite`} className="btn-outline-gold px-4 py-2 rounded-lg text-xs font-semibold">
            Invite Relatives
          </Link>
          <button onClick={() => setShowAddPerson(true)}
            className="btn-gold px-4 py-2 rounded-lg text-xs font-bold">
            + Add Person
          </button>
          <Link href={`/family/${id}/export`}
            className="px-4 py-2 rounded-lg text-xs transition-colors"
            style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>
            📦 Export
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6">
        {view === "tree" ? (
          <div className="animate-fadeIn">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Drag to pan · Scroll to zoom · Hover for details · Click to select
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Claimed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" /> Time-Locked
                </span>
              </div>
            </div>
            <FamilyTree3D familyId={id} />
          </div>
        ) : (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <div className="space-y-3">
              {[
                { name: "James Johnson", year: "1932–2010", gen: "Gen 1", claimed: false, media: 12 },
                { name: "Eleanor Johnson", year: "1935–present", gen: "Gen 1", claimed: true, media: 8 },
                { name: "Robert Johnson", year: "1958–present", gen: "Gen 2", claimed: true, media: 15 },
                { name: "Sarah Johnson", year: "1961–present", gen: "Gen 2", claimed: true, media: 9 },
                { name: "David Johnson", year: "1955–present", gen: "Gen 2", claimed: false, media: 5 },
                { name: "Liam Johnson", year: "1986–present", gen: "Gen 3", claimed: true, media: 11 },
                { name: "Mia Johnson", year: "1989–present", gen: "Gen 3", claimed: true, media: 7 },
                { name: "Noah Johnson", year: "1992–present", gen: "Gen 3", claimed: false, media: 0 },
                { name: "Kate Johnson", year: "1980–present", gen: "Gen 3", claimed: false, media: 6 },
                { name: "Ella Johnson", year: "2015–present", gen: "Gen 4", claimed: false, media: 3 },
                { name: "Owen Johnson", year: "2018–present", gen: "Gen 4", claimed: false, media: 2 },
              ].map((p, i) => (
                <Link key={i} href={`/person/${p.name.split(" ")[0].toLowerCase()}`}
                  className="glass rounded-xl p-4 flex items-center gap-4 hover:border-amber-400/20 transition-all block animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: "rgba(212,168,67,0.15)", color: "#d4a843" }}>
                    {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{p.name}</p>
                      {p.claimed && <span className="text-xs text-green-400">✅</span>}
                    </div>
                    <p className="text-xs text-gray-500">{p.year}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(212,168,67,0.08)", color: "#d4a843" }}>{p.gen}</span>
                    {p.media > 0 && <span className="text-amber-400">📸 {p.media}</span>}
                    <span className="text-gray-600">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Person Modal */}
      {showAddPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass rounded-3xl p-8 w-full max-w-md animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-6">Add Person to Tree</h2>
            <div className="space-y-4">
              {[
                { label: "Display Name", placeholder: "Full name", type: "text" },
                { label: "Birth Year", placeholder: "e.g. 1985", type: "number" },
                { label: "Death Year (optional)", placeholder: "Leave blank if living", type: "number" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.2)", color: "#f0ece3" }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Bio</label>
                <textarea placeholder="Short bio or description…" rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.2)", color: "#f0ece3" }} />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowAddPerson(false)}
                  className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold">
                  Cancel
                </button>
                <button onClick={() => setShowAddPerson(false)}
                  className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold">
                  Add Person →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
