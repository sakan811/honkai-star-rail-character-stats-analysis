from simulations.characters.base_character import Character


class Castorice(Character):
    NEWBUD = 34000
    MIN_COMBINED_ALLIES_HP = 8000
    MAX_COMBINED_ALLIES_HP = 32000
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
            self.current_combined_allies_hp = combined_allies_hp
            skill_counter = 0
            heal_counter = 0
            while current_newbud < self.NEWBUD:
                allies_hp_consumed = self.current_combined_allies_hp * 0.3
                current_newbud += allies_hp_consumed
                skill_counter += 1
                if current_newbud >= self.NEWBUD:
                    break
                self.current_combined_allies_hp -= allies_hp_consumed
                current_newbud += self.GALLAGHER_SKILL_HEAL
                heal_counter += 1
                if current_newbud >= self.NEWBUD:
                    break
                
            data_dict["character"].append(self.__class__.__name__)
            data_dict["combined_allies_hp"].append(combined_allies_hp)
            data_dict["skill_count_before_getting_ult"].append(skill_counter)
            data_dict["heal_count_before_getting_ult"].append(heal_counter)

        return data_dict
    
    def output_data(self) -> dict[str, list[str | float]]:
        return self.calculate_allies_hp_vs_newbud()