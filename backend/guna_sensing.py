"""Guna×Domain Sensing Layer — The Gita's Own Classification System.

Based on Bhagavad Gita Chapter 18 (verses 18.20-18.39) and Chapter 17.
11 domains × 3 guna qualities = deterministic atom weight mapping.
No LLM. No bias. The Gita itself provides the sensing framework.

Research basis:
- 8 parallel research agents confirmed: Nava Rasa is a category error
- Gita Ch.18 Guna×Domain is the correct primary framework
- Triguna is psychometrically validated (VPI α=0.94, MTS α=0.97)
- AHANKARA has 3 modes (Sankhya Karika v25): sattvic/rajasic/tamasic
- Patanjali's Klesha hierarchy is emergent in the topology (verified)
- MAYA is the most important atom to sense accurately
"""

from engine import ALL_ATOMS

# ── The 11 Gita Domains (Ch.17-18) ──────────────────────────────────
#
# Each domain is a question about HOW the person operates.
# The answer reveals the guna quality: Sattvic / Rajasic / Tamasic.
#
# Each guna-answer maps to specific atom weights.
# These mappings come directly from the Gita's own descriptions.

DOMAINS = [
    {
        "id": "action",
        "domain": "Action (Karma)",
        "verse": "18.23-25",
        "question": "When you act, what drives you?",
        "answers": {
            "S": {
                "label": "I do what needs doing, without thinking about reward",
                "gita": "Free from attachment, without desire for reward (18.23)",
            },
            "R": {
                "label": "I act to achieve results — success matters to me",
                "gita": "Prompted by selfish desire, enacted with pride, full of stress (18.24)",
            },
            "T": {
                "label": "I act without thinking about consequences or impact",
                "gita": "Begun out of delusion, without thought to consequences (18.25)",
            },
        },
        "atom_weights": {
            "S": {"KARMA": 0.7, "DHARMA": 0.6, "TYAGA": 0.5, "SATTVA": 0.4, "AHANKARA": -0.3},
            "R": {"KARMA": 0.8, "RAJYA": 0.6, "RAJAS": 0.5, "AHANKARA": 0.5, "KAMA": 0.4},
            "T": {"KARMA": 0.3, "TAMAS": 0.6, "MAYA": 0.5, "AHANKARA": 0.3},
        },
    },
    {
        "id": "knowledge",
        "domain": "Knowledge (Jnana)",
        "verse": "18.20-22",
        "question": "How do you see the world around you?",
        "answers": {
            "S": {
                "label": "I see connections — everything is part of a larger whole",
                "gita": "Sees one undivided reality within all beings (18.20)",
            },
            "R": {
                "label": "I see separate people with separate lives and interests",
                "gita": "Sees manifold entities as individual and unconnected (18.21)",
            },
            "T": {
                "label": "I fixate on one thing as if it's the whole picture",
                "gita": "Engrossed in a fragment as if it encompasses the whole (18.22)",
            },
        },
        "atom_weights": {
            "S": {"JNANA": 0.7, "SATYA": 0.6, "ATMA": 0.5, "SATTVA": 0.5, "MAYA": -0.4},
            "R": {"JNANA": 0.3, "RAJYA": 0.4, "RAJAS": 0.3, "AHANKARA": 0.4},
            "T": {"MAYA": 0.7, "TAMAS": 0.5, "JNANA": -0.3, "BUDDHI": -0.4},
        },
    },
    {
        "id": "intellect",
        "domain": "Intellect (Buddhi)",
        "verse": "18.30-32",
        "question": "When you face a difficult decision, what happens in your mind?",
        "answers": {
            "S": {
                "label": "I can see what's right and what's wrong, even when it's hard",
                "gita": "Understands proper and improper action, bondage and liberation (18.30)",
            },
            "R": {
                "label": "I go back and forth — it's hard to tell what's right",
                "gita": "Confused between righteousness and unrighteousness (18.31)",
            },
            "T": {
                "label": "I convince myself that what I want is what's right",
                "gita": "Imagines irreligion to be religion, perceives untruth to be truth (18.32)",
            },
        },
        "atom_weights": {
            "S": {"BUDDHI": 0.8, "SATYA": 0.5, "DHARMA": 0.5, "SATTVA": 0.4},
            "R": {"BUDDHI": 0.4, "RAJAS": 0.5, "MAYA": 0.3, "AHANKARA": 0.3},
            "T": {"BUDDHI": -0.3, "MAYA": 0.8, "TAMAS": 0.4, "AHANKARA": 0.5, "SATYA": -0.5},
        },
    },
    {
        "id": "resolve",
        "domain": "Resolve (Dhriti)",
        "verse": "18.33-35",
        "question": "What keeps you going when things get hard?",
        "answers": {
            "S": {
                "label": "Inner steadiness — I stay centered regardless of outcome",
                "gita": "Steadfast willpower that sustains mind, life, and senses through yoga (18.33)",
            },
            "R": {
                "label": "I push through because I want the reward at the end",
                "gita": "Holds on to duty, pleasures, wealth out of attachment (18.34)",
            },
            "T": {
                "label": "I can't let go of worry, fear, or sadness — they drive me",
                "gita": "Does not give up dreaming, fearing, grieving, despair (18.35)",
            },
        },
        "atom_weights": {
            "S": {"SVADHARMA": 0.7, "SATTVA": 0.6, "VAIRAGYA": 0.4, "DHARMA": 0.4, "MOKSHA": 0.3},
            "R": {"KARMA": 0.5, "KAMA": 0.6, "RAJYA": 0.4, "RAJAS": 0.4, "AHANKARA": 0.4},
            "T": {"TAMAS": 0.7, "RAJAS": 0.5, "MAYA": 0.4, "KRODHA": 0.3, "MOKSHA": -0.4},
        },
    },
    {
        "id": "happiness",
        "domain": "Happiness (Sukha)",
        "verse": "18.37-39",
        "question": "What kind of happiness do you seek?",
        "answers": {
            "S": {
                "label": "The kind that's hard at first but deeply satisfying later",
                "gita": "Like poison first, nectar later — born of self-knowledge (18.37)",
            },
            "R": {
                "label": "The kind that feels great now, even if it costs me later",
                "gita": "Like nectar first, poison later — from sense contact (18.38)",
            },
            "T": {
                "label": "I mostly just want the noise to stop — sleep, escape, numbness",
                "gita": "Delusion from beginning to end — from sleep, laziness, illusion (18.39)",
            },
        },
        "atom_weights": {
            "S": {"SATTVA": 0.7, "MOKSHA": 0.5, "ATMA": 0.5, "JNANA": 0.3, "VAIRAGYA": 0.3},
            "R": {"KAMA": 0.7, "RAJAS": 0.5, "RAJYA": 0.3, "AHANKARA": 0.3},
            "T": {"TAMAS": 0.8, "MAYA": 0.4, "MOKSHA": -0.5, "SATTVA": -0.4, "VAIRAGYA": 0.3},
        },
    },
    {
        "id": "doer",
        "domain": "Doer (Karta)",
        "verse": "18.26-28",
        "question": "How do you relate to your work and its results?",
        "answers": {
            "S": {
                "label": "I give my best but don't take success or failure personally",
                "gita": "Free from ego, endowed with enthusiasm, unaffected by success or failure (18.26)",
            },
            "R": {
                "label": "Success is mine, failure is mine — I own the results",
                "gita": "Craves fruits of work, covetous, moved by joy and sorrow (18.27)",
            },
            "T": {
                "label": "I put things off, cut corners, or just go through the motions",
                "gita": "Undisciplined, stubborn, deceitful, slothful, a procrastinator (18.28)",
            },
        },
        "atom_weights": {
            "S": {"TYAGA": 0.6, "KARMA": 0.5, "SATTVA": 0.4, "AHANKARA": -0.5, "SVADHARMA": 0.4},
            "R": {"AHANKARA": 0.7, "KAMA": 0.5, "RAJAS": 0.5, "KARMA": 0.6, "RAJYA": 0.4},
            "T": {"TAMAS": 0.7, "AHANKARA": 0.3, "MAYA": 0.4, "KARMA": -0.3, "DHARMA": -0.3},
        },
    },
    {
        "id": "devotion",
        "domain": "Faith / Devotion (Shraddha)",
        "verse": "17.2-4",
        "question": "What do you truly value — what would you protect at any cost?",
        "answers": {
            "S": {
                "label": "Truth, growth, understanding — even if it's uncomfortable",
                "gita": "Sattvic faith: worship of what illuminates (17.4)",
            },
            "R": {
                "label": "My family, my position, my achievements — what I've built",
                "gita": "Rajasic faith: worship of power and wealth (17.4)",
            },
            "T": {
                "label": "Comfort, security, not being disturbed — leave me alone",
                "gita": "Tamasic faith: worship of inertia and avoidance (17.4)",
            },
        },
        "atom_weights": {
            "S": {"BHAKTI": 0.7, "SATYA": 0.6, "ATMA": 0.5, "JNANA": 0.4, "SATTVA": 0.4},
            "R": {"KULA": 0.7, "RAJYA": 0.6, "AHANKARA": 0.5, "KAMA": 0.4, "RAJAS": 0.3},
            "T": {"TAMAS": 0.7, "MAYA": 0.4, "VAIRAGYA": 0.3, "MOKSHA": -0.3},
        },
    },
    {
        "id": "sacrifice",
        "domain": "Sacrifice / Letting Go (Tyaga)",
        "verse": "17.11-13",
        "question": "When you give something up, why do you do it?",
        "answers": {
            "S": {
                "label": "Because it's right — I don't expect anything in return",
                "gita": "Performed as duty, without expectation of reward (17.11)",
            },
            "R": {
                "label": "I give, but I notice — I want acknowledgment or reciprocity",
                "gita": "Performed for show or with hope of return (17.12)",
            },
            "T": {
                "label": "I rarely give up anything willingly — why should I?",
                "gita": "Devoid of faith, contrary to one's duty (17.13)",
            },
        },
        "atom_weights": {
            "S": {"TYAGA": 0.8, "DHARMA": 0.6, "SATTVA": 0.4, "AHANKARA": -0.3, "BHAKTI": 0.3},
            "R": {"TYAGA": 0.3, "AHANKARA": 0.5, "KAMA": 0.4, "RAJYA": 0.3, "RAJAS": 0.3},
            "T": {"TYAGA": -0.4, "TAMAS": 0.5, "AHANKARA": 0.4, "KAMA": 0.3},
        },
    },
    {
        "id": "discipline",
        "domain": "Discipline / Austerity (Tapas)",
        "verse": "17.17-19",
        "question": "How do you approach discipline and self-improvement?",
        "answers": {
            "S": {
                "label": "I practice steadily, without needing to prove anything",
                "gita": "Supreme faith, no reward sought (17.17)",
            },
            "R": {
                "label": "I push hard — I want people to see my dedication",
                "gita": "For honor, respect, adoration — unstable, transitory (17.18)",
            },
            "T": {
                "label": "I avoid discomfort — or I punish myself destructively",
                "gita": "Self-torture or performed to harm — rooted in foolish stubbornness (17.19)",
            },
        },
        "atom_weights": {
            "S": {"SVADHARMA": 0.6, "SATTVA": 0.5, "KARMA": 0.4, "VAIRAGYA": 0.3, "DHARMA": 0.3},
            "R": {"RAJAS": 0.6, "AHANKARA": 0.6, "RAJYA": 0.4, "KAMA": 0.3},
            "T": {"TAMAS": 0.6, "KRODHA": 0.4, "MAYA": 0.3, "AHANKARA": 0.3},
        },
    },
    # ── MAYA DETECTION: The Gap Question ──
    # This is the most important question. MAYA (illusion) is the root
    # klesha (Avidya). The topology test proved: set MAYA alone and
    # AHANKARA, KAMA, KRODHA, TAMAS all emerge downstream.
    {
        "id": "maya_gap",
        "domain": "Self-Honesty (Maya Detection)",
        "verse": "Patanjali 2.5 + Gita 18.32",
        "question": "Think about what you SAY matters to you vs what you actually DO day-to-day. How big is the gap?",
        "answers": {
            "S": {
                "label": "Small gap — my actions mostly match my stated values",
                "gita": "Avidya attenuated: the four confusions are weakened (YS 2.4: tanu)",
            },
            "R": {
                "label": "Moderate gap — I know what I should do but I chase other things",
                "gita": "Avidya intermittent: comes and goes, raga/dvesha override (YS 2.4: vicchinna)",
            },
            "T": {
                "label": "I haven't thought about it — or I tell myself there's no gap",
                "gita": "Avidya active: mistaking impermanent for permanent (YS 2.5: udara)",
            },
        },
        "atom_weights": {
            "S": {"SATYA": 0.6, "SATTVA": 0.5, "MAYA": -0.5, "DHARMA": 0.4, "SVADHARMA": 0.4},
            "R": {"MAYA": 0.5, "RAJAS": 0.4, "KAMA": 0.4, "AHANKARA": 0.3, "SATYA": -0.2},
            "T": {"MAYA": 0.9, "TAMAS": 0.4, "AHANKARA": 0.4, "SATYA": -0.5, "BUDDHI": -0.3},
        },
    },
    # ── AHANKARA DETECTION: Identity Fusion ──
    # Behavioral, not self-report. "Would you be lost?" reveals
    # identity fusion better than "how much ego do you have?"
    {
        "id": "identity",
        "domain": "Identity (Ahankara Detection)",
        "verse": "Sankhya Karika 25, YS 2.6",
        "question": "If the main thing in your life right now — your work, role, relationship — vanished tomorrow, what would happen to your sense of self?",
        "answers": {
            "S": {
                "label": "I'd grieve the loss, but I know who I am beyond it",
                "gita": "Purusha distinct from Prakriti — seer not confused with seen (YS 2.6)",
            },
            "R": {
                "label": "I'd feel shaken — a big part of me IS this thing",
                "gita": "Rajasic ahankara: identity fused with action and results (SK 25)",
            },
            "T": {
                "label": "I can't even imagine it — it would destroy me",
                "gita": "Tamasic ahankara: identity so fused that separation = annihilation (SK 25)",
            },
        },
        "atom_weights": {
            "S": {"ATMA": 0.7, "VAIRAGYA": 0.5, "SATTVA": 0.4, "AHANKARA": -0.3, "MOKSHA": 0.3},
            "R": {"AHANKARA": 0.7, "KARMA": 0.5, "RAJAS": 0.4, "KAMA": 0.3, "SVADHARMA": 0.3},
            "T": {"AHANKARA": 0.9, "TAMAS": 0.5, "MAYA": 0.5, "KULA": 0.4, "MOKSHA": -0.5},
        },
    },
]


