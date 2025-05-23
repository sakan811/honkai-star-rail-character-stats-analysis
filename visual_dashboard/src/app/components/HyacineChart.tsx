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
  ReferenceLine,
  TooltipProps,
} from "recharts";
import Papa from "papaparse";

// Define the error type for Papa.parse
type ParseError = {
  message: string;
  code?: string;
  type?: string;
};

type HyacineData = {
  character: string;
  speed: number;
  increased_outgoing_healing: number;
  base_speed: number;
  speed_after_minor_traces: number;
  speed_after_signature_lightcone: number;
  speed_after_relics_and_planetary_sets: number;
};

const HyacineChart = () => {
  const [data, setData] = useState<HyacineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speedValues, setSpeedValues] = useState({
    base: 0,
    withTraces: 0,
    withLightcone: 0,
    fullBuild: 0,
  });

  useEffect(() => {
    const fetchAndParseData = async () => {
      try {
        const response = await fetch("/hyacine/hyacine_data.csv");
        const csvText = await response.text();

        Papa.parse<HyacineData>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length > 0) {
              setData(results.data);
              const firstRow = results.data[0];
              setSpeedValues({
                base: firstRow.base_speed,
                withTraces: firstRow.speed_after_minor_traces,
                withLightcone: firstRow.speed_after_signature_lightcone,
                fullBuild: firstRow.speed_after_relics_and_planetary_sets,
              });
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

  // Calculate speed increases and healing bonuses
  const speedIncreases = {
    fromTraces: speedValues.withTraces - speedValues.base,
    fromLightcone: speedValues.withLightcone - speedValues.fullBuild,
    fromRelics: speedValues.fullBuild - speedValues.withTraces,
  };

  const traceSpeedGain =
    (speedValues.withTraces - speedValues.base) / speedValues.base;
  const relicsSpeedGain =
    (speedValues.fullBuild - speedValues.withTraces) / speedValues.withTraces;
  const lightconeSpeedGain =
    (speedValues.withLightcone - speedValues.fullBuild) /
    speedValues.withLightcone;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Overview</h2>
        <p className="text-sm md:text-base text-slate-700">
          This analysis explores Hyacine&apos;s unique A6 trace mechanic, which
          enhances her healing capabilities based on her Speed stat. When her
          Speed exceeds 200, each additional point provides a 1% increase to
          outgoing healing. The analysis tracks her Speed progression through
          different build stages: base stats, minor traces, signature Light Cone
          (S1), and finally with Relics and Planetary sets. This helps identify
          optimal build paths and the potential healing bonus at each stage.
        </p>
      </div>

      {/* Increased height and adjusted margins to fix overlap */}
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 60, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="speed"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={7}
          >
            <Label value="Speed" offset={-20} position="insideBottom" dy={30} />
          </XAxis>
          <YAxis
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            width={60}
          >
            <Label
              value="Increased Outgoing Healing"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
              dx={-45}
            />
          </YAxis>
          <Tooltip
            content={(props: TooltipProps<number, string>) => {
              const { active, payload, label } = props;

              if (active && payload && payload.length && payload[0]) {
                return (
                  <div className="bg-white p-3 border border-slate-200 shadow-md rounded">
                    <p className="text-slate-700 font-medium">{`Speed: ${label}`}</p>
                    <p className="text-emerald-600">
                      {`Increased Healing: ${(Number(payload[0].value) * 100).toFixed(2)}%`}
                    </p>
                    {Number(label) === 200 && (
                      <p className="text-red-600 font-medium">
                        Healing Bonus Threshold
                      </p>
                    )}
                    {Object.entries({
                      [speedValues.base]: ["Base Speed", "blue"],
                      [speedValues.withTraces]: [
                        "After Minor Traces",
                        "purple",
                      ],
                      [speedValues.fullBuild]: [
                        "After Relics and Planetary Sets",
                        "rose",
                      ],
                      [speedValues.withLightcone]: [
                        "After Signature Lightcone (S1)",
                        "amber",
                      ],
                    }).map(
                      ([speed, [text, color]]) =>
                        Number(label) === Number(speed) && (
                          <p
                            key={text}
                            className={`text-${color}-600 font-medium`}
                          >
                            {text}
                          </p>
                        ),
                    )}
                  </div>
                );
              }

              return null;
            }}
          />

          <Line
            type="monotone"
            dataKey="increased_outgoing_healing"
            name="Increased Healing"
            stroke="#3edf5d"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />

          <ReferenceLine x={200} stroke="red" strokeDasharray="3 3" />
          <ReferenceLine
            x={speedValues.base}
            stroke="blue"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            x={speedValues.withTraces}
            stroke="purple"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            x={speedValues.withLightcone}
            stroke="orange"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            x={speedValues.fullBuild}
            stroke="darkred"
            strokeDasharray="3 3"
          />

          {/* Added more vertical space using bottom margin and moved Legend position */}
          <Legend
            verticalAlign="bottom"
            height={80}
            wrapperStyle={{ paddingTop: 20, bottom: 0 }}
            payload={[
              { value: `Healing Threshold (200)`, type: "line", color: "red" },
              {
                value: `Base Speed (${speedValues.base})`,
                type: "line",
                color: "blue",
              },
              {
                value: `After Minor Traces (${speedValues.withTraces})`,
                type: "line",
                color: "purple",
              },
              {
                value: `After Relics and Planetary Sets (${speedValues.fullBuild.toFixed(0)})`,
                type: "line",
                color: "darkred",
              },
              {
                value: `After S1 Lightcone (${speedValues.withLightcone.toFixed(0)})`,
                type: "line",
                color: "orange",
              },
              { value: "Increased Healing", type: "line", color: "#3edf5d" },
            ]}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-8 space-y-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-slate-700">
            Speed Analysis
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-700">Speed Progression</h3>
              <p className="text-slate-600 mb-2">
                Starting with a base speed of {speedValues.base}, Hyacine&apos;s
                unique A6 trace mechanic requires careful investment to surpass
                the 200 speed threshold. Each component of her build contributes
                differently to reaching optimal healing output:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <h4 className="text-purple-600 font-medium mb-2">
                  Minor Traces
                </h4>
                <p className="text-slate-600">
                  Minor traces contribute {speedIncreases.fromTraces} speed
                  points ({(traceSpeedGain * 100).toFixed(1)}% speed increased).
                  This initial investment brings her to {speedValues.withTraces}{" "}
                  speed,
                  {` leaving ${(200 - speedValues.withTraces).toFixed(0)} speed until healing bonus activation.`}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <h4 className="text-amber-600 font-medium mb-2">
                  Relics & Planetary Sets
                </h4>
                <p className="text-slate-600">
                  Relics and planetary sets add additional{" "}
                  {speedIncreases.fromRelics.toFixed(1)} speed (
                  {(relicsSpeedGain * 100).toFixed(1)}% speed increased),
                  resulting in {speedValues.fullBuild.toFixed(1)} speed. This
                  includes 2-piece and 4-piece bonus of Warrior Goddess of Sun
                  and Thunder with 25.02 speed bonus from Feet, and 2-piece
                  bonus of Giant Tree of Rapt Brooding set.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 md:col-span-2">
                <h4 className="text-rose-600 font-medium mb-2">
                  Signature Light Cone
                </h4>
                <p className="text-slate-600">
                  Her signature Light Cone (S1) provides{" "}
                  {speedIncreases.fromLightcone.toFixed(1)} additional speed (
                  {(lightconeSpeedGain * 100).toFixed(1)}% speed increased),
                  reaching {speedValues.withLightcone.toFixed(1)} total speed.
                  Hyacine still requires additional{" "}
                  {(200 - speedValues.withLightcone).toFixed(1)} speed to
                  activate the healing bonus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyacineChart;
