from simulations.characters.base_character import Character


class Castorice(Character):
    """
    Corrected Castorice implementation with accurate Newbud energy mechanics.

    Key Mechanics:
    - Castorice's skill consumes 30% of each ally's current HP to generate Newbud energy
    - Ultimate requires 34,000 Newbud energy
    - Gallagher provides healing support but doesn't generate Newbud energy
    - Team consists of 4 members: Castorice + 3 allies
    """

    NEWBUD_REQUIRED = 34000
    MIN_COMBINED_ALLIES_HP = 15000  # Updated to match actual data range
    MAX_COMBINED_ALLIES_HP = 33000  # Updated to match actual data range
    CASTORICE_BASE_HP = 9000
    GALLAGHER_HEAL_AMOUNT = 1600
    SKILL_HP_CONSUMPTION_RATE = 0.30  # 30% of current HP consumed per skill

    def __init__(self) -> None:
        super().__init__()
        self.current_combined_allies_hp = 0.0

    def calculate_allies_hp_vs_newbud(self) -> dict[str, list[str | float]]:
        """
        Calculate the relationship between team HP and actions needed for ultimate.

        Corrected Logic:
        1. Castorice's skill consumes 30% of CURRENT HP from each ally
        2. This consumed HP becomes Newbud energy (1:1 ratio)
        3. After skill, allies retain 70% of their HP
        4. Gallagher heals one ally rotationally for 1,600 HP
        5. Repeat until 34,000 Newbud energy is reached
        """
        data_dict: dict[str, list[str | float]] = {
            "character": [],
            "combined_allies_hp": [],
            "skill_count_before_getting_ult": [],
            "heal_count_before_getting_ult": [],
        }

        # Test different team HP configurations
        for base_combined_hp in range(
            self.MIN_COMBINED_ALLIES_HP, self.MAX_COMBINED_ALLIES_HP + 1, 1000
        ):
            current_newbud = 0.0
            skill_counter = 0
            heal_counter = 0

            # Initialize team HP (3 equal allies + Castorice)
            ally_hp = (base_combined_hp - self.CASTORICE_BASE_HP) / 3
            team = {
                "castorice": float(self.CASTORICE_BASE_HP),
                "ally1": ally_hp,
                "ally2": ally_hp,
                "ally3": ally_hp,
            }

            # Gallagher heals rotationally
            heal_rotation = ["castorice", "ally1", "ally2", "ally3"]
            heal_index = 0

            # Simulate until ultimate is ready
            while current_newbud < self.NEWBUD_REQUIRED:
                # Castorice uses skill: consume 30% of each ally's current HP
                hp_consumed_total = 0.0
                for ally in team:
                    hp_consumed = team[ally] * self.SKILL_HP_CONSUMPTION_RATE
                    hp_consumed_total += hp_consumed
                    team[ally] -= hp_consumed  # Ally loses 30% of current HP

                # HP consumed becomes Newbud energy
                current_newbud += hp_consumed_total
                skill_counter += 1

                # Check if ultimate is ready
                if current_newbud >= self.NEWBUD_REQUIRED:
                    break

                # Gallagher heals next ally in rotation
                target_ally = heal_rotation[heal_index]
                team[target_ally] += self.GALLAGHER_HEAL_AMOUNT
                heal_counter += 1
                heal_index = (heal_index + 1) % len(heal_rotation)

                # Safety check to prevent infinite loops
                if skill_counter > 50:  # Reasonable upper limit
                    break

            # Store results
            data_dict["character"].append(self.__class__.__name__)
            data_dict["combined_allies_hp"].append(base_combined_hp)
            data_dict["skill_count_before_getting_ult"].append(skill_counter)
            data_dict["heal_count_before_getting_ult"].append(heal_counter)

        return data_dict

    def output_data(self) -> dict[str, list[str | float]]:
        return self.calculate_allies_hp_vs_newbud()