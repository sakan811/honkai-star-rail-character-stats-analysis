"use client";

import { useEffect, useState } from "react";
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
} from "recharts";
import Papa from "papaparse";
import Link from "next/link";

type HyacineData = {
  character: string;
  speed: number;
  increased_outgoing_healing: number;
};

// Define proper types for the tooltip and parse error
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

export default function HyacinePage() {
  const [data, setData] = useState<HyacineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/hyacine/hyacine_data.csv");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const csvText = await response.text();

        Papa.parse<HyacineData>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
          error: (error: Error) => {
            setError(`CSV parsing error: ${error.message || String(error)}`);
            setLoading(false);
          },
        });
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format the healing percentage for display
  const formatHealingPercent = (value: number) =>
    `${(value * 100).toFixed(0)}%`;

  // Custom tooltip component with slate-700 styling for the speed label
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-md rounded">
          <p className="text-slate-700 font-medium">{`Speed: ${label}`}</p>
          <p className="text-emerald-600">{`Increased Healing: ${(payload[0].value * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center p-6 w-full h-full min-h-screen bg-gradient-to-b from-cyan-500 to-amber-200">
      <Link
        href="/"
        className="self-start mb-4 bg-green-400 hover:bg-green-600 text-slate-50 font-medium rounded px-4 py-2 transition-colors duration-200"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-slate-50">
        Hyacine A6 Trace Healing Bonus Analysis
      </h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            role="status"
            aria-label="loading"
          ></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          {error}
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <p className="text-slate-700">
              This chart shows how Hyacine&apos;s outgoing healing increases as
              her Speed stat exceeds 200. For every point of Speed above 200,
              healing is increased by 1%.
            </p>
          </div>

          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="speed"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickCount={7}
              >
                <Label
                  value="Speed"
                  offset={-20}
                  position="insideBottom"
                  dy={30}
                />
              </XAxis>
              <YAxis tickFormatter={formatHealingPercent}>
                <Label
                  value="Increased Outgoing Healing"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                  dx={-35}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="increased_outgoing_healing"
                name="Increased Healing"
                stroke="#3edf5d"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-slate-700">
              Key Observations
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>No healing bonus is applied until Speed exceeds 200</li>
              <li>At maximum speed (400), healing bonus reaches 200%</li>
              <li>
                The relationship is linear: each Speed point above 200 adds 1%
                healing
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
