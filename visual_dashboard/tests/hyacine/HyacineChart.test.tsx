// HyacineChart.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import HyacineChart from "../../src/app/components/HyacineChart";

// Mock the recharts components
vi.mock("recharts", () => {
  const OriginalModule = vi.importActual("recharts");
  return {
    ...OriginalModule,
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
    TooltipProps: {},
  };
});

// Mock fetch
global.fetch = vi.fn();

// Mock Papa Parse
vi.mock("papaparse", () => {
  const mockParse = vi.fn((_, options) => {
    const mockData = [
      {
        character: "Hyacine",
        speed: 150,
        increased_outgoing_healing: 0,
        base_speed: 100,
        speed_after_minor_traces: 120,
        speed_after_signature_lightcone: 220,
        speed_after_relics_and_planetary_sets: 180,
      },
      {
        character: "Hyacine",
        speed: 200,
        increased_outgoing_healing: 0,
        base_speed: 100,
        speed_after_minor_traces: 120,
        speed_after_signature_lightcone: 220,
        speed_after_relics_and_planetary_sets: 180,
      },
      {
        character: "Hyacine",
        speed: 250,
        increased_outgoing_healing: 0.5,
        base_speed: 100,
        speed_after_minor_traces: 120,
        speed_after_signature_lightcone: 220,
        speed_after_relics_and_planetary_sets: 180,
      },
    ];

    if (options.complete) {
      options.complete({
        data: mockData,
        meta: { fields: Object.keys(mockData[0]) },
      });
    }

    return mockData;
  });

  return {
    default: {
      parse: mockParse,
    },
  };
});

describe("HyacineChart Component", () => {
  beforeEach(() => {
    // Setup fetch mock
    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve("mock,csv,data"),
    });
  });

  it("renders loading state initially", () => {
    render(<HyacineChart />);
    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("renders the chart after data is loaded", async () => {
    render(<HyacineChart />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    // Check chart components are rendered
    expect(screen.getByTestId("responsive-container")).toBeTruthy();
    expect(screen.getByTestId("line-chart")).toBeTruthy();
    expect(screen.getByTestId("chart-line")).toBeTruthy();

    // Check reference lines
    expect(screen.getByTestId("reference-line-200")).toBeTruthy(); // Healing threshold
    expect(screen.getByTestId("reference-line-100")).toBeTruthy(); // Base speed
    expect(screen.getByTestId("reference-line-120")).toBeTruthy(); // After traces
    expect(screen.getByTestId("reference-line-220")).toBeTruthy(); // After lightcone
    expect(screen.getByTestId("reference-line-180")).toBeTruthy(); // After relics
  });

  it("displays speed analysis information after data is loaded", async () => {
    render(<HyacineChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    // Check the header sections
    expect(screen.getByText("Overview")).toBeTruthy();
    expect(screen.getByText("Speed Analysis")).toBeTruthy();
    expect(screen.getByText("Speed Progression")).toBeTruthy();

    // Check section headers
    expect(screen.getByText("Minor Traces")).toBeTruthy();
    expect(screen.getByText("Signature Light Cone")).toBeTruthy();
    expect(screen.getByText("Relics & Planetary Sets")).toBeTruthy();
  });

  it("handles fetch errors gracefully", async () => {
    // Setup fetch to reject
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    render(<HyacineChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    // Error message should be displayed
    expect(screen.getByText(/Failed to fetch CSV/i)).toBeTruthy();
  });

  it("handles CSV parsing errors gracefully", async () => {
    // Reset previous mocks
    vi.clearAllMocks();

    // Create a mock Papa.parse that triggers an error
    const mockPapaparse = await import("papaparse");
    mockPapaparse.default.parse = vi.fn((_, options) => {
      if (options.error) {
        options.error({ message: "Invalid CSV format" });
      }
      return {};
    });

    render(<HyacineChart />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    // Error message should be displayed
    expect(screen.getByText(/Failed to parse CSV/i)).toBeTruthy();
  });
});
