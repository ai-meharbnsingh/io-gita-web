"""Gemini integration — the tongue of io-gita.

Two jobs:
1. Parse: human language -> atom weights (what the person is feeling)
2. Narrate: trajectory data -> plain language interpretation

Key rotation: set GEMINI_API_KEYS=key1,key2,key3 in .env for multiple keys.
Falls back to single GEMINI_API_KEY if GEMINI_API_KEYS is not set.
Model fallback: gemini-2.5-pro -> gemini-2.5-flash on rate limits.
"""

import json
import logging
import os
import time
import concurrent.futures
from google import genai
from engine import ALL_ATOMS, ATOM_FEELINGS, PATTERN_MEANINGS

logger = logging.getLogger(__name__)

_clients: list = []
_current_key_idx = 0
_MODELS = ["gemini-2.5-pro", "gemini-2.5-flash"]


def _init_clients():
    global _clients
    if _clients:
        return
    keys_str = os.environ.get("GEMINI_API_KEYS", os.environ.get("GEMINI_API_KEY", ""))
    keys = [k.strip() for k in keys_str.split(",") if k.strip()]
    if not keys:
        raise RuntimeError("No Gemini API keys. Set GEMINI_API_KEYS or GEMINI_API_KEY in .env")
    _clients = [genai.Client(api_key=k) for k in keys]
    logger.info(f"Initialized {len(_clients)} Gemini API key(s)")


def _is_rate_limit(e: Exception) -> bool:
    err = str(e).lower()
    return any(s in err for s in ("429", "resource exhausted", "rate limit", "quota"))


_executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)


def _call_gemini_inner(prompt: str) -> str:
    """Inner Gemini call with key rotation and Pro -> Flash fallback."""
    _init_clients()
    global _current_key_idx
    n_keys = len(_clients)

    for model in _MODELS:
        keys_tried = 0
        while keys_tried < n_keys:
            client = _clients[_current_key_idx]
            try:
                response = client.models.generate_content(model=model, contents=prompt)
                return response.text.strip()
            except Exception as e:
                if _is_rate_limit(e):
                    logger.warning(
                        f"Rate limit on key {_current_key_idx + 1}/{n_keys} "
                        f"with {model}, rotating..."
                    )
                    _current_key_idx = (_current_key_idx + 1) % n_keys
                    keys_tried += 1
                    time.sleep(1)
                else:
                    raise
        logger.warning(f"All {n_keys} key(s) exhausted for {model}, trying next model...")

    raise RuntimeError(f"All API keys exhausted on all models: {', '.join(_MODELS)}")


def _call_gemini(prompt: str, timeout_seconds: int = 45) -> str:
    """Call Gemini with timeout protection (thread-safe)."""
    future = _executor.submit(_call_gemini_inner, prompt)
    try:
        return future.result(timeout=timeout_seconds)
    except concurrent.futures.TimeoutError:
        logger.error(f"Gemini API call timed out after {timeout_seconds}s")
        raise RuntimeError(f"Gemini timed out after {timeout_seconds}s")


