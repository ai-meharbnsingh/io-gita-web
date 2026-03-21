"""Klesha Hierarchy Test — Does the topology encode Patanjali's causal chain?

Patanjali says: MAYA → AHANKARA → KAMA/KRODHA → deep TAMAS
(Avidya → Asmita → Raga/Dvesha → Abhinivesha)

Test: Set ONE klesha-atom high, everything else neutral (0).
Does the topology cause the DOWNSTREAM kleshas to grow?

If yes → Klesha hierarchy is emergent in the topology.
If no  → We need to encode dependencies explicitly.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from engine import build_network, run_query, ALL_ATOMS, ATOM_FEELINGS

KLESHA_CHAIN = [
    ("MAYA",     "Avidya (ignorance/illusion)",  ["AHANKARA", "KAMA", "KRODHA", "TAMAS"]),
    ("AHANKARA", "Asmita (ego/I-am-ness)",       ["KAMA", "KRODHA", "TAMAS"]),
    ("KAMA",     "Raga (attachment/craving)",     ["KRODHA", "TAMAS"]),
    ("KRODHA",   "Dvesha (aversion/anger)",       ["TAMAS"]),
]

# Reverse chain: does reducing a klesha cause upstream to shrink?
REVERSE_TESTS = [
    ("SATTVA",   "Clarity (opposite of Avidya)",  ["MAYA", "AHANKARA", "KAMA", "KRODHA", "TAMAS"]),
    ("VAIRAGYA", "Detachment (opposite of Raga)", ["KAMA", "AHANKARA", "RAJAS"]),
    ("MOKSHA",   "Liberation (transcendence)",    ["MAYA", "AHANKARA", "KAMA", "KRODHA", "TAMAS"]),
]


def run_single_atom_test(net, atom_name, weight, label):
    """Set one atom high, everything else zero. Return alignment results."""
    weights = {a: 0.0 for a in ALL_ATOMS}
    weights[atom_name] = weight
    traj = run_query(weights, net)
    return traj


def print_test(label, atom, weight, traj, watch_atoms):
    """Print which atoms grew from zero."""
    print(f"\n  {label}")
    print(f"  Input: {atom} = {weight:+.1f}, all others = 0")
    print(f"  Final basin: {traj['final_display']} ({traj['final_basin']})")
    print(f"  Steps: {traj['total_steps']}, Linger: {traj['linger'][0]['display']} ({traj['linger'][0]['pct']:.0f}%)")

    grew = []
    shrunk = []
    for a in watch_atoms:
        if a in traj["atom_alignments"]:
            info = traj["atom_alignments"][a]
            direction = "GREW" if info["final"] > 0.03 else ("opposed" if info["final"] < -0.03 else "neutral")
            symbol = "↑" if direction == "GREW" else ("↓" if direction == "opposed" else "·")
            print(f"    {symbol} {a:12s}: 0.00 → {info['final']:+.4f}  ({direction})")
            if direction == "GREW":
                grew.append(a)
            elif direction == "opposed":
                shrunk.append(a)
        else:
            print(f"    · {a:12s}: below threshold")

    return grew, shrunk


def main():
    print("=" * 70)
    print("KLESHA HIERARCHY TEST")
    print("Does the topology encode: MAYA → AHANKARA → KAMA/KRODHA → TAMAS?")
    print("=" * 70)

    print("\nBuilding network...")
    net = build_network()

    # ── Forward chain: does each klesha cause downstream kleshas to grow? ──
    print("\n" + "-" * 70)
    print("FORWARD CHAIN: Setting each klesha high, checking if downstream grows")
    print("-" * 70)

    forward_results = {}
    for atom, klesha_name, downstream in KLESHA_CHAIN:
        traj = run_single_atom_test(net, atom, 0.9, klesha_name)
        grew, shrunk = print_test(
            f"TEST: {klesha_name}",
            atom, 0.9, traj, downstream
        )
        forward_results[atom] = {
            "grew": grew,
            "shrunk": shrunk,
            "expected_downstream": downstream,
            "hit_rate": len([g for g in grew if g in downstream]) / len(downstream) if downstream else 0,
        }

    # ── Reverse chain: does cultivating opposite reduce kleshas? ──
    print("\n" + "-" * 70)
    print("REVERSE CHAIN: Setting antidotes high, checking if kleshas diminish")
    print("-" * 70)

    reverse_results = {}
    for atom, label, watch in REVERSE_TESTS:
        traj = run_single_atom_test(net, atom, 0.9, label)
        grew, shrunk = print_test(
            f"TEST: {label}",
            atom, 0.9, traj, watch
        )
        reverse_results[atom] = {
            "grew": grew,
            "shrunk": shrunk,
            "expected_diminished": watch,
            "diminish_rate": len([s for s in shrunk if s in watch]) / len(watch) if watch else 0,
        }

    # ── Combined: MAYA + RAJAS (restless illusion) ──
    print("\n" + "-" * 70)
    print("COMBINATION TEST: Klesha pairs")
    print("-" * 70)

    combos = [
        ({"MAYA": 0.9, "RAJAS": 0.8}, "Restless illusion (Moha + Rajas)"),
        ({"AHANKARA": 0.9, "KAMA": 0.8}, "Ego-driven desire (Asmita + Raga)"),
        ({"KRODHA": 0.8, "AHANKARA": 0.7, "RAJAS": 0.6}, "Angry ego (Dvesha + Asmita + Rajas)"),
        ({"SATTVA": 0.9, "BUDDHI": 0.8, "VAIRAGYA": 0.7}, "Clear detached intellect (antidote)"),
    ]

    for weights_dict, label in combos:
        weights = {a: 0.0 for a in ALL_ATOMS}
        weights.update(weights_dict)
        traj = run_query(weights, net)

        input_str = ", ".join(f"{a}={v:+.1f}" for a, v in weights_dict.items())
        print(f"\n  TEST: {label}")
        print(f"  Input: {input_str}")
        print(f"  Final basin: {traj['final_display']} ({traj['final_basin']})")

        # Show all significant alignments
        print(f"  Forces that GREW (from zero or beyond input):")
        for a, info in list(traj["atom_alignments"].items())[:8]:
            if info["grew"]:
                print(f"    ↑ {a:12s}: {info['input']:+.2f} → {info['final']:+.4f}")

        print(f"  Top linger: {traj['linger'][0]['display']} ({traj['linger'][0]['pct']:.0f}%)")

    # ── Summary ──
    print("\n" + "=" * 70)
    print("SUMMARY: KLESHA HIERARCHY IN TOPOLOGY")
    print("=" * 70)

    print("\n  Forward chain (does upstream cause downstream to grow?):")
    for atom, r in forward_results.items():
        klesha = {"MAYA": "Avidya", "AHANKARA": "Asmita", "KAMA": "Raga", "KRODHA": "Dvesha"}[atom]
        hit = r["hit_rate"]
        grew_list = ", ".join(r["grew"]) if r["grew"] else "none"
        print(f"    {klesha:8s} ({atom:10s}) → downstream grew: [{grew_list}] ({hit:.0%})")

    print("\n  Reverse chain (does antidote diminish kleshas?):")
    for atom, r in reverse_results.items():
        dim = r["diminish_rate"]
        shrunk_list = ", ".join(r["shrunk"]) if r["shrunk"] else "none"
        print(f"    {atom:10s} → kleshas opposed: [{shrunk_list}] ({dim:.0%})")

    # Verdict
    forward_avg = sum(r["hit_rate"] for r in forward_results.values()) / len(forward_results)
    reverse_avg = sum(r["diminish_rate"] for r in reverse_results.values()) / len(reverse_results)

    print(f"\n  Forward chain average: {forward_avg:.0%}")
    print(f"  Reverse chain average: {reverse_avg:.0%}")

    if forward_avg >= 0.6 and reverse_avg >= 0.4:
        print(f"\n  >>> KLESHA HIERARCHY: EMERGENT IN TOPOLOGY")
        print(f"  >>> No need to encode dependencies explicitly")
    elif forward_avg >= 0.3:
        print(f"\n  >>> KLESHA HIERARCHY: PARTIALLY EMERGENT")
        print(f"  >>> Some dependencies work, some need reinforcement in patterns")
    else:
        print(f"\n  >>> KLESHA HIERARCHY: NOT PRESENT")
        print(f"  >>> Need to encode dependencies in pattern construction")


if __name__ == "__main__":
    main()
