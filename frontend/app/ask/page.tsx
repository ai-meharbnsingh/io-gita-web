"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  gunaQuery,
  sendFeedback,
  type Trajectory,
} from "@/lib/api";

type Choice = "S" | "R" | "T";

// ── The 11 Interactive Tasks ──
// Each produces S/R/T. Varied interaction styles. Feels like mirrors, not tests.
const TASKS = [
  {
    id: "action",
    group: "how you move",
    prompt: "What kind of step feels most honest in the next 24 hours?",
    type: "tap" as const,
    options: {
      S: "One small, clean action I can stand behind",
      R: "A big push to change the situation fast",
      T: "No step — wait until it goes away, or I can't",
    },
  },
  {
    id: "knowledge",
    group: "how you move",
    prompt: "Right now, what would help most?",
    type: "tap" as const,
    options: {
      S: "A clearer view of facts and consequences",
      R: "More options and strategies to secure the outcome",
      T: "Less information — I feel flooded, I don't want to know",
    },
  },
  {
    id: "intellect",
    group: "how you move",
    prompt: "When you imagine choosing, what guides you more?",
    type: "tap" as const,
    options: {
      S: "Long-term rightness, even if it costs me comfort",
      R: "What gets me relief or approval sooner",
      T: "Whatever avoids conflict or thinking",
    },
  },
  {
    id: "resolve",
    group: "what drives you",
    prompt: "Pick one you could keep steady for 7 days:",
    type: "tap" as const,
    options: {
      S: "One principle — truth, kindness, or a boundary — consistently",
      R: "High effort until I burn out, then crash",
      T: "I can't hold anything steady right now",
    },
  },
  {
    id: "happiness",
    group: "what drives you",
    prompt: "Which are you actually seeking right now?",
    type: "forced" as const,
    options: {
      S: "Quiet peace — even if emotions still hurt",
      R: "Relief, pleasure, or validation — I need it to feel okay",
      T: "Numbness — anything to not feel",
    },
  },
  {
    id: "doer",
    group: "what drives you",
    prompt: "How much of this situation is within your influence?",
    note: "Not fault. Influence.",
    type: "slider" as const,
    options: {
      S: "Some is me, some isn't — I'll act where I can",
      R: "Mostly me — I must force results",
      T: "None of me — nothing I do matters",
    },
  },
  {
    id: "devotion",
    group: "what you hold",
    prompt: "What are you most devoted to protecting here?",
    type: "tap" as const,
    options: {
      S: "What is true and good — even if it's hard",
      R: "A person, an image, or an outcome I'm attached to",
      T: "I don't feel devoted to anything right now",
    },
  },
  {
    id: "sacrifice",
    group: "what you hold",
    prompt: "To move forward, what could you release first?",
    type: "tap" as const,
    options: {
      S: "My claim to a specific outcome",
      R: "A comfort or advantage — but I'll resent it",
      T: "I can't release anything — I'm stuck",
    },
  },
  {
    id: "discipline",
    group: "what you hold",
    prompt: "Someone presses you for an answer today. You...",
    type: "tap" as const,
    options: {
      S: "Respond calmly with a clear boundary",
      R: "React intensely, over-explain, or argue",
      T: "Ghost, freeze, or say yes just to escape",
    },
  },
  {
    id: "maya_gap",
    group: "the mirror",
    prompt: "What's the hardest part to say out loud?",
    note: "A gentle mirror. Skip anytime.",
    type: "mirror" as const,
    options: {
      S: "A truth that would actually clarify things",
      R: "A desire or fear I keep circling around",
      T: "I don't know — it's blank, I can't look",
    },
  },
  {
    id: "identity",
    group: "the mirror",
    prompt: "Without this situation, I am...",
    note: "No perfect wording. First thought.",
    type: "stem" as const,
    options: {
      S: "Still me — still okay, still worthy",
      R: "Less — unseen, unimportant, failing",
      T: "Nothing — empty, doesn't matter",
    },
  },
];

const GROUPS = ["how you move", "what drives you", "what you hold", "the mirror"];

const ACKNOWLEDGMENTS = [
  "I hear you.",
  "That makes sense.",
  "Got it — this matters to you.",
  "Staying with this.",
  "That takes honesty.",
  "Noted. Let's keep going.",
  "This is real.",
];