# Atoms that represent "higher" states — their ABSENCE in a rajasic/tamasic
# person creates a PULL (negative weight = seeking but not having)
SATTVIC_ATOMS = {"SATTVA", "VAIRAGYA", "ATMA", "MOKSHA"}

# Atoms that represent afflictions — their ABSENCE in a sattvic
# person creates a gentle negative (not struggling with these)
KLESHA_ATOMS = {"KRODHA", "KAMA", "TAMAS"}


def guna_to_atoms(answers: dict) -> dict:
    """Convert 11 domain answers (S/R/T) to 20 atom weights.

    Uses 3-channel proportional mixing (4-way consensus fix:
    Claude + Codex/GPT-5.2 + Gemini-2.5-Pro + Kimi).

    Problem solved: Raw additive accumulation let Sattvic answers
    dominate because S touches ~11 unique atoms vs R(~4) and T(~3).
    4/11 Sattvic answers produced the same basin as 11/11 Sattvic.

    Fix: Accumulate S/R/T into separate channels, normalize each
    channel independently (L2), then mix proportionally by count.
    F = (n_S/11) * normalize(F_S) + (n_R/11) * normalize(F_R) + (n_T/11) * normalize(F_T)

    Args:
        answers: {domain_id: "S"|"R"|"T"} for each of the 11 domains.

    Returns:
        {atom_name: float_weight} clamped to [-1, +1].
    """
    import math

    # Separate channels
    atoms_s = {a: 0.0 for a in ALL_ATOMS}
    atoms_r = {a: 0.0 for a in ALL_ATOMS}
    atoms_t = {a: 0.0 for a in ALL_ATOMS}

    counts = {"S": 0, "R": 0, "T": 0}

    # Accumulate into separate channels
    for domain in DOMAINS:
        did = domain["id"]
        choice = answers.get(did)
        if choice not in ("S", "R", "T"):
            continue
        counts[choice] += 1
        target = {"S": atoms_s, "R": atoms_r, "T": atoms_t}[choice]
        for atom, weight in domain["atom_weights"][choice].items():
            target[atom] += weight

    # L2-normalize each channel independently
    def l2_normalize(vec):
        norm = math.sqrt(sum(v ** 2 for v in vec.values()))
        if norm < 1e-10:
            return vec
        return {k: v / norm for k, v in vec.items()}

    atoms_s = l2_normalize(atoms_s)
    atoms_r = l2_normalize(atoms_r)
    atoms_t = l2_normalize(atoms_t)

    # Proportional mixing: each guna weighted by its fraction of answers
    total = sum(counts.values()) or 1
    p_s = counts["S"] / total
    p_r = counts["R"] / total
    p_t = counts["T"] / total

    atoms = {}
    for a in ALL_ATOMS:
        atoms[a] = p_s * atoms_s[a] + p_r * atoms_r[a] + p_t * atoms_t[a]

    # Opposition injection: minority gunas create negative pull on
    # the majority guna's characteristic atoms. This prevents the
    # default attractor (s:53) from capturing mixed profiles.
    # When 7/11 answers are R, the R channel should push AGAINST
    # the S-typical atoms that would otherwise attract to s:53.
    dominant = max(counts, key=counts.get)
    dom_ratio = counts[dominant] / total

    if dominant == "R" and dom_ratio > 0.5:
        # Rajasic-dominant: suppress sattvic attractor pull
        for a in SATTVIC_ATOMS:
            atoms[a] = atoms.get(a, 0) - 0.5 * dom_ratio
        # Boost rajasic identity atoms
        for a in ("RAJAS", "KAMA", "AHANKARA", "RAJYA"):
            atoms[a] = atoms.get(a, 0) + 0.2 * dom_ratio
    elif dominant == "T" and dom_ratio > 0.5:
        # Tamasic-dominant: suppress sattvic attractor pull even more
        for a in SATTVIC_ATOMS:
            atoms[a] = atoms.get(a, 0) - 0.4 * dom_ratio
        # Also boost klesha atoms to strengthen tamasic identity
        for a in KLESHA_ATOMS:
            atoms[a] = atoms.get(a, 0) + 0.2 * dom_ratio
    elif dominant == "S" and dom_ratio > 0.5:
        # Sattvic-dominant: suppress klesha pull
        for a in KLESHA_ATOMS:
            atoms[a] = atoms.get(a, 0) - 0.2 * dom_ratio

    # Final clamp to [-1, +1]
    max_val = max(abs(v) for v in atoms.values()) or 1.0
    if max_val > 1.0:
        atoms = {a: v / max_val for a, v in atoms.items()}

    return {a: round(v, 3) for a, v in atoms.items()}


