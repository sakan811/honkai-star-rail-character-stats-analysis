from simulations.characters.base_character import Character


class Anaxa(Character):
    def __init__(self):
        super().__init__()
        self.skill_mult = 0.7
        self.ult_mult = 1.6
        self.qualitative_disclosure_mult = 0.3

    def calculate_final_dmg(
        self,
        has_e1: bool | None = None,
        has_e2: bool | None = None,
        has_e3: bool | None = None,
        has_e4: bool | None = None,
        has_e5: bool | None = None,
        has_e6: bool | None = None,
        has_lc: bool | None = None,
    ) -> float:
        if has_e1:
            def_reduce_mult = 0.16
            e1_mult = self.calculate_dmg_increased_from_e1()
        else:
            def_reduce_mult = 0.0
            e1_mult = 0.0

        if has_e2:
            all_type_res_pen_mult = 0.2
            e2_mult = self.calculate_dmg_increased_from_e2()
        else:
            all_type_res_pen_mult = 0.0
            e2_mult = 0.0

        if has_e3:
            self.ult_mult = 1.76

        if has_e4:
            e4_mult = self.calculate_dmg_increased_from_e4()
        else:
            e4_mult = 0.0

        if has_e5:
            self.skill_mult = 0.77
            self.qualitative_disclosure_mult = 0.324

        if has_e6:
            e6_mult = 1.3
            enchanced_a4_bufff_mult = self.calculate_dmg_increased_from_e6()
        else:
            e6_mult = 0.0
            enchanced_a4_bufff_mult = 0.0

        if has_lc:
            lc_mult = self.calculate_dmg_increased_from_lc()
        else:
            lc_mult = 0.0

        skill_dmg = (
            self.calculate_dmg(self.atk, self.skill_mult)
            * (1 + def_reduce_mult)
            * (1 + all_type_res_pen_mult)
            * (1 + self.qualitative_disclosure_mult)
        )
        ult_dmg = (
            self.calculate_dmg(self.atk, self.ult_mult)
            * (1 + def_reduce_mult)
            * (1 + all_type_res_pen_mult)
            * (1 + self.qualitative_disclosure_mult)
        )

        final_dmg = skill_dmg + ult_dmg

        return (
            final_dmg
            * (1 + e1_mult)
            * (1 + e2_mult)
            * (1 + e4_mult)
            * (1 + e6_mult)
            * (1 + enchanced_a4_bufff_mult)
            * (1 + lc_mult)
        )

    def calculate_dmg_increased_from_e1(self) -> float:
        def calculate_dmg(has_e1: bool) -> float:
            total_cycles = 1000
            skill_points = 3
            total_dmg = 0
            if has_e1:
                skill_points += 1

            skill_dmg = 1000
            basic_atk_dmg = 500

            for _ in range(total_cycles):
                if skill_points > 0:
                    total_dmg += skill_dmg
                    skill_points -= 1
                else:
                    total_dmg += basic_atk_dmg
                    skill_points += 1

            return total_dmg

        base_dmg = calculate_dmg(False)
        e1_dmg = calculate_dmg(True)

        return self.calculate_percent_change(base_dmg, e1_dmg)

    def calculate_dmg_increased_from_e2(self) -> float:
        # Constants for simulation
        TOTAL_CYCLES = 1000
        BASE_WEAKNESS_COUNT = 3
        MAX_WEAKNESS_COUNT = 5
        E2_WEAKNESS_BONUS = 1
        SKILL_DMG = 1000
        E2_MULTIPLIER = 1.3

        def calculate_dmg(has_e2: bool) -> float:
            total_dmg = 0
            enemy_weakness_count = BASE_WEAKNESS_COUNT
            new_enemy = True

            for _ in range(TOTAL_CYCLES):
                # E2 increases initial weakness count for new enemy
                if has_e2 and new_enemy:
                    enemy_weakness_count += E2_WEAKNESS_BONUS
                new_enemy = False

                if enemy_weakness_count >= MAX_WEAKNESS_COUNT:
                    # Apply E2 bonus multiplier when max weakness is reached
                    total_dmg += SKILL_DMG * E2_MULTIPLIER
                    enemy_weakness_count = BASE_WEAKNESS_COUNT
                    new_enemy = True
                else:
                    total_dmg += SKILL_DMG
                    enemy_weakness_count += 1

                # Clamp weakness count to max
                enemy_weakness_count = min(enemy_weakness_count, MAX_WEAKNESS_COUNT)

            return total_dmg

        base_dmg = calculate_dmg(False)
        e2_dmg = calculate_dmg(True)

        return self.calculate_percent_change(base_dmg, e2_dmg)

    def calculate_dmg_increased_from_e4(self) -> float:
        # E4: When using Skill, increases ATK by 30%, lasting for 2 turns. Stacks up to 2 times.
        TOTAL_CYCLES = 1000
        BASE_SKILL_POINTS = 3
        ATK_BUFF_PERCENT = 0.3
        ATK_BUFF_DURATION = 2
        ATK_BUFF_MAX_STACKS = 2

        def calculate_dmg(has_e4: bool) -> float:
            skill_points = BASE_SKILL_POINTS
            total_dmg = 0
            atk = self.atk
            # Track active ATK buffs: list of remaining turns for each stack
            atk_buffs = []

            for _ in range(TOTAL_CYCLES):
                # Remove expired buffs
                atk_buffs = [turns for turns in atk_buffs if turns > 0]

                # Calculate current ATK buff multiplier
                buff_stacks = min(len(atk_buffs), ATK_BUFF_MAX_STACKS)
                atk_buff_multiplier = (
                    1.0 + (buff_stacks * ATK_BUFF_PERCENT) if has_e4 else 1.0
                )

                if skill_points > 0:
                    # Use Skill, gain ATK buff if E4
                    total_dmg += self.calculate_dmg(
                        atk * atk_buff_multiplier, self.skill_mult
                    )
                    skill_points -= 1
                    if has_e4 and len(atk_buffs) < ATK_BUFF_MAX_STACKS:
                        atk_buffs.append(ATK_BUFF_DURATION)
                else:
                    # Use Basic ATK, no buff gained
                    total_dmg += self.calculate_dmg(atk * atk_buff_multiplier, 1.0)
                    skill_points += 1

                # Decrement buff durations
                atk_buffs = [turns - 1 for turns in atk_buffs]

            return total_dmg

        base_dmg = calculate_dmg(False)
        e4_dmg = calculate_dmg(True)
        return self.calculate_percent_change(base_dmg, e4_dmg)

    def calculate_dmg_increased_from_e6(self) -> float:
        # Constants
        TOTAL_CYCLES = 1000
        BASE_SKILL_POINTS = 3
        BASE_CRIT_RATE = 0.5
        BASE_CRIT_DMG = 1.0
        BASE_SKILL_DMG = 1000
        BASE_BASIC_ATK_DMG = 500
        E6_CRIT_DMG_BONUS = 1.4  # 140%
        E6_ALLY_DMG_BONUS = 0.5  # 50%

        def calculate_dmg(erudition_char_count: int, has_e6: bool) -> float:
            skill_points = BASE_SKILL_POINTS
            total_dmg = 0
            crit_rate = BASE_CRIT_RATE
            crit_dmg = BASE_CRIT_DMG
            skill_dmg = BASE_SKILL_DMG
            basic_atk_dmg = BASE_BASIC_ATK_DMG

            if has_e6:
                # E6: Both effects are always active, regardless of team comp
                crit_dmg += E6_CRIT_DMG_BONUS * 2
                crit_rate = 1.0  # Double crit rate for comparison
                skill_dmg *= 1 + E6_ALLY_DMG_BONUS
                basic_atk_dmg *= 1 + E6_ALLY_DMG_BONUS
            else:
                # Pre-E6: Only one effect based on erudition_char_count
                if erudition_char_count == 1:
                    crit_dmg += E6_CRIT_DMG_BONUS * 2
                    crit_rate = 1.0
                elif erudition_char_count >= 2:
                    skill_dmg *= 1 + E6_ALLY_DMG_BONUS
                    basic_atk_dmg *= 1 + E6_ALLY_DMG_BONUS

            # Calculate average damage per hit (crit weighted)
            avg_skill_dmg = skill_dmg * (1 + crit_rate * crit_dmg)
            avg_basic_atk_dmg = basic_atk_dmg * (1 + crit_rate * crit_dmg)

            for _ in range(TOTAL_CYCLES):
                if skill_points > 0:
                    total_dmg += avg_skill_dmg
                    skill_points -= 1
                else:
                    total_dmg += avg_basic_atk_dmg
                    skill_points += 1

            return total_dmg

        # Scenario 1: 1 Erudition character, no E6
        base_dmg_1 = calculate_dmg(erudition_char_count=1, has_e6=False)
        # Scenario 2: 2 Erudition characters, no E6
        base_dmg_2 = calculate_dmg(erudition_char_count=2, has_e6=False)
        # Average base dmg
        base_dmg_avg = (base_dmg_1 + base_dmg_2) / 2

        # Scenario 3: E6 active (effects always on, team comp doesn't matter)
        e6_dmg = calculate_dmg(erudition_char_count=1, has_e6=True)

        # Percent change from average base to E6
        return self.calculate_percent_change(base_dmg_avg, e6_dmg)

    def calculate_dmg_increased_from_lc(self) -> float:
        def calculate_dmg(has_lc: bool) -> float:
            total_cycles = 1000
            total_dmg = 0
            ult_energy = self.ult_energy
            current_energy = 0
            energy_gain = 30

            skill_dmg = 1000
            ult_dmg = 1000

            if has_lc:
                lc_enery_gain = 10
                increased_dmg_mult = 0.6
                def_reduce_mult = 0.12
            else:
                lc_enery_gain = 0
                increased_dmg_mult = 0.0
                def_reduce_mult = 0.0

            for _ in range(total_cycles):
                ult_energy += lc_enery_gain
                if current_energy >= ult_energy:
                    total_dmg += ult_dmg
                    current_energy = 0

                total_dmg += (
                    skill_dmg * (1 + def_reduce_mult) * (1 + increased_dmg_mult)
                )
                current_energy += energy_gain
                if current_energy >= ult_energy:
                    total_dmg += ult_dmg
                    current_energy = 0

            return total_dmg

        base_dmg = calculate_dmg(False)
        lc_dmg = calculate_dmg(True)

        return self.calculate_percent_change(base_dmg, lc_dmg)
