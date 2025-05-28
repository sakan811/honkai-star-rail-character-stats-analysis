// Define types for Hyacine data
export type HyacineData = {
  character: string;
  speed: number;
  increased_outgoing_healing: number;
  base_speed: number;
  speed_after_minor_traces: number;
  speed_after_signature_lightcone: number;
  speed_after_relics_and_planetary_sets: number;
};

export type SpeedThresholdMetrics = {
  baseSpeed: number;
  withTracesSpeed: number;
  withRelicsSpeed: number;
  withLightconeSpeed: number;
  traceSpeedGain: number;
  relicsSpeedGain: number;
  lightconeSpeedGain: number;
  speedIncreases: {
    fromTraces: number;
    fromRelics: number;
    fromLightcone: number;
  };
};

export const HEALING_THRESHOLD = 200;

/**
 * Calculate speed gain percentages and increases
 */
export function calculateSpeedMetrics(data: HyacineData[]): SpeedThresholdMetrics | null {
  if (!data.length) return null;

  const firstRow = data[0];
  
  const baseSpeed = firstRow.base_speed;
  const withTracesSpeed = firstRow.speed_after_minor_traces;
  const withRelicsSpeed = firstRow.speed_after_relics_and_planetary_sets;
  const withLightconeSpeed = firstRow.speed_after_signature_lightcone;

  // Calculate speed increases
  const speedIncreases = {
    fromTraces: withTracesSpeed - baseSpeed,
    fromRelics: withRelicsSpeed - withTracesSpeed,
    fromLightcone: withLightconeSpeed - withRelicsSpeed,
  };

  // Calculate percentage gains
  const traceSpeedGain = (withTracesSpeed - baseSpeed) / baseSpeed;
  const relicsSpeedGain = (withRelicsSpeed - withTracesSpeed) / withTracesSpeed;
  const lightconeSpeedGain = (withLightconeSpeed - withRelicsSpeed) / withRelicsSpeed;

  return {
    baseSpeed,
    withTracesSpeed,
    withRelicsSpeed,
    withLightconeSpeed,
    traceSpeedGain,
    relicsSpeedGain,
    lightconeSpeedGain,
    speedIncreases,
  };
}

/**
 * Get the specific healing bonus at a given speed
 */
export function getHealingBonusAtSpeed(speed: number): number {
  if (speed <= HEALING_THRESHOLD) return 0;
  return (speed - HEALING_THRESHOLD) / 100;
}

/**
 * Format a legend payload item for the chart
 */
export function formatLegendItem(
  value: string, 
  type: string = "line", 
  color: string
): { value: string; type: string; color: string } {
  return { value, type, color };
}

/**
 * Format a number with the given precision
 */
export function formatNumber(value: number, precision: number = 0): string {
  return value.toFixed(precision);
}

/**
 * Calculate remaining speed needed to reach threshold
 */
export function remainingSpeedToThreshold(currentSpeed: number): number {
  if (currentSpeed >= HEALING_THRESHOLD) return 0;
  return HEALING_THRESHOLD - currentSpeed;
}