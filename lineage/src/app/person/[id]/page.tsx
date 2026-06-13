"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";

const PEOPLE: Record<string, {
  name: string; birthYear: number; deathYear?: number; bio: string;
  claimed: boolean; claimedBy?: string; verifiedCount: number;
  generation: string; gender: string;
  media: Array<{ id: string; type: string; caption: string; visibility: string; timeLock?: string }>;
  relatives: Array<{ id: string; name: string; relation: string }>;
}> = {
  liam: {
    name: "Liam Johnson", birthYear: 1986, bio: "Software engineer based in New York City. Lover of jazz, coffee, and old maps. Studying our family's migration from Ireland to the US in the 1880s.",
    claimed: true, claimedBy: "Liam Johnson", verifiedCount: 4, generation: "3rd Generation", gender: "male",
    media: [
      { id: "m1", type: "IMAGE", caption: "Summer in Cape Cod, 2019", visibility: "FAMILY" },
      { id: "m2", type: "IMAGE", caption: "Graduation Day, 2008", visibility: "PUBLIC" },
      { id: "m3", type: "VIDEO", caption: "Dad's 60th Birthday Party", visibility: "FAMILY" },
      { id: "m4", type: "TEXT", caption: "Letter to Ella — Open on 18th Birthday", visibility: "LOCKED", timeLock: "Apr 3, 2033" },
      { id: "m5", type: "TEXT", caption: "Letter to Owen — Open on 18th Birthday", visibility: "LOCKED", timeLock: "Nov 12, 2036" },
      { id: "m6", type: "IMAGE", caption: "Wedding Day, 2014", visibility: "PUBLIC" },
    ],
    relatives: [
      { id: "f", name: "Robert Johnson", relation: "Father" },
      { id: "m", name: "Sarah Johnson", relation: "Mother" },
      { id: "gf", name: "James Johnson", relation: "Grandfather" },
      { id: "gm", name: "Eleanor Johnson", relation: "Grandmother" },
      { id: "mia", name: "Mia Johnson", relation: "Sister" },
      { id: "ella", name: "Ella Johnson", relation: "Daughter" },
      { id: "owen", name: "Owen Johnson", relation: "Son" },
    ],
  },
  gf: {
    name: "James Johnson", birthYear: 1932, deathYear: 2010,
    bio: "James served in the Korean War and returned home to build a farm in rural Ohio. He was the first in his family to own land in America. Known for his storytelling, his love of woodworking, and his legendary apple pie recipe.",
    claimed: false, verifiedCount: 5, generation: "1st Generation", gender: "male",
    media: [
      { id: "m1", type: "IMAGE", caption: "Korean War, 1952", visibility: "PUBLIC" },
      { id: "m2", type: "IMAGE", caption: "Wedding Day, 1956", visibility: "PUBLIC" },
      { id: "m3", type: "IMAGE", caption: "The Farm, circa 1970", visibility: "FAMILY" },
      { id: "m4", type: "VIDEO", caption: "Christmas 1985 — 8mm Transfer", visibility: "FAMILY" },
    ],
    relatives: [
      { id: "gm", name: "Eleanor Johnson", relation: "Wife" },
      { id: "f", name: "Robert Johnson", relation: "Son" },
      { id: "u", name: "David Johnson", relation: "Son" },
    ],
  },
};

const DEFAULT_PERSON = {
  name: "Unknown Person", birthYear: 1970, bio: "No bio added yet. Invite this person to claim their node.",
  claimed: false, verifiedCount: 0, generation: "Unknown", gender: "other",
  media: [], relatives: [],
};

