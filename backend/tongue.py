"""Gemini integration — the tongue of io-gita.

Two jobs:
1. Parse: human language -> atom weights (what the person is feeling)
2. Narrate: trajectory data -> plain language interpretation
"""

import json
import os
import google.generativeai as genai
from engine import ALL_ATOMS, ATOM_FEELINGS, PATTERN_MEANINGS

_model = None


def _get_model():
    global _model
    if _model is None:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        _model = genai.GenerativeModel("gemini-2.5-pro")
    return _model


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

    model = _get_model()
    response = model.generate_content(prompt)
    raw = response.text.strip()

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

    prompt = f"""You are io-gita's tongue. You translate topological reasoning into human language.

A person asked: "{original_text}"

A physics simulation of their inner forces ran for {trajectory['total_steps']} steps through a landscape of 60 attractor basins built from 20 Gita concepts. This is NOT AI prediction — it is deterministic topology. The same forces always produce the same path.

WHERE THE MIND TRAVELED:
{phases_text if phases_text else "The mind locked onto one position quickly — very little exploration."}

WHERE IT LINGERED LONGEST:
{linger_text}

FINAL SETTLEMENT: {final}
{f"Meaning: {final_meaning}" if final_meaning else "This is an unnamed position described by its dominant atoms."}

WHICH FORCES WON (this is the most important part):
{forces_text}

IMPORTANT PATTERNS TO NOTICE:
- Forces that GREW despite low input are the hidden drivers — the person doesn't see them but the topology reveals them
- Forces that SHRUNK despite high input were surface noise — loud but not structurally dominant
- If the mind locked on quickly with little exploration, the person is already captured by a specific force structure
- The final position is WHERE the person's forces actually lead, not where they think they want to go

WRITE YOUR RESPONSE IN EXACTLY THREE SECTIONS using these exact headers:

## What's driving you
2-3 paragraphs. Name the real forces — not the loud ones, the structural ones. Which forces GREW? Those are the real drivers. Which ones SHRUNK? Those were surface noise. Be specific: "Your restlessness feels huge but the topology shows it fading — it's not what's actually steering you. What grew was..."
Use warm, plain language. Use "the topology shows" not "I think."

## Where your forces lead
1-2 paragraphs. Explain the FINAL POSITION in everyday terms. Where does this force structure actually land? What does this position feel like in daily life? "In practical terms, this means you are..."

## The path through this
3-4 SPECIFIC, ACTIONABLE steps. NOT generic wisdom like "try meditation" or "see a therapist." Each step must:
- Come directly FROM THE TOPOLOGY DATA (which forces grew, where the mind settled)
- Be something the person can DO today
- Be framed as "The topology suggests..." or "What the forces show is..."

Structure:
- Step 1: Address the ROOT finding (usually identity/ego/illusion). Give a concrete question or exercise rooted in the topology. Example: "The topology found detachment growing from near-zero — it's already in you. Sit with this question: who are you if [the thing they're gripping] disappeared? Not as a thought exercise. As a genuine inquiry."
- Step 2: Address the GAP between stated desire and actual behavior. Name it specifically. Example: "You say you want peace but every action maintains the fight. The topology sees this gap clearly. Pick one action this week that aligns with what you SAY you want, not what you've been doing."
- Step 3: Address the QUIET FORCES that grew (truth, detachment, self-inquiry — whatever the topology found). These are the person's exit path. Example: "Beneath the noise, your pull toward understanding grew. Follow that thread — talk to the person in your life who sees you most clearly. Not about the problem. About you."
- Step 4 (optional): If family/relationship forces are present, address them specifically. "Your family's advice isn't about the business — the topology shows they're responding to the identity lock they can see but you can't."

These are not commands. They are reflections of what the physics computed. But they should be SPECIFIC enough that the person can act on them TODAY.

BILINGUAL FORMAT (MANDATORY):
After EVERY paragraph in English, write the SAME paragraph in Hindi (Roman script, NOT Devanagari).
The Hindi line must be wrapped in *italics* markers: *Hindi text here*

Example format:
Your restlessness feels huge but the topology shows it fading.
*Aapki bechaini bahut badi lagti hai, lekin topology dikhata hai ki yeh kam ho rahi hai.*

The Hindi should be natural spoken Hindi/Hinglish — the way a wise friend would talk, not formal textbook Hindi. Use "aap", "tumhari", "yeh" naturally. Keep English words like "topology" as-is in the Hindi.

RULES:
- Keep total under 700 words (English + Hindi combined)
- Be specific to THIS person's forces, not generic wisdom
- If ego grew, that is THE central finding — build around it
- No bullet points in the first two sections. Steps can be numbered.
- Do not use emojis
- EVERY English paragraph MUST have a Hindi (Roman script) paragraph immediately after it"""

    model = _get_model()
    response = model.generate_content(prompt)
    return response.text.strip()
