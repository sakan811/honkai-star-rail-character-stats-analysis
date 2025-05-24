import { useState, useEffect } from "react";
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
} from "recharts";
import Papa from "papaparse";

// Define the error type for Papa.parse
type ParseError = {
  message: string;
  code?: string;
  type?: string;
};

type CastoriceData = {
  character: string;
  combined_allies_hp: number;
  skill_count_before_getting_ult: number;
  heal_count_before_getting_ult: number;
};

const CastoriceChart = () => {
  const [data, setData] = useState<CastoriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParseData = async () => {
      try {
        const response = await fetch("/castorice/castorice_data.csv");
        const csvText = await response.text();

        Papa.parse<CastoriceData>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length > 0) {
              setData(results.data);
            }
            setLoading(false);
          },
          error: (error: ParseError) => {
            setError(`Failed to parse CSV: ${error.message}`);
            setLoading(false);
          },
        });
      } catch (err) {
        setError(
          `Failed to fetch CSV: ${err instanceof Error ? err.message : String(err)}`,
        );
        setLoading(false);
      }
    };

    fetchAndParseData();
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        data-testid="loading-spinner"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Overview</h2>
        <p className="text-sm md:text-base text-slate-700">
          This analysis explores Castorice&apos;s Newbud energy generation system. Her skill consumes 30% of the combined allies&apos; HP to generate Newbud energy, which is required to cast her ultimate (34,000 Newbud energy needed). The chart shows how different team HP levels affect the number of skills and healing actions needed before she can cast her ultimate.
        </p>
      </div>

      {/* Disclaimer Section */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Analysis Assumptions</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Gallagher rotationally heals an ally with his Skill for <strong>1,600 HP</strong> after each Castorice&apos;s Skill action</li>
          <li>• Combined allies HP are from <strong>3 team members equally</strong>, plus Castorice HP</li>
          <li>• Castorice HP is always <strong>9,000 HP</strong></li>
        </ul>
      </div>

      {/* Chart with increased height */}
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 60, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="combined_allies_hp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={7}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          >
            <Label value="Combined Allies HP" offset={-20} position="insideBottom" dy={30} />
          </XAxis>
          <YAxis width={60}>
            <Label
              value="Action Count"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
              dx={-45}
            />
          </YAxis>
          <Tooltip
            content={(props: TooltipProps<number, string>) => {
              const { active, payload, label } = props;

              if (active && payload && payload.length) {
                const skillCount = payload.find(p => p.dataKey === 'skill_count_before_getting_ult')?.value;
                const healCount = payload.find(p => p.dataKey === 'heal_count_before_getting_ult')?.value;
                
                return (
                  <div className="bg-white p-3 border border-slate-200 shadow-md rounded">
                    <p className="text-slate-700 font-medium">{`Combined Allies HP: ${Number(label).toLocaleString()}`}</p>
                    <p className="text-blue-600">
                      {`Skills Before Ult: ${skillCount}`}
                    </p>
                    <p className="text-emerald-600">
                      {`Heals Before Ult: ${healCount}`}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      {`Total Actions: ${Number(skillCount) + Number(healCount)}`}
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
            name="Skills Before Ult"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="heal_count_before_getting_ult"
            name="Heals Before Ult"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Legend
            verticalAlign="bottom"
            height={80}
            wrapperStyle={{ paddingTop: 20, bottom: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Analysis Section */}
      <div className="mt-8 space-y-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-slate-700">
            Newbud Energy Analysis
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-700">Energy Generation Strategy</h3>
              <p className="text-slate-600 mb-2">
                Castorice&apos;s ultimate requires 34,000 Newbud energy. Her skill consumes 30% of combined allies&apos; HP to generate energy, making team HP management crucial for optimal energy generation:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <h4 className="text-blue-600 font-medium mb-2">
                  Low HP Teams (8k-12k)
                </h4>
                <p className="text-slate-600">
                  With lower combined HP, Castorice needs 14-17 skill uses before her ultimate. Each skill consumes less HP but generates less energy, requiring more actions overall. Gallagher&apos;s healing becomes more critical to sustain the rotation.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <h4 className="text-emerald-600 font-medium mb-2">
                  Medium HP Teams (16k-24k)
                </h4>
                <p className="text-slate-600">
                  The sweet spot for balanced energy generation, requiring 8-12 skills before ultimate. This range provides efficient energy generation while maintaining sustainable HP levels for consistent rotations.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 md:col-span-2">
                <h4 className="text-purple-600 font-medium mb-2">
                  High HP Teams (28k-32k)
                </h4>
                <p className="text-slate-600">
                  High HP teams allow for the most efficient energy generation, requiring only 5-6 skills before ultimate. However, this requires significant HP investment and may sacrifice other stats. The reduced healing frequency can be both an advantage (fewer actions needed) and a risk (less HP recovery).
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-blue-700 font-medium mb-2">Key Insights</h4>
              <ul className="text-slate-600 space-y-1">
                <li>• Higher team HP dramatically reduces actions needed for ultimate</li>
                <li>• Skill count and heal count follow similar patterns, indicating balanced consumption and recovery</li>
                <li>• Teams with 20k+ combined HP show significant efficiency gains</li>
                <li>• Gallagher&apos;s 1,600 HP heal helps maintain sustainability across all HP ranges</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastoriceChart;