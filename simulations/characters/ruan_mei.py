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
            def_ignore = 0.2
        else:
            def_ignore = 0.0
        if has_e2:
            atk_increase = 0.4
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
        if has_lc:
            lc_increased_break_effect = 0.6
            dmg_multiplier = 0.24
            skill_dmg_increase = self.calculate_dmg_increased_by_skill_points(1, 3)
            energy_gain_increase = self.calculate_dmg_increased_from_energy_regen(10, 3)
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
        )

        break_dmg = final_talent_break_dmg + final_ult_break_dmg

        return dmg + break_dmg
