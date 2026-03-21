"""io-gita ODE Reasoning Engine.

Extracted from meharban_query.py — proven across 56 milestones.
Builds a 20-atom Gita network, composes force vectors from atom weights,
runs Hopfield attractor dynamics, and analyzes trajectories.
"""

import numpy as np
from dataclasses import dataclass

# ODE parameters (proven stable across M33 ablations)
D_DEFAULT = 10_000
BETA = 4.0
DT = 0.05
T_MAX = 800
ALPHA_DEFAULT = 0.35

# 20 Gita atoms
ORIGINAL_ATOMS = [
    "DHARMA", "SATYA", "TYAGA", "AHANKARA",
    "ATMA", "MOKSHA", "KULA", "RAJYA",
]
NEW_ATOMS = [
    "KARMA", "BHAKTI", "JNANA", "VAIRAGYA",
    "SATTVA", "RAJAS", "TAMAS", "KAMA",
    "KRODHA", "BUDDHI", "MAYA", "SVADHARMA",
]
ALL_ATOMS = ORIGINAL_ATOMS + NEW_ATOMS

# Plain-language feelings for each atom (shown to users, never atom names)
ATOM_FEELINGS = {
    "DHARMA":    "Sense of duty — pulled by what you know is right",
    "SATYA":     "Need for truth — wanting to be honest with yourself",
    "TYAGA":     "Willingness to sacrifice — ready to let go",
    "AHANKARA":  "Identity/ego — 'this is who I am'",
    "ATMA":      "Self-inquiry — 'who am I beyond all this?'",
    "MOKSHA":    "Yearning for peace — wanting freedom from the noise",
    "KULA":      "Family/belonging — connection to your people",
    "RAJYA":     "Worldly ambition — wanting to build and succeed",
    "KARMA":     "Drive to act — can't stop, need to keep moving",
    "BHAKTI":    "Devotion — pull toward something greater",
    "JNANA":     "Desire for understanding — wanting to know, not just do",
    "VAIRAGYA":  "Detachment — part of you wants to let go of everything",
    "SATTVA":    "Clarity — seeking calmness and purity of mind",
    "RAJAS":     "Restlessness — mind racing, can't sit still",
    "TAMAS":     "Heaviness — mental fog, exhaustion, inertia",
    "KAMA":      "Desire — craving achievement or pleasure",
    "KRODHA":    "Frustration — anger at the situation or yourself",
    "BUDDHI":    "Intellect — trying to reason your way through",
    "MAYA":      "Illusion — caught in a story that may not be real",
    "SVADHARMA": "Personal calling — is this what I'm meant to do?",
}

# Named patterns — 16 Gita archetypes (io = inner, ra = outer)
PATTERN_SPECS = {
    "io:Soul Seeker":     {"pos": ["ATMA", "MOKSHA", "SATYA"],       "neg": ["AHANKARA"]},
    "io:Selfless Actor":  {"pos": ["DHARMA", "TYAGA", "ATMA"],       "neg": ["AHANKARA"]},
    "io:Truth Sage":      {"pos": ["SATYA", "TYAGA", "DHARMA"],      "neg": ["AHANKARA"]},
    "io:Karma Yogi":      {"pos": ["KARMA", "DHARMA", "TYAGA"],      "neg": ["AHANKARA", "KAMA"]},
    "io:Bhakta":          {"pos": ["BHAKTI", "ATMA", "TYAGA"],       "neg": ["AHANKARA", "RAJAS"]},
    "io:Jnani":           {"pos": ["JNANA", "SATYA", "BUDDHI"],      "neg": ["MAYA", "TAMAS"]},
    "io:Detached Seer":   {"pos": ["VAIRAGYA", "JNANA", "ATMA"],    "neg": ["KAMA", "KRODHA"]},
    "io:Pure Mind":       {"pos": ["SATTVA", "BUDDHI", "SATYA"],     "neg": ["TAMAS", "RAJAS"]},
    "io:Desiring Self":   {"pos": ["KAMA", "RAJAS", "AHANKARA"],     "neg": ["VAIRAGYA", "MOKSHA"]},
    "io:Wrathful":        {"pos": ["KRODHA", "RAJAS", "AHANKARA"],   "neg": ["SATTVA", "BUDDHI"]},
    "ra:Ideal King":      {"pos": ["DHARMA", "RAJYA", "SATYA"],      "neg": ["AHANKARA"]},
    "ra:Clan Guardian":   {"pos": ["KULA", "TYAGA", "DHARMA"],       "neg": ["AHANKARA"]},
    "ra:Just Ruler":      {"pos": ["RAJYA", "SATYA", "TYAGA"],       "neg": ["AHANKARA"]},
    "ra:Dharmic Leader":  {"pos": ["SVADHARMA", "RAJYA", "KARMA"],   "neg": ["KAMA"]},
    "ra:Devoted Servant": {"pos": ["BHAKTI", "KULA", "TYAGA"],       "neg": ["AHANKARA"]},
    "ra:Wise Counselor":  {"pos": ["JNANA", "BUDDHI", "SATYA"],      "neg": ["MAYA", "AHANKARA"]},
    # v2: 6 dark-state patterns (Gita-grounded, fixes atom distribution bias)
    "io:Despairing":      {"pos": ["TAMAS", "KULA", "VAIRAGYA"],    "neg": ["KARMA", "RAJYA"]},
    "io:Deluded":         {"pos": ["MAYA", "KULA", "TAMAS"],        "neg": ["SATYA", "JNANA"]},
    "io:Torn":            {"pos": ["DHARMA", "AHANKARA", "KULA"],   "neg": ["SVADHARMA", "SATYA"]},
    "io:Restless":        {"pos": ["RAJAS", "BUDDHI", "KARMA"],     "neg": ["SATTVA", "VAIRAGYA"]},
    "ra:Ambitious":       {"pos": ["RAJYA", "AHANKARA", "KAMA"],    "neg": ["TYAGA", "MOKSHA"]},
    "ra:Blind Ruler":     {"pos": ["KULA", "MAYA", "RAJYA"],        "neg": ["DHARMA", "SATYA"]},
}

PATTERN_MEANINGS = {
    "io:Soul Seeker":     "Searching for truth and liberation, letting go of ego",
    "io:Selfless Actor":  "Acting from duty without self-interest",
    "io:Truth Sage":      "Living in truth, sacrificing comfort for honesty",
    "io:Karma Yogi":      "Working as worship — action without attachment to results",
    "io:Bhakta":          "Pure devotion — surrendering to something greater",
    "io:Jnani":           "The path of knowledge — understanding over doing",
    "io:Detached Seer":   "Witnessing life without clinging — free from desire and anger",
    "io:Pure Mind":       "Clarity and discernment — seeing things as they are",
    "io:Desiring Self":   "Caught in wanting — ego driving ambition and craving",
    "io:Wrathful":        "Frustration and ego colliding — anger clouding judgment",
    "io:Despairing":      "Paralyzed by heaviness and attachment — withdrawal not from wisdom but from overwhelm",
    "io:Deluded":         "Caught in a story that blocks truth — willful blindness driven by attachment",
    "io:Torn":            "Duty and identity pulling opposite directions — loyal to something you know is wrong",
    "io:Restless":        "A driven mind that cannot stop — racing thoughts, constant action, no peace",
    "ra:Ideal King":      "Righteous leadership — power guided by duty and truth",
    "ra:Clan Guardian":   "Protecting your people — sacrifice for family",
    "ra:Just Ruler":      "Fair authority — truth and sacrifice in governance",
    "ra:Dharmic Leader":  "Following your calling through worldly action",
    "ra:Devoted Servant": "Serving others through devotion and sacrifice",
    "ra:Wise Counselor":  "Knowledge and discernment cutting through illusion",
    "ra:Ambitious":       "Ego-driven worldly ambition — building an empire of self, rejecting sacrifice",
    "ra:Blind Ruler":     "Authority wielded to protect your own at the cost of what is right",
}


def _cosim(a, b):
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na < 1e-10 or nb < 1e-10:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


