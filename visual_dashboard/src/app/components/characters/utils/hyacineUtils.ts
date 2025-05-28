export type HyacineData = {
  character: string;
  speed: number;
  increased_outgoing_healing: number;
  base_speed: number;
  speed_after_minor_traces: number;
  speed_after_relics_and_planetary_sets: number;
  speed_after_signature_lightcone: number;
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

export function calculateSpeedMetrics(data: HyacineData[]): SpeedThresholdMetrics | null {
  if (data.length === 0) return null;

  const firstRow = data[0];
  const baseSpeed = firstRow.base_speed;
  const withTracesSpeed = firstRow.speed_after_minor_traces;
  const withRelicsSpeed = firstRow.speed_after_relics_and_planetary_sets;
  const withLightconeSpeed = firstRow.speed_after_signature_lightcone;

  const speedIncreases = {
    fromTraces: withTracesSpeed - baseSpeed,
    fromLightcone: withLightconeSpeed - withRelicsSpeed,
    fromRelics: withRelicsSpeed - withTracesSpeed,
  };

  const traceSpeedGain = (withTracesSpeed - baseSpeed) / baseSpeed;
  const relicsSpeedGain = (withRelicsSpeed - withTracesSpeed) / withTracesSpeed;
  const lightconeSpeedGain = (withLightconeSpeed - withRelicsSpeed) / withLightconeSpeed;

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

export function formatNumber(value: number): string {
  return value.toFixed(1);
}

export function remainingSpeedToThreshold(currentSpeed: number): number {
  return Math.max(0, HEALING_THRESHOLD - currentSpeed);
}