import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

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
        "E0": pulls_per_copy,       # First copy (base character)
        "E1": pulls_per_copy * 2,   # Second copy
        "E2": pulls_per_copy * 3,   # Third copy
        "E3": pulls_per_copy * 4,   # Fourth copy
        "E4": pulls_per_copy * 5,   # Fifth copy
        "E5": pulls_per_copy * 6,   # Sixth copy
        "E6": pulls_per_copy * 7    # Seventh copy
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
        prev_eidolon = eidolons[i-1]
        curr_eidolon = eidolons[i]
        
        dmg_increase = avg_dmg[curr_eidolon] - avg_dmg[prev_eidolon]
        pull_increase = pulls_per_eidolon[curr_eidolon] - pulls_per_eidolon[prev_eidolon]
        
        marginal_value = dmg_increase / pull_increase
        result[f"{prev_eidolon}-{curr_eidolon}"] = marginal_value
    
    return result

def plot_eidolon_value(avg_dmg, dmg_per_pull, marginal_value):
    """Create visualization for eidolon value analysis."""
    # Set up the plot style
    sns.set(style="whitegrid", context="talk")
    
    # Create a figure with 3 subplots
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 18))
    
    # Plot 1: Average Damage Percentage by Eidolon
    sns.barplot(x=list(avg_dmg.keys()), y=list(avg_dmg.values()), palette="viridis", ax=ax1)
    ax1.set_title("Average Damage Percentage by Eidolon")
    ax1.set_xlabel("Eidolon Level")
    ax1.set_ylabel("Damage Percentage (%)")
    
    # Add value labels to the bars
    for i, v in enumerate(avg_dmg.values()):
        ax1.text(i, v + 5, f"{v:.1f}%", ha="center")
    
    # Plot 2: Damage per Pull Efficiency
    # Convert to DataFrame for better plotting
    dmg_pull_df = pd.DataFrame({
        'Eidolon': list(dmg_per_pull.keys()),
        'Damage per Pull': list(dmg_per_pull.values())
    })
    
    sns.barplot(x='Eidolon', y='Damage per Pull', data=dmg_pull_df, palette="rocket", ax=ax2)
    ax2.set_title("Damage per Pull Efficiency")
    ax2.set_xlabel("Eidolon Level")
    ax2.set_ylabel("Damage % per Pull")
    
    # Add value labels
    for i, v in enumerate(dmg_per_pull.values()):
        ax2.text(i, v + 0.01, f"{v:.3f}", ha="center")
    
    # Plot 3: Marginal Value of Each Eidolon
    # Convert to DataFrame
    marginal_df = pd.DataFrame({
        'Transition': list(marginal_value.keys()),
        'Marginal Value': list(marginal_value.values())
    })
    
    sns.barplot(x='Transition', y='Marginal Value', data=marginal_df, palette="mako", ax=ax3)
    ax3.set_title("Marginal Value of Each Eidolon Upgrade")
    ax3.set_xlabel("Eidolon Transition")
    ax3.set_ylabel("Damage % per Additional Pull")
    
    # Add value labels
    for i, v in enumerate(marginal_value.values()):
        ax3.text(i, v + 0.01, f"{v:.3f}", ha="center")

    # Adjust layout and save
    plt.tight_layout()
    plt.savefig("eidolon_value_analysis.png", dpi=300)
    print("Plot saved as 'eidolon_value_analysis.png'")
    plt.show()