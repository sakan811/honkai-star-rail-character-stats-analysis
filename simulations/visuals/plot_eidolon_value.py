from os import path
from typing import Dict, Optional
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from pathlib import Path
import textwrap

# Module-level constants for pulls per copy
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


def calculate_pulls_per_eidolon():
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


def _create_barplot(
    data: pd.DataFrame,
    x_key: str,
    y_key: str,
    title: str,
    xlabel: str,
    ylabel: str,
    palette: str,
    label_format: str,
    y_offset: float,
    filename: str,
    title_suffix: str = "",
    character_name: Optional[str] = None,
):
    """
    Create a standardized bar plot with consistent styling and save to file.

    Args:
        data: DataFrame containing the data to plot
        x_key: Column name for x-axis values
        y_key: Column name for y-axis values
        title: Plot title
        xlabel: X-axis label
        ylabel: Y-axis label
        palette: Color palette name
        label_format: Format string for bar labels
        y_offset: Vertical offset for bar labels
        filename: Output filename
        title_suffix: Optional suffix to append to the title
        character_name: Optional name of the character being analyzed
    """
    plt.figure(figsize=(12, 6.3))  # type: ignore
    ax = plt.gca()

    sns.barplot(
        x=x_key, y=y_key, hue=x_key, data=data, palette=palette, legend=False, ax=ax
    )

    # Wrap long titles to fit better on the plot
    wrapped_title = "\n".join(
        [
            line.strip()
            for line in textwrap.fill(
                f"{title}{title_suffix}",
                width=60,
                break_long_words=False,
                break_on_hyphens=False,
            ).split("\n")
        ]
    )

    ax.set_title(wrapped_title, pad=20)  # type: ignore
    ax.set_xlabel(xlabel, labelpad=10)  # type: ignore
    ax.set_ylabel(ylabel)  # type: ignore

    # Add value labels to bars
    for i, v in enumerate(data[y_key]):  # type: ignore
        ax.text(i, v + y_offset, label_format.format(v), ha="center")  # type: ignore
    plt.tight_layout()

    output_dir = (
        Path(path.join("output", f"{character_name}"))
        if character_name
        else Path("output")
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename

    plt.savefig(output_path, dpi=300)  # type: ignore
    print(f"Plot saved as '{output_path}'")
    plt.close()


def plot_eidolon_value(
    avg_dmg: Dict[str, float],
    dmg_per_pull: Dict[str, float],
    marginal_value: Dict[str, float],
    character_name: Optional[str] = None,
):
    """Create visualization for eidolon value analysis.

    Args:
        avg_dmg: Dictionary of average damage by eidolon
        dmg_per_pull: Dictionary of damage per pull efficiency
        marginal_value: Dictionary of marginal value of each eidolon
        character_name: Optional name of the character being analyzed
    """
    # Set up the plot style
    sns.set_theme(style="whitegrid", context="talk")

    # Create title suffix with character name if provided
    title_suffix = f" - {character_name}" if character_name else ""

    # Figure 1: Average Damage Percentage by Eidolon
    avg_dmg_df = pd.DataFrame(
        {
            "Eidolon": list(avg_dmg.keys()),
            "Damage": list(avg_dmg.values()),
        }
    )

    _create_barplot(
        data=avg_dmg_df,
        x_key="Eidolon",
        y_key="Damage",
        title="Honkai: Star Rail Average Damage Percentage by Eidolon and Signature Light Cone",
        xlabel="Eidolon Level and Signature Light Cone",
        ylabel="Damage Percentage (%)",
        palette="viridis",
        label_format="{:.1f}%",
        y_offset=5,
        filename=f"{character_name}_avg_damage_by_eidolon.png",
        title_suffix=title_suffix,
        character_name=character_name,
    )

    # Figure 2: Damage per Pull Efficiency
    dmg_pull_df = pd.DataFrame(
        {
            "Eidolon": list(dmg_per_pull.keys()),
            "Damage per Pull": list(dmg_per_pull.values()),
        }
    )

    _create_barplot(
        data=dmg_pull_df,
        x_key="Eidolon",
        y_key="Damage per Pull",
        title="Honkai: Star Rail Damage per Pull Efficiency",
        xlabel="Eidolon Level and Signature Light Cone",
        ylabel="Damage % per Pull",
        palette="rocket",
        label_format="{:.3f}",
        y_offset=0.01,
        filename=f"{character_name}_damage_per_pull.png",
        title_suffix=title_suffix,
        character_name=character_name,
    )

    # Figure 3: Marginal Value of Each Eidolon
    marginal_df = pd.DataFrame(
        {
            "Transition": list(marginal_value.keys()),
            "Marginal Value": list(marginal_value.values()),
        }
    )

    _create_barplot(
        data=marginal_df,
        x_key="Transition",
        y_key="Marginal Value",
        title="Honkai: Star Rail Marginal Value of Each Eidolon and Signature Light Cone Upgrade",
        xlabel="Eidolon and Signature Light Cone Transition",
        ylabel="Damage % per Additional Pull",
        palette="mako",
        label_format="{:.3f}",
        y_offset=0.01,
        filename=f"{character_name}_marginal_value.png",
        title_suffix=title_suffix,
        character_name=character_name,
    )
