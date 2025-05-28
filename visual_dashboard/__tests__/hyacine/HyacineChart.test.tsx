import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import HyacineChart from "../../src/app/components/characters/HyacineChart";

// Mock the recharts components
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="chart-line" />,
  XAxis: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="x-axis">{children}</div>
  ),
  YAxis: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="y-axis">{children}</div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ReferenceLine: (props: { x: number }) => (
    <div data-testid={`reference-line-${props.x}`} />
  ),
  Label: () => <div data-testid="axis-label" />,
}));

// Mock fetch and Papa Parse
global.fetch = vi.fn();
vi.mock("papaparse", () => ({
  default: { parse: vi.fn() },
}));

describe("HyacineChart Component - Character Specific", () => {
  const mockData = [
    {
      character: "Hyacine",
      speed: 200,
      increased_outgoing_healing: 0,
      base_speed: 110,
      speed_after_minor_traces: 124,
      speed_after_signature_lightcone: 188,
      speed_after_relics_and_planetary_sets: 168,
    },
    {
      character: "Hyacine",
      speed: 250,
      increased_outgoing_healing: 0.5,
      base_speed: 110,
      speed_after_minor_traces: 124,
      speed_after_signature_lightcone: 188,
      speed_after_relics_and_planetary_sets: 168,
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

  it("renders speed-specific reference lines (unique to Hyacine)", async () => {
    render(<HyacineChart />);
    await waitForLoad();

    // Test Hyacine's speed breakpoint reference lines
    expect(screen.getByTestId("reference-line-200")).toBeTruthy(); // A6 healing threshold
    expect(screen.getByTestId("reference-line-110")).toBeTruthy(); // Base speed
    expect(screen.getByTestId("reference-line-124")).toBeTruthy(); // After minor traces
    expect(screen.getByTestId("reference-line-188")).toBeTruthy(); // After signature lightcone
    expect(screen.getByTestId("reference-line-168")).toBeTruthy(); // After relics/planetary
  });

  it("displays A6 trace speed progression analysis", async () => {
    render(<HyacineChart />);
    await waitForLoad();

    // Test Hyacine-specific build progression sections
    expect(screen.getByText("Speed Progression")).toBeTruthy();
    expect(screen.getByText("Minor Traces")).toBeTruthy();
    expect(screen.getByText("Signature Light Cone")).toBeTruthy();
    expect(screen.getByText("Relics & Planetary Sets")).toBeTruthy();
  });

  it("explains A6 trace healing bonus mechanic", async () => {
    render(<HyacineChart />);
    await waitForLoad();

    // Test that overview explains Hyacine's unique A6 trace mechanic
    expect(
      screen.getByText(
        /A6 trace mechanic, which enhances her healing capabilities based on her Speed stat/,
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        /Speed exceeds 200, each additional point provides a 1% increase/,
      ),
    ).toBeTruthy();
  });

  it("shows speed analysis with healing bonus calculations", async () => {
    render(<HyacineChart />);
    await waitForLoad();

    // Test Hyacine-specific speed analysis section
    expect(screen.getByText("Speed Analysis")).toBeTruthy();

    // Should mention the 200 speed threshold requirement
    expect(screen.getByText(/200 speed threshold/)).toBeTruthy();
  });
});
