"use client";

import { useState, useCallback } from "react";

const MOODS = [
  "Heartbreak",
  "Hype",
  "Spiritual",
  "Romantic",
  "Rage",
  "Introspective",
  "Triumphant",
  "Melancholy",
];

const LANGUAGES = [
  "English",
  "Nigerian Pidgin",
  "Afrobeats Slang",
  "Mixed (Pidgin + English)",
];

const SECTIONS = ["Verse", "Chorus", "Hook", "Bridge", "Pre-Chorus", "Outro"];

const RHYTHM_EXAMPLES = [
  "ti ti ti tii ta",
  "ta ti ti ta ti ta",
  "ti ta ti ti ta",
  "ta ta ti ti ti ta",
  "ti ti ta ta ti ti ta",
];

export default function LyricsGenerator() {
  const [rhythm, setRhythm] = useState("");
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("");
  const [section, setSection] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(async () => {
    if (!rhythm.trim() || !mood || !language || !section) {
      setError("Fill in all fields to generate.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rhythm, mood, language, section }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setLyrics(data.lyrics);
      setHasGenerated(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [rhythm, mood, language, section]);

  const randomExample = () => {
    const ex = RHYTHM_EXAMPLES[Math.floor(Math.random() * RHYTHM_EXAMPLES.length)];
    setRhythm(ex);
  };

  return (
    <div className="lyrics-page">
      <div className="lyrics-container">
        {/* Header */}
        <header className="lyrics-header">
          <div className="header-tag">AI SONGWRITER</div>
          <h1 className="lyrics-title">LYRIC<span className="accent">FORGE</span></h1>
          <p className="lyrics-subtitle">
            Drop a rhythm pattern. Set the vibe. Watch the words come alive.
          </p>
        </header>

        <div className="forge-layout">
          {/* Input Panel */}
          <div className="input-panel">

            {/* Rhythm Input */}
            <div className="field-group">
              <div className="field-label-row">
                <label className="field-label">RHYTHM PATTERN</label>
                <button className="example-btn" onClick={randomExample} type="button">
                  random example
                </button>
              </div>
              <input
                className="rhythm-input"
                type="text"
                value={rhythm}
                onChange={(e) => setRhythm(e.target.value)}
                placeholder="ti ti ta ti ti tii ta"
              />
              <div className="field-hint">
                <span className="hint-chip">ti</span> short &nbsp;
                <span className="hint-chip">tii</span> medium &nbsp;
                <span className="hint-chip">ta</span> long/stressed
              </div>
            </div>

            {/* Mood */}
            <div className="field-group">
              <label className="field-label">MOOD / VIBE</label>
              <div className="pill-grid">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`pill ${mood === m ? "pill-active" : ""}`}
                    onClick={() => setMood(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="field-group">
              <label className="field-label">LANGUAGE FLAVOR</label>
              <div className="pill-grid">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`pill ${language === l ? "pill-active" : ""}`}
                    onClick={() => setLanguage(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Song Section */}
            <div className="field-group">
              <label className="field-label">SONG SECTION</label>
              <div className="pill-grid">
                {SECTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pill ${section === s ? "pill-active" : ""}`}
                    onClick={() => setSection(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && <div className="error-msg">{error}</div>}

            {/* Generate Button */}
            <button
              className={`generate-btn ${loading ? "loading" : ""}`}
              onClick={generate}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <span className="btn-inner">
                  <span className="spinner" />
                  FORGING LYRICS...
                </span>
              ) : hasGenerated ? (
                <span className="btn-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.56" />
                  </svg>
                  REGENERATE
                </span>
              ) : (
                <span className="btn-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  FORGE LYRICS
                </span>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="output-panel">
            {!hasGenerated && !loading && (
              <div className="output-placeholder">
                <div className="placeholder-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <p className="placeholder-text">Your lyrics will appear here</p>
                <p className="placeholder-sub">Heavy. Orbital. Street-philosophical.</p>
              </div>
            )}

            {loading && (
              <div className="output-loading">
                <div className="loading-dots">
                  <span /><span /><span />
                </div>
                <p className="loading-text">Channeling the frequency...</p>
              </div>
            )}

            {hasGenerated && !loading && lyrics && (
              <div className="lyrics-output">
                <div className="output-meta">
                  <span className="meta-tag">{section}</span>
                  <span className="meta-tag">{mood}</span>
                  <span className="meta-tag">{language}</span>
                </div>
                <div className="lyrics-text">
                  {lyrics.split("\n").filter(l => l.trim()).map((line, i) => (
                    <p key={i} className="lyric-line">{line}</p>
                  ))}
                </div>
                <div className="rhythm-ref">
                  <span className="rhythm-label">Rhythm:</span>
                  <span className="rhythm-value">{rhythm}</span>
                </div>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(lyrics)}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  COPY LYRICS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .lyrics-page {
          min-height: 100vh;
          background: #080810;
          padding: 40px 20px 80px;
          position: relative;
          overflow-x: hidden;
        }

        .lyrics-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 20% 10%, rgba(120, 80, 255, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 90%, rgba(255, 90, 120, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .lyrics-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .lyrics-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .header-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #7c5cfc;
          background: rgba(124, 92, 252, 0.12);
          border: 1px solid rgba(124, 92, 252, 0.25);
          border-radius: 20px;
          padding: 4px 14px;
          margin-bottom: 16px;
        }

        .lyrics-title {
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #f0ece3;
          margin: 0 0 12px;
          line-height: 1;
        }

        .lyrics-title .accent {
          color: #7c5cfc;
        }

        .lyrics-subtitle {
          font-size: 16px;
          color: rgba(240, 236, 227, 0.4);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .forge-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .forge-layout {
            grid-template-columns: 1fr;
          }
        }

        .input-panel {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .field-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(240, 236, 227, 0.5);
        }

        .example-btn {
          font-size: 11px;
          color: #7c5cfc;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 3px;
          opacity: 0.8;
          transition: opacity 0.15s;
        }
        .example-btn:hover { opacity: 1; }

        .rhythm-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 14px 16px;
          color: #f0ece3;
          font-size: 18px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          letter-spacing: 0.12em;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .rhythm-input::placeholder { color: rgba(240, 236, 227, 0.2); }
        .rhythm-input:focus {
          border-color: rgba(124, 92, 252, 0.5);
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.1);
        }

        .field-hint {
          font-size: 12px;
          color: rgba(240, 236, 227, 0.3);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hint-chip {
          background: rgba(124, 92, 252, 0.15);
          border: 1px solid rgba(124, 92, 252, 0.2);
          border-radius: 4px;
          padding: 1px 7px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #a78bfa;
          font-weight: 700;
        }

        .pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pill {
          padding: 7px 16px;
          border-radius: 40px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(240, 236, 227, 0.6);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .pill:hover {
          background: rgba(124, 92, 252, 0.1);
          border-color: rgba(124, 92, 252, 0.3);
          color: #f0ece3;
        }
        .pill-active {
          background: rgba(124, 92, 252, 0.2) !important;
          border-color: rgba(124, 92, 252, 0.6) !important;
          color: #c4b5fd !important;
          box-shadow: 0 0 12px rgba(124, 92, 252, 0.2);
        }

        .error-msg {
          font-size: 13px;
          color: #f87171;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 8px;
          padding: 10px 14px;
        }

        .generate-btn {
          padding: 16px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.15em;
          background: linear-gradient(135deg, #7c5cfc, #9d6fff);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .generate-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .generate-btn:hover::before { opacity: 1; }
        .generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124, 92, 252, 0.4);
        }
        .generate-btn:active { transform: translateY(0); }
        .generate-btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Output Panel */
        .output-panel {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: sticky;
          top: 24px;
          overflow: hidden;
        }

        .output-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124, 92, 252, 0.4), transparent);
        }

        .output-placeholder {
          text-align: center;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .placeholder-icon { margin-bottom: 8px; }

        .placeholder-text {
          font-size: 16px;
          color: rgba(240, 236, 227, 0.3);
          margin: 0;
          font-weight: 500;
        }

        .placeholder-sub {
          font-size: 13px;
          color: rgba(240, 236, 227, 0.18);
          margin: 0;
          font-style: italic;
          letter-spacing: 0.05em;
        }

        .output-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px;
        }

        .loading-dots {
          display: flex;
          gap: 6px;
        }
        .loading-dots span {
          width: 8px;
          height: 8px;
          background: #7c5cfc;
          border-radius: 50%;
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .loading-text {
          font-size: 14px;
          color: rgba(240, 236, 227, 0.4);
          letter-spacing: 0.08em;
          margin: 0;
        }

        .lyrics-output {
          width: 100%;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .output-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .meta-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #7c5cfc;
          background: rgba(124, 92, 252, 0.12);
          border: 1px solid rgba(124, 92, 252, 0.2);
          border-radius: 20px;
          padding: 3px 12px;
          text-transform: uppercase;
        }

        .lyrics-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lyric-line {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 700;
          line-height: 1.55;
          color: #f0ece3;
          margin: 0;
          letter-spacing: 0.01em;
          font-style: italic;
        }

        .rhythm-ref {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .rhythm-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(240, 236, 227, 0.3);
          text-transform: uppercase;
        }

        .rhythm-value {
          font-size: 13px;
          font-family: 'Courier New', monospace;
          color: rgba(167, 139, 250, 0.7);
          letter-spacing: 0.1em;
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(240, 236, 227, 0.4);
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.15s;
          align-self: flex-start;
        }
        .copy-btn:hover {
          color: #f0ece3;
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </div>
  );
}