const BREATH_MESSAGES = [
  "Take a breath. This is heavy.",
  "You're doing something most people avoid — looking honestly.",
  "Almost there. The deepest questions come last.",
];

export default function AskPage() {
  const [text, setText] = useState("");
  const [step, setStep] = useState<"text" | "tasks" | "breath" | "running" | "result">("text");
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [currentTask, setCurrentTask] = useState(0);
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
  const taskStartTime = useRef<number>(Date.now());

  const task = TASKS[currentTask];
  const currentGroup = task?.group;
  const prevGroup = currentTask > 0 ? TASKS[currentTask - 1]?.group : null;
  const allAnswered = Object.keys(answers).length === TASKS.length;

  const handleTextSubmit = () => {
    if (!text.trim() || text.trim().length < 5) return;
    setStep("tasks");
    setCurrentTask(0);
    setAnswers({});
    taskStartTime.current = Date.now();
  };

  const handleAnswer = (taskId: string, choice: Choice) => {
    const next = { ...answers, [taskId]: choice };
    setAnswers(next);

    // Show acknowledgment briefly
    const ack = ACKNOWLEDGMENTS[Math.floor(Math.random() * ACKNOWLEDGMENTS.length)];
    setAckText(ack);
    setShowAck(true);

    setTimeout(() => {
      setShowAck(false);

      if (currentTask < TASKS.length - 1) {
        const nextTask = TASKS[currentTask + 1];
        // Check if we're crossing a group boundary → breath pause
        if (nextTask.group !== task.group) {
          setBreathIdx((prev) => prev + 1);
          setStep("breath");
          setTimeout(() => {
            setStep("tasks");
            setCurrentTask(currentTask + 1);
            taskStartTime.current = Date.now();
          }, 3000);
        } else {
          setCurrentTask(currentTask + 1);
          taskStartTime.current = Date.now();
        }
      }
    }, 800);
  };

  const handleRun = useCallback(async () => {
    if (!allAnswered) return;
    setStep("running");
    setError("");

    try {
      const result = await gunaQuery(text, answers);
      setTrajectory(result.trajectory);
      setNarration(result.narration);
      setEntropyText(result.entropy_text);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("tasks");
    }
  }, [text, answers, allAnswered]);

  const handleReset = () => {
    setText("");
    setStep("text");
    setAnswers({});
    setCurrentTask(0);
    setTrajectory(null);
    setNarration("");
    setEntropyText("");
    setFbSent(false);
    setBreathIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      <nav className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-medium tracking-wide" style={{ color: "var(--color-accent)" }}>
            io-gita
          </Link>
          <span className="text-[10px] text-[var(--color-text-dim)] font-mono">
            topology, not prophecy
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto w-full px-6 py-10">
        {error && (
          <div className="mb-6 p-3 rounded border border-red-900/50 bg-red-950/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* ─── STEP 1: Dilemma ─── */}
        {step === "text" && (
          <section className="animate-fadeIn">
            <h2 className="text-lg font-light mb-1">What&apos;s on your mind?</h2>
            <p className="text-xs text-[var(--color-text-dim)] mb-4">
              Share what you&apos;re going through. The more honest you are, the more accurate the mirror.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="In your own words..."
              rows={5}
              className="w-full p-4 rounded-lg text-sm leading-relaxed resize-none outline-none"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-[10px] text-[var(--color-text-dim)] opacity-50">
                After this, 11 gentle prompts to map your inner forces. Takes 3 minutes.
              </p>
              <button
                onClick={handleTextSubmit}
                disabled={!text.trim() || text.trim().length < 5}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* ─── BREATH PAUSE ─── */}
        {step === "breath" && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: "var(--color-accent)", opacity: 0.6 }} />
            <p className="mt-6 text-sm text-[var(--color-text-dim)] text-center italic">
              {BREATH_MESSAGES[Math.min(breathIdx, BREATH_MESSAGES.length - 1)]}
            </p>
          </div>
        )}

        {/* ─── STEP 2: Interactive Tasks ─── */}
        {step === "tasks" && task && (
          <section className="animate-fadeIn">
            {/* Subtle progress dots */}
            <div className="flex items-center gap-1.5 mb-8">
              {TASKS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === currentTask ? "20px" : "6px",
                    background: answers[TASKS[i]?.id]
                      ? "var(--color-accent)"
                      : i === currentTask
                      ? "var(--color-text-dim)"
                      : "var(--color-border)",
                    opacity: i === currentTask ? 1 : answers[TASKS[i]?.id] ? 0.5 : 0.15,
                  }}
                />
              ))}
            </div>

            {/* Group label */}
            <p className="text-[10px] uppercase tracking-widest mb-6" style={{ color: "var(--color-accent)", opacity: 0.6 }}>
              {task.group}
            </p>

            {/* Acknowledgment overlay */}
            {showAck && (
              <div className="mb-4 text-xs italic animate-fadeIn" style={{ color: "var(--color-text-dim)" }}>
                {ackText}
              </div>
            )}

            {/* Task prompt */}
            <h2 className="text-lg font-light mb-2 leading-snug">{task.prompt}</h2>
            {task.note && (
              <p className="text-[10px] text-[var(--color-text-dim)] mb-4 opacity-60">{task.note}</p>
            )}

            {/* Mirror task: show their own text first */}
            {task.type === "mirror" && (
              <div
                className="mb-5 p-4 rounded-lg text-xs italic leading-relaxed"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-dim)" }}
              >
                &ldquo;{text.length > 200 ? text.slice(0, 200) + "..." : text}&rdquo;
              </div>
            )}

            {/* Stem task: show the stem prominently */}
            {task.type === "stem" && (
              <p className="text-2xl font-light mb-6 opacity-40">
                Without this, I am...
              </p>
            )}

            {/* Answer options */}
            <div className="space-y-3 mt-4">
              {(["S", "R", "T"] as const).map((key) => {
                const selected = answers[task.id] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(task.id, key)}
                    disabled={showAck}
                    className="w-full text-left p-4 rounded-lg text-sm leading-relaxed transition-all disabled:opacity-50"
                    style={{
                      background: selected ? "var(--color-accent-dim)" : "var(--color-surface)",
                      border: selected ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                      color: selected ? "var(--color-accent)" : "var(--color-text)",
                    }}
                  >
                    {task.options[key]}
                  </button>
                );
              })}

              {/* Dignity valve */}
              <button
                onClick={() => handleAnswer(task.id, "R")}
                disabled={showAck}
                className="w-full text-center py-2 text-[10px] transition-colors"
                style={{ color: "var(--color-text-dim)", opacity: 0.4 }}
              >
                none of these fit — skip
              </button>
            </div>

            {/* Run button when all answered */}
            {allAnswered && !showAck && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleRun}
                  className="px-8 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}
                >
                  Show me what the topology sees
                </button>
              </div>
            )}
          </section>
        )}

        {/* ─── RUNNING ─── */}
        {step === "running" && (
          <div className="flex flex-col items-center py-20 animate-fadeIn">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
            <p className="mt-4 text-xs text-[var(--color-text-dim)] animate-pulse-glow">
              Running your forces through 60 attractor basins...
            </p>
            <p className="mt-1 text-[10px] text-[var(--color-text-dim)] opacity-40">
              Same forces always lead to the same place
            </p>
          </div>
        )}

        {/* ─── STEP 3: Result ─── */}
        {step === "result" && trajectory && (
          <section className="space-y-8 animate-fadeIn">
            {/* Entropy — how torn */}
            {entropyText && (
              <div className="p-4 rounded-lg text-sm italic leading-relaxed" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-dim)" }}>
                {entropyText}
              </div>
            )}

            {/* Narration */}
            {narration && (
              <div className="space-y-6">
                {narration
                  .split(/^## /m)
                  .filter((s) => s.trim())
                  .map((section, i) => {
                    const lines = section.trim().split("\n");
                    const title = lines[0].trim();
                    const body = lines.slice(1).join("\n").trim();
                    return (
                      <div
                        key={i}
                        className="p-5 rounded-lg text-sm leading-relaxed"
                        style={{
                          background: "var(--color-surface)",
                          border: i === 2 ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-wider mb-3 font-medium"
                          style={{ color: i === 2 ? "var(--color-accent)" : "var(--color-text-dim)" }}
                        >
                          {title}
                        </p>
                        {body.split("\n").map((line, j) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const isHindi = trimmed.startsWith("*") && trimmed.endsWith("*");
                          const lineText = isHindi ? trimmed.slice(1, -1) : trimmed;
                          return (
                            <p
                              key={j}
                              className={`mb-3 last:mb-0 ${isHindi ? "italic text-[13px]" : ""}`}
                              style={isHindi ? { color: "var(--color-text-dim)", opacity: 0.75 } : undefined}
                            >
                              {lineText}
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
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
                Journey ({trajectory.total_steps} steps)
              </p>
              <div className="space-y-1.5">
                {trajectory.phases
                  .filter((p) => p.duration >= 5)
                  .map((p, i) => {
                    const maxDur = Math.max(...trajectory.phases.filter((x) => x.duration >= 5).map((x) => x.duration));
                    const width = Math.max(10, (p.duration / maxDur) * 100);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--color-text-dim)] w-32 shrink-0 text-right truncate">
                          {p.display}
                        </span>
                        <div
                          className="h-6 rounded animate-grow flex items-center px-2"
                          style={{ width: `${width}%`, background: "var(--color-accent-dim)", border: "1px solid var(--color-accent)" }}
                        >
                          <span className="text-[10px] font-mono" style={{ color: "var(--color-accent)" }}>
                            {p.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Final settlement */}
            <div className="p-4 rounded-lg text-center" style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-accent)" }}>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">Settled at</p>
              <p className="text-lg font-light" style={{ color: "var(--color-accent)" }}>
                {trajectory.final_display || trajectory.final_basin}
              </p>
              {trajectory.final_meaning && (
                <p className="text-xs text-[var(--color-text-dim)] mt-1">{trajectory.final_meaning}</p>
              )}
            </div>

            {/* Forces that won */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
                Which forces won
              </p>
              <div className="space-y-1.5">
                {Object.entries(trajectory.atom_alignments)
                  .slice(0, 8)
                  .map(([, info]) => (
                    <div key={info.feeling} className="flex items-center gap-2 text-xs p-2 rounded" style={{ background: "var(--color-surface)" }}>
                      <span className="text-[var(--color-text-dim)] w-36 shrink-0 truncate text-[11px]">
                        {info.feeling.split("\u2014")[0].trim()}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.abs(info.final) * 100}%`,
                            background: info.grew ? "var(--color-accent)" : "var(--color-text-dim)",
                          }}
                        />
                      </div>
                      {info.grew && (
                        <span className="text-[9px] font-medium shrink-0" style={{ color: "var(--color-accent)" }}>grew</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-border)]" /></div>
              <div className="relative flex justify-center gap-3">
                <button
                  onClick={() => { setStep("tasks"); setCurrentTask(0); setTrajectory(null); setNarration(""); setEntropyText(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="px-4 py-2 rounded-lg text-xs border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                >
                  Re-answer &amp; rerun
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-xs border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                >
                  New question
                </button>
              </div>
            </div>

            <p className="text-[10px] text-[var(--color-text-dim)] opacity-40 text-center">
              This is topology, not prophecy. The same forces always lead to the same place.
            </p>

            {/* Feedback */}
            <div className="p-5 rounded-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs font-medium mb-3">How was this? Share your experience.</p>
              {fbSent ? (
                <p className="text-xs text-green-400">Thank you for your feedback.</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input type="text" placeholder="Name (optional)" value={fbName} onChange={(e) => setFbName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-xs outline-none"
                      style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                    <input type="email" placeholder="Email (optional)" value={fbEmail} onChange={(e) => setFbEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-xs outline-none"
                      style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                  </div>
                  <textarea placeholder="Did the result resonate? What surprised you?" value={fbMsg} onChange={(e) => setFbMsg(e.target.value)} rows={3}
                    className="w-full px-3 py-2 rounded text-xs outline-none resize-none"
                    style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                  <button
                    onClick={async () => {
                      if (!fbMsg.trim()) return;
                      setFbSending(true);
                      try { await sendFeedback({ name: fbName, email: fbEmail, message: fbMsg, query: text }); setFbSent(true); }
                      catch { setError("Feedback failed to send"); }
                      finally { setFbSending(false); }
                    }}
                    disabled={!fbMsg.trim() || fbSending}
                    className="px-4 py-2 rounded text-xs font-medium transition-all disabled:opacity-30"
                    style={{ background: "var(--color-accent-dim)", border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}
                  >
                    {fbSending ? "Sending..." : "Send feedback"}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
