"""Golden Input Test — Validate Nava Rasa mapping against Meharban's known trajectory.

Compares:
  A) LLM-derived weights (from tongue.py, known result)
  B) Rasa-derived weights (consensus mapping, new approach)
  C) Rasa-derived with rank normalization (only non-zero atoms)

Pass criteria:
  - Same primary (final) basin
  - Top-3 linger basins Jaccard >= 0.85
  - AHANKARA behavior: still grows despite lower input
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from engine import build_network, run_query, ALL_ATOMS, ATOM_FEELINGS

# ── Consensus Rasa→Atom Mapping (Gemini + Codex agreed) ──────────────

RASA_TO_ATOMS = {
    "Shringara": {"BHAKTI": 0.8, "KAMA": 0.6, "KULA": 0.4, "ATMA": 0.3, "AHANKARA": 0.3},
    "Hasya":     {"SATTVA": 0.8, "MOKSHA": 0.5, "VAIRAGYA": 0.3, "BUDDHI": 0.2},
    "Karuna":    {"KULA": 0.7, "TYAGA": 0.5, "DHARMA": 0.4, "TAMAS": 0.3},
    "Raudra":    {"KRODHA": 0.9, "RAJAS": 0.7, "AHANKARA": 0.5, "RAJYA": 0.3},
    "Veera":     {"DHARMA": 0.8, "KARMA": 0.7, "SVADHARMA": 0.5, "AHANKARA": 0.3, "BUDDHI": 0.4, "SATYA": 0.2},
    "Bhayanaka": {"TAMAS": 0.7, "MAYA": 0.6, "AHANKARA": 0.4, "KULA": 0.3},
    "Bibhatsa":  {"VAIRAGYA": 0.8, "SATYA": 0.5, "KRODHA": 0.3, "BUDDHI": 0.4},
    "Adbhuta":   {"JNANA": 0.8, "BUDDHI": 0.6, "ATMA": 0.4, "SATYA": 0.3},
    "Shanta":    {"SATTVA": 0.9, "VAIRAGYA": 0.6, "MOKSHA": 0.5, "ATMA": 0.4, "SATYA": 0.5, "BUDDHI": 0.4},
}


# "Active" rasas: presence is the signal. 0=neutral, 10=strong positive.
# "State" rasas: absence creates a PULL. 5=neutral, 0=strongly seeking, 10=fully present.
ACTIVE_RASAS = {"Raudra", "Karuna", "Bhayanaka", "Bibhatsa"}
STATE_RASAS = {"Shringara", "Hasya", "Veera", "Adbhuta", "Shanta"}


def rasa_to_atoms(rasa_scores: dict, mode: str = "bipolar") -> dict:
    """Convert 9 Nava Rasa scores (0-10) to 20 atom weights.

    mode="unipolar": original (all positive, broken)
    mode="bipolar":  state rasas use centering (low = negative = seeking)
    """
    atoms = {a: 0.0 for a in ALL_ATOMS}

    for rasa, score in rasa_scores.items():
        if rasa not in RASA_TO_ATOMS:
            continue

        if mode == "bipolar" and rasa in STATE_RASAS:
            # Below 5 = lacking/seeking = negative atom weights
            # Above 5 = present/having = positive atom weights
            factor = (score - 5) / 5.0  # maps 0-10 to [-1, +1]
        else:
            # Active emotions: any amount is above baseline
            factor = score / 10.0  # maps 0-10 to [0, +1]

        for atom, strength in RASA_TO_ATOMS[rasa].items():
            atoms[atom] += factor * strength

    # Clamp to [-1, +1]
    max_val = max(abs(v) for v in atoms.values()) or 1.0
    if max_val > 1.0:
        atoms = {a: v / max_val for a, v in atoms.items()}

    return {a: round(v, 3) for a, v in atoms.items()}


def rank_normalize_nonzero(atoms: dict) -> dict:
    """Rank-normalize only non-zero atoms. Zeros stay zero."""
    nonzero = [(a, v) for a, v in atoms.items() if abs(v) > 0.01]
    zeros = [(a, v) for a, v in atoms.items() if abs(v) <= 0.01]

    if len(nonzero) <= 1:
        return atoms

    sorted_nz = sorted(nonzero, key=lambda x: x[1])
    n = len(sorted_nz)
    ranked = {}
    for i, (a, _) in enumerate(sorted_nz):
        # Map to [-1, +1] but only across non-zero atoms
        ranked[a] = round(i / (n - 1) * 2 - 1, 3)

    for a, _ in zeros:
        ranked[a] = 0.0

    return ranked


def top_n_linger(trajectory: dict, n: int = 3) -> set:
    """Get top-N linger basin names."""
    return {l["basin"] for l in trajectory["linger"][:n]}


def jaccard(a: set, b: set) -> float:
    if not a and not b:
        return 1.0
    return len(a & b) / len(a | b)


def print_weights(label: str, weights: dict):
    """Print non-zero weights sorted by magnitude."""
    active = {a: w for a, w in weights.items() if abs(w) > 0.01}
    sorted_w = sorted(active.items(), key=lambda x: -abs(x[1]))
    print(f"\n  {label} ({len(active)} active atoms):")
    for a, w in sorted_w:
        feeling = ATOM_FEELINGS[a].split("\u2014")[0].strip()
        print(f"    {a:12s} {w:+.3f}  ({feeling})")


def print_trajectory(label: str, traj: dict):
    """Print trajectory summary."""
    print(f"\n  {label}:")
    print(f"    Total steps: {traj['total_steps']}")
    print(f"    Final basin: {traj['final_basin']} ({traj['final_display']})")
    if traj['final_meaning']:
        print(f"    Meaning: {traj['final_meaning']}")

    print(f"    Top linger:")
    for l in traj["linger"][:5]:
        print(f"      {l['display']:30s} {l['steps']:4d} steps ({l['pct']:5.1f}%)")

    print(f"    AHANKARA alignment:")
    if "AHANKARA" in traj["atom_alignments"]:
        ah = traj["atom_alignments"]["AHANKARA"]
        grew = "GREW" if ah["grew"] else "shrunk"
        print(f"      input {ah['input']:+.2f} -> final {ah['final']:+.3f} ({grew})")
    else:
        print(f"      not in top alignments")

    print(f"    Forces that GREW:")
    for atom, info in traj["atom_alignments"].items():
        if info["grew"]:
            print(f"      {atom:12s} {info['input']:+.2f} -> {info['final']:+.3f}")


def main():
    print("=" * 70)
    print("GOLDEN INPUT TEST — Nava Rasa Mapping Validation")
    print("=" * 70)

    # Build network
    print("\nBuilding network (D=10000, 60 patterns)...")
    net = build_network()

    # ── A) LLM-derived weights (Meharban's corrected result from summary.md) ──
    # These are the weights after Meharban corrected the LLM's initial parse
    llm_weights = {
        "DHARMA": 0.20, "SATYA": 0.10, "TYAGA": 0.05, "AHANKARA": 0.45,
        "ATMA": -0.45, "MOKSHA": -0.70, "KULA": 0.05, "RAJYA": 0.40,
        "KARMA": 0.80, "BHAKTI": -0.35, "JNANA": -0.25, "VAIRAGYA": -0.55,
        "SATTVA": -0.50, "RAJAS": 0.90, "TAMAS": 0.55, "KAMA": 0.70,
        "KRODHA": 0.60, "BUDDHI": 0.70, "MAYA": 0.30, "SVADHARMA": 0.50,
    }

    # ── B) Rasa-derived weights ──
    # Meharban's state expressed as Nava Rasa (0-10):
    # "My mind doesn't find peace or rest. Should I keep working or
    #  connect to spirituality? Thousands of thoughts, sometimes unbearable."
    meharban_rasa = {
        "Shringara": 2,   # some attachment to work/purpose, not romantic
        "Hasya":     0,   # no joy expressed
        "Karuna":    6,   # suffering, "unbearable"
        "Raudra":    5,   # frustration, restless anger
        "Veera":     7,   # still pushing, still working, asking the question
        "Bhayanaka": 5,   # existential anxiety, "should I keep going?"
        "Bibhatsa":  2,   # some disillusionment
        "Adbhuta":   5,   # asking about spirituality, seeking beyond
        "Shanta":    1,   # explicitly "mind doesn't find peace"
    }

    rasa_unipolar = rasa_to_atoms(meharban_rasa, mode="unipolar")

    # ── C) Rasa BIPOLAR (state rasas: low = negative = seeking) ──
    rasa_weights = rasa_to_atoms(meharban_rasa, mode="bipolar")

    # ── Print all three weight sets ──
    print("\n" + "-" * 70)
    print("WEIGHT COMPARISON")
    print("-" * 70)
    print_weights("A) LLM-derived (known good)", llm_weights)
    print_weights("B) Rasa UNIPOLAR (all positive, broken)", rasa_unipolar)
    print_weights("C) Rasa BIPOLAR (low state = seeking = negative)", rasa_weights)

    # ── Run all three through ODE ──
    print("\n" + "-" * 70)
    print("TRAJECTORY COMPARISON")
    print("-" * 70)

    traj_llm = run_query(llm_weights, net)
    traj_unipolar = run_query(rasa_unipolar, net)
    traj_rasa = run_query(rasa_weights, net)

    print_trajectory("A) LLM trajectory", traj_llm)
    print_trajectory("B) Rasa UNIPOLAR (broken)", traj_unipolar)
    print_trajectory("C) Rasa BIPOLAR (fixed)", traj_rasa)

    # ── Validation checks ──
    print("\n" + "=" * 70)
    print("VALIDATION RESULTS")
    print("=" * 70)

    checks = []

    # Check 1: Same final basin?
    same_basin_uni = traj_unipolar["final_basin"] == traj_llm["final_basin"]
    same_basin_bi = traj_rasa["final_basin"] == traj_llm["final_basin"]
    print(f"\n  CHECK 1: Same final basin as LLM?")
    print(f"    Unipolar:  {traj_unipolar['final_basin']:20s} vs {traj_llm['final_basin']:20s} => {'PASS' if same_basin_uni else 'DIFFERENT'}")
    print(f"    Bipolar:   {traj_rasa['final_basin']:20s} vs {traj_llm['final_basin']:20s} => {'PASS' if same_basin_bi else 'DIFFERENT'}")

    # Check 2: Top-3 linger Jaccard >= 0.85?
    llm_top3 = top_n_linger(traj_llm, 3)
    uni_top3 = top_n_linger(traj_unipolar, 3)
    bi_top3 = top_n_linger(traj_rasa, 3)

    j_uni = jaccard(llm_top3, uni_top3)
    j_bi = jaccard(llm_top3, bi_top3)

    print(f"\n  CHECK 2: Top-3 linger Jaccard >= 0.85?")
    print(f"    LLM top-3:      {llm_top3}")
    print(f"    Unipolar top-3: {uni_top3}")
    print(f"    Bipolar top-3:  {bi_top3}")
    print(f"    Jaccard(Unipolar): {j_uni:.3f} => {'PASS' if j_uni >= 0.85 else 'FAIL (< 0.85)'}")
    print(f"    Jaccard(Bipolar):  {j_bi:.3f} => {'PASS' if j_bi >= 0.85 else 'FAIL (< 0.85)'}")

    # Check 3: AHANKARA behavior
    print(f"\n  CHECK 3: AHANKARA grows despite lower/different input?")
    for label, traj, w in [
        ("LLM",       traj_llm,    llm_weights),
        ("Unipolar",  traj_unipolar, rasa_unipolar),
        ("Bipolar",   traj_rasa,   rasa_weights),
    ]:
        ah_input = w.get("AHANKARA", 0)
        if "AHANKARA" in traj["atom_alignments"]:
            ah = traj["atom_alignments"]["AHANKARA"]
            grew = ah["grew"]
            print(f"    {label:12s}: input={ah_input:+.3f} -> final={ah['final']:+.3f} {'GREW' if grew else 'shrunk'}")
        else:
            print(f"    {label:12s}: input={ah_input:+.3f} -> not in top alignments")

    # Check 4: Do the same NAMED patterns appear?
    print(f"\n  CHECK 4: Named patterns in trajectory?")
    for label, traj in [("LLM", traj_llm), ("Unipolar", traj_unipolar), ("Bipolar", traj_rasa)]:
        named = [p for p in traj["phases"] if p["is_named"] and p["duration"] >= 5]
        if named:
            parts = [p['display'] + '(' + str(p['duration']) + 'steps)' for p in named]
            print(f"    {label:12s}: {', '.join(parts)}")
        else:
            print(f"    {label:12s}: no named patterns with duration >= 5")

    # Check 5: Similarity of linger distributions
    print(f"\n  CHECK 5: Linger distribution similarity")
    llm_linger = {l["basin"]: l["pct"] for l in traj_llm["linger"][:10]}
    uni_linger = {l["basin"]: l["pct"] for l in traj_unipolar["linger"][:10]}
    bi_linger = {l["basin"]: l["pct"] for l in traj_rasa["linger"][:10]}

    llm_dom = max(llm_linger.items(), key=lambda x: x[1])
    uni_dom = max(uni_linger.items(), key=lambda x: x[1])
    bi_dom = max(bi_linger.items(), key=lambda x: x[1])
    print(f"    LLM dominant:      {llm_dom[0]} at {llm_dom[1]:.1f}%")
    print(f"    Unipolar dominant: {uni_dom[0]} at {uni_dom[1]:.1f}%")
    print(f"    Bipolar dominant:  {bi_dom[0]} at {bi_dom[1]:.1f}%")

    # ── Summary ──
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    # Determine which approach is better
    uni_score = (1 if same_basin_uni else 0) + (1 if j_uni >= 0.85 else 0)
    bi_score = (1 if same_basin_bi else 0) + (1 if j_bi >= 0.85 else 0)

    print(f"\n  Unipolar score: {uni_score}/2 hard checks")
    print(f"  Bipolar score:  {bi_score}/2 hard checks")

    if bi_score >= 2:
        print(f"\n  >>> GOLDEN INPUT: PASS (Bipolar mapping matches LLM trajectory)")
        print(f"  >>> Proceed to UI build")
    elif bi_score >= 1:
        print(f"\n  >>> GOLDEN INPUT: PARTIAL PASS")
        print(f"  >>> Different final basin but similar trajectory structure")
        print(f"  >>> This may be BETTER than LLM (less biased)")
        print(f"  >>> Review trajectory details before deciding")
    else:
        print(f"\n  >>> GOLDEN INPUT: FAIL")
        print(f"  >>> Mapping needs adjustment before shipping")
        if bi_score > uni_score:
            print(f"  >>> Bipolar is better than unipolar — direction is correct")
            print(f"  >>> Slider values or mapping coefficients need tuning")


if __name__ == "__main__":
    main()
