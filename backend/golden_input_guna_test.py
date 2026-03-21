"""Golden Input Test v2 — Guna×Domain questionnaire vs LLM.

Uses Meharban's real dilemma:
"My mind doesn't find peace or rest. Should I keep working or connect
to spirituality? Thousands of thoughts at a time, sometimes unbearable."

Answers the Guna×Domain questionnaire AS Meharban would,
based on what we know from his corrected atom weights and personal context.

Validates:
  1. Same or better final basin as LLM
  2. Top-3 linger Jaccard >= 0.50 (relaxed — Guna may find DIFFERENT but BETTER truth)
  3. AHANKARA behavior: grows despite moderate input (topology reveals hidden ego)
  4. MAYA behavior: downstream kleshas emerge (Klesha hierarchy test proved this)
  5. Key forces match: RAJAS high, MOKSHA negative (seeking), KAMA present
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from engine import build_network, run_query, ALL_ATOMS, ATOM_FEELINGS
from guna_sensing import guna_to_atoms, DOMAINS


def print_weights(label, weights):
    active = sorted(
        [(a, w) for a, w in weights.items() if abs(w) > 0.01],
        key=lambda x: -abs(x[1]),
    )
    print(f"\n  {label} ({len(active)} active atoms):")
    for a, w in active:
        feeling = ATOM_FEELINGS[a].split("\u2014")[0].strip()
        print(f"    {a:12s} {w:+.3f}  ({feeling})")


def print_trajectory(label, traj):
    print(f"\n  {label}:")
    print(f"    Steps: {traj['total_steps']}")
    print(f"    Final: {traj['final_display']} ({traj['final_basin']})")
    if traj["final_meaning"]:
        print(f"    Meaning: {traj['final_meaning']}")
    print(f"    Linger:")
    for l in traj["linger"][:5]:
        marker = " *" if l["is_named"] else ""
        print(f"      {l['display']:35s} {l['steps']:4d} ({l['pct']:5.1f}%){marker}")
    print(f"    Forces that GREW:")
    for atom, info in traj["atom_alignments"].items():
        if info["grew"]:
            print(f"      {atom:12s} {info['input']:+.2f} -> {info['final']:+.3f}")
    ah = traj["atom_alignments"].get("AHANKARA")
    if ah:
        g = "GREW" if ah["grew"] else "shrunk"
        print(f"    AHANKARA: input={ah['input']:+.3f} -> final={ah['final']:+.3f} ({g})")


def jaccard(a, b):
    if not a and not b:
        return 1.0
    return len(a & b) / len(a | b)


def sign_match(a_weights, b_weights, atoms):
    """Count how many atoms have the same sign (direction) between two weight sets."""
    match = 0
    total = 0
    for atom in atoms:
        a = a_weights.get(atom, 0)
        b = b_weights.get(atom, 0)
        if abs(a) > 0.05 or abs(b) > 0.05:
            total += 1
            if (a > 0 and b > 0) or (a < 0 and b < 0) or (abs(a) <= 0.05 and abs(b) <= 0.05):
                match += 1
    return match, total


def main():
    print("=" * 70)
    print("GOLDEN INPUT v2 — Guna×Domain Questionnaire")
    print("=" * 70)

    net = build_network()

    # ── Meharban's Guna×Domain answers ──
    # Based on his dilemma: restless, can't stop working, seeking peace,
    # thousands of thoughts, ego fused with work (AHANKARA grew in original)
    meharban_guna = {
        "action":     "R",  # Acts to achieve results — "should I keep working?"
                            # He WORKS driven by results, not duty. Rajasic karma.

        "knowledge":  "R",  # Sees separate things, fragmented perception
                            # "thousands of thoughts" = fragmented, not unified

        "intellect":  "R",  # Goes back and forth — can't decide
                            # "should I keep working OR seek spirituality?" = confused buddhi

        "resolve":    "T",  # Can't let go of worry, fear, sadness
                            # "unbearable" + "mind doesn't find peace" = tamasic dhriti

        "happiness":  "R",  # Seeks pleasure now (work high) even at cost (no peace)
                            # Working gives rajasic satisfaction, peace eludes him

        "doer":       "R",  # Success is mine, failure is mine
                            # AHANKARA grew in original — identity fused with work results

        "devotion":   "R",  # Values what he's built — family, achievements
                            # Not seeking truth (would be S), not avoiding (would be T)

        "sacrifice":  "R",  # Gives but notices — wants acknowledgment
                            # Still working = not truly letting go (would be S)

        "discipline": "R",  # Pushes hard, wants visible dedication
                            # "Can't stop working" = rajasic tapas

        "maya_gap":   "R",  # Moderate gap — knows what he should do but chases other things
                            # SAYS he wants peace (MOKSHA) but ACTS restlessly (RAJAS)
                            # This IS the gap. He's aware of it ("should I...?")

        "identity":   "R",  # Would feel shaken if work vanished
                            # AHANKARA grew in original — rajasic ego, identity = doer
    }

    guna_weights = guna_to_atoms(meharban_guna)

    # ── LLM-derived weights (known result) ──
    llm_weights = {
        "DHARMA": 0.20, "SATYA": 0.10, "TYAGA": 0.05, "AHANKARA": 0.45,
        "ATMA": -0.45, "MOKSHA": -0.70, "KULA": 0.05, "RAJYA": 0.40,
        "KARMA": 0.80, "BHAKTI": -0.35, "JNANA": -0.25, "VAIRAGYA": -0.55,
        "SATTVA": -0.50, "RAJAS": 0.90, "TAMAS": 0.55, "KAMA": 0.70,
        "KRODHA": 0.60, "BUDDHI": 0.70, "MAYA": 0.30, "SVADHARMA": 0.50,
    }

    # ── Print answers ──
    print("\n" + "-" * 70)
    print("MEHARBAN'S GUNA×DOMAIN ANSWERS")
    print("-" * 70)
    for d in DOMAINS:
        choice = meharban_guna[d["id"]]
        label = {"S": "Sattvic", "R": "Rajasic", "T": "Tamasic"}[choice]
        answer = d["answers"][choice]["label"]
        print(f"  {d['domain']:35s} → {label:8s}: {answer}")

    # ── Print weights ──
    print("\n" + "-" * 70)
    print("WEIGHT COMPARISON")
    print("-" * 70)
    print_weights("A) LLM-derived (known good)", llm_weights)
    print_weights("B) Guna×Domain (new approach)", guna_weights)

    # ── Sign agreement ──
    match, total = sign_match(llm_weights, guna_weights, ALL_ATOMS)
    print(f"\n  Sign agreement: {match}/{total} atoms ({match/total*100:.0f}%)")
    print(f"  Disagreements:")
    for atom in ALL_ATOMS:
        a = llm_weights.get(atom, 0)
        b = guna_weights.get(atom, 0)
        if (abs(a) > 0.05 or abs(b) > 0.05) and not (
            (a > 0 and b > 0) or (a < 0 and b < 0) or (abs(a) <= 0.05 and abs(b) <= 0.05)
        ):
            print(f"    {atom:12s}: LLM={a:+.2f}  Guna={b:+.3f}")

    # ── Run ODE ──
    print("\n" + "-" * 70)
    print("TRAJECTORY COMPARISON")
    print("-" * 70)

    traj_llm = run_query(llm_weights, net)
    traj_guna = run_query(guna_weights, net)

    print_trajectory("A) LLM trajectory", traj_llm)
    print_trajectory("B) Guna×Domain trajectory", traj_guna)

    # ── Validation ──
    print("\n" + "=" * 70)
    print("VALIDATION")
    print("=" * 70)

    # Check 1: Basin comparison
    same_basin = traj_guna["final_basin"] == traj_llm["final_basin"]
    print(f"\n  CHECK 1: Final basin")
    print(f"    LLM:  {traj_llm['final_basin']} ({traj_llm['final_display']})")
    print(f"    Guna: {traj_guna['final_basin']} ({traj_guna['final_display']})")
    print(f"    {'SAME' if same_basin else 'DIFFERENT'}")

    # Check 2: Top-3 linger Jaccard
    llm_top3 = {l["basin"] for l in traj_llm["linger"][:3]}
    guna_top3 = {l["basin"] for l in traj_guna["linger"][:3]}
    j = jaccard(llm_top3, guna_top3)
    print(f"\n  CHECK 2: Top-3 linger Jaccard")
    print(f"    LLM:  {llm_top3}")
    print(f"    Guna: {guna_top3}")
    print(f"    Jaccard: {j:.3f} {'PASS (>=0.50)' if j >= 0.50 else 'DIFFERENT'}")

    # Check 3: AHANKARA behavior
    print(f"\n  CHECK 3: AHANKARA behavior")
    for label, traj, w in [("LLM", traj_llm, llm_weights), ("Guna", traj_guna, guna_weights)]:
        ah = traj["atom_alignments"].get("AHANKARA")
        if ah:
            g = "GREW" if ah["grew"] else "shrunk"
            print(f"    {label:6s}: input={w.get('AHANKARA',0):+.3f} -> final={ah['final']:+.3f} ({g})")

    # Check 4: Key direction matches
    print(f"\n  CHECK 4: Key atom directions (most important)")
    key_atoms = [
        ("RAJAS",    "high positive (restless)"),
        ("KARMA",    "high positive (driven to act)"),
        ("KAMA",     "positive (desire present)"),
        ("MOKSHA",   "NEGATIVE (seeking peace, not having it)"),
        ("SATTVA",   "NEGATIVE (lacking clarity)"),
        ("VAIRAGYA", "NEGATIVE (wanting detachment, not having it)"),
        ("AHANKARA", "positive (ego present)"),
        ("MAYA",     "positive (illusion present)"),
        ("TAMAS",    "positive (heaviness present)"),
    ]
    key_correct = 0
    for atom, expected_dir in key_atoms:
        llm_v = llm_weights.get(atom, 0)
        guna_v = guna_weights.get(atom, 0)
        llm_sign = "+" if llm_v > 0.05 else ("-" if llm_v < -0.05 else "0")
        guna_sign = "+" if guna_v > 0.05 else ("-" if guna_v < -0.05 else "0")
        match = llm_sign == guna_sign
        if match:
            key_correct += 1
        symbol = "✓" if match else "✗"
        print(f"    {symbol} {atom:12s}: LLM={llm_v:+.2f} Guna={guna_v:+.3f}  (expected: {expected_dir})")

    print(f"    Key direction match: {key_correct}/{len(key_atoms)}")

    # Check 5: Does Guna produce named patterns?
    print(f"\n  CHECK 5: Named patterns visited")
    for label, traj in [("LLM", traj_llm), ("Guna", traj_guna)]:
        named = [p for p in traj["phases"] if p["is_named"] and p["duration"] >= 3]
        if named:
            parts = [p["display"] + f"({p['duration']})" for p in named]
            print(f"    {label:6s}: {', '.join(parts)}")
        else:
            print(f"    {label:6s}: no named patterns (duration >= 3)")

    # Check 6: Klesha emergence (does MAYA cause downstream?)
    print(f"\n  CHECK 6: Klesha emergence in Guna trajectory")
    maya_input = guna_weights.get("MAYA", 0)
    for klesha in ["AHANKARA", "KAMA", "KRODHA", "TAMAS"]:
        info = traj_guna["atom_alignments"].get(klesha)
        if info:
            grew = "GREW" if info["grew"] else "shrunk"
            print(f"    MAYA({maya_input:+.3f}) → {klesha:10s}: {info['final']:+.3f} ({grew})")

    # ── Summary ──
    print("\n" + "=" * 70)
    print("VERDICT")
    print("=" * 70)

    score = 0
    score += 1 if same_basin else 0
    score += 1 if j >= 0.50 else 0
    score += 1 if key_correct >= 7 else 0
    score += 1 if match else 0  # sign agreement on last key atom

    # Check AHANKARA grew
    ah_guna = traj_guna["atom_alignments"].get("AHANKARA")
    ah_grew = ah_guna and ah_guna["grew"]
    score += 1 if ah_grew else 0

    print(f"\n  Score: {score}/5")
    print(f"    Basin match:           {'YES' if same_basin else 'NO'}")
    print(f"    Linger Jaccard >= 0.50: {'YES' if j >= 0.50 else 'NO'} ({j:.3f})")
    print(f"    Key directions >= 7/9:  {'YES' if key_correct >= 7 else 'NO'} ({key_correct}/9)")
    print(f"    AHANKARA grew:          {'YES' if ah_grew else 'NO'}")

    if score >= 3:
        print(f"\n  >>> GOLDEN INPUT v2: PASS")
        print(f"  >>> Guna×Domain questionnaire is viable")
        print(f"  >>> Proceed to UI build")
    elif score >= 2:
        print(f"\n  >>> GOLDEN INPUT v2: PARTIAL PASS")
        print(f"  >>> Direction is correct, mapping needs tuning")
    else:
        print(f"\n  >>> GOLDEN INPUT v2: FAIL")
        print(f"  >>> Architecture needs rethinking")


if __name__ == "__main__":
    main()
