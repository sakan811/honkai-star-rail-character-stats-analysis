from hsr_simulations.simulations.characters.base_character import Character


class Hyacine(Character):
    CONDITIONED_SPEED = 200
    MAX_SPEED = 400

    def __init__(self) -> None:
        self.speed = 110

    def calculate_increased_outgoing_healing_by_spd(self) -> dict[str, list[float]]:
        data_dict: dict[str, list[float]] = {
            "speed": [],
            "increased_outgoing_healing": [],
        }
        for speed in range(self.speed, self.MAX_SPEED + 1):
            if speed > self.CONDITIONED_SPEED:
                exceed_speed = speed - self.CONDITIONED_SPEED
                increased_healing = exceed_speed * 0.01
                data_dict["speed"].append(speed)
                data_dict["increased_outgoing_healing"].append(increased_healing)
            else:
                data_dict["speed"].append(speed)
                data_dict["increased_outgoing_healing"].append(0.0)
        return data_dict
