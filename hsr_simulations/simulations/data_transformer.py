# Module-level constants for pulls per copy
import csv
import os
from typing import Dict, Optional


PULLS_PER_COPY = 77  # Average pulls per character copy (50/50 system)
LC_PULLS = 69  # Average pulls for signature Light Cone (75/25 system)


def convert_simulation_data_to_avg_dmg(
    simulation_data: dict[str, float],
) -> dict[str, float]:
    """
    Convert simulation data to a format suitable for plotting eidolon value.

    Args:
        simulation_data: Dictionary with keys like 'base_dmg', 'e1_dmg', etc.

    Returns:
        dict[str, float]: Dictionary mapping eidolon levels to normalized damage percentages
    """
    # Map simulation keys to eidolon levels
    key_to_eidolon = {
        "base_dmg": "E0",
        "e1_dmg": "E1",
        "e2_dmg": "E2",
        "e3_dmg": "E3",
        "e4_dmg": "E4",
        "e5_dmg": "E5",
        "e6_dmg": "E6",
        "lc_dmg": "LC",
    }

    # Extract base damage as reference
    base_dmg = simulation_data["base_dmg"]

    # Calculate normalized damage percentages
    avg_dmg = {
        key_to_eidolon[key]: (value / base_dmg) * 100
        for key, value in simulation_data.items()
        if key in key_to_eidolon
    }

    return avg_dmg


def calculate_pulls_per_eidolon() -> dict[str, int]:
    """
    Calculate the expected number of pulls needed for each eidolon level.

    With 50% chance to get the rate-up character and hard pity at 90 pulls,
    the average pulls per copy is approximately 77 pulls (taking into account
    the 50/50 chance and guarantee system).

    Returns:
        Dictionary mapping eidolon levels to cumulative pull counts
    """
    return {
        "E0": PULLS_PER_COPY,  # First copy (base character)
        "E1": PULLS_PER_COPY * 2,  # Second copy
        "E2": PULLS_PER_COPY * 3,  # Third copy
        "E3": PULLS_PER_COPY * 4,  # Fourth copy
        "E4": PULLS_PER_COPY * 5,  # Fifth copy
        "E5": PULLS_PER_COPY * 6,  # Sixth copy
        "E6": PULLS_PER_COPY * 7,  # Seventh copy
        "LC": LC_PULLS + PULLS_PER_COPY,  # Signature Light Cone
    }


def calculate_dmg_per_pull(
    avg_dmg: Dict[str, float], pulls_per_eidolon: Dict[str, int]
) -> Dict[str, float]:
    """Calculate damage per pull for each eidolon level."""
    return {
        eidolon: (dmg_percent / pulls_per_eidolon[eidolon])
        for eidolon, dmg_percent in avg_dmg.items()
    }


def calculate_marginal_value(
    avg_dmg: Dict[str, float], pulls_per_eidolon: Dict[str, int]
) -> Dict[str, float]:
    """
    Calculate the marginal value (additional damage per additional pull)
    for each eidolon transition.
    """
    eidolons = list(avg_dmg.keys())
    result: Dict[str, float] = {}

    # First, ensure we have the standard Eidolon transitions (E0-E1, E1-E2, etc.)
    standard_eidolons = [e for e in eidolons if e.startswith("E")]
    standard_eidolons.sort(key=lambda x: int(x[1:]))  # Sort by Eidolon number

    for i in range(1, len(standard_eidolons)):
        prev_eidolon = standard_eidolons[i - 1]
        curr_eidolon = standard_eidolons[i]

        dmg_increase = avg_dmg[curr_eidolon] - avg_dmg[prev_eidolon]
        pull_increase = (
            pulls_per_eidolon[curr_eidolon] - pulls_per_eidolon[prev_eidolon]
        )

        marginal_value = dmg_increase / pull_increase
        result[f"{prev_eidolon}-{curr_eidolon}"] = marginal_value

    # Add E0-LC transition if LC exists in the data
    if "LC" in eidolons:
        dmg_increase = avg_dmg["LC"] - avg_dmg["E0"]
        pull_increase = pulls_per_eidolon["LC"] - pulls_per_eidolon["E0"]

        marginal_value = dmg_increase / pull_increase
        result["E0-LC"] = marginal_value

    return result


def export_metric_to_csv(
    metric_data: dict, character_name: str, metric_name: str, out_dir: Optional[str] = None
):
    """
    Export a metric dictionary to a CSV file for a given character.
    Args:
        metric_data: dict of {eidolon: value}
        character_name: str
        metric_name: str (e.g., 'avg_dmg', 'dmg_per_pull', 'marginal_value')
        out_dir: Optional base output directory (default: output/CharacterName)
    """
    if out_dir is None:
        out_dir = os.path.join(os.path.dirname(__file__), "output", character_name)
    else:
        out_dir = os.path.join(out_dir, character_name)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{character_name}_{metric_name}.csv")
    with open(out_path, mode="w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Character", "Eidolon", metric_name])
        for eidolon, value in metric_data.items():
            writer.writerow([character_name, eidolon, value])
