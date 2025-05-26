import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  useChartData,
  LoadingSpinner,
  ErrorDisplay,
} from "../src/app/hooks/useChartData";
import { render, screen } from "@testing-library/react";

// Mock fetch
global.fetch = vi.fn();

// Mock Papa Parse
vi.mock("papaparse", () => {
  return {
    default: {
      parse: vi.fn(),
    },
  };
});

type TestData = {
  id: number;
  name: string;
  value: number;
};

describe("useChartData hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with loading state", () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() =>
      useChartData<TestData>({ csvPath: "/test.csv" }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("successfully loads and parses data", async () => {
    const mockData: TestData[] = [
      { id: 1, name: "Test1", value: 100 },
      { id: 2, name: "Test2", value: 200 },
    ];

    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("id,name,value\n1,Test1,100\n2,Test2,200"),
    });

    const Papa = await import("papaparse");
    Papa.default.parse = vi.fn((csvText, options) => {
      setTimeout(() => {
        if (options.complete) {
          options.complete({
            data: mockData,
            meta: { fields: ["id", "name", "value"] },
          });
        }
      }, 0);
      return mockData;
    });

    const { result } = renderHook(() =>
      useChartData<TestData>({ csvPath: "/test.csv" }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch errors", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useChartData<TestData>({ csvPath: "/test.csv" }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch CSV: Network error");
  });

  it("handles parsing errors", async () => {
    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("invalid,csv,data"),
    });

    const Papa = await import("papaparse");
    Papa.default.parse = vi.fn((csvText, options) => {
      setTimeout(() => {
        if (options.error) {
          options.error({ message: "Parse error", code: "InvalidFormat" });
        }
      }, 0);
      return {};
    });

    const { result } = renderHook(() =>
      useChartData<TestData>({ csvPath: "/test.csv" }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe("Failed to parse CSV: Parse error");
  });

  it("calls onDataProcessed callback when data is loaded", async () => {
    const mockData: TestData[] = [{ id: 1, name: "Test1", value: 100 }];

    const onDataProcessed = vi.fn();

    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("id,name,value\n1,Test1,100"),
    });

    const Papa = await import("papaparse");
    Papa.default.parse = vi.fn((csvText, options) => {
      setTimeout(() => {
        if (options.complete) {
          options.complete({
            data: mockData,
            meta: { fields: ["id", "name", "value"] },
          });
        }
      }, 0);
      return mockData;
    });

    renderHook(() =>
      useChartData<TestData>({
        csvPath: "/test.csv",
        onDataProcessed,
      }),
    );

    await waitFor(() => {
      expect(onDataProcessed).toHaveBeenCalledWith(mockData);
    });
  });

  it("uses correct Papa Parse options", async () => {
    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("test data"),
    });

    const Papa = await import("papaparse");
    const parseSpy = vi.spyOn(Papa.default, "parse");

    renderHook(() => useChartData<TestData>({ csvPath: "/test.csv" }));

    await waitFor(() => {
      expect(parseSpy).toHaveBeenCalled();
    });

    const parseOptions = parseSpy.mock.calls[0][1];
    expect(parseOptions.header).toBe(true);
    expect(parseOptions.dynamicTyping).toBe(true);
    expect(parseOptions.skipEmptyLines).toBe(true);
    expect(parseOptions.complete).toBeDefined();
    expect(parseOptions.error).toBeDefined();
  });
});

describe("LoadingSpinner component", () => {
  it("renders loading spinner with correct attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeTruthy();
    expect(spinner.className).toContain("flex");
    expect(spinner.className).toContain("items-center");
    expect(spinner.className).toContain("justify-center");
    expect(spinner.className).toContain("h-64");

    // Check for the spinning animation element
    const spinnerElement = spinner.querySelector(".animate-spin");
    expect(spinnerElement).toBeTruthy();
    expect(spinnerElement?.className).toContain("border-blue-500");
  });
});

describe("ErrorDisplay component", () => {
  it("renders error message correctly", () => {
    const errorMessage = "Test error message";
    render(<ErrorDisplay error={errorMessage} />);

    const errorDiv = screen.getByText(errorMessage);
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.className).toContain("text-red-500");
    expect(errorDiv.className).toContain("border-red-300");
    expect(errorDiv.className).toContain("bg-red-50");
  });

  it("handles long error messages", () => {
    const longError =
      "This is a very long error message that should be displayed properly in the error component without breaking the layout";
    render(<ErrorDisplay error={longError} />);

    const errorDiv = screen.getByText(longError);
    expect(errorDiv).toBeTruthy();
  });

  it("handles empty error messages", () => {
    render(<ErrorDisplay error="" />);

    // Should still render the container even with empty message
    const errorContainer = screen.getByText("").closest("div");
    expect(errorContainer?.className).toContain("text-red-500");
  });
});
