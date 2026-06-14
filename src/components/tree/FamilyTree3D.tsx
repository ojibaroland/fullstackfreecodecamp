"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface PersonNode {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  bio?: string;
  claimed: boolean;
  claimedBy?: string;
  verifiedCount: number;
  generation: number;
  gender?: "male" | "female" | "other";
  hasMedia: boolean;
  mediaCount: number;
  timeLockCount: number;
}

export interface TreeEdge {
  from: string;
  to: string;
  type: "PARENT_OF" | "PARTNER_OF";
}

interface LayoutNode extends PersonNode {
  x: number;
  y: number;
}

const GEN_COLORS: Record<number, string> = {
  0: "#d4a843",
  1: "#8b5cf6",
  2: "#f43f5e",
  3: "#06b6d4",
  4: "#10b981",
};

function getColor(gen: number) {
  return GEN_COLORS[gen % 5] ?? "#d4a843";
}

const DEMO_PEOPLE: PersonNode[] = [
  { id: "gf", name: "James Johnson", birthYear: 1932, deathYear: 2010, bio: "WWII veteran, farmer, patriarch.", claimed: false, verifiedCount: 5, generation: 0, gender: "male", hasMedia: true, mediaCount: 12, timeLockCount: 0 },
  { id: "gm", name: "Eleanor Johnson", birthYear: 1935, bio: "Schoolteacher for 40 years.", claimed: true, claimedBy: "Eleanor's daughter", verifiedCount: 4, generation: 0, gender: "female", hasMedia: true, mediaCount: 8, timeLockCount: 1 },
  { id: "f", name: "Robert Johnson", birthYear: 1958, bio: "Engineer, chess champion.", claimed: true, claimedBy: "Robert", verifiedCount: 3, generation: 1, gender: "male", hasMedia: true, mediaCount: 15, timeLockCount: 2 },
  { id: "m", name: "Sarah Johnson", birthYear: 1961, bio: "Pediatric nurse, avid gardener.", claimed: true, claimedBy: "Sarah", verifiedCount: 3, generation: 1, gender: "female", hasMedia: true, mediaCount: 9, timeLockCount: 0 },
  { id: "u", name: "David Johnson", birthYear: 1955, bio: "Architect based in Portland.", claimed: false, verifiedCount: 2, generation: 1, gender: "male", hasMedia: true, mediaCount: 5, timeLockCount: 0 },
  { id: "a1", name: "Kate Johnson", birthYear: 1980, bio: "Yoga instructor, world traveler.", claimed: false, verifiedCount: 1, generation: 2, gender: "female", hasMedia: true, mediaCount: 6, timeLockCount: 1 },
  { id: "liam", name: "Liam Johnson", birthYear: 1986, bio: "Software engineer in NYC.", claimed: true, claimedBy: "Liam", verifiedCount: 4, generation: 2, gender: "male", hasMedia: true, mediaCount: 11, timeLockCount: 3 },
  { id: "mia", name: "Mia Johnson", birthYear: 1989, bio: "Graphic designer, mom of two.", claimed: true, claimedBy: "Mia", verifiedCount: 2, generation: 2, gender: "female", hasMedia: true, mediaCount: 7, timeLockCount: 0 },
  { id: "noah", name: "Noah Johnson", birthYear: 1992, bio: "Med student at Columbia.", claimed: false, verifiedCount: 1, generation: 2, gender: "male", hasMedia: false, mediaCount: 0, timeLockCount: 0 },
  { id: "c1", name: "Ella Johnson", birthYear: 2015, bio: "Loves dinosaurs and painting.", claimed: false, verifiedCount: 0, generation: 3, gender: "female", hasMedia: true, mediaCount: 3, timeLockCount: 2 },
  { id: "c2", name: "Owen Johnson", birthYear: 2018, bio: "Future soccer star.", claimed: false, verifiedCount: 0, generation: 3, gender: "male", hasMedia: true, mediaCount: 2, timeLockCount: 1 },
];

