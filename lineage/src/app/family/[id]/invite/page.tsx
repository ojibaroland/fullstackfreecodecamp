"use client";

import { use, useState } from "react";
import Link from "next/link";

const PENDING_INVITES = [
  { email: "noah.j@example.com", person: "Noah Johnson", sentAt: "3 days ago", status: "PENDING" },
  { email: "kate.j@example.com", person: "Kate Johnson", sentAt: "1 week ago", status: "PENDING" },
  { email: "grandma.eleanor@gmail.com", person: "Eleanor Johnson", sentAt: "2 weeks ago", status: "ACCEPTED" },
];

const UNCLAIMED_NODES = [
  { id: "gf", name: "James Johnson", birthYear: "1932", note: "Deceased — add a memory on their behalf" },
  { id: "noah", name: "Noah Johnson", birthYear: "1992", note: "Invite pending" },
  { id: "u", name: "David Johnson", birthYear: "1955", note: "Not yet invited" },
  { id: "a1", name: "Kate Johnson", birthYear: "1980", note: "Invite pending" },
];

export default function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [email, setEmail] = useState("");
  const [personNode, setPersonNode] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const familyName = id === "johnson" ? "Johnson Family" : `${id} Family`;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent((s) => [...s, email]);
    setEmail("");
    setPersonNode("");
  };

  const copyLink = () => {
    const link = `https://lineage.app/join/${id}/abc123token`;
    setShareLink(link);
    navigator.clipboard?.writeText(link).catch(() => {});
  };

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-amber-400/10 px-6 py-4 flex items-center gap-3">
        <Link href={`/family/${id}/tree`} className="text-gray-400 hover:text-white text-sm">← Back to Tree</Link>
        <span className="text-gray-600">/</span>
        <span className="text-amber-400 text-sm font-semibold">Invite Relatives</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">
            Invite Relatives to <span className="text-gold-gradient">{familyName}</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Send magic-link invitations by email. Each invitee can claim a person node in the tree
            and add their own memories. Relatives with claimed nodes become verified members.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Invite form */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Send Email Invitation</h2>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Relative&apos;s Email
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="relative@example.com" required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,168,67,0.2)", color: "#f0ece3" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                    Link to Person Node <span className="text-gray-600 normal-case">(optional)</span>
                  </label>
                  <select
                    value={personNode} onChange={(e) => setPersonNode(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(26,31,53,0.9)", border: "1px solid rgba(212,168,67,0.2)", color: "#f0ece3" }}>
                    <option value="">— Don&apos;t link to a node —</option>
                    {UNCLAIMED_NODES.map((n) => (
                      <option key={n.id} value={n.id}>{n.name} (b. {n.birthYear})</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    If selected, the invitee will be prompted to claim that node on sign-in.
                  </p>
                </div>
                <button type="submit" disabled={sending}
                  className="btn-gold w-full py-3 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : "Send Invitation ✉"}
                </button>
              </form>

              {sent.length > 0 && (
                <div className="mt-4 space-y-2">
                  {sent.map((e) => (
                    <div key={e} className="flex items-center gap-2 text-xs text-green-400">
                      <span>✅</span> Invite sent to {e}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Share link */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-2">Share Join Link</h2>
              <p className="text-gray-400 text-sm mb-4">
                Anyone with this link can request to join the family archive.
                You&apos;ll need to approve them.
              </p>
              {shareLink ? (
                <div>
                  <div className="rounded-xl px-4 py-3 text-xs font-mono text-amber-400 break-all mb-3"
                    style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}>
                    {shareLink}
                  </div>
                  <p className="text-xs text-green-400">✅ Copied to clipboard!</p>
                </div>
              ) : (
                <button onClick={copyLink}
                  className="btn-outline-gold w-full py-3 rounded-xl text-sm font-semibold">
                  🔗 Generate & Copy Join Link
                </button>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Unclaimed nodes */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Unclaimed Nodes</h2>
              <div className="space-y-3">
                {UNCLAIMED_NODES.map((node) => (
                  <div key={node.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "rgba(212,168,67,0.1)", color: "#d4a843" }}>
                      {node.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{node.name}</p>
                      <p className="text-xs text-gray-500">{node.note}</p>
                    </div>
                    <button
                      onClick={() => setPersonNode(node.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap">
                      Invite →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending invites */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Pending Invitations</h2>
              <div className="space-y-3">
                {PENDING_INVITES.map((inv, i) => (
                  <div key={i} className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{inv.person}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: inv.status === "ACCEPTED" ? "rgba(16,185,129,0.1)" : "rgba(212,168,67,0.1)",
                          color: inv.status === "ACCEPTED" ? "#10b981" : "#d4a843",
                        }}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{inv.email} · Sent {inv.sentAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
