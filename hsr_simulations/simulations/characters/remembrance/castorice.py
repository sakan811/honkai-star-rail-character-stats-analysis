from simulations.characters.base_character import Character


class Castorice(Character):
    NEWBUD = 34000
    MIN_COMBINED_ALLIES_HP = 8000
    MAX_COMBINED_ALLIES_HP = 32000

    def __init__(self):
        self.current_combined_allies_hp = 0

    def calculate_allies_hp_vs_newbud(self) -> dict[str, list[str | float]]:
        data_dict: dict[str, list[str | float]] = {
            "character": [],
            "combined_allies_hp": [],
            "skill_count_before_getting_ult": [],
        }
                
        for combined_allies_hp in range(
            self.MIN_COMBINED_ALLIES_HP, self.MAX_COMBINED_ALLIES_HP + 1, 1000
        ):        
            current_newbud = 0
            self.current_combined_allies_hp = combined_allies_hp
            counter = 0
            while current_newbud < self.NEWBUD:
                current_newbud += self.current_combined_allies_hp * 0.3
                counter += 1
                self.current_combined_allies_hp *= 0.7
                
                heal = self.current_combined_allies_hp * 0.5
                self.current_combined_allies_hp += heal
                
                current_newbud += heal
                
            data_dict["character"].append(self.__class__.__name__)
            data_dict["combined_allies_hp"].append(combined_allies_hp)
            data_dict["skill_count_before_getting_ult"].append(counter)

        return data_dict
    
    def output_data(self) -> dict[str, list[str | float]]:
        return self.calculate_allies_hp_vs_newbud()