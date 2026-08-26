function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 shrink-0 mt-0.5 fill-none"
      stroke="var(--accent)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

const CODE_HTML = `<span class="tok-com">// wrap a column with one call</span>
<span class="tok-key">import</span> { xero } <span class="tok-key">from</span> <span class="tok-str">"@xero/sdk"</span>;

<span class="tok-key">const</span> client = <span class="tok-fn">xero</span>({
  key: <span class="tok-fn">env</span>(<span class="tok-str">"XERO_KEY"</span>),
  scope: <span class="tok-str">"customers.email"</span>,
  policy: <span class="tok-str">"tokenize"</span>,
});

<span class="tok-key">const</span> rows = <span class="tok-key">await</span> client.<span class="tok-fn">write</span>({
  table: <span class="tok-str">"customers"</span>,
  rows: [{ email: <span class="tok-str">"a@x.io"</span>, tier: <span class="tok-num">1</span> }],
});

<span class="tok-com">// reads stay transparent — keys travel with the role</span>
<span class="tok-key">const</span> { email } = <span class="tok-key">await</span> client.<span class="tok-fn">read</span>(rows[<span class="tok-num">0</span>].id);`;

export default function Showcase() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-10 py-[100px] max-[768px]:px-5 max-[768px]:py-[70px]">
      <div className="xero-card relative w-full rounded-[20px] overflow-hidden p-[60px] grid grid-cols-[1fr_1.1fr] gap-14 items-center max-[980px]:grid-cols-1 max-[980px]:gap-8 max-[768px]:p-8">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/[0.03] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
            Developer-first
          </div>
          <h3 className="xero-section-title-md font-light leading-[1.15] tracking-tight mt-4 mb-4">
            Drop it in,
            <br />
            <strong className="xero-gradient-text font-normal">
              keep your stack.
            </strong>
          </h3>
          <p className="text-[0.9rem] text-white/45 leading-[1.65] mb-7 max-w-[440px]">
            Six lines and a key. Xero wraps your existing reads and writes — no schema migration, no proxy hop, no surprises in production.
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-3 mb-8">
            {[
              "SDKs for Node, Python, Go, Rust, and Swift",
              "Wraps Postgres, S3, BigQuery, Snowflake, and any HTTP store",
              "Sub-millisecond overhead. Cached keys. No round-trip on hot paths",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[0.88rem] text-white/70">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="#docs"
            className="inline-block bg-white text-[#0a0a0f] px-8 py-3 rounded-full font-semibold text-[0.9rem] transition-all hover:opacity-90 hover:-translate-y-px"
          >
            Read the docs
          </a>
        </div>

        {/* Code panel */}
        <div className="xero-code-panel relative rounded-[14px] overflow-hidden text-[0.78rem] leading-[1.7]">
          {/* gradient border overlay */}
          <span className="xero-code-border absolute pointer-events-none rounded-[14px]" />
          <div className="xero-code-tab-bar flex items-center gap-2 px-3.5 py-3">
            <span className="xero-code-dot w-[11px] h-[11px] rounded-full" />
            <span className="xero-code-dot w-[11px] h-[11px] rounded-full" />
            <span className="xero-code-dot w-[11px] h-[11px] rounded-full" />
            <span className="xero-code-tab ml-3.5 px-3 py-1 rounded-md text-[0.7rem] text-white/60">
              encrypt.ts
            </span>
          </div>
          <pre
            className="p-[18px_22px_22px] text-white/75 whitespace-pre overflow-x-auto m-0"
            dangerouslySetInnerHTML={{ __html: CODE_HTML }}
          />
        </div>
      </div>
    </section>
  );
}
