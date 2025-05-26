import { useState, useEffect } from "react";
import Papa from "papaparse";

type ParseError = {
  message: string;
  code?: string;
  type?: string;
};

interface UseChartDataOptions<T> {
  csvPath: string;
  onDataProcessed?: (data: T[]) => void;
}

export function useChartData<T>({
  csvPath,
  onDataProcessed,
}: UseChartDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParseData = async () => {
      try {
        const response = await fetch(csvPath);
        const csvText = await response.text();

        Papa.parse<T>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length > 0) {
              setData(results.data);
              onDataProcessed?.(results.data);
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
  }, [csvPath, onDataProcessed]);

  return { data, loading, error };
}

// Common loading and error components
export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center h-64"
      data-testid="loading-spinner"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
      {error}
    </div>
  );
}
