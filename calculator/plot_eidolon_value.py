import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from pathlib import Path


def calculate_pulls_per_eidolon():
    """
    Calculate the expected number of pulls needed for each eidolon level.

    With 50% chance to get the rate-up character and hard pity at 90 pulls,
    the average pulls per copy is approximately 108 pulls (taking into account
    the 50/50 chance and guarantee system).

    Returns:
        Dictionary mapping eidolon levels to cumulative pull counts
    """
    # Approximately 108 pulls per copy on average with the 50/50 system
    pulls_per_copy = 108

    return {
        "E0": pulls_per_copy,  # First copy (base character)
        "E1": pulls_per_copy * 2,  # Second copy
        "E2": pulls_per_copy * 3,  # Third copy
        "E3": pulls_per_copy * 4,  # Fourth copy
        "E4": pulls_per_copy * 5,  # Fifth copy
        "E5": pulls_per_copy * 6,  # Sixth copy
        "E6": pulls_per_copy * 7,  # Seventh copy
    }


def calculate_dmg_per_pull(avg_dmg, pulls_per_eidolon):
    """Calculate damage per pull for each eidolon level."""
    return {
        eidolon: (dmg_percent / pulls_per_eidolon[eidolon])
        for eidolon, dmg_percent in avg_dmg.items()
    }


def calculate_marginal_value(avg_dmg, pulls_per_eidolon):
    """
    Calculate the marginal value (additional damage per additional pull)
    for each eidolon transition.
    """
    eidolons = list(avg_dmg.keys())
    result = {}

    for i in range(1, len(eidolons)):
        prev_eidolon = eidolons[i - 1]
        curr_eidolon = eidolons[i]

        dmg_increase = avg_dmg[curr_eidolon] - avg_dmg[prev_eidolon]
        pull_increase = (
            pulls_per_eidolon[curr_eidolon] - pulls_per_eidolon[prev_eidolon]
        )

        marginal_value = dmg_increase / pull_increase
        result[f"{prev_eidolon}-{curr_eidolon}"] = marginal_value

    return result


def _create_barplot(data, x_key, y_key, title, xlabel, ylabel, 
                  palette, label_format, y_offset, filename, title_suffix=""):
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
    """
    plt.figure(figsize=(12, 6.3))
    ax = plt.gca()
    
    sns.barplot(
        x=x_key, y=y_key, hue=x_key,
        data=data, palette=palette, legend=False, ax=ax
    )
    
    ax.set_title(f"{title}{title_suffix}", pad=15)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    
    # Add value labels to bars
    for i, v in enumerate(data[y_key]):
        ax.text(i, v + y_offset, label_format.format(v), ha="center")
    
    plt.tight_layout()
    
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    output_path = output_dir / filename
    
    plt.savefig(output_path, dpi=300)
    print(f"Plot saved as '{output_path}'")
    plt.close()


def plot_eidolon_value(avg_dmg, dmg_per_pull, marginal_value, character_name=None):
    """Create visualization for eidolon value analysis.
    
    Args:
        avg_dmg: Dictionary of average damage by eidolon
        dmg_per_pull: Dictionary of damage per pull efficiency
        marginal_value: Dictionary of marginal value of each eidolon
        character_name: Optional name of the character being analyzed
    """
    # Set up the plot style
    sns.set(style="whitegrid", context="talk")
    
    # Create title suffix with character name if provided
    title_suffix = f" ({character_name})" if character_name else ""
    
    # Figure 1: Average Damage Percentage by Eidolon
    avg_dmg_df = pd.DataFrame({
        "Eidolon": list(avg_dmg.keys()),
        "Damage": list(avg_dmg.values()),
    })
    
    _create_barplot(
        data=avg_dmg_df,
        x_key="Eidolon",
        y_key="Damage",
        title="Honkai: Star Rail Average Damage Percentage by Eidolon",
        xlabel="Eidolon Level",
        ylabel="Damage Percentage (%)",
        palette="viridis",
        label_format="{:.1f}%",
        y_offset=5,
        filename=f"{title_suffix}_avg_damage_by_eidolon.png",
        title_suffix=title_suffix
    )
    
    # Figure 2: Damage per Pull Efficiency
    dmg_pull_df = pd.DataFrame({
        "Eidolon": list(dmg_per_pull.keys()),
        "Damage per Pull": list(dmg_per_pull.values()),
    })
    
    _create_barplot(
        data=dmg_pull_df,
        x_key="Eidolon",
        y_key="Damage per Pull",
        title="Honkai: Star Rail Damage per Pull Efficiency",
        xlabel="Eidolon Level",
        ylabel="Damage % per Pull",
        palette="rocket",
        label_format="{:.3f}",
        y_offset=0.01,
        filename=f"{title_suffix}_damage_per_pull.png",
        title_suffix=title_suffix
    )
    
    # Figure 3: Marginal Value of Each Eidolon
    marginal_df = pd.DataFrame({
        "Transition": list(marginal_value.keys()),
        "Marginal Value": list(marginal_value.values()),
    })
    
    _create_barplot(
        data=marginal_df,
        x_key="Transition",
        y_key="Marginal Value",
        title="Honkai: Star Rail Marginal Value of Each Eidolon Upgrade",
        xlabel="Eidolon Transition",
        ylabel="Damage % per Additional Pull",
        palette="mako",
        label_format="{:.3f}",
        y_offset=0.01,
        filename=f"{title_suffix}_marginal_value.png",
        title_suffix=title_suffix
    )
    