def parse_feelings(text: str) -> dict:
    """Parse natural language into atom weights + plain feelings."""
    atom_list = "\n".join(
        f"- {atom}: {feeling}" for atom, feeling in ATOM_FEELINGS.items()
    )

    prompt = f"""You are io-gita's tongue. You translate human language into inner forces.

A person shared what's on their mind. Read their words carefully — not just what they SAY, but what's UNDERNEATH.

FEELINGS (20 forces):
{atom_list}

RULES:
- Return a JSON object with "weights" mapping atom names to floats in [-1.0, +1.0]
- Positive = DRIVING force (pushing, active, currently present)
- Negative = PULLING force (yearning for it, seeking it, drawn toward it)
- Zero = not relevant

CRITICAL — READ BETWEEN THE LINES:
- If someone keeps working despite suffering, KARMA is high (+0.7 to +0.9)
- If they want more/crave results, KAMA is active (+0.3 to +0.5)
- "Can't stop" or "thousands of thoughts" = RAJAS very high (+0.8 to +0.9)
- "Should I keep going" = SVADHARMA question (+0.5 to +0.7)
- Yearning for peace = MOKSHA NEGATIVE (-0.6 to -0.8), not positive
- Wanting clarity/calm = SATTVA NEGATIVE (-0.4 to -0.6)
- Frustration, unbearable = KRODHA present (+0.3 to +0.6)
- Mental heaviness/fog = TAMAS present (+0.2 to +0.4)
- "Should I do this or that" = BUDDHI active (+0.5 to +0.7)
- Working people always have some RAJYA (ambition +0.3 to +0.5)
- Every person has some DHARMA (duty, +0.1 to +0.3)

HIDDEN FORCES — AHANKARA (ego) and MAYA (illusion):
These two forces are NEVER visible to the person themselves. You must infer them carefully.
The user will NOT be able to adjust these — they are locked. So you must get them right.

AHANKARA (identity/ego) detection — ask yourself:
- Would this person feel LOST if the situation/work/role they describe disappeared? → +0.5 to +0.8
- Is their IDENTITY fused with what they do? ("I am my work", "this is who I am") → +0.6 to +0.9
- Do they describe achievements or capabilities as part of who they are? → +0.4 to +0.7
- Are they seeking recognition, validation, or status? → +0.5 to +0.8
- Do they say "I" frequently when describing their situation? → mild signal +0.3
- If they say "I don't care about recognition" — that's HIGHER ego, not lower. People at peace with ego don't mention it. → +0.6 to +0.8
- Someone who built something alone against all odds has deep ego investment even if noble → +0.5 to +0.7
- Be honest. Almost everyone has AHANKARA between +0.3 and +0.7. Below +0.3 is rare (monks, genuinely detached people).

MAYA (illusion) detection — ask yourself:
- Is there a contradiction in what they say? (want X but reject X) → +0.4 to +0.7
- Are they telling themselves a story about their situation that might be incomplete? → +0.3 to +0.6
- Do they believe something about themselves that their actions contradict? → +0.5 to +0.7
- "I don't want recognition" but clearly craving it = MAYA +0.6 to +0.8
- Be reasonable. Most people have MAYA between +0.2 and +0.5. Above +0.6 = clear self-deception.

Also return "ahankara_reason" and "maya_reason" — one sentence each explaining WHY you set these values.

CALIBRATION EXAMPLE:
Person says: "I can't stop working. My mind races. I want peace but can't rest."
Good weights: RAJAS: +0.85, KARMA: +0.80, BUDDHI: +0.65, AHANKARA: +0.50, RAJYA: +0.45, KAMA: +0.35, TAMAS: +0.30, MOKSHA: -0.70, VAIRAGYA: -0.55, SATTVA: -0.50, ATMA: -0.45, BHAKTI: -0.35, JNANA: -0.25, DHARMA: +0.20, KRODHA: +0.15, MAYA: +0.30
AHANKARA reason: "Identity is tied to work — can't rest because stopping means losing who they are."
MAYA reason: "Says they want peace but every action maintains the restlessness."
Notice: 15 atoms are active, not just 5-6. A full human has many forces at once.

PERSON'S WORDS:
"{text}"

Return ONLY valid JSON, no markdown:
{{"weights": {{"ATOM_NAME": 0.0, ...}}, "ahankara_reason": "...", "maya_reason": "..."}}"""

    raw = _call_gemini(prompt)

    # Clean markdown fencing if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    raw = raw.strip()

    data = json.loads(raw)
    weights = data.get("weights", data)

    # Clamp to [-1, 1] and filter valid atoms
    clean = {}
    for atom in ALL_ATOMS:
        w = weights.get(atom, 0)
        if isinstance(w, (int, float)):
            clean[atom] = max(-1.0, min(1.0, float(w)))
        else:
            clean[atom] = 0.0

    # Build feelings list (sorted by magnitude, only non-zero)
    feelings = []
    for atom, w in sorted(clean.items(), key=lambda x: -abs(x[1])):
        if abs(w) >= 0.05:
            feelings.append({
                "atom": atom,
                "feeling": ATOM_FEELINGS[atom],
                "weight": round(w, 2),
                "direction": "driving" if w > 0 else "pulling",
            })

    return {
        "weights": clean,
        "feelings": feelings,
        "ahankara_reason": data.get("ahankara_reason", ""),
        "maya_reason": data.get("maya_reason", ""),
    }


