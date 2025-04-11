from typing import Optional

from simulations.characters.base_character import Character


class RuanMei(Character):
    DMG_INCREASED_FROM_SKILL = 0.32
    BREAK_EFFECT_INCREASED_FROM_SKILL = 0.5
    SPD_INCREASED_FROM_TALENT_PERCENT = 0.1
    TALENT_BREAK_DMG_MULTIPLIER = 1.2
    RES_PEN_FROM_ULT = 0.25
    ULT_BREAK_DMG_MULTIPLIER = 0.5

    def __init__(self):
        super().__init__()
        self.ruan_mei_ult_energy: int = 130

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
        if has_e1:
            def_ignore = self.calculate_dmg_increased_from_e1()
        else:
            def_ignore = 0.0
        if has_e2:
            atk_increase = self.calculate_dmg_increased_from_e2()
        else:
            atk_increase = 0.0
        if has_e3:
            self.RES_PEN_FROM_ULT = 0.27
            self.TALENT_BREAK_DMG_MULTIPLIER = 1.32
        if has_e4:
            e4_increased_break_effect = 1
        else:
            e4_increased_break_effect = 0
        if has_e5:
            self.DMG_INCREASED_FROM_SKILL = 0.352
        if has_e6:
            self.TALENT_BREAK_DMG_MULTIPLIER = 1.32 + 2
            ult_duration_increase = (
                self.calculate_dmg_increased_from_increased_ult_duration()
            )
        else:
            ult_duration_increase = 0
        if has_lc:
            lc_increased_break_effect = 0.6
            dmg_multiplier = self.calculate_dmg_increased_from_lc()
            skill_dmg_increase = self.calculate_dmg_increased_by_skill_points()
            energy_gain_increase = self.calculate_dmg_increased_from_energy_regen()
        else:
            lc_increased_break_effect = 0
            dmg_multiplier = 0.0
            skill_dmg_increase = 0
            energy_gain_increase = 0

        def_ignore_buff = 1 + def_ignore
        speed_buff = 1 + self.SPD_INCREASED_FROM_TALENT_PERCENT
        dmg_multiplier_buff = 1 + dmg_multiplier
        skill_dmg_increase_buff = 1 + skill_dmg_increase
        energy_gain_increase_buff = 1 + energy_gain_increase
        ult_duration_increase_buff = 1 + ult_duration_increase

        atk = self.atk * (1 + atk_increase)
        base_dmg = self.calculate_dmg(atk, self.skill_multiplier)
        base_break_dmg = self.calculate_break_dmg(e4_increased_break_effect)

        skill_buff = 1 + self.DMG_INCREASED_FROM_SKILL
        break_effect_buff = 1 + self.calculate_dmg_increase_by_break_effect(
            self.BREAK_EFFECT_INCREASED_FROM_SKILL
            + e4_increased_break_effect
            + lc_increased_break_effect
        )
        res_pen = 1 + self.RES_PEN_FROM_ULT

        dmg = (
            base_dmg
            * skill_buff
            * break_effect_buff
            * res_pen
            * def_ignore_buff
            * speed_buff
            * dmg_multiplier_buff
            * skill_dmg_increase_buff
            * energy_gain_increase_buff
            * ult_duration_increase_buff
        )

        talent_break_dmg = base_break_dmg * self.TALENT_BREAK_DMG_MULTIPLIER
        ult_break_dmg = base_break_dmg * self.ULT_BREAK_DMG_MULTIPLIER

        final_talent_break_dmg = (
            talent_break_dmg
            * break_effect_buff
            * res_pen
            * def_ignore_buff
            * speed_buff
            * dmg_multiplier_buff
            * skill_dmg_increase_buff
            * energy_gain_increase_buff
            * ult_duration_increase_buff
        )

        final_ult_break_dmg = (
            ult_break_dmg
            * break_effect_buff
            * res_pen
            * def_ignore_buff
            * speed_buff
            * dmg_multiplier_buff
            * skill_dmg_increase_buff
            * energy_gain_increase_buff
            * ult_duration_increase_buff
        )

        break_dmg = final_talent_break_dmg + final_ult_break_dmg

        return dmg + break_dmg

    def calculate_dmg_increased_by_skill_points(self) -> float:
        """
        Calculate the damage increase from having an extra skill point and periodic skill point recovery.

        Simulates two scenarios:
        1. Base scenario: Starting with 3 skill points
        2. Enhanced scenario: Starting with 4 skill points and gaining an additional point every 4 turns

        Returns:
            float: Percentage increase in damage from the enhanced scenario
        """
        # Constants
        base_skill_point = 3
        enhanced_skill_point = base_skill_point + 1  # One extra skill point
        skill_point_recovery = 1
        skill_duration = 4
        total_turns = 1000

        # Damage values
        skill_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)
        basic_atk_dmg = self.calculate_dmg(self.atk, 1.0)

        def simulate_damage(
            starting_points: int, with_periodic_gain: bool = False
        ) -> float:
            """
            Simulate damage over time with given skill point parameters

            Args:
                starting_points (int): Starting skill points
                with_periodic_gain (bool): Whether to include periodic skill point gain

            Returns:
                float: Total damage calculated over the simulation period
            """
            total_damage = 0
            current_points = starting_points
            turn_counter = 0

            for _ in range(total_turns):
                # Check for periodic skill point gain (every 4 turns)
                if with_periodic_gain and turn_counter == 0:
                    current_points += 1

                # Use skill if points available, otherwise basic attack
                if current_points > 0:
                    current_points -= 1
                    total_damage += skill_dmg
                else:
                    total_damage += basic_atk_dmg
                    current_points += skill_point_recovery

                # Update turn counter for periodic gain
                if with_periodic_gain:
                    turn_counter = (turn_counter + 1) % skill_duration

            return total_damage

        # Calculate damage for base and enhanced scenarios
        base_dmg = simulate_damage(base_skill_point)
        enhanced_dmg = simulate_damage(enhanced_skill_point, True)

        return self.calculate_percent_change(base_dmg, enhanced_dmg)

    def calculate_dmg_increased_from_energy_regen(self) -> float:
        turns_per_wave = 5
        additional_energy_gain_per_wave = 10

        base_energy_regen = 30.0

        def simulate_dmg(has_buff: bool = False) -> float:
            ult_energy = self.ult_energy
            current_ult_energy = 0
            total_damage = 0
            total_turns = 1000

            skil_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)
            ult_dmg = self.calculate_dmg(self.atk, self.ult_multiplier)

            for i in range(total_turns):
                if i % turns_per_wave == 0 and has_buff:
                    current_ult_energy += additional_energy_gain_per_wave

                if current_ult_energy >= ult_energy:
                    total_damage += ult_dmg
                    current_ult_energy = 0
                else:
                    total_damage += skil_dmg
                    current_ult_energy += base_energy_regen

            return total_damage

        base_dmg = simulate_dmg()
        enhanced_dmg = simulate_dmg(True)

        return self.calculate_percent_change(base_dmg, enhanced_dmg)

    def calculate_dmg_increased_from_increased_ult_duration(self) -> float:
        """
        Calculate the damage increase from extended ultimate duration.

        Compares two scenarios:
        1. Base scenario: Ultimate lasts 3 turns followed by 1 turn without ultimate
        2. Enhanced scenario: Ultimate lasts 4 turns

        Returns:
            float: Percentage increase in damage from the extended ultimate duration
        """
        # Constants
        base_duration = 3
        enhanced_duration = 4

        # Damage values
        normal_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)
        buffed_dmg = normal_dmg * (1 + self.RES_PEN_FROM_ULT)

        def simulate_dmg(ult_duration: int) -> float:
            total_turns = 1000
            total_damage = 0
            turns_with_ult = ult_duration
            turns_until_ult = 5
            ult_counter = 0

            for _ in range(total_turns):
                if ult_counter >= turns_until_ult:
                    # Reset ult counter after using ultimate
                    ult_counter = 0
                    turns_with_ult = ult_duration

                # If within ultimate duration, apply buffed damage
                if turns_with_ult > 0:
                    total_damage += buffed_dmg
                    turns_with_ult -= 1
                else:
                    total_damage += normal_dmg
                    ult_counter += 1

            return total_damage

        # Calculate damage for base and enhanced scenarios
        base_dmg = simulate_dmg(base_duration)
        enhanced_dmg = simulate_dmg(enhanced_duration)

        return self.calculate_percent_change(base_dmg, enhanced_dmg)

    def calculate_dmg_increased_from_e1(self) -> float:
        ult_duration = 3
        energy_gain = 30

        def simulate_dmg(has_e1: bool = False) -> float:
            ult_energy = self.ruan_mei_ult_energy
            current_ult_energy = 0
            total_damage = 0
            current_ult_duration = 0
            total_turns = 1000

            if has_e1:
                def_ignore = 0.2
            else:
                def_ignore = 0.0

            for _ in range(total_turns):
                if current_ult_energy >= ult_energy:
                    is_ult_active = True
                    current_ult_energy = 0
                    current_ult_duration = ult_duration
                else:
                    is_ult_active = False
                    current_ult_duration = 0

                if is_ult_active:
                    skil_dmg = (
                        self.calculate_dmg(self.atk, self.skill_multiplier)
                        * (1 + self.RES_PEN_FROM_ULT)
                        * (1 + def_ignore)
                    )
                    current_ult_duration -= 1
                else:
                    skil_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)

                total_damage += skil_dmg
                current_ult_energy += energy_gain

            return total_damage

        base_dmg = simulate_dmg()
        enhanced_dmg = simulate_dmg(True)

        return self.calculate_percent_change(base_dmg, enhanced_dmg)

    def calculate_dmg_increased_from_e2(self) -> float:
        def simulate_dmg(has_e2: bool = False) -> float:
            # Constants
            enemy_toughness = 100
            toughness_reduction_per_turn = 30
            weakness_broken_duration_max = 2
            total_turns = 1000

            # Initial state
            current_enemy_toughness = enemy_toughness
            total_damage = 0
            weakness_broken_duration = 0
            is_broken = False

            for _ in range(total_turns):
                if current_enemy_toughness <= 0 and not is_broken:
                    is_broken = True
                    weakness_broken_duration = weakness_broken_duration_max

                if is_broken:
                    if has_e2:
                        atk = self.atk * 1.4
                        skil_dmg = self.calculate_dmg(atk, self.skill_multiplier) * 1.1
                        total_damage += skil_dmg
                    else:
                        skil_dmg = (
                            self.calculate_dmg(self.atk, self.skill_multiplier) * 1.1
                        )
                        total_damage += skil_dmg
                else:
                    skil_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)
                    total_damage += skil_dmg
                # Apply toughness reduction when not broken
                if not is_broken:
                    current_enemy_toughness -= toughness_reduction_per_turn

                # Manage broken state duration
                if is_broken:
                    weakness_broken_duration -= 1
                    if weakness_broken_duration <= 0:
                        # Reset broken state, but don't immediately refill toughness
                        is_broken = False
                        current_enemy_toughness = enemy_toughness

            return total_damage

        base_dmg = simulate_dmg()
        enhanced_dmg = simulate_dmg(True)
        return self.calculate_percent_change(base_dmg, enhanced_dmg)

    def calculate_dmg_increased_from_lc(self) -> float:
        def simulate_dmg(has_lc: bool = False) -> float:
            ult_energy = self.ruan_mei_ult_energy
            current_ult_energy = 0
            total_damage = 0
            current_ult_duration = 0
            ult_duration = 3
            energy_gain = 30
            total_turns = 1000

            if has_lc:
                dmg_multiplier = 0.24
            else:
                dmg_multiplier = 0.0

            for _ in range(total_turns):
                if current_ult_energy >= ult_energy:
                    is_ult_active = True
                    current_ult_energy = 0
                    current_ult_duration = ult_duration
                else:
                    is_ult_active = False
                    current_ult_duration = 0

                if is_ult_active:
                    skil_dmg = (
                        self.calculate_dmg(self.atk, self.skill_multiplier)
                        * (1 + self.RES_PEN_FROM_ULT)
                        * (1 + dmg_multiplier)
                    )
                    current_ult_duration -= 1
                else:
                    skil_dmg = self.calculate_dmg(self.atk, self.skill_multiplier)

                total_damage += skil_dmg
                current_ult_energy += energy_gain

            return total_damage

        base_dmg = simulate_dmg()
        enhanced_dmg = simulate_dmg(True)

        return self.calculate_percent_change(base_dmg, enhanced_dmg)
