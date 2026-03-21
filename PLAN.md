# Project 24: io-gita Shubharambh — Interactive Web Interface

## One-Line
First public interactive io-gita experience: ask a life dilemma, watch the topology reason, see where you're torn.

## Architecture

```
USER (io-gita.com)
    |
    v
[FRONTEND — Vercel / Next.js]         ← io-gita.com domain
    |  Static landing + interactive query page
    |  Streams trajectory in real-time
    |  Correction loop UI (adjust feelings, rerun)
    |
    | REST API calls
    v
[BACKEND — Railway / Python FastAPI]   ← api.io-gita.com (or /api proxy)
    |  sg_engine (numpy ODE dynamics)
    |  Gemini LLM (tongue: language <-> atom weights)
    |  20-atom Gita network (prebuilt, cached)
    |
    v
[sg_engine core]
    Network(D=10000, 60 patterns, 20 atoms)
    ODE: dQ/dt = -Q + tanh(B*P^T(P@Q/D)) + a*F
    Atlas (transition graph)
    Trajectory -> basin visits -> linger analysis -> atom alignment
```

## The Pipeline (What Happens Per Query)

```
1. User types: "My mind doesn't find peace, should I keep working or seek spirituality?"
2. Frontend sends to backend: POST /api/query {text: "..."}
3. Backend:
   a. Gemini parses text -> atom_weights {RAJAS: +0.90, KARMA: +0.80, ...}
   b. Show weights to user as plain-English feelings (NOT atom names)
   c. User confirms or adjusts ("desire is stronger", "frustration is high")
   d. Backend recomposes force vector from final weights
   e. Runs ODE (800 steps, alpha=0.35) from neutral start
   f. Gemini narrates the trajectory back to plain language
4. Frontend displays:
   a. Animated trajectory visualization (basins visited, linger times)
   b. Final basin + interpretation
   c. "Which forces won" breakdown
   d. Option to adjust and rerun
```

## Pages

### 1. Landing Page (/)
- What is io-gita? (one-paragraph explanation)
- "Ask your first question" CTA
- How it works (3-step visual: You speak -> Topology reasons -> You see)
- Not a chatbot. Not an advisor. A mirror.

### 2. Query Page (/ask)
- Text input: "What's on your mind?"
- Step 1: System shows parsed feelings (plain English, sliders)
- Step 2: User confirms/adjusts
- Step 3: Watch the trajectory (animated or step-by-step)
- Step 4: See the result + interpretation
- "Adjust and rerun" button

### 3. About (/about)
- The science: topology, attractors, Gita atoms
- Link to paper / research
- Who built this

## Tech Stack

### Frontend (Vercel)
- Next.js 16 (App Router, Server Components)
- Tailwind CSS (dark mode, zinc tokens)
- Geist font
- No auth needed for v1 (public, rate-limited)

### Backend (Railway)
- Python 3.11+ / FastAPI
- sg_engine (copied or pip-installed from local)
- google-generativeai (Gemini API)
- numpy (ODE dynamics)
- uvicorn

### API Endpoints (Backend)

| Method | Path | What |
|--------|------|------|
| GET | /health | Health check |
| POST | /api/parse | Text -> atom weights via Gemini. Returns feelings in plain English + raw weights |
| POST | /api/run | atom_weights -> run ODE -> trajectory + linger + final basin + atom alignment |
| POST | /api/interpret | trajectory data -> Gemini narrates in plain language |
| POST | /api/query | Full pipeline: text -> parse -> run -> interpret (convenience) |

### Gemini Integration
- Model: gemini-2.0-flash (fast, cheap) or gemini-1.5-pro (quality)
- Two LLM calls per query:
  1. Parse: "Given these 20 atoms with meanings, map this question to weights" (structured JSON output)
  2. Narrate: "Given this trajectory and final state, explain what it means" (plain text)
- Prompt includes ATOM_MEANINGS and PATTERN_MEANINGS from sg_engine.presets

## Deployment

### Vercel (Frontend)
- `vercel link` -> connect to io-gita.com
- Next.js auto-detected
- Environment: NEXT_PUBLIC_API_URL=https://api.io-gita.com (or Railway URL)

### Railway (Backend)
- Python FastAPI app
- Dockerfile or nixpacks auto-detect
- Environment: GEMINI_API_KEY, CORS_ORIGINS
- Custom domain: api.io-gita.com (or use Railway-provided URL)

### Domain Setup
- io-gita.com -> Vercel (A/CNAME records)
- api.io-gita.com -> Railway (CNAME record)

## What I Need From You (Questions)

1. **Gemini model**: gemini-2.0-flash (fast/cheap) or gemini-1.5-pro (better quality)?
   - For parsing atoms, flash is probably fine
   - For narrating trajectory, pro might give richer language

2. **Domain registrar**: Where is io-gita.com registered? (Namecheap? GoDaddy? Cloudflare?)
   - Need to set DNS records pointing to Vercel + Railway

3. **Railway account**: Do you have one? Is `railway` CLI already logged in?

4. **Gemini API key**: Do you have one ready? Where should I store it?

5. **Scope for v1**:
   - Just the query page (minimal)? Or landing + query + about?
   - Rate limiting? (suggest: 10 queries/hour per IP for free tier)
   - Save query history? (suggest: no for v1, keep it stateless)

6. **sg_engine deployment**:
   - Copy the engine code into the backend? (simplest)
   - Or pip install from local path? (cleaner but harder on Railway)
   - Suggest: copy sg_engine/ folder into backend, it's self-contained (only needs numpy)

7. **Visual style**:
   - Dark mode (matches the existing demo)?
   - Any specific aesthetic? (suggest: minimal, dark, Geist font, no clutter)

## What Already Exists (Reusable)

| Asset | Location | Reuse |
|-------|----------|-------|
| sg_engine library | project_22/io-gita/sg_engine/ | Copy entire folder into backend |
| 20-atom presets | sg_engine/presets.py | build_gita_network(), ATOM_MEANINGS, PATTERN_MEANINGS |
| Personal query pipeline | meharban_query.py | Reference implementation for backend /api/run |
| FastAPI structure | sg_engine/api.py | Pattern for new endpoints |
| Demo HTML/CSS | sg_engine/demo/index.html | Dark theme reference, vis.js graph |
| ODE dynamics | sg_engine/network.py | Core computation (run_dynamics) |

## Phases

### Phase 1: Backend (Railway)
- Copy sg_engine into backend project
- New FastAPI app with /parse, /run, /interpret, /query endpoints
- Gemini integration for parse + narrate
- CORS for io-gita.com
- Deploy to Railway
- Test with curl

### Phase 2: Frontend (Vercel)
- Next.js 16 project
- Landing page (/)
- Query page (/ask) with full interaction loop
- Dark mode, Geist, Tailwind
- Deploy to Vercel
- Connect io-gita.com domain

### Phase 3: Integration Test
- Full end-to-end: type question -> see result
- Run YOUR original query as the test case
- Compare output to meharban_query.py results
- Verify trajectory matches

### Phase 4: Polish
- Trajectory visualization (animated basins)
- Mobile responsive
- Error handling
- Rate limiting
