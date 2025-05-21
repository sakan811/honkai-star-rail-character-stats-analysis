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
  ReferenceLine
} from "recharts";
import Papa from 'papaparse';

type HyacineData = {
  character: string;
  speed: number;
  increased_outgoing_healing: number;
  base_speed: number;
  speed_after_minor_traces: number;
  speed_after_signature_lightcone: number;
  speed_after_relics_and_planetary_sets: number;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; dataKey?: string }>;
  label?: string;
}

const HyacineChart = () => {
  const [data, setData] = useState<HyacineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speedValues, setSpeedValues] = useState({
    base: 0,
    withTraces: 0,
    withLightcone: 0,
    fullBuild: 0
  });

  useEffect(() => {
    const fetchAndParseData = async () => {
      try {
        const response = await fetch('/hyacine/hyacine_data.csv');
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
                fullBuild: firstRow.speed_after_relics_and_planetary_sets
              });
            }
            setLoading(false);
          },
          error: (error) => {
            setError(`Failed to parse CSV: ${error.message}`);
            setLoading(false);
          }
        });
      } catch (err) {
        setError(`Failed to fetch CSV: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };

    fetchAndParseData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    fromLightcone: speedValues.withLightcone - speedValues.withTraces,
    fromRelics: speedValues.fullBuild - speedValues.withLightcone
  };

  const totalSpeedGain = speedValues.fullBuild - speedValues.base;
  const healingBonusAtFullBuild = Math.max(0, speedValues.fullBuild - 200);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Overview</h2>
        <p className="text-sm md:text-base text-slate-700">
          This analysis explores Hyacine's unique A6 trace mechanic, which enhances her healing capabilities 
          based on her Speed stat. When her Speed exceeds 200, each additional point provides a 1% increase 
          to outgoing healing. The analysis tracks her Speed progression through different build stages: base stats, 
          minor traces, signature Light Cone (S1), and finally with Relics and Planetary sets. This helps identify 
          optimal build paths and the potential healing bonus at each stage.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 70 }}
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
          <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}>
            <Label
              value="Increased Outgoing Healing"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
              dx={-35}
            />
          </YAxis>
          <Tooltip content={({ active, payload, label }) => 
            active && payload && payload.length ? (
              <div className="bg-white p-3 border border-slate-200 shadow-md rounded">
                <p className="text-slate-700 font-medium">{`Speed: ${label}`}</p>
                <p className="text-emerald-600">
                  {`Increased Healing: ${(payload[0].value * 100).toFixed(2)}%`}
                </p>
                {Number(label) === 200 && (
                  <p className="text-red-600 font-medium">Healing Bonus Threshold</p>
                )}
                {Object.entries({
                  [speedValues.base]: ['Base Speed', 'blue'],
                  [speedValues.withTraces]: ['After Minor Traces', 'purple'],
                  [speedValues.withLightcone]: ['After Signature Lightcone (S1)', 'amber'],
                  [speedValues.fullBuild]: ['After Relics and Planetary Sets', 'rose']
                }).map(([speed, [text, color]]) => 
                  Number(label) === Number(speed) && (
                    <p key={text} className={`text-${color}-600 font-medium`}>{text}</p>
                  )
                )}
              </div>
            ) : null
          } />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="increased_outgoing_healing"
            name="Increased Healing"
            stroke="#3edf5d"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          
          {/* Reference lines with adjusted label positions */}
          <ReferenceLine
            x={200}
            stroke="red"
            strokeDasharray="3 3"
            label={{ 
              value: "Threshold (200)", 
              position: "top", 
              fill: "red", 
              fontSize: 10,
              dy: -10
            }}
          />
          
          <ReferenceLine
            x={speedValues.base}
            stroke="blue"
            strokeDasharray="3 3"
            label={{ 
              value: `Base (${speedValues.base})`, 
              position: "top", 
              fill: "blue", 
              fontSize: 10,
              dy: -10
            }}
          />
          
          <ReferenceLine
            x={speedValues.withTraces}
            stroke="purple"
            strokeDasharray="3 3"
            label={{ 
              value: `Minor Traces (${speedValues.withTraces})`, 
              position: "top", 
              fill: "purple", 
              fontSize: 10,
              dy: -10
            }}
          />
          
          <ReferenceLine
            x={speedValues.withLightcone}
            stroke="orange"
            strokeDasharray="3 3"
            label={{ 
              value: `S1 Lightcone (${speedValues.withLightcone.toFixed(0)})`, 
              position: "top", 
              fill: "orange", 
              fontSize: 10,
              dy: -10
            }}
          />
          
          <ReferenceLine
            x={speedValues.fullBuild}
            stroke="darkred"
            strokeDasharray="3 3"
            label={{ 
              value: `Relics & Sets (${speedValues.fullBuild.toFixed(0)})`, 
              position: "bottom", 
              fill: "darkred", 
              fontSize: 10,
              dy: 10
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-8 space-y-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-slate-700">Speed Analysis</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-700">Base Speed</h3>
              <p className="text-slate-600">
                Starting at {speedValues.base} speed, Hyacine needs {Math.max(0, 200 - speedValues.base)} more 
                speed to begin receiving healing bonuses.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-slate-700">Speed Sources</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Traces: +{speedIncreases.fromTraces} speed 
                  ({((speedIncreases.fromTraces / totalSpeedGain) * 100).toFixed(1)}% of total gain)
                </li>
                <li>
                  Signature Light Cone: +{speedIncreases.fromLightcone.toFixed(1)} speed 
                  ({((speedIncreases.fromLightcone / totalSpeedGain) * 100).toFixed(1)}% of total gain)
                </li>
                <li>
                  Relics & Sets: +{speedIncreases.fromRelics.toFixed(1)} speed 
                  ({((speedIncreases.fromRelics / totalSpeedGain) * 100).toFixed(1)}% of total gain)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <h3 className="font-medium text-emerald-800">Healing Bonus Analysis</h3>
          <p className="text-emerald-700">
            At full build (speed: {speedValues.fullBuild}), Hyacine gains a 
            {healingBonusAtFullBuild > 0 ? ` ${healingBonusAtFullBuild}% healing bonus` : "n insufficient speed for healing bonus"}. 
            This is {((healingBonusAtFullBuild / 200) * 100).toFixed(1)}% of her maximum potential (200% at 400 speed).
          </p>
        </div>
      </div>
    </div>
  );
};

export default HyacineChart;