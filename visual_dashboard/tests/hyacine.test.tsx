import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Home from "../src/app/page";
import HyacinePage from "../src/app/hyacine/page";

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Set up mocks before tests
beforeEach(() => {
  // Mock ResizeObserver
  global.ResizeObserver = ResizeObserverMock;

  // Mock fetch
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      text: () =>
        Promise.resolve(
          "character,speed,increased_outgoing_healing\nHyacine,220,0.2",
        ),
    }),
  ) as any;
});

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

// Mock recharts to avoid rendering complex chart components
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
    Line: () => <div data-testid="chart-line">Line Mock</div>,
    XAxis: () => <div data-testid="x-axis">XAxis Mock</div>,
    YAxis: () => <div data-testid="y-axis">YAxis Mock</div>,
    CartesianGrid: () => (
      <div data-testid="cartesian-grid">CartesianGrid Mock</div>
    ),
    Tooltip: () => <div data-testid="tooltip">Tooltip Mock</div>,
    Legend: () => <div data-testid="legend">Legend Mock</div>,
    Label: () => <div data-testid="label">Label Mock</div>,
  };
});

// Properly mock papaparse with default export
vi.mock("papaparse", () => {
  return {
    default: {
      parse: vi.fn((csvText, options) => {
        options.complete({
          data: [
            {
              character: "Hyacine",
              speed: 220,
              increased_outgoing_healing: 0.2,
            },
            {
              character: "Hyacine",
              speed: 300,
              increased_outgoing_healing: 1.0,
            },
            {
              character: "Hyacine",
              speed: 400,
              increased_outgoing_healing: 2.0,
            },
          ],
          meta: {
            fields: ["character", "speed", "increased_outgoing_healing"],
          },
        });
      }),
    },
  };
});

describe("Navigation flow", () => {
  // Since we can't test actual navigation in these unit tests,
  // we'll check that the link structure forms a connected graph
  it("ensures correct navigation path from home to hyacine page", () => {
    render(<Home />);
    const hyacineLink = screen.getByRole("button", { name: /hyacine/i });
    const parentLink = hyacineLink.closest("a");
    expect(parentLink).not.toBeNull();
    expect(parentLink?.getAttribute("href")).toBe("/hyacine");
  });

  it("ensures correct navigation from hyacine page back to home", () => {
    render(<HyacinePage />);
    const backLink = screen.getByText("← Back");
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("renders the hyacine page with correct title", async () => {
    render(<HyacinePage />);
    const title = screen.getByText("Hyacine A6 Trace Healing Bonus Analysis");
    expect(title).toBeTruthy();
  });

  it("displays chart content after data loads", async () => {
    render(<HyacinePage />);

    // Wait for chart elements to be rendered
    await waitFor(() => {
      // Should find description text
      const description = screen.getByText(
        /This chart shows how Hyacine's outgoing healing increases/,
      );
      expect(description).toBeTruthy();

      // Check for mocked chart components
      expect(screen.getByTestId("responsive-container")).toBeTruthy();
    });
  });

  it("displays key observations section", async () => {
    render(<HyacinePage />);

    await waitFor(() => {
      // Look for the heading text within all elements
      const keyObservationsHeading = screen.getByText(/Key Observations/);
      expect(keyObservationsHeading).toBeTruthy();

      // Check for the list items
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBe(3);

      // Check content of the first item
      const firstItem = listItems[0];
      expect(firstItem.textContent).toContain(
        "No healing bonus is applied until Speed exceeds 200",
      );
    });
  });
});
