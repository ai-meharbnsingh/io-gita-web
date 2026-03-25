"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

function WaxSeal({ size = 140 }: { children?: React.ReactNode; size?: number }) {
  return (
    <motion.div whileHover={{ scale: 1.05, rotate: 1 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
      <img
        src="/wax-seal.png"
        alt="Show Me My Truth"
        width={size}
        height={size}
        className="drop-shadow-lg"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}
      />
    </motion.div>
  );
}


function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center parchment-texture aged-edges overflow-hidden px-6">
      <div className="devanagari-watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">अ</div>

      {/* Coffee stain decorations */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full border-2 border-[#8B4513]/10 opacity-50" />
      <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full border border-[#8B4513]/5 opacity-30" />

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
          className="text-5xl sm:text-6xl md:text-7xl handwritten text-[#1a1a2e] mb-6 ink-bleed"
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
          className="text-xl sm:text-2xl handwritten text-[#4a4a5e] mb-12 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          &ldquo;The oldest map of consciousness.
          <br />
          The newest physics to read it.&rdquo;
        </motion.p>

        <motion.p className="mt-12 text-xs text-[#8B7355] mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
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
  const [showMath, setShowMath] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    let interval: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      setShowMath(true);
      interval = setInterval(() => setShowMath((prev) => !prev), 8000);
    }, 5000);
    return () => { clearTimeout(startTimer); clearInterval(interval); };
  }, [isInView]);

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

          {/* Sanskrit + Math morph */}
          <div className="text-center mb-8 relative">
            <motion.p
              className="text-3xl sm:text-4xl md:text-5xl handwritten text-[#1a1a2e] leading-relaxed"
              animate={{ opacity: showMath ? 0.15 : 1 }}
              transition={{ duration: 3 }}
            >
              सर्वभूतेषु येनैकं भावमव्ययमीक्षते
            </motion.p>

            {/* Math overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={showMath ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 3, delay: showMath ? 1 : 0 }}
            >
              <p className="mono text-xl sm:text-2xl text-[#B8860B]">
                ∇E(Q) = 0 → Q* = attractor basin
              </p>
            </motion.div>
          </div>

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

          {/* Annotation on right */}
          <motion.div
            className="absolute -right-4 top-1/4 w-32 hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.2 }}
          >
            <p className="text-[10px] text-[#8B7355] handwritten" style={{ transform: "rotate(3deg)" }}>
              * The Rishis observed what physics now confirms: consciousness has topology
            </p>
          </motion.div>
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

  return (
    <section ref={ref} className="relative py-24 sm:py-32 parchment-texture">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="text-[#8B7355] mono text-xs tracking-[0.3em] mb-4">THE FRAMEWORK</p>
          <h2 className="text-3xl sm:text-4xl handwritten text-[#1a1a2e]">Three Pillars of Understanding</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Prakriti — Landscape */}
          <motion.div
            className="p-8 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/60 hover:bg-[#F5F0E8] hover:border-[#B8860B]/40 transition-all duration-500 h-full"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-3xl handwritten text-[#B8860B] mb-2">प्रकृति</p>
            <h3 className="text-xl handwritten text-[#1a1a2e] mb-1">Prakriti</h3>
            <p className="text-sm mono text-[#8B7355] tracking-wider mb-6">— The Landscape —</p>
            <div className="h-24 mb-6 flex items-center justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <motion.path d="M 0 50 Q 25 20 50 35 T 100 25" fill="none" stroke="#B8860B" strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 2, delay: 0.5 }} />
                <motion.path d="M 0 55 Q 25 30 50 45 T 100 35" fill="none" stroke="#8B7355" strokeWidth="0.5" opacity="0.5"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 2, delay: 0.7 }} />
                <circle cx="25" cy="28" r="3" fill="#4A90D9" opacity="0.6" />
                <circle cx="50" cy="38" r="3" fill="#D4A017" opacity="0.6" />
                <circle cx="75" cy="30" r="3" fill="#6B7280" opacity="0.6" />
              </svg>
            </div>
            <p className="text-[#4a4a5e] text-sm leading-relaxed">60 patterns carved into 10,000 dimensions by the rules of the Gita.</p>
          </motion.div>

          {/* Guna — Forces */}
          <motion.div
            className="p-8 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/60 hover:bg-[#F5F0E8] hover:border-[#B8860B]/40 transition-all duration-500 h-full"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p className="text-3xl handwritten text-[#B8860B] mb-2">गुण</p>
            <h3 className="text-xl handwritten text-[#1a1a2e] mb-1">Guna</h3>
            <p className="text-sm mono text-[#8B7355] tracking-wider mb-6">— The Forces —</p>
            <div className="h-24 mb-6 flex items-center justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <defs>
                  <marker id="arrowup" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M 0 6 L 3 0 L 6 6" fill="#4A90D9" /></marker>
                  <marker id="arrowright" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6" fill="#D4A017" /></marker>
                  <marker id="arrowdown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M 0 0 L 3 6 L 6 0" fill="#6B7280" /></marker>
                </defs>
                <motion.line x1="30" y1="50" x2="30" y2="20" stroke="#4A90D9" strokeWidth="2" markerEnd="url(#arrowup)"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1, delay: 0.5 }} />
                <motion.line x1="20" y1="40" x2="50" y2="40" stroke="#D4A017" strokeWidth="2" markerEnd="url(#arrowright)"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1, delay: 0.7 }} />
                <motion.line x1="70" y1="20" x2="70" y2="50" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowdown)"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1, delay: 0.9 }} />
              </svg>
            </div>
            <p className="text-[#4a4a5e] text-sm leading-relaxed">Sattva lifts. Rajas drives. Tamas binds. Your answers set the direction.</p>
          </motion.div>

          {/* Gati — Trajectory */}
          <motion.div
            className="p-8 border border-[#8B7355]/20 rounded-lg bg-[#F5F0E8]/60 hover:bg-[#F5F0E8] hover:border-[#B8860B]/40 transition-all duration-500 h-full"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-3xl handwritten text-[#B8860B] mb-2">गति</p>
            <h3 className="text-xl handwritten text-[#1a1a2e] mb-1">Gati</h3>
            <p className="text-sm mono text-[#8B7355] tracking-wider mb-6">— The Trajectory —</p>
            <div className="h-24 mb-6 flex items-center justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <motion.path d="M 10 50 Q 30 45 40 30 T 70 25" fill="none" stroke="#00C9A7" strokeWidth="2" strokeDasharray="4,2"
                  initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 2, delay: 0.5 }} />
                <motion.circle cx="70" cy="25" r="4" fill="#D4A017"
                  initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 2 }} />
              </svg>
            </div>
            <p className="text-[#4a4a5e] text-sm leading-relaxed">The physics decides where you land. Not an algorithm. Not AI. Dynamics.</p>
          </motion.div>
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

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
        >
          <Link href="/ask" className="inline-block">
            <WaxSeal size={350} />
          </Link>
          <p className="mt-3 text-sm text-[#B8860B] handwritten animate-pulse">↑ Click the seal to know your truth ↑</p>
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
              Powered by <a href="https://www.adaptive-mind.com" target="_blank" rel="noopener noreferrer" className="text-[#00C9A7] hover:underline">Semantic Gravity</a>
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
      <WhatItIsNot />
      <TerminalCTA />
      <Footer />
    </main>
  );
}
