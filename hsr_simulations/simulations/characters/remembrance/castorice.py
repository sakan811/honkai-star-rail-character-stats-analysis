from simulations.characters.base_character import Character


class Castorice(Character):
    # Class constants for base values
    BASE_SKILL_MULTIPLIER = 0.5
    BASE_ENHANCED_SKILL_MULTIPLIER = {"netherwing": 0.3, "castorice": 0.5}
    BASE_BREATH_SCORCHES_THE_SHADOW_MULTIPLIER = {"1st": 0.24, "2nd": 0.28, "3rd": 0.34}
    BASE_CLAW_SPLITS_THE_VEIL_MULTIPLIER = 0.4
    BASE_WINGS_SWEEP_THE_RUINS_MULTIPLIER = 0.4
    BASE_WINGS_SWEEP_THE_RUINS_INSTANCES = 6
    BASE_TALENT_STACK_MULTIPLIER = 0.2

    def __init__(self):
        super().__init__()
        # Initialize instance attributes with base values
        self.skill_multiplier = self.BASE_SKILL_MULTIPLIER
        self.enhanced_skill_multiplier = self.BASE_ENHANCED_SKILL_MULTIPLIER.copy()
        self.breath_shadow_multiplier = (
            self.BASE_BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.copy()
        )
        self.claw_veil_multiplier = self.BASE_CLAW_SPLITS_THE_VEIL_MULTIPLIER
        self.wings_ruins_multiplier = self.BASE_WINGS_SWEEP_THE_RUINS_MULTIPLIER
        self.wings_ruins_instances = self.BASE_WINGS_SWEEP_THE_RUINS_INSTANCES
        self.talent_stack_multiplier = self.BASE_TALENT_STACK_MULTIPLIER
        self.ult_res_pen = 0.2

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
        if has_e3:
            self.ult_res_pen = 0.22
            self.wings_ruins_multiplier = 0.44

        if has_e4:
            e4_multiplier = self.calculate_dmg_increased_from_e4()
        else:
            e4_multiplier = 0

        if has_e5:
            self.enhanced_skill_multiplier = {"netherwing": 0.33, "castorice": 0.55}
            self.skill_multiplier = 0.55
            self.claw_veil_multiplier = 0.44
            self.breath_shadow_multiplier = {
                "1st": 0.264,
                "2nd": 0.308,
                "3rd": 0.374,
            }
            self.talent_stack_multiplier = 0.22

        if has_e6:
            e6_quantum_res_pen = 0.2
            self.wings_ruins_instances = 9
        else:
            e6_quantum_res_pen = 0.0

        if has_lc:
            lc_multiplier = self.calculate_dmg_increased_from_lc()
        else:
            lc_multiplier = 0

        skill_dmg = (
            self.calculate_dmg_with_hp(self.hp, self.skill_multiplier)
            * (1 + self.ult_res_pen)
            * (1 + e6_quantum_res_pen)
        )
        enhanced_skill_dmg = (
            sum(
                [
                    self.calculate_dmg_with_hp(
                        self.hp, self.enhanced_skill_multiplier.get(key, 1)
                    )
                    for key, _ in self.enhanced_skill_multiplier.items()
                ]
            )
            * (1 + self.ult_res_pen)
            * (1 + e6_quantum_res_pen)
        )

        breath_dmg = (
            sum(
                [
                    self.calculate_dmg_with_hp(
                        self.hp, self.breath_shadow_multiplier.get(key, 1)
                    )
                    for key, _ in self.breath_shadow_multiplier.items()
                ]
            )
            * (1 + self.ult_res_pen)
            * (1 + e6_quantum_res_pen)
        )
        claw_dmg = (
            self.calculate_dmg_with_hp(self.hp, self.claw_veil_multiplier)
            * (1 + self.ult_res_pen)
            * (1 + e6_quantum_res_pen)
        )
        wings_sweep_dmg = (
            sum(
                [
                    self.calculate_dmg_with_hp(self.hp, self.wings_ruins_multiplier)
                    for _ in range(self.wings_ruins_instances)
                ]
            )
            * (1 + self.ult_res_pen)
            * (1 + e6_quantum_res_pen)
        )

        if has_e2:
            additional_castorice_dmg = enhanced_skill_dmg
            breath_dmg_multiplier = self.calculate_dmg_increased_from_e2()
        else:
            additional_castorice_dmg = 0
            breath_dmg_multiplier = 0

        final_breath_dmg = breath_dmg * (1 + breath_dmg_multiplier)

        main_dmg = (
            enhanced_skill_dmg
            + final_breath_dmg
            + claw_dmg
            + wings_sweep_dmg
            + additional_castorice_dmg
        )

        if has_e1:
            main_dmg *= 1 + self.calculate_dmg_increased_from_e1()

        final_dmg = (
            (skill_dmg + main_dmg)
            * (
                1
                + self.calculate_dmg_increased_from_talent(self.talent_stack_multiplier)
            )
            * (1 + e4_multiplier)
            * (1 + lc_multiplier)
        )

        return final_dmg

    def calculate_dmg_increased_from_e1(self) -> float:
        def simulate_dmg(has_e1: bool) -> float:
            enemy_hp = 100
            total_dmg = 0

            while enemy_hp > 0:
                enemy_hp -= 20

                enhanced_skill_dmg = sum(
                    [
                        self.calculate_dmg_with_hp(
                            self.hp, self.enhanced_skill_multiplier.get(key, 1)
                        )
                        for key, _ in self.enhanced_skill_multiplier.items()
                    ]
                )
                breath_dmg = sum(
                    [
                        self.calculate_dmg_with_hp(
                            self.hp,
                            self.breath_shadow_multiplier.get(key, 1),
                        )
                        for key, _ in self.breath_shadow_multiplier.items()
                    ]
                )
                claw_dmg = self.calculate_dmg_with_hp(
                    self.hp, self.claw_veil_multiplier
                )
                wings_sweep_dmg = sum(
                    [
                        self.calculate_dmg_with_hp(self.hp, self.wings_ruins_multiplier)
                        for _ in range(self.wings_ruins_instances)
                    ]
                )

                if enemy_hp <= 80 and has_e1 and enemy_hp > 50:
                    enhanced_skill_dmg *= 1.2
                    breath_dmg *= 1.2
                    claw_dmg *= 1.2
                    wings_sweep_dmg *= 1.2

                if enemy_hp <= 50 and has_e1:
                    enhanced_skill_dmg *= 1.4
                    breath_dmg *= 1.4
                    claw_dmg *= 1.4
                    wings_sweep_dmg *= 1.4

                total_dmg += (
                    enhanced_skill_dmg + breath_dmg + claw_dmg + wings_sweep_dmg
                )

            return total_dmg

        base_dmg = simulate_dmg(False)
        e1_dmg = simulate_dmg(True)
        return self.calculate_percent_change(base_dmg, e1_dmg)

    def calculate_dmg_increased_from_e2(self) -> float:
        def simulate_dmg(has_e2: bool) -> float:
            breath_hit_hum = 4
            if has_e2:
                breath_hit_hum = 6

            total_dmg = 0

            for i in range(breath_hit_hum):
                if i == 0:
                    breath_dmg = self.calculate_dmg_with_hp(
                        self.hp,
                        self.breath_shadow_multiplier.get("1st", 1),
                    )
                elif i == 1:
                    breath_dmg = self.calculate_dmg_with_hp(
                        self.hp,
                        self.breath_shadow_multiplier.get("2nd", 1),
                    )
                elif i >= 2:
                    breath_dmg = self.calculate_dmg_with_hp(
                        self.hp,
                        self.breath_shadow_multiplier.get("3rd", 1),
                    )
                else:
                    breath_dmg = 0

                total_dmg += breath_dmg

            return total_dmg

        base_dmg = simulate_dmg(False)
        e2_dmg = simulate_dmg(True)

        return self.calculate_percent_change(base_dmg, e2_dmg)

    def calculate_dmg_increased_from_talent(
        self, stack_multiplier: float = 0.2
    ) -> float:
        base_dmg = 2000
        one_stack_dmg = base_dmg * (1 + stack_multiplier)
        two_stack_dmg = base_dmg * (1 + stack_multiplier * 2)
        three_stack_dmg = base_dmg * (1 + stack_multiplier * 3)

        avg_smg = (one_stack_dmg + two_stack_dmg + three_stack_dmg) / 3

        return self.calculate_percent_change(base_dmg, avg_smg)

    def calculate_dmg_increased_from_e4(self) -> float:
        def simulate_dmg(has_e4: bool) -> float:
            total_cycles = 1000
            total_dmg = 0
            max_newbud = 100
            newbud = 0
            skill_dmg = 1000
            ult_dmg = 2000

            if has_e4:
                healing_amount = 12 * 1.2
            else:
                healing_amount = 12

            for _ in range(total_cycles):
                if newbud >= max_newbud:
                    newbud = 0
                    total_dmg += ult_dmg
                else:
                    total_dmg += skill_dmg
                    newbud += healing_amount

            return total_dmg

        base_dmg = simulate_dmg(False)
        e4_dmg = simulate_dmg(True)

        return self.calculate_percent_change(base_dmg, e4_dmg)

    def calculate_dmg_increased_from_lc(self) -> float:
        def simulate_dmg(has_lc: bool) -> float:
            total_cycles = 1000
            total_dmg = 0
            max_newbud = 9000
            newbud = 0
            skill_dmg = 1000
            ult_dmg = 2000
            character_hp = 9000
            action_forward_counter = 0
            ult_counter = 0

            if has_lc:
                character_hp *= 1.3
                def_ignore = 0.3
            else:
                def_ignore = 0

            for _ in range(total_cycles):
                if newbud >= max_newbud:
                    newbud = 0
                    total_dmg += ult_dmg * (1 + def_ignore)

                    ult_counter += 1

                    if has_lc and ult_counter >= 3:
                        ult_counter = 0
                        action_forward_counter += 1
                        if action_forward_counter >= 9:
                            action_forward_counter = 0
                            total_dmg += skill_dmg * (1 + def_ignore)
                            newbud += 0.3 * character_hp
                else:
                    total_dmg += skill_dmg * (1 + def_ignore)
                    newbud += 0.3 * character_hp

            return total_dmg

        base_dmg = simulate_dmg(False)
        lc_dmg = simulate_dmg(True)
        return self.calculate_percent_change(base_dmg, lc_dmg)
