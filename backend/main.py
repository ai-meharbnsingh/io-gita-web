"""io-gita API — FastAPI backend.

Endpoints:
  POST /api/parse      — text -> feelings + atom weights (LLM, legacy)
  POST /api/reason     — atom weights -> trajectory + interpretation
  POST /api/query      — full pipeline via LLM (legacy)
  POST /api/guna-query — Guna×Domain pipeline: answers + text -> trajectory + narration (no LLM for sensing)
  GET  /api/questions   — return the 11 Guna×Domain questions
  POST /api/feedback   — send feedback email
  GET  /health         — health check
"""

import os
import json
import time
import pathlib
import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from engine import build_network, run_query, ATOM_FEELINGS, ALL_ATOMS, GitaNetwork
from guna_sensing import guna_to_atoms, guna_to_alpha, get_domain_questions, trajectory_entropy, entropy_interpretation
import tongue

# Global network (built once at startup)
_net: GitaNetwork | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _net
    d = int(os.environ.get("GITA_D", 10_000))
    print(f"Building 20-atom Gita network (D={d}, 60 patterns)...")
    t0 = time.time()
    _net = build_network(D=d)
    print(f"Network ready in {time.time() - t0:.1f}s (D={_net.D})")
    yield


app = FastAPI(title="io-gita API", version="0.1.0", lifespan=lifespan)

# Thread pool for CPU-heavy ODE computation — keeps event loop free for health checks
_pool = ThreadPoolExecutor(max_workers=2)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request / Response models ---

class ParseRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=2000)

class ReasonRequest(BaseModel):
    weights: dict[str, float]
    text: str = ""

class QueryRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=2000)

class GunaQueryRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=2000)
    answers: dict[str, str]  # {domain_id: "S"|"R"|"T"}

class FeedbackRequest(BaseModel):
    name: str = Field("", max_length=100)
    email: str = Field("", max_length=200)
    message: str = Field(..., min_length=3, max_length=5000)
    query: str = Field("", max_length=2000)


# --- Endpoints ---

@app.get("/health")
@app.head("/health")
def health():
    return {"status": "ok", "network": _net is not None, "D": _net.D if _net else 0}


@app.get("/api/ode-timing")
def ode_timing():
    """Quick ODE benchmark — returns timing without Gemini."""
    if _net is None:
        return {"error": "not ready"}
    weights = {a: 0.3 for a in ALL_ATOMS}
    t0 = time.time()
    traj = run_query(weights, _net)
    elapsed = time.time() - t0
    return {"ode_seconds": round(elapsed, 3), "D": _net.D, "steps": traj["total_steps"]}


@app.post("/api/parse")
def parse(req: ParseRequest):
    """Parse text into feelings + atom weights via Gemini."""
    try:
        result = tongue.parse_feelings(req.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parse failed: {str(e)}")


@app.post("/api/reason")
def reason(req: ReasonRequest):
    """Run ODE with given weights, return trajectory + interpretation."""
    if _net is None:
        raise HTTPException(status_code=503, detail="Network not ready")

    # Validate weights
    clean = {}
    for atom in ALL_ATOMS:
        w = req.weights.get(atom, 0)
        clean[atom] = max(-1.0, min(1.0, float(w)))

    trajectory = run_query(clean, _net)

    narration = ""
    if req.text:
        try:
            narration = tongue.narrate_result(trajectory, req.text)
        except Exception:
            narration = ""

    return {
        "trajectory": trajectory,
        "narration": narration,
    }


@app.post("/api/query")
def full_query(req: QueryRequest):
    """Full pipeline: text -> parse -> run ODE -> narrate."""
    if _net is None:
        raise HTTPException(status_code=503, detail="Network not ready")

    # Step 1: Parse feelings
    try:
        parsed = tongue.parse_feelings(req.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parse failed: {str(e)}")

    # Step 2: Run ODE
    trajectory = run_query(parsed["weights"], _net)

    # Step 3: Narrate
    narration = ""
    try:
        narration = tongue.narrate_result(trajectory, req.text)
    except Exception:
        pass

    return {
        "feelings": parsed["feelings"],
        "weights": parsed["weights"],
        "trajectory": trajectory,
        "narration": narration,
    }


@app.get("/api/atoms")
def get_atoms():
    """Return atom list with feelings (for frontend reference)."""
    return {
        "atoms": [
            {"name": atom, "feeling": ATOM_FEELINGS[atom]}
            for atom in ALL_ATOMS
        ]
    }


@app.get("/api/questions")
def get_questions():
    """Return the 11 Guna×Domain questions for the frontend."""
    return {"questions": get_domain_questions()}


def _run_guna_pipeline(answers: dict, text: str, net) -> dict:
    """Sync heavy work: ODE + Gemini narration. Runs in thread pool."""
    t0 = time.time()

    weights = guna_to_atoms(answers)
    alpha = guna_to_alpha(answers)

    t1 = time.time()
    trajectory = run_query(weights, net, alpha=alpha)
    t2 = time.time()

    entropy = trajectory_entropy(trajectory["linger"])
    entropy_text = entropy_interpretation(entropy)

    narration = ""
    try:
        narration = tongue.narrate_result(trajectory, text)
    except Exception as e:
        print(f"[WARN] Narration failed: {e}")
    t3 = time.time()

    print(f"[TIMING] guna-query: ODE={t2-t1:.2f}s narrate={t3-t2:.2f}s total={t3-t0:.2f}s D={net.D}")

    return {
        "weights": weights,
        "alpha": alpha,
        "entropy": entropy,
        "entropy_text": entropy_text,
        "trajectory": trajectory,
        "narration": narration,
    }


@app.post("/api/guna-query")
async def guna_query(req: GunaQueryRequest):
    """Guna×Domain pipeline: answers + text -> trajectory + narration.

    Async so health checks aren't blocked by ODE/Gemini computation.
    """
    if _net is None:
        raise HTTPException(status_code=503, detail="Network not ready")

    # Validate answers (supports multi-select: "S", "R", "T", "S,R", "S,T", "R,T")
    valid_ids = {d["id"] for d in get_domain_questions()}
    for did, choice in req.answers.items():
        if did not in valid_ids:
            raise HTTPException(status_code=400, detail=f"Unknown domain: {did}")
        parts = choice.split(",")
        for p in parts:
            if p not in ("S", "R", "T"):
                raise HTTPException(status_code=400, detail=f"Invalid choice for {did}: {choice}")

    if len(req.answers) < 11:
        raise HTTPException(status_code=400, detail=f"Need 11 answers, got {len(req.answers)}")

    # Run heavy computation in thread pool so event loop stays free for health checks
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(_pool, _run_guna_pipeline, req.answers, req.text, _net)
    return result


FB_FILE = pathlib.Path("feedback.jsonl")


@app.post("/api/feedback")
def save_feedback(req: FeedbackRequest):
    """Store feedback. Viewable at /api/feedback/list."""
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "name": req.name or "Anonymous",
        "email": req.email or "",
        "message": req.message,
        "query": req.query or "",
    }
    print(f"[FEEDBACK] {json.dumps(entry)}")
    with open(FB_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    return {"status": "saved"}


@app.get("/api/feedback/list")
def list_feedback():
    """View all feedback. Visit this URL to check responses."""
    if not FB_FILE.exists():
        return {"feedback": [], "count": 0}
    entries = []
    for line in FB_FILE.read_text().strip().split("\n"):
        if line.strip():
            entries.append(json.loads(line))
    entries.reverse()
    return {"feedback": entries, "count": len(entries)}
