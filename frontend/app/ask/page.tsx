"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getQuestions,
  gunaQuery,
  sendFeedback,
  type DomainQuestion,
  type Trajectory,
} from "@/lib/api";

type Choice = "S" | "R" | "T";

export default function AskPage() {
  // Step 1: Dilemma text
  const [text, setText] = useState("");
  const [step, setStep] = useState<"text" | "questions" | "running" | "result">("text");

  // Step 2: Questions
  const [questions, setQuestions] = useState<DomainQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loadingQs, setLoadingQs] = useState(false);

  // Step 3: Result
  const [trajectory, setTrajectory] = useState<Trajectory | null>(null);
  const [narration, setNarration] = useState("");
  const [entropyText, setEntropyText] = useState("");

  // Feedback
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMsg, setFbMsg] = useState("");
  const [fbSent, setFbSent] = useState(false);
  const [fbSending, setFbSending] = useState(false);

  const [error, setError] = useState("");

  // Load questions on mount
  useEffect(() => {
    setLoadingQs(true);
    getQuestions()
      .then((qs) => setQuestions(qs))
      .catch((e) => setError("Failed to load questions"))
      .finally(() => setLoadingQs(false));
  }, []);

  const handleTextSubmit = () => {
    if (!text.trim() || text.trim().length < 5) return;
    setStep("questions");
    setCurrentQ(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, choice: Choice) => {
    const next = { ...answers, [questionId]: choice };
    setAnswers(next);

    // Auto-advance to next question
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

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
      setStep("questions");
    }
  }, [text, answers, allAnswered]);

  const handleReset = () => {
    setText("");
    setStep("text");
    setAnswers({});
    setCurrentQ(0);
    setTrajectory(null);
    setNarration("");
    setEntropyText("");
    setFbSent(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReAnswer = () => {
    setStep("questions");
    setCurrentQ(0);
    setTrajectory(null);
    setNarration("");
    setEntropyText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const q = questions[currentQ];

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-wide"
            style={{ color: "var(--color-accent)" }}
          >
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

        {/* ─── STEP 1: Your Dilemma ─── */}
        {step === "text" && (
          <section>
            <h2 className="text-lg font-light mb-1">What&apos;s on your mind?</h2>
            <p className="text-xs text-[var(--color-text-dim)] mb-2">
              Share what you&apos;re going through — a dilemma, a conflict, something you can&apos;t resolve.
            </p>
            <div className="text-[10px] text-[var(--color-text-dim)] opacity-50 mb-4 space-y-0.5">
              <p>This is not AI giving you advice. It&apos;s a physics engine that reads your inner forces</p>
              <p>and shows you which ones are actually driving you — even the ones you can&apos;t see.</p>
              <p>After this, you&apos;ll answer 11 short questions. Then the topology runs.</p>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: I gave up my career for my family but now I feel empty. I don't know who I am anymore..."
              rows={4}
              className="w-full p-4 rounded-lg text-sm leading-relaxed resize-none outline-none transition-colors"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <button
              onClick={handleTextSubmit}
              disabled={!text.trim() || text.trim().length < 5}
              className="mt-3 px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "var(--color-accent-dim)",
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
              }}
            >
              Next — answer 11 questions
            </button>
          </section>
        )}

        {/* ─── STEP 2: Guna×Domain Questions ─── */}
        {step === "questions" && !loadingQs && q && (
          <section>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < currentQ
                        ? "var(--color-accent)"
                        : i === currentQ
                        ? "var(--color-accent)"
                        : answers[questions[i]?.id]
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    opacity: i === currentQ ? 1 : i < currentQ || answers[questions[i]?.id] ? 0.5 : 0.2,
                  }}
                />
              ))}
              <span className="text-[10px] text-[var(--color-text-dim)] font-mono ml-2">
                {Object.keys(answers).length}/11
              </span>
            </div>

            {/* Question */}
            <div className="mb-2">
              <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider">
                {q.domain}
              </span>
            </div>
            <h2 className="text-lg font-light mb-6">{q.question}</h2>

            {/* Answer choices */}
            <div className="space-y-3">
              {(["S", "R", "T"] as const).map((key) => {
                const selected = answers[q.id] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(q.id, key)}
                    className="w-full text-left p-4 rounded-lg text-sm leading-relaxed transition-all"
                    style={{
                      background: selected ? "var(--color-accent-dim)" : "var(--color-surface)",
                      border: selected
                        ? "1px solid var(--color-accent)"
                        : "1px solid var(--color-border)",
                      color: selected ? "var(--color-accent)" : "var(--color-text)",
                    }}
                  >
                    {q.answers[key]}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] disabled:opacity-30 transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {currentQ < questions.length - 1 && answers[q.id] && (
                  <button
                    onClick={() => setCurrentQ(currentQ + 1)}
                    className="text-xs px-4 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    Next
                  </button>
                )}

                {allAnswered && (
                  <button
                    onClick={handleRun}
                    className="text-sm px-6 py-2 rounded-lg font-medium transition-all"
                    style={{
                      background: "var(--color-accent-dim)",
                      border: "1px solid var(--color-accent)",
                      color: "var(--color-accent)",
                    }}
                  >
                    Run the topology
                  </button>
                )}
              </div>
            </div>

            {/* Show dilemma context */}
            <div className="mt-8 p-3 rounded-lg text-[10px] text-[var(--color-text-dim)] opacity-40" style={{ background: "var(--color-surface)" }}>
              Your dilemma: &ldquo;{text.length > 120 ? text.slice(0, 120) + "..." : text}&rdquo;
            </div>
          </section>
        )}

        {/* ─── RUNNING ─── */}
        {step === "running" && (
          <div className="flex flex-col items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
            <p className="mt-3 text-xs text-[var(--color-text-dim)] animate-pulse-glow">
              Running your forces through 60 attractor basins...
            </p>
            <p className="mt-1 text-[10px] text-[var(--color-text-dim)] opacity-40">
              Same forces always lead to the same place
            </p>
          </div>
        )}

        {/* ─── STEP 3: Result ─── */}
        {step === "result" && trajectory && (
          <section className="space-y-8">
            {/* How to read */}
            <div className="text-[10px] text-[var(--color-text-dim)] opacity-50 space-y-0.5">
              <p><strong className="text-[var(--color-text)]">How to read:</strong> Your forces ran through 60 attractor basins — positions your mind could settle in.</p>
              <p>Forces that <strong style={{ color: "var(--color-accent)" }}>grew</strong> are the real drivers — you may not see them but the topology does.</p>
              <p>Forces that <strong>shrunk</strong> are surface noise — they feel big but don&apos;t determine where you land.</p>
            </div>

            {/* Entropy — how torn are you? */}
            {entropyText && (
              <div
                className="p-4 rounded-lg text-sm italic leading-relaxed"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-dim)",
                }}
              >
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
                          border: i === 2
                            ? "1px solid var(--color-accent)"
                            : "1px solid var(--color-border)",
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
                          const text = isHindi ? trimmed.slice(1, -1) : trimmed;
                          return (
                            <p
                              key={j}
                              className={`mb-3 last:mb-0 ${isHindi ? "italic text-[13px]" : ""}`}
                              style={isHindi ? { color: "var(--color-text-dim)", opacity: 0.75 } : undefined}
                            >
                              {text}
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
                    const maxDur = Math.max(
                      ...trajectory.phases
                        .filter((x) => x.duration >= 5)
                        .map((x) => x.duration)
                    );
                    const width = Math.max(10, (p.duration / maxDur) * 100);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[11px] text-[var(--color-text-dim)] w-32 shrink-0 text-right truncate">
                          {p.display}
                        </span>
                        <div
                          className="h-6 rounded animate-grow flex items-center px-2"
                          style={{
                            width: `${width}%`,
                            background: "var(--color-accent-dim)",
                            border: "1px solid var(--color-accent)",
                          }}
                        >
                          <span
                            className="text-[10px] font-mono"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {p.duration} steps
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Final settlement */}
            <div
              className="p-4 rounded-lg text-center"
              style={{
                background: "var(--color-accent-dim)",
                border: "1px solid var(--color-accent)",
              }}
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
                Settled at
              </p>
              <p
                className="text-lg font-light"
                style={{ color: "var(--color-accent)" }}
              >
                {trajectory.final_display || trajectory.final_basin}
              </p>
              {trajectory.final_meaning && (
                <p className="text-xs text-[var(--color-text-dim)] mt-1">
                  {trajectory.final_meaning}
                </p>
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
                  .map(([, info]) => {
                    const label = info.feeling.split("\u2014")[0].trim();
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-2 text-xs p-2 rounded"
                        style={{ background: "var(--color-surface)" }}
                      >
                        <span className="text-[var(--color-text-dim)] w-36 shrink-0 truncate text-[11px]">
                          {label}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.abs(info.final) * 100}%`,
                              background: info.grew
                                ? "var(--color-accent)"
                                : "var(--color-text-dim)",
                            }}
                          />
                        </div>
                        {info.grew && (
                          <span
                            className="text-[9px] font-medium shrink-0"
                            style={{ color: "var(--color-accent)" }}
                          >
                            grew
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center gap-3">
                <button
                  onClick={handleReAnswer}
                  className="px-4 py-2 rounded-lg text-xs border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                >
                  Re-answer & rerun
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-xs border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                >
                  New question
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-[var(--color-text-dim)] opacity-40 text-center">
              This is topology, not prophecy. The same forces always lead to the same place.
            </p>

            {/* Feedback */}
            <div
              className="p-5 rounded-lg"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-xs font-medium mb-3">
                How was this? Share your experience.
              </p>
              {fbSent ? (
                <p className="text-xs text-green-400">Thank you for your feedback.</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Name (optional)"
                      value={fbName}
                      onChange={(e) => setFbName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-xs outline-none"
                      style={{
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={fbEmail}
                      onChange={(e) => setFbEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded text-xs outline-none"
                      style={{
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                  <textarea
                    placeholder="Did the result resonate? What surprised you?"
                    value={fbMsg}
                    onChange={(e) => setFbMsg(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded text-xs outline-none resize-none"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  />
                  <button
                    onClick={async () => {
                      if (!fbMsg.trim()) return;
                      setFbSending(true);
                      try {
                        await sendFeedback({
                          name: fbName,
                          email: fbEmail,
                          message: fbMsg,
                          query: text,
                        });
                        setFbSent(true);
                      } catch {
                        setError("Feedback failed to send");
                      } finally {
                        setFbSending(false);
                      }
                    }}
                    disabled={!fbMsg.trim() || fbSending}
                    className="px-4 py-2 rounded text-xs font-medium transition-all disabled:opacity-30"
                    style={{
                      background: "var(--color-accent-dim)",
                      border: "1px solid var(--color-accent)",
                      color: "var(--color-accent)",
                    }}
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
