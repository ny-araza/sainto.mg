const items = [
  {
    q: "Where do my keys actually live?",
    a: "On infrastructure you control. Xero never sees plaintext keys — we orchestrate envelope encryption against your KMS, HSM, or BYO provider. If we go away tomorrow, your data is still readable by you.",
  },
  {
    q: "Do I need to change my schema?",
    a: "No. Xero wraps existing reads and writes through the SDK. Encrypted fields keep their original column type. Annotations live in a separate signed ledger that links by row id.",
  },
  {
    q: "What's the latency overhead?",
    a: "Sub-millisecond on hot paths thanks to in-process key caching. Cold-start a region and you'll see ~5ms once, then steady state.",
  },
  {
    q: "How does annotation differ from tagging?",
    a: "Tags describe a column. Annotations describe a value — and they travel with that value through every read, transform, and export. You can scope, expire, and audit each one independently.",
  },
  {
    q: "Can I self-host?",
    a: "Yes. The Team plan is cloud-managed; Enterprise can deploy single-tenant in your VPC with the same control plane.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-10 py-[100px] max-[768px]:px-5 max-[768px]:py-[70px]">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/[0.03] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
          Questions
        </div>
        <h2 className="xero-section-title font-light leading-[1.1] tracking-tight m-0">
          Answers, before{" "}
          <strong className="font-normal xero-gradient-text">
            you ask.
          </strong>
        </h2>
      </div>

      <div className="max-w-[820px] mx-auto w-full">
        {items.map((it, i) => (
          <details key={i} className="group">
            <summary className="w-full list-none text-[--text] py-[22px] px-1 text-[0.98rem] tracking-[-0.005em] flex items-center justify-between cursor-pointer gap-6 [&::-webkit-details-marker]:hidden">
              <span>{it.q}</span>
              <svg
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px] shrink-0 fill-none transition-transform duration-[250ms] group-open:rotate-180"
                stroke="var(--text-muted)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="faq-answer open text-[0.88rem] text-white/50 leading-[1.65]">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