const DEMO_EDGES: TreeEdge[] = [
  { from: "gf", to: "gm", type: "PARTNER_OF" },
  { from: "gf", to: "f", type: "PARENT_OF" },
  { from: "gm", to: "f", type: "PARENT_OF" },
  { from: "gf", to: "u", type: "PARENT_OF" },
  { from: "gm", to: "u", type: "PARENT_OF" },
  { from: "f", to: "m", type: "PARTNER_OF" },
  { from: "f", to: "liam", type: "PARENT_OF" },
  { from: "m", to: "liam", type: "PARENT_OF" },
  { from: "f", to: "mia", type: "PARENT_OF" },
  { from: "m", to: "mia", type: "PARENT_OF" },
  { from: "u", to: "noah", type: "PARENT_OF" },
  { from: "u", to: "a1", type: "PARENT_OF" },
  { from: "liam", to: "c1", type: "PARENT_OF" },
  { from: "liam", to: "c2", type: "PARENT_OF" },
];

function computeLayout(people: PersonNode[]): LayoutNode[] {
  const byGen: Record<number, PersonNode[]> = {};
  for (const p of people) {
    (byGen[p.generation] ??= []).push(p);
  }
  const H_SPACING = 160;
  const V_SPACING = 140;
  const laid: LayoutNode[] = [];
  const gens = Object.keys(byGen).map(Number).sort();
  for (const gen of gens) {
    const members = byGen[gen];
    const total = members.length;
    members.forEach((p, idx) => {
      const x = (idx - (total - 1) / 2) * H_SPACING;
      const y = gen * V_SPACING;
      laid.push({ ...p, x, y });
    });
  }
  return laid;
}

interface TooltipState {
  x: number;
  y: number;
  person: LayoutNode;
}

