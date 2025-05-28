export type CastoriceData = {
  character: string;
  combined_allies_hp: number;
  skill_count_before_getting_ult: number;
  heal_count_before_getting_ult: number;
};

export type EnhancedCastoriceData = CastoriceData & {
  total_actions: number;
  energy_per_action: number;
  hp_label: string;
};

export type TeammateHpStats = {
  minActions: number;
  maxActions: number;
  averageActions: number;
  minTeammateHp: number;
  maxTeammateHp: number;
  avgTeammateHp: number;
};

export const CASTORICE_BASE_HP = 9000;
export const NEWBUD_THRESHOLD = 34000;

export function enhanceData(data: CastoriceData[]): EnhancedCastoriceData[] {
  return data.map((item) => {
    const totalActions =
      item.skill_count_before_getting_ult + item.heal_count_before_getting_ult;
    const energyPerAction = NEWBUD_THRESHOLD / totalActions;

    return {
      ...item,
      total_actions: totalActions,
      energy_per_action: energyPerAction,
      hp_label: `${(item.combined_allies_hp / 1000).toFixed(0)}k`,
    };
  });
}

export function calculateTeammateHpStats(
  hpRange: EnhancedCastoriceData[],
): TeammateHpStats {
  const totalActions = hpRange.map((item) => item.total_actions);
  const averageActions =
    hpRange.reduce((sum, item) => sum + item.total_actions, 0) /
      hpRange.length || 0;
  const minTeammateHp = Math.min(
    ...hpRange.map((item) => (item.combined_allies_hp - CASTORICE_BASE_HP) / 3),
  );
  const maxTeammateHp = Math.max(
    ...hpRange.map((item) => (item.combined_allies_hp - CASTORICE_BASE_HP) / 3),
  );
  const avgTeammateHp =
    hpRange.reduce(
      (sum, item) => sum + (item.combined_allies_hp - CASTORICE_BASE_HP) / 3,
      0,
    ) / hpRange.length;

  return {
    minActions: Math.min(...totalActions),
    maxActions: Math.max(...totalActions),
    averageActions,
    minTeammateHp: Math.round(minTeammateHp),
    maxTeammateHp: Math.round(maxTeammateHp),
    avgTeammateHp: Math.round(avgTeammateHp),
  };
}

export function getHpRangeStats(enhancedData: EnhancedCastoriceData[]) {
  const lowHpRange = enhancedData.filter(
    (item) =>
      item.combined_allies_hp >= 15000 && item.combined_allies_hp <= 19000,
  );
  const lowHpStats = calculateTeammateHpStats(lowHpRange);

  const optimalHpRange = enhancedData.filter(
    (item) =>
      item.combined_allies_hp >= 20000 && item.combined_allies_hp <= 26000,
  );
  const optimalHpStats = calculateTeammateHpStats(optimalHpRange);

  const highHpRange = enhancedData.filter(
    (item) =>
      item.combined_allies_hp >= 27000 && item.combined_allies_hp <= 33000,
  );
  const highHpStats = calculateTeammateHpStats(highHpRange);

  const optimalHpChange = Math.abs(
    (optimalHpStats.averageActions - lowHpStats.averageActions) /
      lowHpStats.averageActions,
  );
  const highHpChange = Math.abs(
    (highHpStats.averageActions - lowHpStats.averageActions) /
      lowHpStats.averageActions,
  );

  return {
    lowHpStats,
    optimalHpStats,
    highHpStats,
    optimalHpChange,
    highHpChange,
  };
}
