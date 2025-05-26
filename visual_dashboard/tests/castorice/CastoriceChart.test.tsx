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

// Mock fetch and Papa Parse
global.fetch = vi.fn();
vi.mock("papaparse", () => ({
  default: { parse: vi.fn() },
}));

describe("CastoriceChart Component - Character Specific", () => {
  const mockData = [
    {
      character: "Castorice",
      combined_allies_hp: 15000,
      skill_count_before_getting_ult: 16,
      heal_count_before_getting_ult: 15,
    },
    {
      character: "Castorice",
      combined_allies_hp: 25000,
      skill_count_before_getting_ult: 10,
      heal_count_before_getting_ult: 9,
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("mock,csv,data"),
    });

    // Setup Papa Parse mock
    const Papa = await import("papaparse");
    Papa.default.parse = vi.fn((_, options) => {
      if (options.complete) {
        options.complete({
          data: mockData,
          meta: { fields: Object.keys(mockData[0]) },
        });
      }
    });
  });

  // Test helper to wait for component to load
  const waitForLoad = async () => {
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });
  };

  it("renders both LineChart and AreaChart (unique to Castorice)", async () => {
    render(<CastoriceChart />);
    await waitForLoad();

    // Castorice uses both chart types - this is unique behavior
    expect(screen.getByTestId("line-chart")).toBeTruthy();
    expect(screen.getByTestId("area-chart")).toBeTruthy();
  });

  it("renders Castorice-specific line components", async () => {
    render(<CastoriceChart />);
    await waitForLoad();

    // Test Castorice-specific data visualization lines
    expect(screen.getByTestId("line-skills-needed")).toBeTruthy();
    expect(screen.getByTestId("line-heals-needed")).toBeTruthy();
    expect(screen.getByTestId("line-total-actions")).toBeTruthy();
  });

  it("displays Newbud energy analysis parameters", async () => {
    render(<CastoriceChart />);
    await waitForLoad();

    // Test Castorice-specific game mechanics
    expect(screen.getByText("⚡ Analysis Parameters")).toBeTruthy();
    expect(screen.getByText(/34,000 Newbud energy/)).toBeTruthy();
    expect(screen.getByText(/1,600 HP/)).toBeTruthy();
  });

  it("displays team building analysis with HP investment ranges", async () => {
    render(<CastoriceChart />);
    await waitForLoad();

    // Test Castorice-specific team building strategy
    expect(screen.getByText("Team Building Analysis")).toBeTruthy();
    expect(screen.getByText("Low Investment (15k-19k HP)")).toBeTruthy();
    expect(screen.getByText("Optimal Range (20k-26k HP)")).toBeTruthy();
    expect(screen.getByText("High Investment (27k-33k HP)")).toBeTruthy();
  });

  it("mentions unique Newbud energy system in overview", async () => {
    render(<CastoriceChart />);
    await waitForLoad();

    // Test that the overview explains Castorice's unique mechanics
    expect(
      screen.getByText(/Castorice uses a unique Newbud energy system/),
    ).toBeTruthy();
  });
});
