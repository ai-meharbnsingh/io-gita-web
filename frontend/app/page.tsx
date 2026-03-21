"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

function WaxSeal({ children, size = 100 }: { children: React.ReactNode; size?: number }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group cursor-pointer">
      <div className="wax-seal flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center z-10">{children}</div>
      </div>
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: "0 0 30px rgba(139, 0, 0, 0.4), 0 0 60px rgba(139, 0, 0, 0.2)" }}
      />
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center parchment-texture aged-edges overflow-hidden px-6">
      <div className="devanagari-watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">अ</div>

      <div className="relative z-10 text-center max-w-3xl">
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 1.5 }}
        >
          <div className="h-px bg-[#8B7355]/30 flex-1 max-w-[100px]" />
          <span className="text-[#8B7355] text-xs tracking-[0.3em] mono">ANCIENT TEXT · MODERN PHYSICS</span>
          <div className="h-px bg-[#8B7355]/30 flex-1 max-w-[100px]" />
        </motion.div>

        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl handwritten text-[#1a1a2e] mb-6 ink-bleed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          io-gita
        </motion.h1>

        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
          <p className="mono text-sm text-[#8B7355] tracking-wider mb-2">THE DYNAMICS OF CONSCIOUSNESS</p>
          <p className="mono text-lg text-[#B8860B]">dQ/dt = -Q + tanh(β·W·Q) + α·F</p>
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl handwritten text-[#4a4a5e] mb-4 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Do you want comfort, or do you want the truth?
        </motion.p>

        <motion.p
          className="text-sm text-[#8B7355] mb-12 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          AI will tell you what you want to hear.
          <br />
          io-gita shows you what you need to see.
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1.3, type: "spring" }}>
          <Link href="/ask">
            <WaxSeal size={110}>
              <div className="text-white text-center">
                <span className="block text-xs tracking-widest opacity-80">SHOW ME</span>
                <span className="block text-[10px] tracking-wider opacity-60">MY</span>
                <span className="block text-xs tracking-widest opacity-80">TRUTH</span>
              </div>
            </WaxSeal>
          </Link>
        </motion.div>

        <motion.p className="mt-12 text-xs text-[#8B7355] mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          Based on Bhagavad Gita Chapter 18 · 10,000-dimensional Hopfield networks
        </motion.p>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <div className="scroll-hint text-[#8B7355]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

function VerseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em]">THE VERSE</p>
        </motion.div>

        <motion.div
          className="relative p-8 sm:p-12 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/80 aged-edges"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute -top-4 left-8 bg-[#F5F0E8] px-4">
            <span className="handwritten text-[#8B7355] text-sm">Gita 18.20</span>
          </div>

          <p className="text-3xl sm:text-4xl md:text-5xl handwritten text-[#1a1a2e] leading-relaxed text-center mb-8">
            सर्वभूतेषु येनैकं भावमव्ययमीक्षते
          </p>

          <p className="text-center text-[#8B7355] italic mb-6">
            Sarva-bhūteṣu yenaikaṁ bhāvam avyayam īkṣate
          </p>

          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px bg-[#8B7355]/30 w-16" />
            <span className="text-[#8B7355] text-xs">✦</span>
            <div className="h-px bg-[#8B7355]/30 w-16" />
          </div>

          <p className="text-center text-lg text-[#4a4a5e] handwritten">
            &ldquo;That knowledge by which one sees one undivided imperishable reality in all beings&rdquo;
          </p>
        </motion.div>

        <motion.p
          className="text-center mt-12 text-[#8B7355] handwritten text-lg italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          The text <span className="text-[#B8860B]">is</span> the math. The observation <span className="text-[#B8860B]">is</span> the equation.
        </motion.p>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 parchment-texture">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em] mb-4">THE DIFFERENCE</p>
          <h2 className="text-3xl sm:text-4xl handwritten text-[#1a1a2e]">What Makes This Different</h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-8 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/60">
            <p className="text-[#8B7355] mono text-[10px] tracking-[0.3em] mb-4">AI CHATBOT SAYS</p>
            <p className="text-[#4a4a5e] handwritten text-lg leading-relaxed italic">
              &ldquo;Consider both perspectives. Communicate openly. Think about what&apos;s best for everyone.&rdquo;
            </p>
            <p className="mt-4 text-xs text-[#8B7355]">Correct. Surface-level. Doesn&apos;t touch why you&apos;re stuck.</p>
          </div>

          <div className="p-8 border border-[#B8860B]/40 rounded-lg bg-[#F5F0E8]/80 aged-edges">
            <p className="text-[#B8860B] mono text-[10px] tracking-[0.3em] mb-4">io-gita SHOWS</p>
            <p className="text-[#1a1a2e] handwritten text-lg leading-relaxed">
              &ldquo;Your forces settled where illusion and identity reinforce each other. You can&apos;t choose because the fight
              itself has become your purpose. Beneath the noise, a pull toward truth is growing.&rdquo;
            </p>
            <p className="mt-4 text-xs text-[#B8860B]">Physics. Deterministic. The same forces always lead to the same place.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PillarsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pillars = [
    { sanskrit: "प्रकृति", name: "Prakriti", subtitle: "The Landscape", desc: "60 patterns carved into 10,000 dimensions by the rules of the Gita." },
    { sanskrit: "गुण", name: "Guna", subtitle: "The Forces", desc: "Sattva lifts. Rajas drives. Tamas binds. Your answers set the direction." },
    { sanskrit: "गति", name: "Gati", subtitle: "The Trajectory", desc: "The physics decides where you land. Not an algorithm. Not AI. Dynamics." },
  ];

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em] mb-4">HOW IT WORKS</p>
          <h2 className="text-3xl sm:text-4xl handwritten text-[#1a1a2e]">Three Pillars</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.name}
              className="p-8 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/60 hover:bg-[#F5F0E8] hover:border-[#B8860B]/40 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
            >
              <p className="text-3xl handwritten text-[#B8860B] mb-2">{p.sanskrit}</p>
              <h3 className="text-xl handwritten text-[#1a1a2e] mb-1">{p.name}</h3>
              <p className="text-sm mono text-[#8B7355] tracking-wider mb-6">— {p.subtitle} —</p>
              <p className="text-[#4a4a5e] text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotebookSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em] mb-4">THE SCIENCE</p>
          <h2 className="text-3xl sm:text-4xl handwritten text-[#1a1a2e]">Research Notebook</h2>
        </motion.div>

        <motion.div
          className="relative p-8 sm:p-12 bg-[#FFFEF8] border border-[#8B7355]/20 rounded-lg notebook-lines"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute left-16 top-8 bottom-8 w-px bg-[#FF6B6B]/30" />

          <div className="pl-12 space-y-8">
            <p className="text-[#8B7355] text-sm handwritten">March 2026</p>

            <div>
              <p className="text-[#1a1a2e] handwritten text-lg">
                <span className="line-through text-[#8B7355]/50">Hypothesis: Consciousness patterns are stochastic</span>
              </p>
              <p className="text-[#B8860B] handwritten text-lg ml-4">
                Result: 120/120 escape predictions correct. Deterministic dynamics confirmed.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
              {[
                ["120/120", "Predictions"],
                ["R²=0.68", "Height Formula"],
                ["p<0.001", "Significance"],
                ["3", "AI Reviews"],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl mono text-[#B8860B]">{val}</p>
                  <p className="text-xs text-[#8B7355]">{label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mono text-sm text-[#4a4a5e]">dQ/dt = -Q + tanh(β·W·Q) + α·F</p>
              <p className="text-xs text-[#8B7355] handwritten mt-1">* This is the actual ODE we integrate. 10,000 dimensions. No shortcuts.</p>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full border border-[#8B4513]/10 opacity-40" />
        </motion.div>

        <motion.p
          className="text-center mt-8 text-[#8B7355] handwritten italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
        >
          60+ experiments · Peer-reviewed by 3 independent AI systems · Not wellness marketing
        </motion.p>
      </div>
    </section>
  );
}

function WhatItIsNot() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-16 parchment-texture">
      <div className="max-w-md mx-auto px-6 text-center">
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-sm text-[#4a4a5e] handwritten">
            io-gita is <strong className="text-[#1a1a2e]">not</strong> a chatbot. It won&apos;t have a conversation with you.
          </p>
          <p className="text-sm text-[#4a4a5e] handwritten">
            It is <strong className="text-[#1a1a2e]">not</strong> an advisor. It won&apos;t tell you what to do.
          </p>
          <p className="text-sm text-[#4a4a5e] handwritten">
            It is a <strong className="text-[#1a1a2e]">mirror</strong>. It shows you the forces inside you — the ones pushing, the ones pulling, and the ones you didn&apos;t know were there.
          </p>
          <p className="text-sm handwritten italic text-[#B8860B] pt-2">
            Yeh aapko salah nahi deta. Yeh aapko aaina dikhata hai.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TerminalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em]">THE MANUSCRIPT AWAKENS</p>
        </motion.div>

        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl handwritten text-[#1a1a2e] mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Every consciousness has a topology.
          <br />
          <span className="text-[#B8860B]">Yours is waiting.</span>
        </motion.h2>

        <motion.div className="inline-block" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}>
          <Link
            href="/ask"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a2e] rounded mono text-[#00FF41] hover:bg-[#2a2a3e] transition-colors duration-300"
          >
            <span className="text-[#00AA2A]">$</span>
            <span className="terminal-cursor">./compute --self</span>
          </Link>
        </motion.div>

        <motion.p className="mt-6 text-xs text-[#8B7355] mono" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
          11 questions · 10,000 dimensions · 22 possible patterns
        </motion.p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-12 parchment-texture border-t border-[#8B7355]/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-2xl handwritten text-[#1a1a2e]">io-gita</p>
            <p className="text-xs text-[#8B7355] mono">Ancient manuscript · Modern computation</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-[#8B7355] handwritten">
              Built by <span className="text-[#1a1a2e]">Meharban Singh</span>
            </p>
            <p className="text-xs text-[#8B7355] mono mt-1">
              Powered by <span className="text-[#00C9A7]">Semantic Gravity</span>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#8B7355]/10 text-center">
          <p className="text-xs text-[#8B7355] mono">© 2026 · Peer-reviewed physics · Not a personality test</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <VerseSection />
      <ComparisonSection />
      <PillarsSection />
      <NotebookSection />
      <WhatItIsNot />
      <TerminalCTA />
      <Footer />
    </main>
  );
}
