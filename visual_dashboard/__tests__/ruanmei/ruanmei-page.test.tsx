import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RuanMeiPage from "../../src/app/characters/ruanmei/page";

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Papa Parse
vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn((csvText, options) => {
      const mockData = [
        {
          character: "RuanMei",
          break_effect: 1.0,
          break_effect_percentage: 100.0,
          base_skill_dmg_increase: 0.32,
          additional_dmg_from_a6: 0.0,
          total_skill_dmg_increase: 0.32,
        },
        {
          character: "RuanMei",
          break_effect: 1.5,
          break_effect_percentage: 150.0,
          base_skill_dmg_increase: 0.32,
          additional_dmg_from_a6: 0.18,
          total_skill_dmg_increase: 0.5,
        },
      ];

      if (options?.complete) {
        options.complete({ data: mockData });
      }
      return { data: mockData };
    }),
  },
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve("mocked,csv,data"),
  }),
) as any;

describe("RuanMei Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display data correctly", async () => {
    render(<RuanMeiPage />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
    });

    // Check page title
    expect(
      screen.getByText("Ruan Mei A6 Trace Break Effect Analysis"),
    ).toBeTruthy();

    // Check overview section
    expect(screen.getByText("Overview")).toBeTruthy();
    expect(screen.getByText(/A6 trace enhances/)).toBeTruthy();

    // Check A6 mechanics section
    expect(screen.getByText("❄️ A6 Trace Mechanics")).toBeTruthy();
    expect(screen.getByText(/32.0% damage/)).toBeTruthy();
    expect(screen.getByText(/120% Break Effect/)).toBeTruthy();
  });

  it("should have working back button", async () => {
    render(<RuanMeiPage />);

    // Find and click back button
    const backButton = screen.getByRole("link", { name: /← Back/i });
    expect(backButton).toBeTruthy();
    expect(backButton.getAttribute("href")).toBe("/");

    fireEvent.click(backButton);

    // In a real app, this would navigate. Here we just verify the link exists and is clickable
    expect(backButton.classList.contains("hover:bg-blue-600")).toBe(true);
  });
});
