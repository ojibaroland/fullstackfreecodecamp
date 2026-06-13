"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 4,
}));

const FEATURES = [
  {
    icon: "🌳",
    title: "Living Family Tree",
    desc: "Explore 3D interactive ancestry graphs with animated connections spanning centuries.",
  },
  {
    icon: "⏳",
    title: "Time-Locked Memories",
    desc: "Encrypt messages and media to unlock at a future date — a letter to your grandchildren.",
  },
  {
    icon: "📸",
    title: "Shared Archive",
    desc: "Upload photos, videos, and stories with fine-grained visibility: public, family, or locked.",
  },
  {
    icon: "✅",
    title: "Verified by Relatives",
    desc: "Claim your person node and get a badge verified by your living relatives.",
  },
  {
    icon: "🔐",
    title: "AES-GCM Encryption",
    desc: "Time-locked media is encrypted server-side. Key is released only when the timestamp arrives.",
  },
  {
    icon: "📦",
    title: "Portable Export",
    desc: "Download your full family archive — tree + media manifest — any time. Your data outlives us.",
  },
];

function MiniTreePreview() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = [
    { id: "gf", x: 200, y: 50, name: "James", year: "1932", gen: 0 },
    { id: "gm", x: 350, y: 50, name: "Eleanor", year: "1935", gen: 0 },
    { id: "f", x: 275, y: 150, name: "Robert", year: "1958", gen: 1 },
    { id: "m", x: 420, y: 150, name: "Sarah", year: "1961", gen: 1 },
    { id: "u", x: 80, y: 150, name: "David", year: "1955", gen: 1 },
    { id: "a", x: 490, y: 260, name: "Mia", year: "1989", gen: 2 },
    { id: "b", x: 330, y: 260, name: "Liam", year: "1986", gen: 2 },
    { id: "c", x: 150, y: 260, name: "Noah", year: "1992", gen: 2 },
  ];

  const edges = [
    { from: "gf", to: "gm", type: "partner" },
    { from: "gf", to: "f", type: "parent" },
    { from: "gm", to: "f", type: "parent" },
    { from: "f", to: "m", type: "partner" },
    { from: "f", to: "b", type: "parent" },
    { from: "m", to: "b", type: "parent" },
    { from: "m", to: "a", type: "parent" },
    { from: "gf", to: "u", type: "parent" },
    { from: "u", to: "c", type: "parent" },
  ];

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const genColors = ["#d4a843", "#8b5cf6", "#f43f5e"];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: 310 }}>
      <svg width="600" height="310" className="w-full h-full" viewBox="0 0 600 310">
        {edges.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          if (!a || !b) return null;
          const isPartner = e.type === "partner";
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isPartner ? "rgba(212,168,67,0.4)" : "rgba(139,92,246,0.35)"}
              strokeWidth={isPartner ? 2 : 1.5}
              strokeDasharray={isPartner ? "6 3" : "none"}
              className="tree-line"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
        {nodes.map((n, i) => {
          const isHov = hovered === n.id;
          const color = genColors[n.gen] || "#d4a843";
          return (
            <g
              key={n.id}
              className="tree-node cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s` }}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                cx={n.x} cy={n.y} r={isHov ? 28 : 22}
                fill={isHov ? color : "rgba(26,31,53,0.9)"}
                stroke={color} strokeWidth={isHov ? 2.5 : 1.5}
                style={{ transition: "all 0.2s ease" }}
                filter={isHov ? `drop-shadow(0 0 8px ${color})` : undefined}
              />
              <text x={n.x} y={n.y - 3} textAnchor="middle"
                fill={isHov ? "#0c0a1a" : color} fontSize={10} fontWeight="700"
                style={{ transition: "all 0.2s ease" }}>
                {n.name}
              </text>
              <text x={n.x} y={n.y + 9} textAnchor="middle"
                fill={isHov ? "rgba(12,10,26,0.7)" : "rgba(156,163,175,0.8)"} fontSize={8}>
                {n.year}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 right-4 text-xs text-amber-400/50 font-mono">
        Interactive Preview ✦
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {STARS.map((s) => (
          <div key={s.id} className="star" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            "--duration": `${s.duration}s`, "--delay": `${s.delay}s`,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* Ambient orbs */}
      <div className="fixed pointer-events-none z-0 inset-0">
        <div className="absolute rounded-full blur-3xl opacity-15 animate-float" style={{ left: "5%", top: "15%", width: 500, height: 500, background: "#d4a843" }} />
        <div className="absolute rounded-full blur-3xl opacity-10 animate-float" style={{ left: "70%", top: "40%", width: 600, height: 600, background: "#8b5cf6", animationDelay: "1.5s" }} />
        <div className="absolute rounded-full blur-3xl opacity-10 animate-float" style={{ left: "40%", top: "70%", width: 400, height: 400, background: "#f43f5e", animationDelay: "3s" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 glass border-b border-amber-400/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full" style={{ background: "linear-gradient(135deg, #d4a843, #8b5cf6)" }} />
          <span className="text-xl font-bold text-gold-gradient">Lineage</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/#features" className="hover:text-amber-400 transition-colors">Features</Link>
          <Link href="/#security" className="hover:text-amber-400 transition-colors">Security</Link>
          <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Demo</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="btn-outline-gold px-5 py-2 rounded-lg text-sm font-semibold">Sign In</Link>
          <Link href="/auth" className="btn-gold px-5 py-2 rounded-lg text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fadeInUp"
          style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
          Open Beta — Preserve your family&apos;s story for generations
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl animate-fadeInUp"
          style={{ animationDelay: "0.1s", opacity: 0 }}>
          Your family&apos;s history,{" "}
          <span className="text-gold-gradient">preserved across time</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed animate-fadeInUp"
          style={{ animationDelay: "0.2s", opacity: 0 }}>
          Lineage is a collaborative family archive where you build a living 3D tree,
          share memories, and set time-locks on messages — a letter that opens on your
          grandchild&apos;s 18th birthday.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fadeInUp"
          style={{ animationDelay: "0.3s", opacity: 0 }}>
          <Link href="/auth" className="btn-gold px-8 py-4 rounded-xl text-base font-bold inline-block" style={{ minWidth: 220 }}>
            Start Your Family Tree →
          </Link>
          <Link href="/dashboard" className="btn-outline-gold px-8 py-4 rounded-xl text-base font-semibold inline-block">
            View Demo Tree
          </Link>
        </div>

        {/* Preview card */}
        <div className="w-full max-w-2xl glass rounded-2xl p-6 animate-fadeInUp"
          style={{
            animationDelay: "0.4s", opacity: 0,
            transform: `perspective(1000px) rotateX(${-mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg)`,
            transition: "transform 0.1s ease-out",
          }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-500 font-mono">
              Johnson Family Tree • 3 Generations • Hover nodes to explore
            </span>
          </div>
          <MiniTreePreview />
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-12">
        <div className="flex flex-wrap justify-center gap-12 px-8">
          {[
            { value: "3 Generations", label: "Demo Family Included" },
            { value: "AES-256-GCM", label: "Encryption Standard" },
            { value: "Time-Locks", label: "Future Messages" },
            { value: "JSON Export", label: "Portable Archive" },
          ].map((s, i) => (
            <div key={i} className="text-center animate-fadeInUp" style={{ animationDelay: `${0.5 + i * 0.1}s`, opacity: 0 }}>
              <div className="text-2xl font-black text-gold-gradient">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Everything your family needs</h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            Built to last decades, not just until our next funding round.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-amber-400/30 transition-all duration-300 group cursor-default animate-fadeInUp"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-amber-200">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time-lock explainer */}
      <section id="security" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-10 border" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="text-6xl">⏳</div>
              <div>
                <h3 className="text-2xl font-black mb-3 text-violet-300">How Time-Locks Work</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Each locked media item is encrypted with a unique AES-GCM key before upload.
                  The key is held server-side. At the exact{" "}
                  <code className="text-amber-400 font-mono">releaseAt</code> timestamp, our cron
                  job flips status to{" "}
                  <code className="text-green-400 font-mono">RELEASED</code> and the content
                  becomes accessible.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono"
                  style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843" }}>
                  ⚠ Company-held key — trustless drand tlock version coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="inline-block rounded-3xl p-16 max-w-2xl mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,67,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(212,168,67,0.2)",
          }}>
          <h2 className="text-4xl font-black mb-4">
            Your family&apos;s story{" "}
            <span className="text-gold-gradient">deserves to last</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">Start building your archive today. Export anytime. No lock-in.</p>
          <Link href="/auth" className="btn-gold px-10 py-4 rounded-xl text-lg font-bold inline-block">
            Create Your Family Archive →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-400/10 py-8 px-8 text-center text-gray-600 text-sm">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Demo</Link>
          <Link href="/#security" className="hover:text-amber-400 transition-colors">Security</Link>
          <Link href="/family/johnson/export" className="hover:text-amber-400 transition-colors">Data Export</Link>
        </div>
        <p>© 2026 Lineage — Built to outlive us. <span className="text-amber-400/60">Your data, always portable.</span></p>
      </footer>
    </main>
  );
}
