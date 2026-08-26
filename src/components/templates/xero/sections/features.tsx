"use client";

import { useState } from "react";

const ITEMS = [
  {
    title: "Zero-knowledge architecture",
    body: "Keys never touch our servers. Your team holds the only set, end to end.",
    visual: <KeyVaultVisual />,
  },
  {
    title: "Annotate in place",
    body: "Tag rows, fields, and files with labels that travel with the data — searchable, scoped, audited.",
    visual: <AnnotateVisual />,
  },
  {
    title: "Pipelines that prove themselves",
    body: "Every transform leaves a signed trail. Replay, diff, and verify any step on demand.",
    visual: <PipelineVisual />,
  },
  {
    title: "Field-level controls",
    body: "Mask, tokenize, or redact at the column level. Roles see exactly what they need — nothing more.",
    visual: <FieldControlVisual />,
  },
  {
    title: "Bring your own model",
    body: "Encryption keys, embeddings, classifiers — slot your stack in and we honor it through every hop.",
    visual: <ModelVisual />,
  },
  {
    title: "Audit at a glance",
    body: "Every key, label, and access event in one stream. Export to SIEM, never lose context.",
    visual: <AuditVisual />,
  },
];

function KeyVaultVisual() {
  return (
    <div className="xero-feat-visual-inner flex flex-col justify-center items-center gap-4">
      <div className="w-16 h-16 rounded-full xero-node flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 stroke-white/60 fill-none"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </div>
      <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
        {["AES-256-GCM", "ChaCha20-Poly1305", "Ed25519 signatures"].map(
          (algo) => (
            <div
              key={algo}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.8)] flex-shrink-0" />
              <span className="text-[11px] text-white/50 font-mono">
                {algo}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function AnnotateVisual() {
  return (
    <div className="xero-feat-visual-inner flex flex-col gap-2.5 px-4 justify-center">
      {[
        {
          col: "email",
          tag: "PII",
          color: "text-yellow-300 bg-yellow-300/10 border-yellow-300/20",
        },
        {
          col: "user_id",
          tag: "internal",
          color: "text-blue-300 bg-blue-300/10 border-blue-300/20",
        },
        {
          col: "payment_token",
          tag: "secret",
          color:
            "text-[--accent-pink] bg-[--accent-pink]/10 border-[--accent-pink]/20",
        },
        {
          col: "timestamp",
          tag: "audit",
          color: "text-white/40 bg-white/[0.04] border-white/10",
        },
      ].map((row) => (
        <div
          key={row.col}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
        >
          <span className="text-[12px] text-white/55 font-mono">{row.col}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${row.color}`}
          >
            {row.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function PipelineVisual() {
  const steps = ["Ingest", "Transform", "Encrypt", "Store"];
  return (
    <div className="xero-feat-visual-inner flex items-center justify-center gap-0 px-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-xl xero-node flex items-center justify-center">
              <span className="text-[10px] text-white/50 font-mono">
                0{i + 1}
              </span>
            </div>
            <span className="text-[10px] text-white/35">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-6 h-px bg-white/10 mx-1 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldControlVisual() {
  const roles = [
    { role: "admin", can: ["read", "write", "redact"] },
    { role: "analyst", can: ["read"] },
    { role: "external", can: [] },
  ];
  return (
    <div className="xero-feat-visual-inner flex flex-col justify-center gap-2 px-3">
      {roles.map((r) => (
        <div
          key={r.role}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
        >
          <span className="text-[12px] text-white/50 font-mono">{r.role}</span>
          <div className="flex gap-1">
            {["read", "write", "redact"].map((p) => (
              <span
                key={p}
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  r.can.includes(p)
                    ? "bg-emerald-400/15 text-emerald-400"
                    : "bg-white/[0.03] text-white/15"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ModelVisual() {
  const models = ["GPT-4o", "Claude 3.5", "Mistral 7B", "Custom BERT"];
  return (
    <div className="xero-feat-visual-inner flex flex-col items-center gap-3 justify-center">
      <div className="w-12 h-12 rounded-2xl xero-node flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-white/50 fill-none"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-1.5 w-full max-w-[180px]">
        {models.map((m) => (
          <div
            key={m}
            className="px-2 py-1.5 rounded-lg border border-white/[0.06] text-center"
          >
            <span className="text-[10px] text-white/40">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditVisual() {
  const events = [
    { time: "09:41:02", event: "key.rotated", who: "sys" },
    { time: "09:41:18", event: "field.redacted", who: "admin" },
    { time: "09:42:05", event: "access.denied", who: "ext" },
    { time: "09:42:11", event: "export.queued", who: "siem" },
  ];
  return (
    <div className="xero-feat-visual-inner flex flex-col justify-center gap-1.5 px-3">
      {events.map((e) => (
        <div
          key={e.time}
          className="flex items-center gap-2.5 text-[11px] px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]"
        >
          <span className="text-white/25 font-mono tabular-nums flex-shrink-0">
            {e.time}
          </span>
          <span className="text-white/55 font-mono flex-1">{e.event}</span>
          <span className="text-white/30 ml-auto">{e.who}</span>
        </div>
      ))}
    </div>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/[0.03] mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
      {label}
    </div>
  );
}

export default function Features() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="method"
      className="w-full max-w-[1600px] mx-auto px-10 py-[100px] max-[768px]:px-5 max-[768px]:py-[70px]"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <Eyebrow label="What it does" />
        <h2 className="xero-section-title font-light leading-[1.1] tracking-tight mb-4 m-0 max-w-[760px]">
          One pipeline.
          <br />
          <strong className="xero-gradient-text font-normal">
            Every guarantee you need.
          </strong>
        </h2>
        <p className="text-[0.95rem] text-white/45 max-w-[540px] leading-[1.6] m-0">
          Xero is the encryption, annotation, and audit layer that sits between
          your data and everything that touches it — no rewrite required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-[1100px] mx-auto">
        {/* Accordion list */}
        <div className="flex flex-col">
          {ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="xero-feat-row text-left w-full relative"
            >
              {active === i && <span className="xero-feat-active-bar" />}
              <div
                className={`px-5 py-5 border-b border-white/[0.07] transition-colors duration-200 ${active === i ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-[0.95rem] font-medium tracking-tight transition-colors duration-200 ${active === i ? "text-white" : "text-white/55"}`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`text-[11px] tabular-nums flex-shrink-0 transition-colors duration-200 ${active === i ? "text-[--accent-pink]" : "text-white/20"}`}
                  >
                    0{i + 1}
                  </span>
                </div>
                <div
                  className={`xero-feat-body-wrap ${active === i ? "xero-feat-body-open" : ""}`}
                >
                  <div>
                    <p className="text-[0.85rem] text-white/45 leading-[1.6] pt-2.5 pr-8">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Visual panel */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="xero-feat-visual-panel min-h-[360px] flex items-center justify-center relative overflow-hidden">
            <div className="xero-feat-panel-glow absolute inset-0 pointer-events-none" />
            <div className="relative w-full py-10">
              {ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  {item.visual}
                </div>
              ))}
              {/* keep layout height */}
              <div className="invisible py-10">{ITEMS[0].visual}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
