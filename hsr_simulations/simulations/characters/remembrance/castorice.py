from simulations.characters.base_character import Character


class Castorice(Character):
    NEWBUD = 34000
    MIN_COMBINED_ALLIES_HP = 6000
    MAX_COMBINED_ALLIES_HP = 24000
    CASTORICE_HP = 9000
    GALLAGHER_SKILL_HEAL = 1600

    def __init__(self):
        self.current_combined_allies_hp = 0

    def calculate_allies_hp_vs_newbud(self) -> dict[str, list[str | float]]:
        data_dict: dict[str, list[str | float]] = {
            "character": [],
            "combined_allies_hp": [],
            "skill_count_before_getting_ult": [],
            "heal_count_before_getting_ult": [],
        }
                
        for combined_allies_hp in range(
            self.MIN_COMBINED_ALLIES_HP, self.MAX_COMBINED_ALLIES_HP + 1, 1000
        ):        
            current_newbud = 0
            self.current_combined_allies_hp = combined_allies_hp + self.CASTORICE_HP
            skill_counter = 0
            heal_counter = 0
            each_ally_hp = combined_allies_hp / 3
            teammate = {
                "castorice": self.CASTORICE_HP,
                "ally1": each_ally_hp,
                "ally2": each_ally_hp,
                "ally3": each_ally_hp,
            }
            next_char_to_get_heal = "castorice"
            while current_newbud < self.NEWBUD:
                allies_hp_consumed = sum([hp * 0.3 for hp in teammate.values()])
                current_newbud += allies_hp_consumed
                skill_counter += 1
                if current_newbud >= self.NEWBUD:
                    break
                teammate["castorice"] -= teammate["castorice"] * 0.7
                teammate["ally1"] -= teammate["ally1"] * 0.7
                teammate["ally2"] -= teammate["ally2"] * 0.7
                teammate["ally3"] -= teammate["ally3"] * 0.7
                current_newbud += self.GALLAGHER_SKILL_HEAL
                
                if next_char_to_get_heal == "castorice":
                    teammate["castorice"] += self.GALLAGHER_SKILL_HEAL
                    next_char_to_get_heal = "ally1"
                elif next_char_to_get_heal == "ally1":
                    teammate["ally1"] += self.GALLAGHER_SKILL_HEAL
                    next_char_to_get_heal = "ally2"
                elif next_char_to_get_heal == "ally2":
                    teammate["ally2"] += self.GALLAGHER_SKILL_HEAL
                    next_char_to_get_heal = "ally3"
                elif next_char_to_get_heal == "ally3":
                    teammate["ally3"] += self.GALLAGHER_SKILL_HEAL
                    next_char_to_get_heal = "castorice"
                
                heal_counter += 1
                if current_newbud >= self.NEWBUD:
                    break
                
            data_dict["character"].append(self.__class__.__name__)
            data_dict["combined_allies_hp"].append(combined_allies_hp + self.CASTORICE_HP)
            data_dict["skill_count_before_getting_ult"].append(skill_counter)
            data_dict["heal_count_before_getting_ult"].append(heal_counter)

        return data_dict
    
    def output_data(self) -> dict[str, list[str | float]]:
        return self.calculate_allies_hp_vs_newbud()