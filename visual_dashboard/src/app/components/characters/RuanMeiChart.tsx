import { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ReferenceLine,
  TooltipProps,
  AreaChart,
  Area,
} from "recharts";
import {
  useChartData,
  LoadingSpinner,
  ErrorDisplay,
} from "../../hooks/useChartData";
import {
  RuanMeiData,
  BreakEffectMetrics,
  BREAK_EFFECT_THRESHOLD_DECIMAL,
  calculateBreakEffectMetrics,
  formatBreakEffect,
  formatDamageIncrease,
  getBreakEffectRanges,
} from "./utils/ruanmeiUtils";

const RuanMeiChart = () => {
  const [breakEffectMetrics, setBreakEffectMetrics] =
    useState<BreakEffectMetrics | null>(null);

  const { data, loading, error } = useChartData<RuanMeiData>({
    csvPath: "/ruanmei/ruanmei_data.csv",
    onDataProcessed: (processedData) => {
      setBreakEffectMetrics(calculateBreakEffectMetrics(processedData));
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!breakEffectMetrics) return <div>No data available</div>;

  const {
    thresholdPercentage,
    maxAdditionalDamage,
    damagePerTenPercent,
    maxTotalDamage,
    baseDamage,
  } = breakEffectMetrics;

  const { thresholdRange, optimalRange } = getBreakEffectRanges(data);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Overview</h2>
        <p className="text-sm md:text-base text-slate-700">
          Ruan Mei&apos;s A6 trace enhances her skill damage based on Break
          Effect investment. Her base skill provides a{" "}
          {formatDamageIncrease(baseDamage)} damage increase. Once Break Effect
          exceeds {thresholdPercentage}%, her A6 trace activates, granting an
          additional {formatDamageIncrease(damagePerTenPercent)} damage increase
          for every 10% Break Effect above the threshold, capping at{" "}
          {formatDamageIncrease(maxAdditionalDamage)}
          additional damage. This analysis explores optimal Break Effect
          investment for maximizing her damage contribution.
        </p>
      </div>

      {/* Analysis Parameters */}
      <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-rose-800 mb-2">
          🌸 A6 Trace Mechanics
        </h3>
        <div className="text-sm text-rose-700 space-y-2">
          <p>
            • Base skill damage increase:{" "}
            <strong>{formatDamageIncrease(baseDamage)}</strong>
          </p>
          <p>
            • A6 activation threshold:{" "}
            <strong>{thresholdPercentage}% Break Effect</strong>
          </p>
          <p>
            • A6 scaling:{" "}
            <strong>
              {formatDamageIncrease(damagePerTenPercent)} damage per 10% Break
              Effect
            </strong>{" "}
            above threshold
          </p>
          <p>
            • Maximum A6 bonus:{" "}
            <strong>{formatDamageIncrease(maxAdditionalDamage)}</strong>
            (reached at{" "}
            {formatBreakEffect(
              (maxAdditionalDamage / damagePerTenPercent) * 0.1 +
                BREAK_EFFECT_THRESHOLD_DECIMAL,
            )}
            )
          </p>
        </div>
      </div>

      {/* Primary Chart - Total Damage Scaling */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">
          Skill Damage Scaling by Break Effect
        </h3>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart
            data={data}
            margin={{ top: 30, right: 30, left: 60, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="break_effect_percentage"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatBreakEffect}
            >
              <Label
                value="Break Effect"
                offset={-20}
                position="insideBottom"
                dy={30}
              />
            </XAxis>
            <YAxis
              tickFormatter={(value) => formatDamageIncrease(value)}
              width={80}
            >
              <Label
                value="Skill Damage Increase"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                dx={-50}
              />
            </YAxis>
            <Tooltip
              content={(props: TooltipProps<number, string>) => {
                const { active, payload, label } = props;

                if (active && payload && payload.length) {
                  const breakEffect = Number(label);
                  const totalDamage = payload.find(
                    (p) => p.dataKey === "total_skill_dmg_increase",
                  )?.value;
                  const baseDamage = payload.find(
                    (p) => p.dataKey === "base_skill_dmg_increase",
                  )?.value;
                  const additionalDamage = payload.find(
                    (p) => p.dataKey === "additional_dmg_from_a6",
                  )?.value;

                  return (
                    <div className="bg-white p-3 border border-slate-200 shadow-md rounded">
                      <p className="text-slate-700 font-medium">
                        {`Break Effect: ${formatBreakEffect(breakEffect / 100)}`}
                      </p>
                      <p className="text-blue-600">
                        {`Base Damage: ${formatDamageIncrease(Number(baseDamage))}`}
                      </p>
                      <p className="text-rose-600">
                        {`A6 Bonus: ${formatDamageIncrease(Number(additionalDamage))}`}
                      </p>
                      <p className="text-purple-600 font-medium">
                        {`Total: ${formatDamageIncrease(Number(totalDamage))}`}
                      </p>
                      {breakEffect === thresholdPercentage && (
                        <p className="text-orange-600 font-medium">
                          A6 Activation Threshold
                        </p>
                      )}
                    </div>
                  );
                }

                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="base_skill_dmg_increase"
              stackId="1"
              stroke="#3b82f6"
              fill="#dbeafe"
              name="Base Damage"
            />

            <Area
              type="monotone"
              dataKey="additional_dmg_from_a6"
              stackId="1"
              stroke="#ec4899"
              fill="#fce7f3"
              name="A6 Bonus"
            />

            <Line
              type="monotone"
              dataKey="total_skill_dmg_increase"
              name="Total Damage"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />

            <ReferenceLine
              x={thresholdPercentage}
              stroke="orange"
              strokeDasharray="5 5"
              strokeWidth={2}
            />

            <Legend
              verticalAlign="bottom"
              height={60}
              wrapperStyle={{ paddingTop: 20 }}
              payload={[
                { value: "Base Damage", type: "rect", color: "#3b82f6" },
                { value: "A6 Bonus", type: "rect", color: "#ec4899" },
                { value: "Total Damage", type: "line", color: "#8b5cf6" },
                {
                  value: `A6 Threshold (${thresholdPercentage}%)`,
                  type: "line",
                  color: "orange",
                },
              ]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Break Effect Analysis */}
      <div className="mt-8 space-y-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-slate-700">
            Break Effect Investment Analysis
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <h4 className="text-slate-600 font-medium mb-2">
                  Pre-Threshold (100%-119%)
                </h4>
                <p className="text-slate-600 text-sm">
                  <strong>Damage: {formatDamageIncrease(baseDamage)}</strong>
                </p>
                <p className="text-slate-500 text-xs">
                  Only base skill damage active. A6 trace provides no benefit.
                  Focus on other stats for overall team utility.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                <h4 className="text-orange-600 font-medium mb-2">
                  Threshold Range (120%-130%)
                </h4>
                <p className="text-slate-600 text-sm">
                  <strong>
                    Damage:{" "}
                    {formatDamageIncrease(
                      thresholdRange[0]?.total_skill_dmg_increase || baseDamage,
                    )}{" "}
                    -{" "}
                    {formatDamageIncrease(
                      thresholdRange[thresholdRange.length - 1]
                        ?.total_skill_dmg_increase || baseDamage,
                    )}
                  </strong>
                </p>
                <p className="text-slate-500 text-xs">
                  A6 activation point. Minimal but noticeable damage increase.
                  Consider this the minimum investment for A6 benefits.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-200">
                <h4 className="text-emerald-600 font-medium mb-2">
                  Optimal Range (150%-180%)
                </h4>
                <p className="text-slate-600 text-sm">
                  <strong>
                    Damage:{" "}
                    {formatDamageIncrease(
                      optimalRange[0]?.total_skill_dmg_increase || baseDamage,
                    )}{" "}
                    -{" "}
                    {formatDamageIncrease(
                      optimalRange[optimalRange.length - 1]
                        ?.total_skill_dmg_increase || baseDamage,
                    )}
                  </strong>
                </p>
                <p className="text-slate-500 text-xs">
                  Balanced investment providing significant A6 benefits. Good
                  middle ground between damage and other stat priorities.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-200">
                <h4 className="text-purple-600 font-medium mb-2">
                  Maximum Investment (180%+)
                </h4>
                <p className="text-slate-600 text-sm">
                  <strong>
                    Damage: {formatDamageIncrease(maxTotalDamage)}
                  </strong>{" "}
                  (A6 cap reached)
                </p>
                <p className="text-slate-500 text-xs">
                  Maximum A6 damage achieved. Further Break Effect investment
                  provides diminishing returns for personal damage.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-blue-800 font-medium mb-2">
                💡 Investment Recommendations
              </h4>
              <div className="text-blue-700 text-sm space-y-1">
                <p>
                  • <strong>Minimum viable:</strong> 120% Break Effect for A6
                  activation
                </p>
                <p>
                  • <strong>Balanced build:</strong> 150-160% Break Effect for
                  good A6 value
                </p>
                <p>
                  • <strong>Maximum damage:</strong> 180% Break Effect for full
                  A6 potential
                </p>
                <p>
                  • Beyond 180%, prioritize Speed, Effect Hit Rate, or defensive
                  stats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuanMeiChart;
