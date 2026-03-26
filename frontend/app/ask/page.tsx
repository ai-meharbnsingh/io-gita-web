"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { gunaQuery, sendFeedback, type Trajectory } from "@/lib/api";
import { track } from "@vercel/analytics";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

const GITA_QUOTES = [
  { sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", chapter: "2.47", hindi: "तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं।", english: "You have the right to action alone, never to its fruits." },
  { sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय", chapter: "2.48", hindi: "हे धनंजय, योग में स्थित होकर, आसक्ति त्यागकर कर्म करो।", english: "Perform actions established in yoga, abandoning attachment." },
  { sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः", chapter: "2.23", hindi: "इस आत्मा को न शस्त्र काट सकते हैं, न अग्नि जला सकती है।", english: "Weapons cannot cut the soul, nor can fire burn it." },
  { sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्", chapter: "6.5", hindi: "अपने आप को स्वयं ऊपर उठाओ, अपने आप को गिरने मत दो।", english: "Elevate yourself by your own self. Do not degrade yourself." },
  { sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज", chapter: "18.66", hindi: "सब धर्मों को त्यागकर मेरी शरण में आओ।", english: "Abandon all duties and surrender unto me alone." },
  { sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत", chapter: "4.7", hindi: "जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं प्रकट होता हूँ।", english: "Whenever righteousness declines and unrighteousness rises, I manifest myself." },
  { sanskrit: "मन एव मनुष्याणां कारणं बन्धमोक्षयोः", chapter: "6.5", hindi: "मन ही मनुष्य के बंधन और मोक्ष दोनों का कारण है।", english: "The mind alone is the cause of bondage and liberation." },
  { sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्", chapter: "3.35", hindi: "अपना गुणरहित धर्म भी दूसरे के अच्छे धर्म से श्रेष्ठ है।", english: "Better is one's own duty, though imperfect, than another's duty well performed." },
  { sanskrit: "क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते", chapter: "2.3", hindi: "हे पार्थ, कायरता को मत अपनाओ, यह तुम्हें शोभा नहीं देती।", english: "Do not yield to cowardice, O Partha. It does not befit you." },
  { sanskrit: "समोऽहं सर्वभूतेषु न मे द्वेष्योऽस्ति न प्रियः", chapter: "9.29", hindi: "मैं सब प्राणियों में समान हूँ, न कोई मुझे अप्रिय है न प्रिय।", english: "I am equal to all beings. None is hateful or dear to me." },
];

function GitaQuotesLoader() {
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * GITA_QUOTES.length));
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % GITA_QUOTES.length);
    }, 5000);
    const timerInterval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => { clearInterval(quoteInterval); clearInterval(timerInterval); };
  }, []);

  const quote = GITA_QUOTES[quoteIdx];

  return (
    <div className="flex flex-col items-center justify-center py-16 min-h-[60vh]">
      {/* Clear loading header */}
      <div className="text-center mb-8 p-4 rounded-lg bg-[#FFFEF8] border border-[#B8860B]/20 max-w-md">
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#B8860B]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p className="text-base text-[#1a1a2e] handwritten font-medium">Your results are being computed...</p>
        </div>
        <p className="text-xs text-[#8B7355] mono">This may take 1-3 minutes — please stay on this page ({elapsed}s elapsed)</p>
        {/* Progress bar */}
        <div className="mt-3 h-1 rounded-full bg-[#E8E0D4] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#B8860B]"
            animate={{ width: ["0%", "40%", "60%", "75%", "85%"] }}
            transition={{ duration: 120, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-12 bg-[#8B7355]/20" />
        <p className="text-xs text-[#8B7355] mono tracking-wider">WHILE YOU WAIT — SOME GITA WISDOM</p>
        <div className="h-px w-12 bg-[#8B7355]/20" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIdx}
          className="text-center max-w-lg px-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Sanskrit shloka */}
          <p className="text-xl sm:text-2xl sanskrit-hand text-[#B8860B] leading-relaxed mb-3">
            {quote.sanskrit}
          </p>

          {/* Chapter reference */}
          <p className="text-[10px] mono text-[#8B7355]/60 tracking-widest mb-5">
            — Bhagavad Gita {quote.chapter}
          </p>

          {/* Hindi meaning */}
          <p className="text-sm text-[#4a4a5e] leading-relaxed mb-3 sanskrit-hand">
            {quote.hindi}
          </p>

          {/* English meaning */}
          <p className="text-sm text-[#8B7355] italic handwritten leading-relaxed">
            {quote.english}
          </p>
        </motion.div>
      </AnimatePresence>

      <p className="mt-10 text-[10px] text-[#8B7355]/40 mono">These verses are for reflection — your personal results will appear above when ready</p>
    </div>
  );
}

export default function AskPage() {
  const [text, setText] = useState("");
  const [step, setStep] = useState<"text" | "tasks" | "breath" | "running" | "result">("text");
  const [answers, setAnswers] = useState<Record<string, Choice[]>>({});
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
  const resultRef = useRef<HTMLDivElement>(null);

  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: "#F5F0E8",
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: resultRef.current.scrollWidth,
        windowHeight: resultRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      } else {
        let remaining = imgHeight;
        let srcY = 0;
        while (remaining > 0) {
          const sliceH = Math.min(pageHeight, remaining);
          const sliceCanvasH = (sliceH / imgHeight) * canvas.height;
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceCanvasH;
          const ctx = sliceCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(canvas, 0, srcY, canvas.width, sliceCanvasH, 0, 0, canvas.width, sliceCanvasH);
            pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", 10, 10, imgWidth, sliceH);
          }
          remaining -= sliceH;
          srcY += sliceCanvasH;
          if (remaining > 0) pdf.addPage();
        }
      }
      pdf.save("io-gita-result.pdf");
      track("pdf_downloaded");
    } catch (e) {
      console.error("PDF generation failed:", e);
      setError("PDF download failed — please try taking a screenshot instead");
    } finally {
      setPdfLoading(false);
    }
  };

  const task = TASKS[cur];
  const allDone = Object.keys(answers).length === TASKS.length && Object.values(answers).every((a) => a.length > 0);

  const handleAnswer = (id: string, c: Choice) => {
    const current = answers[id] || [];
    let updated: Choice[];
    if (current.includes(c)) {
      // Deselect — toggle off
      updated = current.filter((x) => x !== c);
    } else if (current.length >= 2) {
      // Already 2 selected — replace oldest with new
      updated = [current[1], c];
    } else {
      // Add selection
      updated = [...current, c];
    }
    setAnswers({ ...answers, [id]: updated });
  };

  const advanceToNext = () => {
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

  const handleSkip = (id: string) => {
    // Set default answer AND advance in one go
    setAnswers((prev) => ({ ...prev, [id]: ["R"] }));
    advanceToNext();
  };

  const handleRun = useCallback(async () => {
    if (!allDone) return;
    setStep("running");
    setError("");
    try {
      // Convert Choice[] to comma-joined strings for backend ("S" or "S,R")
      const flatAnswers: Record<string, string> = {};
      for (const [k, v] of Object.entries(answers)) {
        flatAnswers[k] = v.join(",");
      }
      console.log("Sending to backend:", { text: text.slice(0, 50), answers: flatAnswers });
      const r = await gunaQuery(text, flatAnswers);
      setTrajectory(r.trajectory);
      setNarration(r.narration);
      setEntropyText(r.entropy_text);
      setStep("result");
      track("result_viewed", { pattern: r.trajectory?.final_display || "unknown" });
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
          <span className="text-[10px] text-[#8B7355] mono">a mirror, not a prediction</span>
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

            {/* Example questions */}
            {!text.trim() && (
              <div className="mt-4 mb-2">
                <p className="text-[10px] text-[#8B7355] mono mb-2">NOT SURE WHAT TO WRITE? TRY ONE OF THESE:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "I can't decide whether to leave my job or stay",
                    "My family wants one thing, my heart wants another",
                    "I keep starting things but never finish them",
                    "I feel stuck and don't know why",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setText(example)}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#8B7355]/20 text-[#8B7355] hover:bg-[#B8860B]/10 hover:border-[#B8860B]/40 hover:text-[#B8860B] transition-all cursor-pointer handwritten"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <p className="text-[10px] text-[#8B7355] mono">11 gentle prompts · 3 minutes · no wrong answers</p>
              <button
                onClick={() => { if (text.trim().length >= 5) { track("question_started"); setStep("tasks"); } }}
                disabled={text.trim().length < 5}
                className="px-8 py-2.5 rounded-full text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-[#8B2332] text-[#F5F0E8] hover:bg-[#A52A2A] shadow-md handwritten tracking-wide"
              >
                Continue
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  {TASKS.map((_, i) => {
                    const answered = (answers[TASKS[i]?.id] || []).length > 0;
                    return (
                      <div key={i} className="rounded-full transition-all duration-500" style={{
                        width: 8,
                        height: 8,
                        background: answered ? "#B8860B" : i === cur ? "#8B7355" : "transparent",
                        border: i === cur ? "2px solid #8B7355" : answered ? "2px solid #B8860B" : "2px solid #D4C9B8",
                      }} />
                    );
                  })}
                </div>
                <span className="text-xs text-[#8B7355] mono">{cur + 1}/{TASKS.length}</span>
              </div>

              {/* Sanskrit domain */}
              <div className="text-center mb-2">
                <p className="text-5xl sanskrit-hand text-[#B8860B]/50 mb-1">{task.sanskrit}</p>
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

              {/* Answers — multi-select up to 2 with checkboxes */}
              <div className="space-y-3 mt-6">
                <p className="text-[10px] text-[#8B7355]/60 mono text-center mb-1">pick one, or two if both feel true</p>
                {(["S", "R", "T"] as const).map((k) => {
                  const selections = answers[task.id] || [];
                  const sel = selections.includes(k);
                  return (
                    <motion.button
                      key={k}
                      onClick={() => handleAnswer(task.id, k)}
                      disabled={showAck}
                      className="w-full text-left p-5 rounded-lg text-sm leading-relaxed transition-all disabled:opacity-50 cursor-pointer handwritten"
                      style={{
                        background: sel ? "rgba(184, 134, 11, 0.1)" : "#FFFEF8",
                        border: sel ? "1px solid #B8860B" : "1px solid rgba(139, 115, 85, 0.2)",
                        color: sel ? "#B8860B" : "#1a1a2e",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * ["S", "R", "T"].indexOf(k) }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors" style={{ borderColor: sel ? "#B8860B" : "#D4C9B8", background: sel ? "#B8860B" : "transparent" }}>
                          {sel && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 6l3 3 5-5" />
                            </svg>
                          )}
                        </span>
                        {task.options[k]}
                      </span>
                    </motion.button>
                  );
                })}

                {/* Next / Skip buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => handleSkip(task.id)} disabled={showAck} className="text-sm text-[#8B7355]/60 hover:text-[#8B7355] cursor-pointer handwritten transition-colors">
                    skip this one
                  </button>
                  {(answers[task.id] || []).length > 0 && !showAck && (
                    <motion.button
                      onClick={advanceToNext}
                      className="px-6 py-2 rounded-full text-sm cursor-pointer bg-[#8B2332] text-[#F5F0E8] hover:bg-[#A52A2A] shadow-md handwritten tracking-wide transition-colors"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      Next
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Run button */}
              {allDone && !showAck && (
                <motion.div className="mt-10 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button onClick={handleRun} className="px-10 py-3.5 rounded-full text-sm cursor-pointer bg-[#8B2332] text-[#F5F0E8] hover:bg-[#A52A2A] shadow-lg transition-colors handwritten tracking-wide">
                    Reveal My Truth
                  </button>
                </motion.div>
              )}

            </motion.section>
          </AnimatePresence>
        )}

        {/* ─── RUNNING: Gita Quotes ─── */}
        {step === "running" && <GitaQuotesLoader />}

        {/* ─── STEP 3: Result (MinimalWorkingPage design) ─── */}
        {step === "result" && trajectory && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header — Back / Again / Download */}
            <div className="flex items-center justify-between mb-12">
              <button onClick={reset} className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                <span className="text-sm sans">Back</span>
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => { setStep("tasks"); setCur(0); setTrajectory(null); setNarration(""); setEntropyText(""); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                  <span className="text-sm sans">Again</span>
                </button>
                <button onClick={handleDownloadPDF} disabled={pdfLoading} className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a2e] transition-colors disabled:opacity-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  <span className="text-sm sans">{pdfLoading ? "Generating..." : "PDF"}</span>
                </button>
              </div>
            </div>

            <div ref={resultRef}>
            {/* YOUR PATTERN label */}
            <p className="text-xs text-[#9b9b9b] sans tracking-wider mb-4">WHAT WE FOUND</p>

            {/* Pattern name — large elegant */}
            <h2 className="text-4xl sm:text-5xl heading-elegant text-[#1a1a2e] mb-2">
              {trajectory.final_display || trajectory.final_basin}
            </h2>

            {/* Sanskrit name in orange */}
            {trajectory.final_meaning && (
              <p className="text-xl text-[#FF6B00] italic mb-10">{trajectory.final_meaning}</p>
            )}

            {/* Trajectory SVG — orange curve with dot */}
            <div className="mb-10">
              <svg width="100%" height="120" viewBox="0 0 400 120" className="mx-auto">
                <line x1="20" y1="100" x2="380" y2="100" stroke="#e5e5e5" strokeWidth="1" />
                <motion.path
                  d="M 30 90 Q 100 30 200 60 T 350 40"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                <circle cx="350" cy="40" r="6" fill="#FF6B00" />
              </svg>
            </div>

            {/* Simple one-line meaning */}
            {trajectory.final_meaning && (
              <p className="text-[#6b6b6b] leading-relaxed mb-10 text-lg">
                {trajectory.final_meaning}
              </p>
            )}

            {/* Three cards — What Drives / Where This Leads / What You Can Do */}
            {(() => {
              const sections = narration ? narration.split(/^## /m).filter((s) => s.trim()) : [];
              const cardColors = ["#4A90D9", "#FF6B00", "#00C9A7"];
              const cardTitles = ["What's Really Driving You", "Where This Leads", "What You Can Do"];
              const cardDefaults = [
                "Your answers reveal the forces that are shaping how you feel right now.",
                "This is where your current inner patterns are taking you.",
                "Small, specific steps you can take today.",
              ];
              return (
                <div className="space-y-4 mb-10">
                  {cardTitles.map((title, i) => {
                    const section = sections[i];
                    let body = cardDefaults[i];
                    if (section) {
                      const lines = section.trim().split("\n");
                      body = lines.slice(1).join("\n").trim() || cardDefaults[i];
                    }
                    // Split into English and Hindi (Hindi is wrapped in * markers)
                    const parts = body.split(/(\*[^*]+\*)/g).filter(Boolean);
                    return (
                      <motion.div
                        key={i}
                        className="minimal-card p-6 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.15 }}
                      >
                        <h3 className="sans font-medium mb-3" style={{ color: cardColors[i] }}>{title}</h3>
                        <div className="space-y-3">
                          {parts.map((part, j) => {
                            const isHindi = part.startsWith("*") && part.endsWith("*");
                            if (isHindi) {
                              return (
                                <p key={j} className="text-sm sanskrit-hand text-[#8B7355] leading-relaxed pl-3 border-l-2 border-[#B8860B]/30">
                                  {part.slice(1, -1)}
                                </p>
                              );
                            }
                            return (
                              <p key={j} className="text-sm text-[#4a4a5e] leading-relaxed">
                                {part.trim()}
                              </p>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Journey bar chart */}
            <div className="mb-8">
              <p className="text-xs text-[#9b9b9b] sans tracking-wider mb-3">YOUR MIND'S JOURNEY</p>
              <div className="space-y-1.5">
                {trajectory.phases.filter((p) => p.duration >= 5).map((p, i) => {
                  const max = Math.max(...trajectory.phases.filter((x) => x.duration >= 5).map((x) => x.duration));
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#8B7355] w-32 shrink-0 text-right truncate handwritten">{p.display}</span>
                      <div className="h-6 rounded animate-grow flex items-center px-2" style={{ width: `${Math.max(10, (p.duration / max) * 100)}%`, background: "rgba(255, 107, 0, 0.08)", border: "1px solid rgba(255, 107, 0, 0.3)" }}>
                        <span className="text-[10px] mono text-[#FF6B00]">{p.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Forces — what's strongest in you */}
            <div className="mb-8">
              <p className="text-xs text-[#9b9b9b] sans tracking-wider mb-2">WHAT'S STRONGEST IN YOU</p>
              <p className="text-xs text-[#8B7355] mb-4">These are the inner forces that shaped your answer. The ones that grew are quietly steering you.</p>
              <div className="space-y-2">
                {Object.entries(trajectory.atom_alignments).slice(0, 8).map(([, info]) => {
                  const parts = info.feeling.split("\u2014");
                  const name = parts[0].trim();
                  const explanation = parts.length > 1 ? parts[1].trim() : "";
                  return (
                    <div key={info.feeling} className="p-3 rounded minimal-card">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#1a1a2e] text-sm font-medium handwritten">{name}</span>
                        {info.grew ? (
                          <span className="text-[9px] font-medium text-[#FF6B00] mono px-1.5 py-0.5 rounded-full bg-[#FF6B00]/10">getting stronger</span>
                        ) : (
                          <span className="text-[9px] text-[#8B7355] mono px-1.5 py-0.5 rounded-full bg-[#8B7355]/10">fading</span>
                        )}
                      </div>
                      {explanation && <p className="text-[11px] text-[#8B7355] mb-2">{explanation}</p>}
                      <div className="h-1.5 rounded-full overflow-hidden bg-[#E8E0D4]">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(8, Math.abs(info.final) * 100)}%`, background: info.grew ? "#FF6B00" : "#8B7355" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Where you are right now */}
            <div className="p-5 rounded-lg text-center mb-8" style={{ background: "rgba(255, 107, 0, 0.04)", border: "1px solid rgba(255, 107, 0, 0.15)" }}>
              <p className="text-xs text-[#9b9b9b] sans tracking-wider mb-1">WHERE YOU ARE RIGHT NOW</p>
              <p className="text-2xl heading-elegant text-[#FF6B00]">{trajectory.final_display || trajectory.final_basin}</p>
              {trajectory.final_meaning && <p className="text-sm text-[#8B7355] mt-1">{trajectory.final_meaning}</p>}
            </div>

            <p className="text-[10px] text-[#9b9b9b] text-center sans mb-8">this is not prediction — the same inner forces always lead to the same place</p>
            </div>{/* end resultRef */}

            {/* Feedback */}
            <div className="minimal-card p-6 rounded-lg">
              <p className="text-sm sans text-[#1a1a2e] mb-3 font-medium">How was this?</p>
              {fbSent ? <p className="text-sm text-green-700 sans">Thank you.</p> : (
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
                    onClick={async () => { if (!fbMsg.trim()) return; setFbSending(true); try { await sendFeedback({ name: fbName, email: fbEmail, message: fbMsg, query: text }); setFbSent(true); track("feedback_sent"); } catch { setError("Feedback failed"); } finally { setFbSending(false); } }}
                    disabled={!fbMsg.trim() || fbSending}
                    className="px-6 py-2 rounded-full text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-[#1a1a1a] text-white hover:bg-[#333] sans">
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
