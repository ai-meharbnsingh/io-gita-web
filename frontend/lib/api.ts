const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Feeling {
  atom: string;
  feeling: string;
  weight: number;
  direction: "driving" | "pulling";
}

export interface Phase {
  basin: string;
  display: string;
  meaning: string;
  start: number;
  end: number;
  duration: number;
  is_named: boolean;
}

export interface LingerItem {
  basin: string;
  display: string;
  meaning: string;
  steps: number;
  pct: number;
  is_named: boolean;
}

export interface AtomAlignment {
  final: number;
  input: number;
  feeling: string;
  direction: "active" | "opposing";
  grew: boolean;
}

export interface Trajectory {
  total_steps: number;
  phases: Phase[];
  linger: LingerItem[];
  final_basin: string;
  final_display: string;
  final_meaning: string;
  final_top: { basin: string; display: string; similarity: number }[];
  atom_alignments: Record<string, AtomAlignment>;
  input_weights: Record<string, number>;
}

export interface ParseResult {
  feelings: Feeling[];
  weights: Record<string, number>;
  ahankara_reason: string;
  maya_reason: string;
}

export interface ReasonResult {
  trajectory: Trajectory;
  narration: string;
}

export interface QueryResult {
  feelings: Feeling[];
  weights: Record<string, number>;
  trajectory: Trajectory;
  narration: string;
}

export async function parseFeelings(text: string): Promise<ParseResult> {
  const res = await fetch(`${API}/api/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Parse failed: ${res.status}`);
  return res.json();
}

export async function runReason(
  weights: Record<string, number>,
  text: string
): Promise<ReasonResult> {
  const res = await fetch(`${API}/api/reason`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weights, text }),
  });
  if (!res.ok) throw new Error(`Reason failed: ${res.status}`);
  return res.json();
}

export async function fullQuery(text: string): Promise<QueryResult> {
  const res = await fetch(`${API}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status}`);
  return res.json();
}

export interface DomainQuestion {
  id: string;
  domain: string;
  question: string;
  answers: { S: string; R: string; T: string };
}

export async function getQuestions(): Promise<DomainQuestion[]> {
  const res = await fetch(`${API}/api/questions`);
  if (!res.ok) throw new Error(`Questions failed: ${res.status}`);
  const data = await res.json();
  return data.questions;
}

export interface GunaResult {
  weights: Record<string, number>;
  alpha: number;
  entropy: number;
  entropy_text: string;
  trajectory: Trajectory;
  narration: string;
}

export async function gunaQuery(
  text: string,
  answers: Record<string, string>
): Promise<GunaResult> {
  const res = await fetch(`${API}/api/guna-query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, answers }),
  });
  if (!res.ok) throw new Error(`Guna query failed: ${res.status}`);
  return res.json();
}

export async function sendFeedback(data: {
  name: string;
  email: string;
  message: string;
  query: string;
}): Promise<{ status: string }> {
  const res = await fetch(`/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Feedback failed: ${res.status}`);
  return res.json();
}