function MediaCard({ item }: { item: { id: string; type: string; caption: string; visibility: string; timeLock?: string } }) {
  const colors: Record<string, string> = {
    PUBLIC: "#10b981",
    FAMILY: "#d4a843",
    LOCKED: "#8b5cf6",
  };
  const color = colors[item.visibility] || "#9ca3af";

  return (
    <div className="glass rounded-xl overflow-hidden group hover:border-amber-400/20 transition-all">
      {/* Thumbnail */}
      <div className="relative overflow-hidden"
        style={{ height: 160, background: item.visibility === "LOCKED" ? "rgba(139,92,246,0.08)" : "rgba(212,168,67,0.06)" }}>
        {item.visibility === "LOCKED" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">🔐</div>
            <p className="text-xs text-violet-400 font-semibold text-center px-4">
              Time-Locked
            </p>
            {item.timeLock && (
              <p className="text-xs text-gray-500 mt-1">Unlocks {item.timeLock}</p>
            )}
          </div>
        ) : item.type === "IMAGE" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl opacity-30">{item.type === "IMAGE" ? "🖼" : item.type === "VIDEO" ? "🎬" : "📝"}</div>
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, rgba(212,168,67,0.1), rgba(139,92,246,0.1))`,
            }} />
          </div>
        ) : item.type === "VIDEO" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl opacity-30">🎬</div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background: "rgba(212,168,67,0.2)", border: "2px solid rgba(212,168,67,0.4)" }}>
              ▶
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-5xl opacity-30 absolute">📝</div>
            <p className="text-xs text-gray-400 text-center line-clamp-4 relative z-10 italic leading-relaxed">
              {item.caption}
            </p>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(12,10,26,0.8)", color: "#9ca3af" }}>
            {item.type}
          </span>
        </div>

        {/* Visibility badge */}
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${color}20`, color }}>
            {item.visibility}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-300 font-medium line-clamp-2">{item.caption}</p>
        {item.timeLock && (
          <p className="text-xs text-violet-400 mt-1">⏳ Unlocks {item.timeLock}</p>
        )}
      </div>
    </div>
  );
}

