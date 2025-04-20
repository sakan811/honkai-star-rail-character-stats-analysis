from simulations.characters.base_character import Character
from simulations.characters.harmony.ruan_mei import RuanMei
from simulations.characters.remembrance.castorice import Castorice
from simulations.simulation import run_simulations
from simulations.visuals.plot_eidolon_value import (
    convert_simulation_data_to_avg_dmg,
    calculate_pulls_per_eidolon,
    calculate_dmg_per_pull,
    calculate_marginal_value,
    plot_eidolon_value,
)


def main():
    # Initialize character
    character_list: list[Character] = [RuanMei(), Castorice()]

    # Run simulations
    for character in character_list:
        print(f"Running simulations for {character.get_name()}...")
        simulation_data = run_simulations(character)

        print("\nGenerating plots...")

        # Convert simulation data to normalized damage percentages
        avg_dmg = convert_simulation_data_to_avg_dmg(simulation_data)

        # Calculate the pull efficiency metrics
        pulls_per_eidolon = calculate_pulls_per_eidolon()
        dmg_per_pull = calculate_dmg_per_pull(avg_dmg, pulls_per_eidolon)
        marginal_value = calculate_marginal_value(avg_dmg, pulls_per_eidolon)

        # Generate plots
        plot_eidolon_value(
            avg_dmg, dmg_per_pull, marginal_value, character_name=character.get_name()
        )


if __name__ == "__main__":
    main()