def guna_to_alpha(answers: dict) -> float:
    """Derive alpha (forcing strength) from guna distribution.

    M33 proved: governance holds at ALL alpha (0.10-0.50).
    M56-M59 proved: alpha_threshold varies per edge.

    Alpha reflects inner turbulence:
      Rajasic-dominant → high alpha (0.40-0.50) → mind races, explores many basins
      Tamasic-dominant → low alpha (0.20-0.30) → stuck, few transitions, quick lock-on
      Sattvic-dominant → moderate alpha (0.25-0.35) → deliberate, clear, settled
      Mixed → default (0.35)
    """
    counts = {"S": 0, "R": 0, "T": 0}
    for domain in DOMAINS:
        choice = answers.get(domain["id"])
        if choice in counts:
            counts[choice] += 1

    total = sum(counts.values()) or 1
    s_ratio = counts["S"] / total
    r_ratio = counts["R"] / total
    t_ratio = counts["T"] / total

    # Weighted alpha: rajas raises it, tamas lowers it, sattva centers it
    alpha = 0.30 + (r_ratio * 0.15) - (t_ratio * 0.05) - (s_ratio * 0.05)

    # Clamp to proven-safe range
    return round(max(0.15, min(0.50, alpha)), 2)


def trajectory_entropy(linger: list) -> float:
    """Compute Shannon entropy of the linger distribution.

    Low entropy (< 0.5): forces settled quickly, not actually torn
    Medium entropy (0.5-1.5): some exploration, moderate deliberation
    High entropy (> 1.5): genuine deliberation, truly torn
    """
    import math
    total = sum(l["steps"] for l in linger)
    if total == 0:
        return 0.0
    H = 0.0
    for l in linger:
        p = l["steps"] / total
        if p > 0:
            H -= p * math.log2(p)
    return round(H, 3)