@dataclass
class GitaNetwork:
    D: int
    V: dict           # atom_name -> np.ndarray(D,)
    patterns: dict     # pattern_name -> np.ndarray(D,)
    pat_names: list
    P_mat: np.ndarray  # (N, D)
    P_mat_T: np.ndarray  # (D, N)
    pat_idx: dict      # pattern_name -> int
    inv_sqrt_D: float


def build_network(D: int = D_DEFAULT, seed: int = 42) -> GitaNetwork:
    """Build the 20-atom, 60-pattern Gita network. Deterministic with seed."""
    rng = np.random.default_rng(seed)

    V = {name: rng.choice([-1, 1], size=D).astype(np.float64) for name in ALL_ATOMS}

    # Named patterns with cross-inhibition
    all_pos = {n: set(s["pos"]) for n, s in PATTERN_SPECS.items()}
    patterns = {}
    for name, spec in PATTERN_SPECS.items():
        vec = 3.0 * sum(V[a] for a in spec["pos"]) - 3.0 * sum(V[a] for a in spec["neg"])
        for on, op in all_pos.items():
            if on != name:
                for a in op - set(spec["pos"]):
                    vec -= 0.5 * V[a]
        patterns[name] = np.sign(vec)

    # Fill to 60 with structured random patterns
    gen_rng = np.random.default_rng(60 * 7)
    atom_names = list(ALL_ATOMS)
    attempts = 0
    while len(patterns) < 60 and attempts < 3000:
        attempts += 1
        n_pos = gen_rng.integers(2, 6)
        n_neg = gen_rng.integers(0, 4)
        names = list(atom_names)
        gen_rng.shuffle(names)
        pos = names[:n_pos]
        neg = names[n_pos:n_pos + n_neg]
        w_pos = gen_rng.uniform(1.5, 4.0, size=n_pos)
        w_neg = gen_rng.uniform(1.0, 3.5, size=max(n_neg, 1))[:n_neg]
        vec = sum(w * V[a] for w, a in zip(w_pos, pos))
        if neg:
            vec -= sum(w * V[a] for w, a in zip(w_neg, neg))
        pat = np.sign(vec)
        if all(abs(_cosim(pat, ep)) < 0.75 for ep in patterns.values()):
            patterns[f"s:{len(patterns)}"] = pat

    while len(patterns) < 60:
        n_a = gen_rng.integers(3, 8)
        names = list(atom_names)
        gen_rng.shuffle(names)
        vec = sum(gen_rng.normal(0, 2) * V[a] for a in names[:n_a])
        vec += gen_rng.normal(0, 0.1, size=D)
        patterns[f"s:{len(patterns)}"] = np.sign(vec)

    pat_names = list(patterns.keys())
    P_mat = np.array([patterns[n] for n in pat_names])

    return GitaNetwork(
        D=D, V=V, patterns=patterns, pat_names=pat_names,
        P_mat=P_mat, P_mat_T=P_mat.T,
        pat_idx={n: i for i, n in enumerate(pat_names)},
        inv_sqrt_D=1.0 / np.sqrt(D),
    )