def narrate_result(trajectory: dict, original_text: str) -> str:
    """Narrate trajectory results in plain compassionate language."""
    # Build phases text — include ALL significant phases, not just named ones
    phases_text = ""
    for p in trajectory["phases"]:
        if p["duration"] >= 5:
            phases_text += f"- Visited '{p['display']}' for {p['duration']} steps"
            if p["meaning"]:
                phases_text += f" ({p['meaning']})"
            phases_text += "\n"

    linger_text = ""
    for l in trajectory["linger"][:5]:
        linger_text += f"- '{l['display']}': {l['steps']} steps ({l['pct']}%)"
        if l["meaning"]:
            linger_text += f" — {l['meaning']}"
        linger_text += "\n"

    forces_text = ""
    for atom, info in list(trajectory["atom_alignments"].items())[:10]:
        grew = "GREW (significant!)" if info["grew"] else "shrunk"
        forces_text += (
            f"- {atom} ({ATOM_FEELINGS[atom].split('—')[0].strip()}): "
            f"input {info['input']:+.2f} -> final {info['final']:+.3f} ({grew})\n"
        )

    final = trajectory["final_display"]
    final_meaning = trajectory["final_meaning"]

    prompt = f"""You are a wise, compassionate friend who explains inner patterns in simple everyday language.

A person shared: "{original_text}"

We analyzed their inner forces using the Bhagavad Gita's framework. Here is what we found:

WHERE THEIR MIND WENT:
{phases_text if phases_text else "Their mind settled quickly — not much inner conflict, one pattern dominates."}

WHAT THEY SPENT MOST TIME WITH:
{linger_text}

WHERE THEY ENDED UP: {final}
{f"This means: {final_meaning}" if final_meaning else ""}

WHICH INNER FORCES ARE STRONGEST:
{forces_text}

KEY PATTERNS:
- Forces that GREW = the real drivers (the person may not see them, but they are steering)
- Forces that SHRUNK = surface noise (feels loud but is fading)
- The final position = where their inner forces actually lead them

WRITE YOUR RESPONSE IN EXACTLY THREE SECTIONS using these exact headers:

## What's really driving you
3-4 sentences MAXIMUM. Like a wise friend talking over chai. Name what's actually pushing them — in plain words anyone can understand. Say "your answers reveal..." or "what we can see is..." Do NOT use words like topology, basin, attractor, entropy, atom, convergence, or any physics/math terms. Use everyday language: "the pull toward...", "a quiet strength growing...", "the restlessness is loud but fading..."

## Where this leads
2-3 sentences MAXIMUM. Explain where their current inner forces are taking them — in terms of daily life feelings and behavior. Like: "Right now, you're being pulled toward..." or "If nothing changes, you'll keep feeling..."

## What you can do
Exactly 3 steps. Each step = ONE clear sentence. Something they can do TODAY.
- Say "Try this:" or "This week:" — NOT "The topology suggests..."
- Be specific to their situation, not generic advice
- Example good step: "This week, before reacting to your family's opinion, pause and ask yourself: am I defending my idea, or my identity?"
- Example bad step: "Practice mindfulness and self-reflection" (too generic)

BILINGUAL FORMAT (MANDATORY):
After EVERY English paragraph, write the SAME meaning in Hindi using DEVANAGARI script (NOT Roman/transliteration).
The Hindi must be wrapped in *italics* markers.

Example format:
Your restlessness feels big but it's actually fading. What's really growing is a quiet pull toward clarity.

*आपकी बेचैनी बड़ी लगती है, लेकिन असल में यह कम हो रही है। जो सच में बढ़ रहा है वो है स्पष्टता की ओर एक शांत खिंचाव।*

The Hindi should sound like a caring elder speaking naturally — warm, simple, not textbook Hindi.

ABSOLUTE RULES:
- Total: UNDER 300 words (English + Hindi combined)
- ZERO technical/physics/math words. Write for a 16-year-old who has never studied science.
- Be specific to THIS person, not generic wisdom
- No emojis
- Keep sentences short. One idea per sentence.
- Leave a blank line between English and Hindi paragraphs for readability"""

    return _call_gemini(prompt)
