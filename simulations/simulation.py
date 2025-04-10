from simulations.characters.base_character import Character


def run_simulations(character: "Character") -> dict[str, float]:
    """
    Run simulations for the character and return a dictionary of damage values.

    Args:
        character (Character): The character instance to simulate.

    Returns:
        dict[str, float]: A dictionary containing the damage values for different scenarios.
    """
    data_dict = {
        "base_dmg": character.calculate_final_dmg(),
        "e1_dmg": character.calculate_final_dmg(has_e1=True),
        "e2_dmg": character.calculate_final_dmg(has_e1=True, has_e2=True),
        "e3_dmg": character.calculate_final_dmg(has_e1=True, has_e2=True, has_e3=True),
        "e4_dmg": character.calculate_final_dmg(
            has_e1=True, has_e2=True, has_e3=True, has_e4=True
        ),
        "e5_dmg": character.calculate_final_dmg(
            has_e1=True, has_e2=True, has_e3=True, has_e4=True, has_e5=True
        ),
        "e6_dmg": character.calculate_final_dmg(
            has_e1=True, has_e2=True, has_e3=True, has_e4=True, has_e5=True, has_e6=True
        ),
        "lc_dmg": character.calculate_final_dmg(has_lc=True),
    }

    return data_dict
