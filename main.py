from pathlib import Path
from calculator.plot_eidolon_value import (
    calculate_dmg_per_pull,
    calculate_marginal_value,
    calculate_pulls_per_eidolon,
    plot_eidolon_value,
)
from calculator.value_calculator import ValueCalculator


def main():
    # Path to the data file
    data_path = Path(__file__).parent / "data" / "castorice.json"

    # Initialize calculator
    calculator = ValueCalculator(data_path)

    # Calculate average damage by eidolon
    avg_dmg = calculator.calculate_average_dmg_by_eidolon()

    # Calculate pulls required per eidolon
    pulls_per_eidolon = calculate_pulls_per_eidolon()

    # Calculate damage per pull efficiency
    dmg_per_pull = calculate_dmg_per_pull(avg_dmg, pulls_per_eidolon)

    # Calculate marginal value of each eidolon upgrade
    marginal_value = calculate_marginal_value(avg_dmg, pulls_per_eidolon)

    # Generate the visualizations
    plot_eidolon_value(avg_dmg, dmg_per_pull, marginal_value)

if __name__ == "__main__":
    main()
