"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { gunaQuery, sendFeedback, type Trajectory } from "@/lib/api";

type Choice = "S" | "R" | "T";

const TASKS = [
  { id: "action", sanskrit: "कर्म", domain: "Action", group: "how you move", prompt: "What kind of step feels most honest in the next 24 hours?", options: { S: "One small, clean action I can stand behind", R: "A big push to change the situation fast", T: "No step — wait until it goes away, or I can't" } },
  { id: "knowledge", sanskrit: "ज्ञान", domain: "Knowledge", group: "how you move", prompt: "Right now, what would help most?", options: { S: "A clearer view of facts and consequences", R: "More options and strategies to secure the outcome", T: "Less information — I feel flooded, I don't want to know" } },
  { id: "intellect", sanskrit: "बुद्धि", domain: "Intellect", group: "how you move", prompt: "When you imagine choosing, what guides you more?", options: { S: "Long-term rightness, even if it costs me comfort", R: "What gets me relief or approval sooner", T: "Whatever avoids conflict or thinking" } },
  { id: "resolve", sanskrit: "धृति", domain: "Resolve", group: "what drives you", prompt: "Pick one you could keep steady for 7 days:", options: { S: "One principle — truth, kindness, or a boundary — consistently", R: "High effort until I burn out, then crash", T: "I can't hold anything steady right now" } },
  { id: "happiness", sanskrit: "सुख", domain: "Happiness", group: "what drives you", prompt: "Which are you actually seeking right now?", options: { S: "Quiet peace — even if emotions still hurt", R: "Relief, pleasure, or validation — I need it to feel okay", T: "Numbness — anything to not feel" } },
  { id: "doer", sanskrit: "कर्ता", domain: "Doer", group: "what drives you", prompt: "How much of this situation is within your influence?", note: "Not fault. Influence.", options: { S: "Some is me, some isn't — I'll act where I can", R: "Mostly me — I must force results", T: "None of me — nothing I do matters" } },
  { id: "devotion", sanskrit: "श्रद्धा", domain: "Devotion", group: "what you hold", prompt: "What are you most devoted to protecting here?", options: { S: "What is true and good — even if it's hard", R: "A person, an image, or an outcome I'm attached to", T: "I don't feel devoted to anything right now" } },
  { id: "sacrifice", sanskrit: "त्याग", domain: "Sacrifice", group: "what you hold", prompt: "To move forward, what could you release first?", options: { S: "My claim to a specific outcome", R: "A comfort or advantage — but I'll resent it", T: "I can't release anything — I'm stuck" } },
  { id: "discipline", sanskrit: "तपस्", domain: "Discipline", group: "what you hold", prompt: "Someone presses you for an answer today. You...", options: { S: "Respond calmly with a clear boundary", R: "React intensely, over-explain, or argue", T: "Ghost, freeze, or say yes just to escape" } },
  { id: "maya_gap", sanskrit: "माया", domain: "Self-Honesty", group: "the mirror", prompt: "What's the hardest part to say out loud?", note: "A gentle mirror. Skip anytime.", options: { S: "A truth that would actually clarify things", R: "A desire or fear I keep circling around", T: "I don't know — it's blank, I can't look" }, isMirror: true },
  { id: "identity", sanskrit: "अहंकार", domain: "Identity", group: "the mirror", prompt: "Without this situation, I am...", note: "No perfect wording. First thought.", options: { S: "Still me — still okay, still worthy", R: "Less — unseen, unimportant, failing", T: "Nothing — empty, doesn't matter" } },
];

const ACKS = ["I hear you.", "That makes sense.", "Got it.", "Staying with this.", "That takes honesty.", "This is real."];
const BREATHS = ["Take a breath. This is heavy.", "You're doing something most people avoid — looking honestly.", "Almost there. The deepest questions come last."];

export default function AskPage() {
  const [text, setText] = useState("");
  const [step, setStep] = useState<"text" | "tasks" | "breath" | "running" | "result">("text");
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [cur, setCur] = useState(0);
  const [showAck, setShowAck] = useState(false);
  const [ackText, setAckText] = useState("");
  const [breathIdx, setBreathIdx] = useState(0);
  const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
  const [narration, setNarration] = useState("");
  const [entropyText, setEntropyText] = useState("");
  const [error, setError] = useState("");
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMsg, setFbMsg] = useState("");
  const [fbSent, setFbSent] = useState(false);
  const [fbSending, setFbSending] = useState(false);

  const task = TASKS[cur];
  const allDone = Object.keys(answers).length === TASKS.length;

  const handleAnswer = (id: string, c: Choice) => {
    const next = { ...answers, [id]: c };
    setAnswers(next);
    setAckText(ACKS[Math.floor(Math.random() * ACKS.length)]);
    setShowAck(true);
    setTimeout(() => {
      setShowAck(false);
      if (cur < TASKS.length - 1) {
        const nxt = TASKS[cur + 1];
        if (nxt.group !== task.group) {
          setBreathIdx((p) => p + 1);
          setStep("breath");
          setTimeout(() => { setStep("tasks"); setCur(cur + 1); }, 3000);
        } else {
          setCur(cur + 1);
        }
      }
    }, 800);
  };

  const handleRun = useCallback(async () => {
    if (!allDone) return;
    setStep("running");
    setError("");
    try {
      const r = await gunaQuery(text, answers);
      setTrajectory(r.trajectory);
      setNarration(r.narration);
      setEntropyText(r.entropy_text);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("tasks");
    }
  }, [text, answers, allDone]);

  const reset = () => {
    setText(""); setStep("text"); setAnswers({}); setCur(0);
    setTrajectory(null); setNarration(""); setEntropyText("");
    setFbSent(false); setBreathIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen parchment-texture">
      {/* Nav */}
      <nav className="border-b border-[#8B7355]/20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm handwritten" style={{ color: "#B8860B" }}>io-gita</Link>
          <span className="text-[10px] text-[#8B7355] mono">topology, not prophecy</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto w-full px-6 py-10">
        {error && <div className="mb-6 p-3 rounded border border-red-900/30 bg-red-50/50 text-red-800 text-xs">{error}</div>}

        {/* ─── STEP 1: Dilemma ─── */}
        {step === "text" && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl handwritten text-[#1a1a2e] mb-2">What weighs on your mind?</h2>
            <p className="text-sm text-[#8B7355] mb-4">Share what you&apos;re going through. The more honest, the more accurate the mirror.</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="In your own words..."
              rows={5}
              className="w-full p-4 rounded-lg text-sm leading-relaxed resize-none outline-none bg-[#FFFEF8] border border-[#8B7355]/20 text-[#1a1a2e] placeholder-[#8B7355]/40 handwritten"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-[10px] text-[#8B7355] mono">11 gentle prompts · 3 minutes · no wrong answers</p>
              <button
                onClick={() => { if (text.trim().length >= 5) setStep("tasks"); }}
                disabled={text.trim().length < 5}
                className="px-6 py-2.5 rounded mono text-sm transition-all disabled:opacity-30 bg-[#1a1a2e] text-[#00FF41] hover:bg-[#2a2a3e]"
              >
                Continue →
              </button>
            </div>
          </motion.section>
        )}

        {/* ─── BREATH PAUSE ─── */}
        {step === "breath" && (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div className="w-3 h-3 rounded-full bg-[#B8860B] opacity-60" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <p className="mt-6 text-lg text-[#8B7355] handwritten italic text-center">
              {BREATHS[Math.min(breathIdx, BREATHS.length - 1)]}
            </p>
          </div>
        )}

        {/* ─── STEP 2: Tasks ─── */}
        {step === "tasks" && task && (
          <AnimatePresence mode="wait">
            <motion.section key={cur} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {/* Progress */}
              <div className="flex items-center gap-1.5 mb-8">
                {TASKS.map((_, i) => (
                  <div key={i} className="h-1 rounded-full transition-all duration-500" style={{
                    width: i === cur ? "20px" : "6px",
                    background: answers[TASKS[i]?.id] ? "#B8860B" : i === cur ? "#8B7355" : "#E8E0D4",
                    opacity: i === cur ? 1 : answers[TASKS[i]?.id] ? 0.5 : 0.2,
                  }} />
                ))}
              </div>

              {/* Sanskrit domain */}
              <div className="text-center mb-2">
                <p className="text-4xl handwritten text-[#B8860B]/30 mb-1">{task.sanskrit}</p>
                <p className="text-[10px] text-[#8B7355] mono tracking-[0.3em]">{task.group.toUpperCase()}</p>
              </div>

              {/* Ack */}
              {showAck && <p className="text-sm text-[#8B7355] italic handwritten text-center mb-4">{ackText}</p>}

              {/* Prompt */}
              <h2 className="text-xl handwritten text-[#1a1a2e] text-center mb-2 mt-6">{task.prompt}</h2>
              {task.note && <p className="text-[10px] text-[#8B7355] text-center mb-4">{task.note}</p>}

              {/* Mirror: show their text */}
              {"isMirror" in task && task.isMirror && (
                <div className="mb-5 p-4 rounded-lg bg-[#FFFEF8] border border-[#8B7355]/20 text-sm italic text-[#4a4a5e] handwritten">
                  &ldquo;{text.length > 200 ? text.slice(0, 200) + "..." : text}&rdquo;
                </div>
              )}

              {/* Answers */}
              <div className="space-y-3 mt-6">
                {(["S", "R", "T"] as const).map((k) => {
                  const sel = answers[task.id] === k;
                  return (
                    <motion.button
                      key={k}
                      onClick={() => handleAnswer(task.id, k)}
                      disabled={showAck}
                      className="w-full text-left p-5 rounded-lg text-sm leading-relaxed transition-all disabled:opacity-50 handwritten"
                      style={{
                        background: sel ? "rgba(184, 134, 11, 0.1)" : "#FFFEF8",
                        border: sel ? "1px solid #B8860B" : "1px solid rgba(139, 115, 85, 0.2)",
                        color: sel ? "#B8860B" : "#1a1a2e",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * ["S", "R", "T"].indexOf(k) }}
                    >
                      {task.options[k]}
                    </motion.button>
                  );
                })}

                <button onClick={() => handleAnswer(task.id, "R")} disabled={showAck} className="w-full text-center py-2 text-[10px] text-[#8B7355]/40">
                  none of these fit — skip
                </button>
              </div>

              {/* Run button */}
              {allDone && !showAck && (
                <motion.div className="mt-10 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button onClick={handleRun} className="px-8 py-3 rounded mono text-sm bg-[#1a1a2e] text-[#00FF41] hover:bg-[#2a2a3e] transition-colors">
                    <span className="text-[#00AA2A] mr-2">$</span>
                    <span className="terminal-cursor">./compute --self</span>
                  </button>
                </motion.div>
              )}

              {/* Context */}
              <div className="mt-8 p-3 rounded-lg bg-[#FFFEF8] border border-[#8B7355]/10 text-[10px] text-[#8B7355]/40 handwritten italic">
                &ldquo;{text.length > 100 ? text.slice(0, 100) + "..." : text}&rdquo;
              </div>
            </motion.section>
          </AnimatePresence>
        )}

        {/* ─── RUNNING ─── */}
        {step === "running" && (
          <div className="flex flex-col items-center py-20">
            <div className="mb-8 p-6 bg-[#1a1a2e] rounded mono text-sm w-full max-w-md">
              <p className="text-[#00AA2A] mb-2">$ initializing_computation...</p>
              <motion.p className="text-[#00FF41] mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                → Loading 10,000-dimensional attractor network
              </motion.p>
              <motion.p className="text-[#00FF41] mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                → Integrating ODE: dQ/dt = -Q + tanh(β·W·Q)
              </motion.p>
              <motion.p className="text-[#00FF41]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                → Mapping trajectory through energy landscape
              </motion.p>
            </div>
            <div className="w-full max-w-md h-2 bg-[#E8E0D4] rounded overflow-hidden">
              <motion.div className="h-full bg-[#B8860B]" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 8, ease: "linear" }} />
            </div>
            <p className="mt-4 text-sm text-[#8B7355] handwritten italic animate-pulse-glow">Computing your trajectory...</p>
          </div>
        )}

        {/* ─── STEP 3: Result ─── */}
        {step === "result" && trajectory && (
          <motion.section className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Terminal header */}
            <div className="p-4 bg-[#1a1a2e] rounded mono text-sm">
              <p className="text-[#00AA2A]">$ ./compute --self</p>
              <p className="text-[#00FF41]">→ Computation complete</p>
              <p className="text-[#00FF41]">→ Pattern: <span className="text-[#D4A017]">{trajectory.final_display}</span></p>
            </div>

            {/* Entropy */}
            {entropyText && (
              <div className="p-4 rounded-lg bg-[#FFFEF8] border border-[#8B7355]/20 text-sm italic text-[#4a4a5e] handwritten">
                {entropyText}
              </div>
            )}

            {/* Narration */}
            {narration && (
              <div className="space-y-6">
                {narration.split(/^## /m).filter((s) => s.trim()).map((section, i) => {
                  const lines = section.trim().split("\n");
                  const title = lines[0].trim();
                  const body = lines.slice(1).join("\n").trim();
                  return (
                    <div key={i} className="p-6 sm:p-8 rounded-lg aged-edges" style={{
                      background: i === 2 ? "rgba(184, 134, 11, 0.05)" : "#FFFEF8",
                      border: i === 2 ? "1px solid #B8860B" : "1px solid rgba(139, 115, 85, 0.2)",
                    }}>
                      <p className="mono text-[10px] tracking-[0.3em] mb-4" style={{ color: i === 2 ? "#B8860B" : "#8B7355" }}>
                        {title.toUpperCase()}
                      </p>
                      {body.split("\n").map((line, j) => {
                        const t = line.trim();
                        if (!t) return null;
                        const isHindi = t.startsWith("*") && t.endsWith("*");
                        return (
                          <p key={j} className={`mb-3 last:mb-0 text-sm leading-relaxed ${isHindi ? "italic text-[13px]" : "handwritten"}`}
                            style={isHindi ? { color: "#8B7355", opacity: 0.75 } : { color: "#1a1a2e" }}>
                            {isHindi ? t.slice(1, -1) : t}
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Journey */}
            <div>
              <p className="mono text-[10px] tracking-[0.3em] text-[#8B7355] mb-3">JOURNEY ({trajectory.total_steps} steps)</p>
              <div className="space-y-1.5">
                {trajectory.phases.filter((p) => p.duration >= 5).map((p, i) => {
                  const max = Math.max(...trajectory.phases.filter((x) => x.duration >= 5).map((x) => x.duration));
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#8B7355] w-32 shrink-0 text-right truncate handwritten">{p.display}</span>
                      <div className="h-6 rounded animate-grow flex items-center px-2" style={{ width: `${Math.max(10, (p.duration / max) * 100)}%`, background: "rgba(184, 134, 11, 0.1)", border: "1px solid #B8860B" }}>
                        <span className="text-[10px] mono text-[#B8860B]">{p.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlement */}
            <div className="p-4 rounded-lg text-center aged-edges" style={{ background: "rgba(184, 134, 11, 0.08)", border: "1px solid #B8860B" }}>
              <p className="mono text-[10px] tracking-[0.3em] text-[#8B7355] mb-1">SETTLED AT</p>
              <p className="text-xl handwritten text-[#B8860B]">{trajectory.final_display || trajectory.final_basin}</p>
              {trajectory.final_meaning && <p className="text-xs text-[#8B7355] mt-1 handwritten">{trajectory.final_meaning}</p>}
            </div>

            {/* Forces */}
            <div>
              <p className="mono text-[10px] tracking-[0.3em] text-[#8B7355] mb-3">WHICH FORCES WON</p>
              <div className="space-y-1.5">
                {Object.entries(trajectory.atom_alignments).slice(0, 8).map(([, info]) => (
                  <div key={info.feeling} className="flex items-center gap-2 text-xs p-2 rounded bg-[#FFFEF8] border border-[#8B7355]/10">
                    <span className="text-[#4a4a5e] w-36 shrink-0 truncate text-[11px] handwritten">{info.feeling.split("\u2014")[0].trim()}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#E8E0D4]">
                      <div className="h-full rounded-full" style={{ width: `${Math.abs(info.final) * 100}%`, background: info.grew ? "#B8860B" : "#8B7355" }} />
                    </div>
                    {info.grew && <span className="text-[9px] font-medium text-[#B8860B] mono">grew</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 py-6">
              <button onClick={() => { setStep("tasks"); setCur(0); setTrajectory(null); setNarration(""); setEntropyText(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="px-4 py-2 rounded text-xs border border-[#8B7355]/30 text-[#8B7355] hover:text-[#B8860B] hover:border-[#B8860B] transition-colors handwritten">
                Re-answer &amp; rerun
              </button>
              <button onClick={reset} className="px-4 py-2 rounded text-xs border border-[#8B7355]/30 text-[#8B7355] hover:text-[#1a1a2e] transition-colors handwritten">
                New question
              </button>
            </div>

            <p className="text-[10px] text-[#8B7355] text-center mono">topology, not prophecy · same forces, same place, every time</p>

            {/* Feedback */}
            <div className="p-6 rounded-lg bg-[#FFFEF8] border border-[#8B7355]/20">
              <p className="text-sm handwritten text-[#1a1a2e] mb-3">How was this?</p>
              {fbSent ? <p className="text-sm text-green-700 handwritten">Thank you.</p> : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input type="text" placeholder="Name (optional)" value={fbName} onChange={(e) => setFbName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-xs outline-none bg-[#F5F0E8] border border-[#8B7355]/20 text-[#1a1a2e]" />
                    <input type="email" placeholder="Email (optional)" value={fbEmail} onChange={(e) => setFbEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-xs outline-none bg-[#F5F0E8] border border-[#8B7355]/20 text-[#1a1a2e]" />
                  </div>
                  <textarea placeholder="Did the result resonate? What surprised you?" value={fbMsg} onChange={(e) => setFbMsg(e.target.value)} rows={3}
                    className="w-full px-3 py-2 rounded text-xs outline-none resize-none bg-[#F5F0E8] border border-[#8B7355]/20 text-[#1a1a2e]" />
                  <button
                    onClick={async () => { if (!fbMsg.trim()) return; setFbSending(true); try { await sendFeedback({ name: fbName, email: fbEmail, message: fbMsg, query: text }); setFbSent(true); } catch { setError("Feedback failed"); } finally { setFbSending(false); } }}
                    disabled={!fbMsg.trim() || fbSending}
                    className="px-4 py-2 rounded text-xs mono transition-all disabled:opacity-30 bg-[#1a1a2e] text-[#00FF41]">
                    {fbSending ? "Sending..." : "Send feedback"}
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
