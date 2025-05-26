import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CastoriceChart from "../../src/app/components/characters/CastoriceChart";

// Mock the recharts components
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Line: ({ name }: { name: string }) => (
    <div data-testid={`line-${name.toLowerCase().replace(/\s+/g, "-")}`} />
  ),
  Area: () => <div data-testid="chart-area" />,
  XAxis: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="x-axis">{children}</div>
  ),
  YAxis: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="y-axis">{children}</div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Label: () => <div data-testid="axis-label" />,
}));

// Mock fetch
global.fetch = vi.fn();

// Mock Papa Parse
vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn(),
  },
}));

describe("CastoriceChart Component", () => {
  const mockData = [
    {
      character: "Castorice",
      combined_allies_hp: 15000,
      skill_count_before_getting_ult: 16,
      heal_count_before_getting_ult: 15,
    },
    {
      character: "Castorice",
      combined_allies_hp: 20000,
      skill_count_before_getting_ult: 13,
      heal_count_before_getting_ult: 12,
    },
    {
      character: "Castorice",
      combined_allies_hp: 25000,
      skill_count_before_getting_ult: 10,
      heal_count_before_getting_ult: 9,
    },
    {
      character: "Castorice",
      combined_allies_hp: 30000,
      skill_count_before_getting_ult: 8,
      heal_count_before_getting_ult: 7,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("mock,csv,data"),
    });

    const Papa = vi.mocked(await import("papaparse"));
    Papa.default.parse = vi.fn((_, options) => {
      if (options.complete) {
        options.complete({
          data: mockData,
          meta: { fields: Object.keys(mockData[0]) },
        });
      }
    });
  });

  it("renders loading state initially", () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<CastoriceChart />);
    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("renders overview section after loading", async () => {
    render(<CastoriceChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    expect(screen.getByText("Overview")).toBeTruthy();
    expect(
      screen.getByText(/Castorice uses a unique Newbud energy system/),
    ).toBeTruthy();
  });

  it("renders analysis parameters section", async () => {
    render(<CastoriceChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    expect(screen.getByText("⚡ Analysis Parameters")).toBeTruthy();
    expect(screen.getByText(/34,000 Newbud energy/)).toBeTruthy();
    expect(screen.getByText(/1,600 HP/)).toBeTruthy();
  });

  it("renders both charts after data loads", async () => {
    render(<CastoriceChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    // Should have both LineChart and AreaChart
    expect(screen.getByTestId("line-chart")).toBeTruthy();
    expect(screen.getByTestId("area-chart")).toBeTruthy();

    // Should have multiple lines for the LineChart
    expect(screen.getByTestId("line-skills-needed")).toBeTruthy();
    expect(screen.getByTestId("line-heals-needed")).toBeTruthy();
    expect(screen.getByTestId("line-total-actions")).toBeTruthy();
  });

  it("renders team building analysis section", async () => {
    render(<CastoriceChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    expect(screen.getByText("Team Building Analysis")).toBeTruthy();
    expect(screen.getByText("Low Investment (15k-19k HP)")).toBeTruthy();
    expect(screen.getByText("Optimal Range (20k-26k HP)")).toBeTruthy();
    expect(screen.getByText("High Investment (27k-33k HP)")).toBeTruthy();
  });

  it("handles fetch errors gracefully", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    render(<CastoriceChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    expect(screen.getByText(/Failed to fetch CSV: Network error/)).toBeTruthy();
  });

  it("handles parsing errors gracefully", async () => {
    const Papa = vi.mocked(await import("papaparse"));
    Papa.default.parse = vi.fn((_, options) => {
      if (options.error) {
        options.error({ message: "Invalid CSV format" });
      }
    });

    render(<CastoriceChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    expect(
      screen.getByText(/Failed to parse CSV: Invalid CSV format/),
    ).toBeTruthy();
  });
});