def entropy_interpretation(H: float) -> str:
    """Plain-language interpretation of trajectory entropy."""
    if H < 0.5:
        return "Your forces settled quickly — there was little internal debate. The structure of your drives points clearly in one direction."
    elif H < 1.0:
        return "Your forces explored briefly before settling. Some deliberation happened, but the pull toward one position was strong."
    elif H < 1.5:
        return "Your forces genuinely deliberated — visiting multiple positions before settling. This is a real tension, not a simple question."
    else:
        return "Your forces are deeply torn — the mind visited many positions with no clear winner. This is a genuine dilemma where multiple forces have nearly equal strength."


def get_domain_questions() -> list:
    """Return the 11 questions for frontend display."""
    return [
        {
            "id": d["id"],
            "domain": d["domain"],
            "question": d["question"],
            "answers": {
                k: v["label"] for k, v in d["answers"].items()
            },
        }
        for d in DOMAINS
    ]


def print_questionnaire():
    """Print all 11 questions for CLI use."""
    for i, d in enumerate(DOMAINS, 1):
        print(f"\n{'─' * 60}")
        print(f"  Q{i}. {d['domain']} ({d['verse']})")
        print(f"  {d['question']}")
        print()
        for key in ("S", "R", "T"):
            label = {"S": "Sattvic", "R": "Rajasic", "T": "Tamasic"}[key]
            print(f"    [{key}] {d['answers'][key]['label']}")
        print()
