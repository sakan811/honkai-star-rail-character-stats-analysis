from simulations.characters.base_character import Character


class Hyacine(Character):
    BASE_SPEED = 110
    CONDITIONED_SPEED = 200
    MAX_SPEED = 400
    MINOR_TRACES_SPEED = 14
    SIGNATURE_LIGHTCONE_SPEED_MULT = 0.18
    RELICS_SPEED_MULT = 0.06
    PLANETARY_SPEED_MULT = 0.06
    FEET_RELICS_SPEED_MULT = 0.25032

    def __init__(self) -> None:
        self.speed = self.BASE_SPEED
        self.speed_after_minor_traces = self.speed + self.MINOR_TRACES_SPEED
        self.speed_after_relics_and_planetary_sets = self.speed_after_minor_traces * (1 + self.RELICS_SPEED_MULT) * (1 + self.RELICS_SPEED_MULT) * (1 + self.PLANETARY_SPEED_MULT) * (1 + self.FEET_RELICS_SPEED_MULT)
        self.speed_after_signature_lightcone = self.speed_after_relics_and_planetary_sets * (1 + self.SIGNATURE_LIGHTCONE_SPEED_MULT)

    def calculate_increased_outgoing_healing_by_spd(self) -> dict[str, list[str | float]]:
        data_dict: dict[str, list[str | float]] = {
            "character": [],
            "speed": [],
            "increased_outgoing_healing": [],
            "base_speed": [],
            "speed_after_minor_traces": [],
            "speed_after_relics_and_planetary_sets": [], 
            "speed_after_signature_lightcone": [],
        }
        
        for speed in range(self.speed, self.MAX_SPEED + 1):
            if speed > self.CONDITIONED_SPEED:
                exceed_speed = speed - self.CONDITIONED_SPEED
                increased_healing = exceed_speed * 0.01
                data_dict["character"].append(self.__class__.__name__)
                data_dict["speed"].append(speed)
                data_dict["increased_outgoing_healing"].append(increased_healing)
            else:
                data_dict["character"].append(self.__class__.__name__)
                data_dict["speed"].append(speed)
                data_dict["increased_outgoing_healing"].append(0.0)
                
            data_dict["base_speed"].append(self.speed)
            data_dict["speed_after_minor_traces"].append(self.speed_after_minor_traces)
            data_dict["speed_after_signature_lightcone"].append(self.speed_after_signature_lightcone)
            data_dict["speed_after_relics_and_planetary_sets"].append(self.speed_after_relics_and_planetary_sets)
                
        return data_dict
        
    def output_data(self) -> dict[str, list[str | float]]:
        return self.calculate_increased_outgoing_healing_by_spd()