export default function FamilyTree3D({
  people = DEMO_PEOPLE,
  edges = DEMO_EDGES,
  familyId = "johnson",
}: {
  people?: PersonNode[];
  edges?: TreeEdge[];
  familyId?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [layoutNodes, setLayoutNodes] = useState<LayoutNode[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, tx: 0, ty: 0 });
  const [filter, setFilter] = useState<"ALL" | "CLAIMED" | "TIMELOCKED">("ALL");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLayoutNodes(computeLayout(people));
  }, [people]);

  const nodeMap = Object.fromEntries(layoutNodes.map((n) => [n.id, n]));

  const filteredIds = new Set(
    layoutNodes
      .filter((n) => {
        if (filter === "CLAIMED") return n.claimed;
        if (filter === "TIMELOCKED") return n.timeLockCount > 0;
        return true;
      })
      .map((n) => n.id)
  );

  // Mouse parallax tilt
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltX(cy * 8);
    setTiltY(-cx * 8);

    if (isDragging) {
      setTransform((t) => ({
        ...t,
        x: dragStart.tx + (e.clientX - dragStart.x),
        y: dragStart.ty + (e.clientY - dragStart.y),
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
    setHovered(null);
    setTooltip(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => ({ ...t, scale: Math.max(0.3, Math.min(3, t.scale * delta)) }));
  };

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest(".tree-node-g")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y });
  };

  const handleSvgMouseUp = () => setIsDragging(false);

  const handleNodeHover = (node: LayoutNode, e: React.MouseEvent) => {
    setHovered(node.id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10, person: node });
    }
  };

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });
  const zoomIn = () => setTransform((t) => ({ ...t, scale: Math.min(3, t.scale * 1.2) }));
  const zoomOut = () => setTransform((t) => ({ ...t, scale: Math.max(0.3, t.scale / 1.2) }));

  const svgW = 900;
  const svgH = 580;
  const midX = svgW / 2;
  const midY = svgH / 2 - 40;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{
        height: 600,
        background: "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.06) 0%, rgba(12,10,26,0.95) 70%)",
        border: "1px solid rgba(212,168,67,0.12)",
        cursor: isDragging ? "grabbing" : "grab",
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isDragging ? "none" : "transform 0.15s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleSvgMouseDown}
      onMouseUp={handleSvgMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid lines (depth effect) */}
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(212,168,67,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button onClick={zoomIn} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-amber-400 hover:bg-amber-400/20 transition-colors text-lg font-bold">+</button>
        <button onClick={zoomOut} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-amber-400 hover:bg-amber-400/20 transition-colors text-lg font-bold">−</button>
        <button onClick={resetView} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xs">⊙</button>
      </div>

      {/* Filter chips */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {(["ALL", "CLAIMED", "TIMELOCKED"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === f ? "rgba(212,168,67,0.2)" : "rgba(26,31,53,0.8)",
              border: `1px solid ${filter === f ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.08)"}`,
              color: filter === f ? "#d4a843" : "#9ca3af",
            }}>
            {f === "ALL" ? "All Members" : f === "CLAIMED" ? "✅ Claimed" : "⏳ Time-Locked"}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 glass rounded-xl p-3">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Generations</p>
        {[0, 1, 2, 3].map((g) => (
          <div key={g} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: getColor(g) }} />
            <span className="text-xs text-gray-400">Gen {g === 0 ? "1 (Great-grands)" : g === 1 ? "2 (Grandparents)" : g === 2 ? "3 (Parents)" : "4 (Children)"}</span>
          </div>
        ))}
        <div className="mt-1 pt-1 border-t border-white/5 flex items-center gap-3">
          <div className="flex items-center gap-1"><div className="w-6 border-t border-amber-400/50 border-dashed" /><span className="text-xs text-gray-500">Partner</span></div>
          <div className="flex items-center gap-1"><div className="w-6 border-t border-violet-400/50" /><span className="text-xs text-gray-500">Parent</span></div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-20 text-xs text-gray-600 text-right">
        <p>Scroll to zoom • Drag to pan</p>
        <p>Hover for details • Click to visit</p>
      </div>

      {/* Main SVG */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="absolute inset-0"
      >
        <g transform={`translate(${midX + transform.x}, ${midY + transform.y}) scale(${transform.scale})`}>
          {/* Edges */}
          {edges.map((e, i) => {
            const a = nodeMap[e.from];
            const b = nodeMap[e.to];
            if (!a || !b) return null;
            const visible = filteredIds.has(e.from) && filteredIds.has(e.to);
            const isPartner = e.type === "PARTNER_OF";
            const x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
            const mx = (x1 + x2) / 2;
            const my = isPartner ? (y1 + y2) / 2 : Math.min(y1, y2) + Math.abs(y2 - y1) * 0.5;
            const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={isPartner ? "rgba(212,168,67,0.4)" : "rgba(139,92,246,0.3)"}
                strokeWidth={isPartner ? 2 : 1.5}
                strokeDasharray={isPartner ? "8 4" : "none"}
                opacity={visible ? 1 : 0.1}
                className="tree-line"
                style={{ animationDelay: `${i * 0.08}s`, transition: "opacity 0.3s" }}
              />
            );
          })}

          {/* Nodes */}
          {layoutNodes.map((node, i) => {
            const isHov = hovered === node.id;
            const isSel = selected === node.id;
            const color = getColor(node.generation);
            const visible = filteredIds.has(node.id);
            const r = isHov || isSel ? 36 : 28;
            return (
              <g
                key={node.id}
                className="tree-node tree-node-g"
                onClick={() => setSelected(node.id === selected ? null : node.id)}
                onMouseEnter={(e) => handleNodeHover(node, e)}
                onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                style={{
                  cursor: "pointer",
                  opacity: visible ? 1 : 0.15,
                  transition: "opacity 0.3s",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                {/* Glow ring */}
                {(isHov || isSel) && (
                  <circle cx={node.x} cy={node.y} r={r + 12}
                    fill="none" stroke={color} strokeWidth={1} opacity={0.2}
                    style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
                )}
                {/* Node circle */}
                <circle cx={node.x} cy={node.y} r={r}
                  fill={isHov || isSel ? color : "rgba(26,31,53,0.95)"}
                  stroke={color}
                  strokeWidth={isSel ? 3 : isHov ? 2 : 1.5}
                  style={{
                    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                    filter: isHov ? `drop-shadow(0 0 12px ${color})` : "none",
                  }}
                />
                {/* Avatar initials */}
                <text x={node.x} y={node.y - 5} textAnchor="middle"
                  fill={isHov || isSel ? "#0c0a1a" : color}
                  fontSize={isHov ? 13 : 11} fontWeight="800"
                  style={{ transition: "all 0.2s ease", pointerEvents: "none" }}>
                  {node.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </text>
                {/* Year */}
                <text x={node.x} y={node.y + 8} textAnchor="middle"
                  fill={isHov || isSel ? "rgba(12,10,26,0.75)" : "rgba(156,163,175,0.7)"}
                  fontSize={8}
                  style={{ pointerEvents: "none" }}>
                  {node.birthYear}{node.deathYear ? `–${node.deathYear}` : ""}
                </text>
                {/* Name label below */}
                <text x={node.x} y={node.y + r + 14} textAnchor="middle"
                  fill={isHov ? "#f0ece3" : "rgba(240,236,227,0.6)"}
                  fontSize={9} fontWeight="600"
                  style={{ transition: "all 0.2s", pointerEvents: "none" }}>
                  {node.name.split(" ")[0]}
                </text>

                {/* Badges */}
                {node.claimed && (
                  <circle cx={node.x + r - 4} cy={node.y - r + 4} r={7}
                    fill="#10b981" stroke="#0c0a1a" strokeWidth={1.5} />
                )}
                {node.timeLockCount > 0 && (
                  <circle cx={node.x - r + 4} cy={node.y - r + 4} r={7}
                    fill="#8b5cf6" stroke="#0c0a1a" strokeWidth={1.5} />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div className="tooltip pointer-events-none animate-fadeIn" style={{ left: tooltip.x, top: tooltip.y, maxWidth: 220 }}>
          <p className="font-bold text-amber-400">{tooltip.person.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {tooltip.person.birthYear}
            {tooltip.person.deathYear ? ` – ${tooltip.person.deathYear}` : " – present"}
          </p>
          {tooltip.person.bio && (
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{tooltip.person.bio}</p>
          )}
          <div className="flex gap-3 mt-2 pt-2 border-t border-white/10">
            {tooltip.person.claimed && (
              <span className="text-xs text-green-400">✅ Claimed</span>
            )}
            {tooltip.person.mediaCount > 0 && (
              <span className="text-xs text-amber-400">📸 {tooltip.person.mediaCount}</span>
            )}
            {tooltip.person.timeLockCount > 0 && (
              <span className="text-xs text-violet-400">⏳ {tooltip.person.timeLockCount}</span>
            )}
          </div>
          <p className="text-gray-600 text-xs mt-1">Click to visit profile →</p>
        </div>
      )}

      {/* Selected person panel */}
      {selected && nodeMap[selected] && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-fadeInUp">
          <div className="glass rounded-2xl px-6 py-4 flex items-center gap-6" style={{ minWidth: 340 }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg"
              style={{ background: getColor(nodeMap[selected].generation), color: "#0c0a1a" }}>
              {nodeMap[selected].name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="font-bold">{nodeMap[selected].name}</p>
              <p className="text-xs text-gray-400">
                b. {nodeMap[selected].birthYear}
                {nodeMap[selected].claimed && " · ✅ Claimed"}
                {nodeMap[selected].verifiedCount > 0 && ` · Verified by ${nodeMap[selected].verifiedCount}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/person/${selected}`}
                className="btn-gold px-4 py-2 rounded-lg text-xs font-bold"
                onClick={(e) => e.stopPropagation()}>
                View Profile →
              </Link>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white text-sm">
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
