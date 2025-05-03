from os import path
from typing import Dict, Optional
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from pathlib import Path
import textwrap


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
) -> None:
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
    plt.figure(figsize=(12, 6.3))
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

    ax.set_title(wrapped_title, pad=20)
    ax.set_xlabel(xlabel, labelpad=10)
    ax.set_ylabel(ylabel)

    # Add value labels to bars
    for i, v in enumerate(data[y_key]):
        ax.text(i, v + y_offset, label_format.format(v), ha="center")
    plt.tight_layout()

    output_dir = (
        Path(path.join("output", f"{character_name}"))
        if character_name
        else Path("output")
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename

    plt.savefig(output_path, dpi=300)
    print(f"Plot saved as '{output_path}'")
    plt.close()


def plot_eidolon_value(
    avg_dmg: Dict[str, float],
    dmg_per_pull: Dict[str, float],
    marginal_value: Dict[str, float],
    character_name: Optional[str] = None,
) -> None:
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
