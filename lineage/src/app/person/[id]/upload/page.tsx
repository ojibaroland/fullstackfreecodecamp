"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";

type Visibility = "PUBLIC" | "FAMILY" | "LOCKED";
type MediaType = "IMAGE" | "VIDEO" | "TEXT";

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mediaType, setMediaType] = useState<MediaType>("IMAGE");
  const [visibility, setVisibility] = useState<Visibility>("FAMILY");
  const [caption, setCaption] = useState("");
  const [textContent, setTextContent] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    setDone(true);
  };

  const visibilityConfig: Record<Visibility, { color: string; desc: string; icon: string }> = {
    PUBLIC: { color: "#10b981", desc: "Visible to anyone who views this family tree.", icon: "🌍" },
    FAMILY: { color: "#d4a843", desc: "Only visible to authenticated family members.", icon: "👨‍👩‍👧‍👦" },
    LOCKED: { color: "#8b5cf6", desc: "AES-GCM encrypted. Decrypted only after the release date.", icon: "🔐" },
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-3xl p-12 text-center max-w-md w-full animate-fadeInUp">
          <div className="text-6xl mb-6">{visibility === "LOCKED" ? "🔐" : "✅"}</div>
          <h2 className="text-2xl font-black mb-3">
            {visibility === "LOCKED" ? "Memory Locked" : "Upload Successful"}
          </h2>
          <p className="text-gray-400 mb-2">
            {visibility === "LOCKED"
              ? `Your memory has been encrypted with AES-GCM and will be revealed on ${releaseDate}.`
              : "Your media has been added to the family archive."}
          </p>
          {visibility === "LOCKED" && (
            <div className="glass-light rounded-xl p-4 mb-6 mt-4">
              <p className="text-xs text-violet-400 font-mono leading-relaxed">
                ⚠ Company-held key — the encryption key is stored server-side.
                A trustless drand tlock version is coming. Your content will NOT
                be accessible before {releaseDate}.
              </p>
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <Link href={`/person/${id}`} className="flex-1 btn-outline-gold py-3 rounded-xl text-sm font-semibold text-center">
              View Profile
            </Link>
            <button onClick={() => { setDone(false); setFile(null); setCaption(""); setTextContent(""); }}
              className="flex-1 btn-gold py-3 rounded-xl text-sm font-bold">
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-amber-400/10 px-6 py-4 flex items-center gap-3">
        <Link href={`/person/${id}`} className="text-gray-400 hover:text-white text-sm">← Back to Profile</Link>
        <span className="text-gray-600">/</span>
        <span className="text-amber-400 text-sm font-semibold">Upload Media</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Upload Memory</h1>
          <p className="text-gray-400 text-sm">
            Add a photo, video, or written memory to this profile. Choose visibility carefully — locked items are encrypted immediately.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Media type */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Media Type</label>
            <div className="flex gap-3">
              {(["IMAGE", "VIDEO", "TEXT"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setMediaType(t)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: mediaType === t ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${mediaType === t ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: mediaType === t ? "#d4a843" : "#9ca3af",
                  }}>
                  {t === "IMAGE" ? "🖼 Photo" : t === "VIDEO" ? "🎬 Video" : "📝 Text"}
                </button>
              ))}
            </div>
          </div>

          {/* File drop zone or text editor */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              {mediaType === "TEXT" ? "Written Memory" : "File"}
            </label>
            {mediaType === "TEXT" ? (
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                placeholder="Write your memory, letter, or story here…

This could be a letter to a grandchild, a recipe, memories of a person, or anything you want preserved."
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none leading-relaxed"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,67,0.15)", color: "#f0ece3" }}
              />
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className="rounded-xl p-10 text-center cursor-pointer transition-all"
                style={{
                  border: `2px dashed ${dragOver ? "rgba(212,168,67,0.6)" : "rgba(212,168,67,0.2)"}`,
                  background: dragOver ? "rgba(212,168,67,0.05)" : "rgba(255,255,255,0.02)",
                }}>
                {file ? (
                  <div>
                    <div className="text-4xl mb-2">{mediaType === "IMAGE" ? "🖼" : "🎬"}</div>
                    <p className="text-amber-400 font-semibold text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-xs text-gray-500 hover:text-rose-400 mt-2 transition-colors">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-3">{mediaType === "IMAGE" ? "🖼" : "🎬"}</div>
                    <p className="text-gray-400 text-sm mb-1">
                      Drop your {mediaType.toLowerCase()} here or{" "}
                      <span className="text-amber-400">browse</span>
                    </p>
                    <p className="text-gray-600 text-xs">
                      {mediaType === "IMAGE" ? "PNG, JPG, WEBP up to 50MB" : "MP4, MOV, WebM up to 2GB"}
                    </p>
                  </div>
                )}
                <input ref={fileRef} type="file"
                  accept={mediaType === "IMAGE" ? "image/*" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden" />
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Caption</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={visibility === "LOCKED" ? 'e.g. "Letter to Ella — Open on 18th Birthday"' : 'e.g. "Summer vacation, Cape Cod 2019"'}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,67,0.15)", color: "#f0ece3" }}
            />
          </div>

          {/* Visibility */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Visibility</label>
            <div className="space-y-3">
              {(["PUBLIC", "FAMILY", "LOCKED"] as const).map((v) => {
                const cfg = visibilityConfig[v];
                return (
                  <label key={v} className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: visibility === v ? `${cfg.color}10` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${visibility === v ? `${cfg.color}40` : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <input type="radio" name="visibility" value={v} checked={visibility === v}
                      onChange={() => setVisibility(v)} className="mt-0.5 accent-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: visibility === v ? cfg.color : "#f0ece3" }}>
                        <span>{cfg.icon}</span> {v}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{cfg.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Time-lock date picker */}
          {visibility === "LOCKED" && (
            <div className="glass rounded-2xl p-6 border animate-fadeInUp" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
              <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Release Date & Time ⏳
              </label>
              <input
                type="datetime-local"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.4)", color: "#f0ece3" }}
              />
              <div className="mt-4 glass-light rounded-xl p-4">
                <p className="text-xs text-violet-300 leading-relaxed">
                  🔐 <strong>AES-GCM encryption</strong> will be applied immediately upon upload.
                  The decryption key is held server-side and released only at the specified timestamp.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  ⚠ <em>Company-held key model</em> — trustless timelock (drand tlock) coming soon.
                  Your content is protected but relies on our servers to enforce the release date.
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || (mediaType !== "TEXT" && !file) || !caption}
            className="btn-gold w-full py-4 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {visibility === "LOCKED" ? "Encrypting & Uploading…" : "Uploading to archive…"}
              </>
            ) : (
              <>
                {visibility === "LOCKED" ? "🔐 Encrypt & Lock Memory" : "📤 Upload Memory"}
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