def run_query(atom_weights: dict, net: GitaNetwork,
              alpha: float = ALPHA_DEFAULT, seed: int = 2026) -> dict:
    """Run ODE dynamics with given atom weights. Returns full trajectory analysis."""

    # Compose force vector
    force_vec = np.zeros(net.D, dtype=np.float64)
    for atom, weight in atom_weights.items():
        if atom in net.V:
            force_vec += weight * net.V[atom]
    norm = np.linalg.norm(force_vec)
    if norm > 1e-10:
        force_vec = force_vec / norm * np.sqrt(net.D)

    # Neutral start
    start_rng = np.random.default_rng(seed)
    Q = start_rng.choice([-1, 1], size=net.D).astype(np.float64)

    # ODE integration
    basins = []
    energies = []
    linger = {}

    for step in range(T_MAX):
        sims = net.P_mat @ Q / net.D
        h = net.P_mat_T @ sims
        dQ = -Q + np.tanh(BETA * h) + alpha * force_vec

        idx = int(np.argmax(sims))
        basin = net.pat_names[idx]
        energy = -float(np.sum(sims ** 2))

        basins.append(basin)
        energies.append(energy)
        linger[basin] = linger.get(basin, 0) + 1

        Q += DT * dQ
        if np.linalg.norm(dQ) * net.inv_sqrt_D < 1e-7:
            break

    total = len(basins)

    # Trajectory phases — compute Q snapshots for unnamed basin descriptions
    # We need per-phase final Q for describing unnamed basins. Re-run a lightweight pass.
    phase_boundaries = []
    cur = basins[0]
    start_idx = 0
    for i, b in enumerate(basins):
        if b != cur:
            phase_boundaries.append((cur, start_idx, i - 1))
            cur = b
            start_idx = i
    phase_boundaries.append((cur, start_idx, total - 1))

    phases = []
    for basin_name, s, e in phase_boundaries:
        duration = e - s + 1
        display = _display_name(basin_name)
        # For unnamed basins with significant duration, describe by final Q atom alignment
        if not display and duration >= 5:
            display = _describe_basin(basin_name, net)
        phases.append({
            "basin": basin_name,
            "display": display or "transition",
            "meaning": PATTERN_MEANINGS.get(basin_name, ""),
            "start": s,
            "end": e,
            "duration": duration,
            "is_named": basin_name in PATTERN_SPECS,
        })

    # Linger (sorted)
    sorted_linger = sorted(linger.items(), key=lambda x: -x[1])
    linger_data = []
    for b, s in sorted_linger[:10]:
        display = _display_name(b)
        if not display and s >= 5:
            display = _describe_basin(b, net)
        linger_data.append({
            "basin": b,
            "display": display or "transition",
            "meaning": PATTERN_MEANINGS.get(b, ""),
            "steps": s,
            "pct": round(s / total * 100, 1),
            "is_named": b in PATTERN_SPECS,
        })

    # Final state
    final_sims = net.P_mat @ Q / net.D
    top_idx = np.argsort(-final_sims)[:5]
    final_top = [
        {"basin": net.pat_names[i], "display": _display_name(net.pat_names[i]),
         "similarity": round(float(final_sims[i]), 4)}
        for i in top_idx
    ]

    # Atom alignments (which forces won)
    alignments = {}
    for atom in ALL_ATOMS:
        a = _cosim(Q, net.V[atom])
        if abs(a) > 0.03:
            alignments[atom] = {
                "final": round(a, 3),
                "input": round(atom_weights.get(atom, 0), 2),
                "feeling": ATOM_FEELINGS[atom],
                "direction": "active" if a > 0 else "opposing",
                "grew": abs(a) > abs(atom_weights.get(atom, 0)),
            }
    alignments = dict(sorted(alignments.items(), key=lambda x: -abs(x[1]["final"])))

    final_basin = basins[-1]
    final_display = _display_name(final_basin) or _describe_basin(final_basin, net)

    return {
        "total_steps": total,
        "phases": phases,
        "linger": linger_data,
        "final_basin": final_basin,
        "final_display": final_display,
        "final_meaning": PATTERN_MEANINGS.get(final_basin, ""),
        "final_top": final_top,
        "atom_alignments": alignments,
        "input_weights": atom_weights,
    }


def _display_name(basin: str) -> str:
    """Strip io:/ra: prefix for display. Keep s:N as 'unnamed'."""
    if basin.startswith("io:") or basin.startswith("ra:"):
        return basin.split(":", 1)[1]
    return ""


def _describe_basin(basin: str, net: GitaNetwork) -> str:
    """Describe any basin by its dominant atom alignment. Uses pattern vector, not Q."""
    if basin in PATTERN_SPECS:
        return _display_name(basin)
    if basin not in net.pat_idx:
        return "unnamed state"
    # Use the pattern's own vector to find aligned atoms
    pvec = net.patterns[basin]
    aligns = []
    for atom in ALL_ATOMS:
        a = _cosim(pvec, net.V[atom])
        if abs(a) > 0.05:
            aligns.append((atom, a))
    aligns.sort(key=lambda x: -abs(x[1]))
    top = aligns[:3]
    if not top:
        return "unnamed state"
    parts = []
    for atom, a in top:
        label = ATOM_FEELINGS[atom].split("\u2014")[0].strip()
        parts.append(label)
    return " + ".join(parts)
