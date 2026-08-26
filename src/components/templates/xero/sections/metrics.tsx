const stats = [
  { v: "<1ms", l: "Encryption overhead" },
  { v: "99.999%", l: "Multi-region availability" },
  { v: "12B+", l: "Records sealed monthly" },
  { v: "SOC 2", l: "Type II + HIPAA + GDPR" },
];

export default function Metrics() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-10 py-[60px] max-[768px]:px-5">
      <div className="xero-metrics-grid grid max-[980px]:grid-cols-2 max-[768px]:grid-cols-1">
        {stats.map((s, i) => (
          <div key={i} className="px-7 py-9 text-left">
            <div className="xero-stat-value font-light tracking-[-0.03em] leading-none mb-2.5">
              {s.v}
            </div>
            <div className="text-[0.78rem] text-white/45 tracking-[0.06em]">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