export default function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const person = PEOPLE[id] ?? { ...DEFAULT_PERSON, name: `${id.charAt(0).toUpperCase() + id.slice(1)} Johnson` };
  const [activeTab, setActiveTab] = useState<"media" | "relatives" | "timeline">("media");
  const [showVerify, setShowVerify] = useState(false);
  const [showClaim, setShowClaim] = useState(false);

  const initials = person.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="glass border-b border-amber-400/10 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">← Dashboard</Link>
        <span className="text-gray-600">/</span>
        <Link href="/family/johnson/tree" className="text-gray-400 hover:text-white transition-colors text-sm">Johnson Family Tree</Link>
        <span className="text-gray-600">/</span>
        <span className="text-amber-400 text-sm font-semibold">{person.name}</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile header */}
        <div className="glass rounded-3xl p-8 mb-6 animate-fadeInUp">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-black animate-pulse-glow"
                style={{
                  background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(139,92,246,0.2))",
                  border: "2px solid rgba(212,168,67,0.3)",
                  color: "#d4a843",
                }}>
                {initials}
              </div>
              {person.claimed && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs border-2 border-[#0c0a1a]">
                  ✓
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h1 className="text-3xl font-black">{person.name}</h1>
                {person.claimed && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                    ✅ Claimed by {person.claimedBy}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                <span>
                  {person.birthYear}
                  {person.deathYear ? ` – ${person.deathYear} (${person.deathYear - person.birthYear} years)` : " – present"}
                </span>
                <span className="text-gray-600">·</span>
                <span>{person.generation}</span>
                {person.verifiedCount > 0 && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="text-amber-400">
                      ✦ Verified by {person.verifiedCount} relative{person.verifiedCount !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">{person.bio}</p>

              <div className="flex flex-wrap gap-3">
                {!person.claimed && (
                  <button onClick={() => setShowClaim(true)}
                    className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
                    Claim This Profile →
                  </button>
                )}
                <button onClick={() => setShowVerify(true)}
                  className="btn-outline-gold px-5 py-2.5 rounded-xl text-sm font-semibold">
                  {person.verifiedCount > 0 ? `✦ Verify (${person.verifiedCount} so far)` : "Verify This Person"}
                </button>
                <Link href={`/person/${id}/upload`}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>
                  + Upload Media
                </Link>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex md:flex-col gap-4 md:gap-3">
              {[
                { label: "Media", value: person.media.length, color: "#d4a843" },
                { label: "Verified by", value: person.verifiedCount, color: "#10b981" },
                { label: "Relatives", value: person.relatives.length, color: "#8b5cf6" },
              ].map((s) => (
                <div key={s.label} className="text-center glass-light rounded-xl px-4 py-3">
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1 w-fit">
          {(["media", "relatives", "timeline"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
              style={{
                background: activeTab === tab ? "rgba(212,168,67,0.15)" : "transparent",
                color: activeTab === tab ? "#d4a843" : "#9ca3af",
              }}>
              {tab === "media" ? `📸 Media (${person.media.length})`
                : tab === "relatives" ? `👥 Relatives (${person.relatives.length})`
                : "📅 Timeline"}
            </button>
          ))}
        </div>

        {/* Media grid */}
        {activeTab === "media" && (
          <div className="animate-fadeIn">
            {person.media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {person.media.map((item, i) => (
                  <div key={item.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                    <MediaCard item={item} />
                  </div>
                ))}
                {/* Upload slot */}
                <Link href={`/person/${id}/upload`}
                  className="glass rounded-xl flex flex-col items-center justify-center text-center p-6 hover:border-amber-400/30 transition-all group border-dashed"
                  style={{ minHeight: 200, borderColor: "rgba(212,168,67,0.15)" }}>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">+</div>
                  <p className="text-xs text-gray-400 group-hover:text-amber-400 transition-colors">Upload Media</p>
                </Link>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📸</div>
                <p className="text-gray-400 mb-4">No media yet</p>
                <Link href={`/person/${id}/upload`} className="btn-gold px-6 py-3 rounded-xl text-sm font-bold inline-block">
                  Upload First Media →
                </Link>
              </div>
            )}

            {/* Visibility note */}
            <div className="mt-6 glass rounded-xl p-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />PUBLIC — visible to everyone</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />FAMILY — only family members</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />LOCKED — encrypted until releaseAt</span>
            </div>
          </div>
        )}

        {/* Relatives */}
        {activeTab === "relatives" && (
          <div className="animate-fadeIn grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {person.relatives.map((rel, i) => (
              <Link key={rel.id} href={`/person/${rel.id}`}
                className="glass rounded-xl p-4 flex items-center gap-3 hover:border-amber-400/20 transition-all animate-fadeInUp"
                style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843" }}>
                  {rel.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{rel.name}</p>
                  <p className="text-xs text-gray-500">{rel.relation}</p>
                </div>
                <span className="ml-auto text-gray-600 text-sm">→</span>
              </Link>
            ))}
          </div>
        )}

        {/* Timeline */}
        {activeTab === "timeline" && (
          <div className="animate-fadeIn max-w-2xl">
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-amber-400/20" />
              {[
                { year: person.birthYear, event: `Born in ${person.birthYear}`, icon: "👶" },
                ...(person.media.filter(m => m.visibility !== "LOCKED").map(m => ({
                  year: 2019, event: m.caption, icon: m.type === "IMAGE" ? "📸" : m.type === "VIDEO" ? "🎬" : "📝"
                }))),
                ...(person.deathYear ? [{ year: person.deathYear, event: `Passed away in ${person.deathYear}`, icon: "🕊" }] : []),
              ].sort((a, b) => a.year - b.year).map((item, i) => (
                <div key={i} className="relative mb-6 animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                  <div className="absolute -left-5 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                    style={{ background: "#0c0a1a", border: "2px solid rgba(212,168,67,0.4)" }}>
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{item.icon}</span>
                      <span className="text-xs text-amber-400 font-mono">{item.year}</span>
                    </div>
                    <p className="text-sm text-gray-300">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Verify modal */}
      {showVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass rounded-3xl p-8 w-full max-w-sm animate-fadeInUp">
            <h2 className="text-xl font-black mb-2">Verify {person.name}</h2>
            <p className="text-gray-400 text-sm mb-6">
              Confirm you personally know this person or can attest to their identity.
              Currently verified by <strong className="text-amber-400">{person.verifiedCount}</strong> relative
              {person.verifiedCount !== 1 ? "s" : ""}.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowVerify(false)}
                className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold">
                Cancel
              </button>
              <button onClick={() => setShowVerify(false)}
                className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold">
                ✅ Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim modal */}
      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="glass rounded-3xl p-8 w-full max-w-md animate-fadeInUp">
            <h2 className="text-xl font-black mb-2">Claim Your Profile</h2>
            <p className="text-gray-400 text-sm mb-6">
              Claiming links this person node to your account. Other family members will be asked to verify you.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Your Email</label>
                <input type="email" placeholder="you@example.com" className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.2)", color: "#f0ece3" }} />
              </div>
              <p className="text-xs text-gray-600">
                A verification email will be sent. Once 2+ relatives confirm, you receive the verified badge.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowClaim(false)}
                className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold">
                Cancel
              </button>
              <button onClick={() => setShowClaim(false)}
                className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold">
                Send Claim Request →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
