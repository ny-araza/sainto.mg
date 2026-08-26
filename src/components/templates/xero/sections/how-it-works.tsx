const steps = [
  {
    n: "STEP 01",
    title: "Connect a source",
    desc: "Point Xero at your warehouse, object store, or app. Read-only by default — we never store the data itself.",
  },
  {
    n: "STEP 02",
    title: "Annotate & encrypt",
    desc: "Tag fields with policies. Sensitivity, retention, owner, access scope — everything travels with the row.",
  },
  {
    n: "STEP 03",
    title: "Ship with proof",
    desc: "Every read, write, and key event is signed. Audit, replay, or revoke in a single click.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-10 py-[100px] max-[768px]:px-5 max-[768px]:py-[70px]">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/[0.03] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
          How it works
        </div>
        <h2 className="xero-section-title font-light leading-[1.1] tracking-tight m-0">
          Three steps.{" "}
          <strong className="xero-gradient-text font-normal">
            Zero rewrites.
          </strong>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-2 max-[768px]:grid-cols-1">
        {steps.map((s, i) => (
          <div
            key={i}
            className="xero-card relative rounded-[20px] p-7 pl-[30px] min-h-[220px] overflow-hidden"
          >
            {/* Glowing left spine */}
            <span className="xero-step-spine absolute left-0 top-6 bottom-6 w-[2px] rounded-full" />
            <div className="xero-mono font-mono text-[0.72rem] text-[--text-muted] tracking-[0.12em] mb-[18px]">
              {s.n}
            </div>
            <h4 className="text-[1.05rem] font-medium m-0 mb-2">{s.title}</h4>
            <p className="text-[0.85rem] text-white/45 m-0 leading-[1.6]">{s.desc}</p>
            <span className="xero-step-glow absolute pointer-events-none rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
