from typing import Optional


class Character:
    def __init__(
        self,
        hp: float = 3000,
        atk: float = 2000,
        crit_rate: float = 0.5,
        crit_dmg: float = 1,
        ult_energy: float = 120,
        break_effect: float = 1.0,
        speed: float = 100,
        skill_multiplier: float = 1.25,
        ult_multiplier: float = 4.5,
        has_e1: bool = False,
        has_e2: bool = False,
        has_e3: bool = False,
        has_e4: bool = False,
        has_e5: bool = False,
        has_e6: bool = False,
        has_lc: bool = False,
    ):
        self.hp = hp
        self.atk = atk
        self.crit_rate = crit_rate
        self.crit_dmg = crit_dmg
        self.ult_energy = ult_energy
        self.break_effect = break_effect
        self.speed = speed
        self.skill_multiplier = skill_multiplier
        self.ult_multiplier = ult_multiplier
        self.has_e1 = has_e1
        self.has_e2 = has_e2
        self.has_e3 = has_e3
        self.has_e4 = has_e4
        self.has_e5 = has_e5
        self.has_e6 = has_e6
        self.has_lc = has_lc

    def calculate_dmg(self, atk, multiplier) -> float:
        """
        Calculate damage based on attack and a multiplier.

        Args:
            atk (float): The attack value.
            multiplier (float): The damage multiplier.

        Returns:
            float: The calculated damage.
        """
        return atk * multiplier

    def calculate_break_dmg(
        self, base_break_dmg: float = 2000, break_effect: float = 1.0
    ) -> float:
        """
        Calculate break damage or super break damage based on base break damage and break effect.

        Args:
            base_break_dmg (float): The base break damage.
            break_effect (float): The break effect multiplier.

        Returns:
            float: The calculated break damage.
        """
        return base_break_dmg * break_effect

    def calculate_percent_change(
        self, original_value: float, new_value: float
    ) -> float:
        """
        Calculate the percentage change between two values.

        Args:
            original_value (float): The original value.
            new_value (float): The new value.

        Returns:
            float: The percentage change.
        """
        return (new_value - original_value) / original_value

    def calculate_dmg_increase_by_break_effect(
        self, increased_break_effect: float
    ) -> float:
        """
        Calculate the increase in damage due to break effect.

        Args:
            increased_break_effect (float): The increased break effect.

        Returns:
            float: The increase in damage.
        """
        hit_fraction_bonus = increased_break_effect / (1 + increased_break_effect)
        return hit_fraction_bonus * 0.1

    def calculate_final_dmg(
        self,
        has_e1: Optional[bool] = None,
        has_e2: Optional[bool] = None,
        has_e3: Optional[bool] = None,
        has_e4: Optional[bool] = None,
        has_e5: Optional[bool] = None,
        has_e6: Optional[bool] = None,
        has_lc: Optional[bool] = None,
    ) -> float:
        """
        Calculate the final damage based on various factors.

        Args:
            has_e1 (bool): Whether the character has E1.
            has_e2 (bool): Whether the character has E2.
            has_e3 (bool): Whether the character has E3.
            has_e4 (bool): Whether the character has E4.
            has_e5 (bool): Whether the character has E5.
            has_e6 (bool): Whether the character has E6.
            has_lc (bool): Whether the character has a signature light cone.

        Returns:
            float: The final damage.
        """
        if has_e1:
            # Apply E1 effects
            raise NotImplementedError("Subclasses should implement this method.")
        if has_e2:
            # Apply E2 effects
            raise NotImplementedError("Subclasses should implement this method.")
        if has_e3:
            # Apply E3 effects
            raise NotImplementedError("Subclasses should implement this method.")
        if has_e4:
            # Apply E4 effects
            raise NotImplementedError("Subclasses should implement this method.")
        if has_e5:
            # Apply E5 effects
            raise NotImplementedError("Subclasses should implement this method.")
        if has_e6:
            # Apply E6 effects
            raise NotImplementedError("Subclasses should implement this method.")
        if has_lc:
            # Apply light cone effects
            raise NotImplementedError("Subclasses should implement this method.")

        raise NotImplementedError("Subclasses should implement this method.")

    def calculate_dmg_increased_by_skill_points(
        self, additional_skill_points: int, affected_team_members: int = 1
    ) -> float:
        """
        Calculate the damage increase from additional skill points

        Args:
            additional_skill_points: Extra skill points gained
            affected_team_members: Number of team members affected

        Returns:
            Damage increase percentage
        """
        base_skill_point = 3
        new_skills_point = base_skill_point + additional_skill_points

        # Get single skill damage
        single_skill_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)
        non_skill_dmg = 1000

        # Calculate damage per cycle
        base_cycle_dmg = (single_skill_dmg * base_skill_point) + non_skill_dmg
        new_cycle_dmg = (single_skill_dmg * new_skills_point) + non_skill_dmg

        # Calculate damage increase
        damage_increase = (new_cycle_dmg / base_cycle_dmg) - 1

        return damage_increase / affected_team_members

    def calculate_dmg_increased_from_energy_regen(
        self, additional_energy_gain: float, affected_team_members: int = 1
    ) -> float:
        """
        Calculate the damage increase from energy regeneration.

        Args:
            additional_energy_gain (float): The additional energy gained.
            affected_team_members (int): Number of team members affected.

        Returns:
            Damage increase percentage
        """
        base_turn = 5

        base_energy_regen = 30.0
        base_turn_until_ult = self.ult_energy / base_energy_regen

        new_energy_regen = base_energy_regen + additional_energy_gain
        new_turn_until_ult = self.ult_energy / new_energy_regen

        base_ult_used = base_turn / base_turn_until_ult
        new_ult_used = base_turn / new_turn_until_ult

        ult_dmg = self.calculate_dmg(self.atk, self.ult_multiplier)
        non_skill_dmg = 1000

        base_cycle_dmg = (ult_dmg * base_ult_used) + non_skill_dmg
        new_cycle_dmg = (ult_dmg * new_ult_used) + non_skill_dmg

        # Calculate damage increase
        damage_increase = (new_cycle_dmg / base_cycle_dmg) - 1

        return damage_increase / affected_team_members
