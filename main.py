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
import logging

# Set up default logger
logger = logging.getLogger("hsr_eidolon_value_analysis")
logger.setLevel(logging.INFO)
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(module)s:%(lineno)d -  %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def main():
    # Initialize characters
    character_list: list[Character] = [RuanMei(), Castorice()]

    for character in character_list:
        logger.info(f"Running simulations for {character.get_name()}...")
        simulation_data = run_simulations(character)

        logger.info("Generating plots...")

        avg_dmg = convert_simulation_data_to_avg_dmg(simulation_data)
        pulls_per_eidolon = calculate_pulls_per_eidolon()
        dmg_per_pull = calculate_dmg_per_pull(avg_dmg, pulls_per_eidolon)
        marginal_value = calculate_marginal_value(avg_dmg, pulls_per_eidolon)

        plot_eidolon_value(
            avg_dmg, dmg_per_pull, marginal_value, character_name=character.get_name()
        )


if __name__ == "__main__":
    main()
