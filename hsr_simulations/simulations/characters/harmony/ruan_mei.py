from simulations.characters.base_character import Character


class RuanMei(Character):
    START_BREAK_EFFECT: float = 1.0
    END_BREAK_EFFECT: float = 2.0
    BASE_SKILL_DMG_MULT: float = 0.32
    A6_BREAK_EFFECT_THRESHOLD: float = 1.2  # 120%
    A6_DMG_PER_10_PERCENT: float = 0.06  # 6% per 10% break effect
    A6_MAX_ADDITIONAL_DMG: float = 0.36  # 36% maximum

    def __init__(self):
        super().__init__()
        self.ruan_mei_ult_energy: int = 130

    def calculate_additional_skill_dmg_by_break_effect(
        self, break_effect: float
    ) -> float:
        """
        Calculate additional skill damage from A6 trace based on break effect.

        For every 10% of Break Effect above 120%, gain 6% additional DMG, up to 36%.

        Args:
            break_effect: Break effect as decimal (1.0 = 100%)

        Returns:
            Additional damage multiplier from A6 trace
        """
        if break_effect <= self.A6_BREAK_EFFECT_THRESHOLD:
            return 0.0

        excess_break_effect = break_effect - self.A6_BREAK_EFFECT_THRESHOLD
        # Each 0.1 (10%) gives 0.06 (6%) damage
        additional_dmg = (excess_break_effect / 0.1) * self.A6_DMG_PER_10_PERCENT

        return min(self.A6_MAX_ADDITIONAL_DMG, additional_dmg)

    def calculate_skill_dmg_over_break_effect_range(
        self,
    ) -> dict[str, list[str | float]]:
        """
        Generate data showing skill damage scaling across break effect range.

        Returns:
            Dictionary with break effect values and corresponding damage increases
        """
        data_dict: dict[str, list[str | float]] = {
            "character": [],
            "break_effect": [],
            "break_effect_percentage": [],
            "base_skill_dmg_increase": [],
            "additional_dmg_from_a6": [],
            "total_skill_dmg_increase": [],
        }

        # Generate data points from 100% to 300% break effect
        current_break_effect = self.START_BREAK_EFFECT
        while current_break_effect <= self.END_BREAK_EFFECT:
            # Calculate damage components
            base_dmg = self.BASE_SKILL_DMG_MULT
            additional_a6_dmg = self.calculate_additional_skill_dmg_by_break_effect(
                current_break_effect
            )
            total_dmg = base_dmg + additional_a6_dmg

            # Store data
            data_dict["character"].append(self.__class__.__name__)
            data_dict["break_effect"].append(current_break_effect)
            data_dict["break_effect_percentage"].append(current_break_effect * 100)
            data_dict["base_skill_dmg_increase"].append(base_dmg)
            data_dict["additional_dmg_from_a6"].append(additional_a6_dmg)
            data_dict["total_skill_dmg_increase"].append(total_dmg)

            # Increment by 1% (0.01)
            current_break_effect = round(current_break_effect + 0.01, 2)

        return data_dict

    def output_data(self) -> dict[str, list[str | float]]:
        """Main output method for data visualization."""
        return self.calculate_skill_dmg_over_break_effect_range()
