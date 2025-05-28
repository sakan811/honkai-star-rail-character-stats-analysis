import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
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
  CastoriceData,
  EnhancedCastoriceData,
  enhanceData,
  getHpRangeStats,
  CASTORICE_BASE_HP,
  NEWBUD_THRESHOLD,
} from "./utils/castoriceUtils";

const CastoriceChart = () => {
  const [enhancedData, setEnhancedData] = useState<EnhancedCastoriceData[]>([]);

  const { data, loading, error } = useChartData<CastoriceData>({
    csvPath: "/castorice/castorice_data.csv",
    onDataProcessed: (processedData) => {
      setEnhancedData(enhanceData(processedData));
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const {
    lowHpStats,
    optimalHpStats,
    highHpStats,
    optimalHpChange,
    highHpChange,
  } = getHpRangeStats(enhancedData);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Overview</h2>
        <p className="text-sm md:text-base text-slate-700">
          Castorice uses a unique Newbud energy system instead of traditional
          energy. Her SP-neutral skill drains 30% current HP from all allies to
          generate equivalent Newbud energy, requiring 34,000 total to summon
          Netherwing. This analysis shows the relationship between team HP
          investment and action efficiency, crucial for optimizing her ultimate
          frequency and team sustainability.
        </p>
      </div>

      {/* Analysis Assumptions */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          ⚡ Analysis Parameters
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            • Ultimate threshold:{" "}
            <strong>{NEWBUD_THRESHOLD.toLocaleString()} Newbud energy</strong>
          </p>
          <p>
            • Gallagher rotationally heals each ally for{" "}
            <strong>1,600 HP</strong> after each Castorice skill action
          </p>
          <p>
            • <strong>Team Composition:</strong>
          </p>
          <p className="ml-4">
            Combined Team HP = Castorice ({CASTORICE_BASE_HP.toLocaleString()}{" "}
            base HP) + 3 equal-HP allies
          </p>
        </div>
      </div>

      {/* Primary Chart - Actions Needed */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">
          Actions Required Before Ultimate
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={enhancedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hp_label"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            >
              <Label
                value="Combined Team HP"
                offset={-50}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value="Action Count"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip
              content={(props: TooltipProps<number, string>) => {
                const { active, payload, label } = props;

                if (active && payload && payload.length) {
                  const skillCount = payload.find(
                    (p) => p.dataKey === "skill_count_before_getting_ult",
                  )?.value;
                  const healCount = payload.find(
                    (p) => p.dataKey === "heal_count_before_getting_ult",
                  )?.value;
                  const totalActions = payload.find(
                    (p) => p.dataKey === "total_actions",
                  )?.value;

                  // Get the actual HP value from the data
                  const dataPoint = enhancedData.find(
                    (item) => item.hp_label === label,
                  );
                  const actualHp = dataPoint?.combined_allies_hp;

                  return (
                    <div className="bg-white p-3 border border-slate-200 shadow-md rounded">
                      <p className="text-slate-700 font-medium">{`Team HP: ${actualHp?.toLocaleString()}`}</p>
                      <p className="text-blue-600">{`Skills: ${skillCount}`}</p>
                      <p className="text-emerald-600">{`Heals: ${healCount}`}</p>
                      <p className="text-purple-600 font-medium">{`Total Actions: ${totalActions}`}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        {`Efficiency: ${(NEWBUD_THRESHOLD / Number(totalActions)).toFixed(0)} energy/action`}
                      </p>
                    </div>
                  );
                }

                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey="skill_count_before_getting_ult"
              name="Skills Needed"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="heal_count_before_getting_ult"
              name="Heals Needed"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="total_actions"
              name="Total Actions"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Efficiency Analysis Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">
          Energy Generation Efficiency
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={enhancedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hp_label"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            >
              <Label
                value="Combined Team HP"
                offset={-5}
                position="insideBottom"
              />
            </XAxis>
            <YAxis tickFormatter={(value) => `${value.toFixed(0)}`}>
              <Label
                value="Energy per Action"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip
              content={(props: TooltipProps<number, string>) => {
                const { active, payload, label } = props;

                if (active && payload && payload.length) {
                  const efficiency = payload[0].value;

                  // Get the actual HP value from the data
                  const dataPoint = enhancedData.find(
                    (item) => item.hp_label === label,
                  );
                  const actualHp = dataPoint?.combined_allies_hp;

                  return (
                    <div className="bg-white p-3 border border-slate-200 shadow-md rounded">
                      <p className="text-slate-700 font-medium">{`Team HP: ${actualHp?.toLocaleString()}`}</p>
                      <p className="text-amber-600 font-medium">
                        {`Efficiency: ${Number(efficiency).toFixed(0)} energy/action`}
                      </p>
                      <p className="text-slate-500 text-sm">
                        Higher is more efficient
                      </p>
                    </div>
                  );
                }

                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="energy_per_action"
              stroke="#f59e0b"
              fill="#fef3c7"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Strategic Analysis Section */}
      <div className="mt-8 space-y-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-slate-700">
            Team HP Analysis
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
                <h4 className="text-red-600 font-medium mb-2">
                  Low HP Team (15k-19k HP)
                </h4>
                <p className="text-slate-600 text-sm mb-2">
                  <strong>
                    {lowHpStats.maxActions}-{lowHpStats.minActions} total
                    actions needed (avg {lowHpStats.averageActions.toFixed(1)}).
                  </strong>
                </p>
                <p className="text-slate-500 text-xs">
                  Each Teammate HP (exclude Castorice):{" "}
                  {lowHpStats.minTeammateHp.toLocaleString()}-
                  {lowHpStats.maxTeammateHp.toLocaleString()} (avg{" "}
                  {lowHpStats.avgTeammateHp.toLocaleString()})
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-200">
                <h4 className="text-emerald-600 font-medium mb-2">
                  Optimal HP Team (20k-26k HP)
                </h4>
                <p className="text-slate-600 text-sm mb-2">
                  <strong>
                    {optimalHpStats.maxActions}-{optimalHpStats.minActions}{" "}
                    total actions needed (avg{" "}
                    {optimalHpStats.averageActions.toFixed(1)}).
                  </strong>{" "}
                  {(optimalHpChange * 100).toFixed(1)}% less actions required
                  than low HP Team.
                </p>
                <p className="text-slate-500 text-xs">
                  Each Teammate HP (exclude Castorice):{" "}
                  {optimalHpStats.minTeammateHp.toLocaleString()}-
                  {optimalHpStats.maxTeammateHp.toLocaleString()} (avg{" "}
                  {optimalHpStats.avgTeammateHp.toLocaleString()})
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-200">
                <h4 className="text-purple-600 font-medium mb-2">
                  High HP Team (27k-33k HP)
                </h4>
                <p className="text-slate-600 text-sm mb-2">
                  <strong>
                    {highHpStats.maxActions}-{highHpStats.minActions} total
                    actions needed (avg {highHpStats.averageActions.toFixed(1)}
                    ).
                  </strong>{" "}
                  {(highHpChange * 100).toFixed(1)}% less actions required than
                  low HP Team.
                </p>
                <p className="text-slate-500 text-xs">
                  Each Teammate HP (exclude Castorice):{" "}
                  {highHpStats.minTeammateHp.toLocaleString()}-
                  {highHpStats.maxTeammateHp.toLocaleString()} (avg{" "}
                  {highHpStats.avgTeammateHp.toLocaleString()})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastoriceChart;
