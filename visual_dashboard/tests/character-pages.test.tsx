import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

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
    <div
      data-testid={`line-${name?.toLowerCase().replace(/\s+/g, "-") || "default"}`}
    />
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
  ReferenceLine: (props: { x?: number }) => (
    <div data-testid={`reference-line-${props.x || "default"}`} />
  ),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock Papa Parse
vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn(),
  },
}));

const chartConfigs = [
  {
    name: "Hyacine",
    componentPath: "../src/app/components/characters/HyacineChart",
    csvPath: "/hyacine/hyacine_data.csv",
    mockData: [
      {
        character: "Hyacine",
        speed: 150,
        increased_outgoing_healing: 0,
        base_speed: 100,
        speed_after_minor_traces: 120,
        speed_after_signature_lightcone: 220,
        speed_after_relics_and_planetary_sets: 180,
      },
    ],
    expectedSections: ["Overview", "Speed Analysis"],
  },
  {
    name: "Castorice",
    componentPath: "../src/app/components/characters/CastoriceChart",
    csvPath: "/castorice/castorice_data.csv",
    mockData: [
      {
        character: "Castorice",
        combined_allies_hp: 15000,
        skill_count_before_getting_ult: 16,
        heal_count_before_getting_ult: 15,
      },
    ],
    expectedSections: ["Overview", "Team HP Analysis"],
  },
];

chartConfigs.forEach(({ name, componentPath, mockData, expectedSections }) => {
  describe(`${name} Chart Component`, () => {
    let ChartComponent: React.ComponentType;

    beforeEach(async () => {
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

      const module = await import(componentPath);
      ChartComponent = module.default;
    });

    it("renders loading state initially", () => {
      (global.fetch as any).mockImplementation(() => new Promise(() => {}));

      render(<ChartComponent />);
      expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    });

    it("renders expected sections after loading", async () => {
      render(<ChartComponent />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
      });

      expectedSections.forEach((section) => {
        expect(screen.getByText(section)).toBeTruthy();
      });
    });

    it("renders chart components after data loads", async () => {
      render(<ChartComponent />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
      });

      expect(screen.getAllByTestId("responsive-container")[0]).toBeTruthy();
    });

    it("handles fetch errors gracefully", async () => {
      (global.fetch as any).mockRejectedValue(new Error("Network error"));

      render(<ChartComponent />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
      });

      expect(
        screen.getByText(/Failed to fetch CSV: Network error/),
      ).toBeTruthy();
    });
  });
});
