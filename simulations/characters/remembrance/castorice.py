from simulations.characters.base_character import Character


class Castorice(Character):
    SKILL_MULTIPLIER = 0.5
    ENHANCED_SKILL_MULTIPLIER = {"netherwing": 0.3, "castorice": 0.5}
    BREATH_SCORCHES_THE_SHADOW_MULTIPLIER = {"1st": 0.24, "2nd": 0.28, "3rd": 0.34}
    CLAW_SPLITS_THE_VEIL_MULTIPLIER = 0.4
    WINGS_SWEEP_THE_RUINS_MULTIPLIER = 0.4
    WINGS_SWEEP_THE_RUINS_INSTANCES = 6

    def __init__(self):
        super().__init__()

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
        skill_dmg = self.calculate_dmg_with_hp(self.hp, self.SKILL_MULTIPLIER)
        enhanced_skill_dmg = sum(
            [
                self.calculate_dmg_with_hp(
                    self.hp, self.ENHANCED_SKILL_MULTIPLIER.get(key, 1)
                )
                for key, _ in self.ENHANCED_SKILL_MULTIPLIER.items()
            ]
        )

        breath_dmg = sum(
            [
                self.calculate_dmg_with_hp(
                    self.hp, self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.get(key, 1)
                )
                for key, _ in self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.items()
            ]
        )
        claw_dmg = self.calculate_dmg_with_hp(
            self.hp, self.CLAW_SPLITS_THE_VEIL_MULTIPLIER
        )
        wings_sweep_dmg = sum(
            [
                self.calculate_dmg_with_hp(
                    self.hp, self.WINGS_SWEEP_THE_RUINS_MULTIPLIER
                )
                for _ in range(self.WINGS_SWEEP_THE_RUINS_INSTANCES)
            ]
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

        final_dmg = skill_dmg + main_dmg

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
                            self.hp, self.ENHANCED_SKILL_MULTIPLIER.get(key, 1)
                        )
                        for key, _ in self.ENHANCED_SKILL_MULTIPLIER.items()
                    ]
                )
                breath_dmg = sum(
                    [
                        self.calculate_dmg_with_hp(
                            self.hp,
                            self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.get(key, 1),
                        )
                        for key, _ in self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.items()
                    ]
                )
                claw_dmg = self.calculate_dmg_with_hp(
                    self.hp, self.CLAW_SPLITS_THE_VEIL_MULTIPLIER
                )
                wings_sweep_dmg = sum(
                    [
                        self.calculate_dmg_with_hp(
                            self.hp, self.WINGS_SWEEP_THE_RUINS_MULTIPLIER
                        )
                        for _ in range(self.WINGS_SWEEP_THE_RUINS_INSTANCES)
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
                        self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.get("1st", 1),
                    )
                elif i == 1:
                    breath_dmg = self.calculate_dmg_with_hp(
                        self.hp,
                        self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.get("2nd", 1),
                    )
                elif i >= 2:
                    breath_dmg = self.calculate_dmg_with_hp(
                        self.hp,
                        self.BREATH_SCORCHES_THE_SHADOW_MULTIPLIER.get("3rd", 1),
                    )
                else:
                    breath_dmg = 0

                total_dmg += breath_dmg

            return total_dmg

        base_dmg = simulate_dmg(False)
        e2_dmg = simulate_dmg(True)

        return self.calculate_percent_change(base_dmg, e2_dmg)
