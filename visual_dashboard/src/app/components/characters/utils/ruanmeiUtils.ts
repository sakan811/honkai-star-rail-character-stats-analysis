export type RuanMeiData = {
  character: string;
  break_effect: number;
  break_effect_percentage: number;
  base_skill_dmg_increase: number;
  additional_dmg_from_a6: number;
  total_skill_dmg_increase: number;
};

export type BreakEffectMetrics = {
  thresholdBreakEffect: number;
  thresholdPercentage: number;
  maxAdditionalDamage: number;
  damagePerTenPercent: number;
  maxTotalDamage: number;
  baseDamage: number;
};

export const BREAK_EFFECT_THRESHOLD = 120; // 120%
export const BREAK_EFFECT_THRESHOLD_DECIMAL = 1.2;
export const MAX_ADDITIONAL_DAMAGE = 0.36; // 36%
export const DAMAGE_PER_10_PERCENT = 0.06; // 6%

export function calculateBreakEffectMetrics(
  data: RuanMeiData[],
): BreakEffectMetrics | null {
  if (data.length === 0) return null;

  const firstRow = data[0];
  const baseDamage = firstRow.base_skill_dmg_increase;

  // Find the max total damage from the data
  const maxTotalDamage = Math.max(
    ...data.map((item) => item.total_skill_dmg_increase),
  );

  return {
    thresholdBreakEffect: BREAK_EFFECT_THRESHOLD_DECIMAL,
    thresholdPercentage: BREAK_EFFECT_THRESHOLD,
    maxAdditionalDamage: MAX_ADDITIONAL_DAMAGE,
    damagePerTenPercent: DAMAGE_PER_10_PERCENT,
    maxTotalDamage,
    baseDamage,
  };
}

export function formatBreakEffect(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function formatDamageIncrease(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getBreakEffectRanges(data: RuanMeiData[]) {
  const lowBreakEffect = data.filter(
    (item) =>
      item.break_effect_percentage >= 100 && item.break_effect_percentage < 120,
  );

  const thresholdRange = data.filter(
    (item) =>
      item.break_effect_percentage >= 120 &&
      item.break_effect_percentage <= 130,
  );

  const optimalRange = data.filter(
    (item) =>
      item.break_effect_percentage >= 150 &&
      item.break_effect_percentage <= 180,
  );

  const maxRange = data.filter(
    (item) =>
      item.break_effect_percentage >= 180 &&
      item.break_effect_percentage <= 200,
  );

  return {
    lowBreakEffect,
    thresholdRange,
    optimalRange,
    maxRange,
  };
}
