"use client";

import { useState } from "react";
import Link from "next/link";

const SAMPLE_EXPORT = {
  format: "lineage-archive-v1",
  exportedAt: "2026-06-13T20:00:00Z",
  family: { id: "johnson", name: "Johnson Family", createdAt: "2024-01-15T10:00:00Z" },
  people: [
    { id: "gf", displayName: "James Johnson", birthYear: 1932, deathYear: 2010, bio: "WWII veteran, farmer.", generation: 0 },
    { id: "gm", displayName: "Eleanor Johnson", birthYear: 1935, bio: "Schoolteacher for 40 years.", generation: 0 },
    { id: "f", displayName: "Robert Johnson", birthYear: 1958, bio: "Engineer, chess champion.", generation: 1, claimedByEmail: "robert@example.com" },
  ],
  relationships: [
    { from: "gf", to: "gm", type: "PARTNER_OF" },
    { from: "gf", to: "f", type: "PARENT_OF" },
    { from: "gm", to: "f", type: "PARENT_OF" },
  ],
  media: [
    { id: "m1", personId: "gf", type: "IMAGE", caption: "Korean War, 1952", visibility: "PUBLIC", s3Key: "media/gf/m1.jpg" },
    { id: "m2", personId: "liam", type: "TEXT", caption: "Letter to Ella", visibility: "LOCKED", releaseAt: "2033-04-03T00:00:00Z", note: "Content encrypted — key held server-side" },
  ],
  timeLocks: [
    { id: "tl1", mediaItemId: "m2", releaseAt: "2033-04-03T00:00:00Z", status: "LOCKED" },
  ],
};

export default function ExportClient({ id }: { id: string }) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const familyName = id === "johnson" ? "Johnson Family" : `${id} Family`;

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExporting(false);
    setExported(true);
    const blob = new Blob([JSON.stringify(SAMPLE_EXPORT, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lineage-${id}-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-amber-400/10 px-6 py-4 flex items-center gap-3">
        <Link href={`/family/${id}/tree`} className="text-gray-400 hover:text-white text-sm">← Back to Tree</Link>
        <span className="text-gray-600">/</span>
        <span className="text-amber-400 text-sm font-semibold">Export Archive</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-3xl font-black mb-2">
            Export <span className="text-gold-gradient">{familyName}</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            Download your complete family archive as a structured JSON file including the full tree,
            media metadata, relationship graph, and time-lock manifests.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">What&apos;s Included</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "👥", title: "All Person Nodes", desc: "Names, birth/death years, bios, claim status" },
              { icon: "🔗", title: "Relationship Graph", desc: "PARENT_OF and PARTNER_OF edges" },
              { icon: "📸", title: "Media Manifest", desc: "Captions, types, visibility, S3 keys (not files)" },
              { icon: "⏳", title: "Time-Lock Records", desc: "Release dates and current status" },
              { icon: "✅", title: "Verification Records", desc: "Who verified who and when" },
              { icon: "📅", title: "Full Metadata", desc: "Timestamps, family ID, export format version" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6 border" style={{ borderColor: "rgba(212,168,67,0.2)" }}>
          <h2 className="font-bold text-lg mb-4">⚠ Important Notes</h2>
          <div className="space-y-3 text-sm text-gray-400">
            <p><strong className="text-amber-300">Locked media content</strong> is NOT included — only the manifest.</p>
            <p><strong className="text-amber-300">Media files</strong> are referenced by S3 key but not bundled.</p>
            <p><strong className="text-amber-300">Format:</strong>{" "}
              <code className="text-violet-400 font-mono">lineage-archive-v1</code> — re-importable to any future Lineage instance.</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Format Preview</h2>
            <button onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              {showPreview ? "Hide" : "Show"} Preview
            </button>
          </div>
          {showPreview ? (
            <pre className="text-xs text-green-300 font-mono overflow-x-auto rounded-xl p-4 leading-relaxed"
              style={{ background: "rgba(0,0,0,0.4)", maxHeight: 400, overflowY: "auto" }}>
              {JSON.stringify(SAMPLE_EXPORT, null, 2)}
            </pre>
          ) : (
            <div className="rounded-xl px-4 py-3 text-xs font-mono text-gray-500"
              style={{ background: "rgba(0,0,0,0.4)" }}>
              <span className="text-violet-400">{"{"}</span>{" "}
              <span className="text-amber-400">&quot;format&quot;</span>: <span className="text-green-400">&quot;lineage-archive-v1&quot;</span>,{" "}
              <span className="text-amber-400">&quot;people&quot;</span>: [...], <span className="text-amber-400">&quot;relationships&quot;</span>: [...]{" "}
              <span className="text-violet-400">{"}"}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[{ label: "People", value: "11" }, { label: "Relationships", value: "14" }, { label: "Media Items", value: "47" }, { label: "Time-Locks", value: "3" }].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-gold-gradient">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={handleExport} disabled={exporting}
          className="btn-gold w-full py-4 rounded-xl font-bold text-base disabled:opacity-50 flex items-center justify-center gap-2 mb-4">
          {exporting ? (
            <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>Generating archive…</>
          ) : exported ? "✅ Downloaded! Export again?" : "📦 Download Archive JSON"}
        </button>
        <p className="text-center text-xs text-gray-600">Your data is always yours. We will never hold it hostage. 🤝</p>
      </main>
    </div>
  );
}
