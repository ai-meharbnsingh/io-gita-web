import Link from "next/link";

function Yantra() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-64 h-64 mx-auto opacity-60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="200" r="180" stroke="#d4a052" strokeWidth="0.5" opacity="0.3" />
      <circle cx="200" cy="200" r="160" stroke="#d4a052" strokeWidth="0.5" opacity="0.2" />
      <circle cx="200" cy="200" r="140" stroke="#d4a052" strokeWidth="1" opacity="0.4" />
      <polygon points="200,60 320,280 80,280" stroke="#d4a052" strokeWidth="1" opacity="0.5" />
      <polygon points="200,340 80,120 320,120" stroke="#d4a052" strokeWidth="1" opacity="0.5" />
      <polygon points="200,90 290,255 110,255" stroke="#d4a052" strokeWidth="0.5" opacity="0.3" />
      <polygon points="200,310 110,145 290,145" stroke="#d4a052" strokeWidth="0.5" opacity="0.3" />
      {[
        [200, 60], [320, 280], [80, 280],
        [200, 340], [80, 120], [320, 120],
        [200, 200],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill="#d4a052" opacity="0.7" />
          <circle cx={cx} cy={cy} r="8" stroke="#d4a052" strokeWidth="0.5" opacity="0.3" />
        </g>
      ))}
      <line x1="200" y1="60" x2="200" y2="200" stroke="#d4a052" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <line x1="80" y1="280" x2="200" y2="200" stroke="#d4a052" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <line x1="320" y1="280" x2="200" y2="200" stroke="#d4a052" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <line x1="80" y1="120" x2="200" y2="200" stroke="#d4a052" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <line x1="320" y1="120" x2="200" y2="200" stroke="#d4a052" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <line x1="200" y1="340" x2="200" y2="200" stroke="#d4a052" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
      <circle cx="200" cy="200" r="6" fill="#d4a052" opacity="0.8" />
      <circle cx="200" cy="200" r="20" stroke="#d4a052" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium tracking-wide" style={{ color: "var(--color-accent)" }}>
            io-gita
          </span>
          <Link
            href="/ask"
            className="text-xs px-4 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
          >
            Ask a question
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <Yantra />

        <h1 className="mt-10 text-3xl font-light tracking-tight text-center max-w-lg leading-snug">
          Do you want comfort,
          <br />
          <span className="text-[var(--color-text-dim)]">or do you want the truth?</span>
        </h1>

        <p className="mt-6 text-sm text-[var(--color-text-dim)] text-center max-w-md leading-relaxed italic">
          AI will tell you what you want to hear.
          <br />
          io-gita shows you what you need to see.
        </p>

        <Link
          href="/ask"
          className="mt-10 px-8 py-3 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "var(--color-accent-dim)",
            border: "1px solid var(--color-accent)",
            color: "var(--color-accent)",
          }}
        >
          Show me my truth
        </Link>

        {/* What is io-gita */}
        <div className="mt-20 max-w-lg w-full space-y-6">
          <h2 className="text-sm font-medium text-center" style={{ color: "var(--color-accent)" }}>
            What is io-gita?
          </h2>

          <div className="space-y-4 text-sm text-[var(--color-text-dim)] leading-relaxed">
            <p>
              When you ask an AI for advice, it gives you balanced,
              reasonable suggestions. &ldquo;Consider both perspectives.&rdquo;
              &ldquo;Communicate openly.&rdquo; &ldquo;Think about what&apos;s best long-term.&rdquo;
            </p>
            <p>
              All correct. All surface-level. None of it touches
              <strong className="text-[var(--color-text)]"> why you&apos;re actually stuck.</strong>
            </p>
            <p>
              io-gita is different. It doesn&apos;t give advice.
              It runs your inner forces through a physics engine &mdash;
              built on 20 concepts from the Bhagavad Gita &mdash; and shows you
              where those forces <em>actually</em> lead. Not where you
              think they lead. Not where you want them to lead.
              Where the physics says they go.
            </p>
            <p className="text-[var(--color-text)]">
              The same forces always lead to the same place.
              Run it today, run it next year &mdash; if nothing has changed inside you,
              the answer won&apos;t change either.
            </p>
          </div>
        </div>

        {/* How it's different */}
        <div className="mt-16 max-w-lg w-full">
          <div
            className="p-6 rounded-lg space-y-4"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[var(--color-text-dim)] mb-2 uppercase tracking-wider text-[10px]">AI chatbot says</p>
                <p className="text-[var(--color-text-dim)] leading-relaxed">
                  &ldquo;Consider both perspectives. Communicate openly with your partner.
                  Think about what&apos;s best for everyone.&rdquo;
                </p>
              </div>
              <div>
                <p className="mb-2 uppercase tracking-wider text-[10px]" style={{ color: "var(--color-accent)" }}>io-gita shows</p>
                <p className="leading-relaxed">
                  &ldquo;Your forces settled where illusion and identity reinforce each other.
                  You can&apos;t choose because the fight itself has become your purpose.
                  Beneath the noise, a pull toward truth is growing &mdash; you&apos;re not hearing it yet.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl w-full">
          {[
            {
              step: "01",
              title: "You speak",
              desc: "Share what's on your mind in your own words. A dilemma, a conflict, something you can't resolve.",
            },
            {
              step: "02",
              title: "11 questions",
              desc: "Answer 11 simple questions about how you operate. Not what you feel — how you act, think, and decide. No wrong answers.",
            },
            {
              step: "03",
              title: "Physics runs",
              desc: "Your forces run through 60 attractor basins. You see where they lead, where they linger, and what grew that you didn't expect.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div
                className="text-xs font-mono mb-2"
                style={{ color: "var(--color-accent)" }}
              >
                {item.step}
              </div>
              <div className="text-sm font-medium mb-1">{item.title}</div>
              <div className="text-xs text-[var(--color-text-dim)] leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* What it's NOT */}
        <div className="mt-16 max-w-md w-full text-center space-y-3">
          <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
            io-gita is <strong className="text-[var(--color-text)]">not</strong> a chatbot.
            It won&apos;t have a conversation with you.
          </p>
          <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
            It is <strong className="text-[var(--color-text)]">not</strong> an advisor.
            It won&apos;t tell you what to do.
          </p>
          <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
            It is a <strong className="text-[var(--color-text)]">mirror</strong>.
            It shows you the forces inside you &mdash; the ones pushing,
            the ones pulling, and the ones you didn&apos;t know were there.
          </p>
          <p className="text-xs leading-relaxed italic" style={{ color: "var(--color-accent)" }}>
            Yeh aapko salah nahi deta. Yeh aapko aaina dikhata hai.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/ask"
          className="mt-12 px-8 py-3 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "var(--color-accent-dim)",
            border: "1px solid var(--color-accent)",
            color: "var(--color-accent)",
          }}
        >
          Ask your first question
        </Link>

        {/* Bottom note */}
        <p className="mt-20 text-xs text-[var(--color-text-dim)] text-center max-w-sm opacity-60">
          Built on 60+ proven experiments in high-dimensional attractor dynamics.
          <br />
          20 forces from the Bhagavad Gita. Deterministic. Auditable. Same input, same answer, every time.
        </p>
      </section>
    </main>
  );
}
