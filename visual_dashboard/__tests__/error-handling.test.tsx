import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorDisplay, LoadingSpinner } from "../src/app/hooks/useChartData";

describe("Error Handling Components", () => {
  describe("ErrorDisplay", () => {
    it("renders error with proper styling", () => {
      render(<ErrorDisplay error="Test error message" />);

      const errorDiv = screen.getByText("Test error message");
      expect(errorDiv.className).toContain("text-red-500");
      expect(errorDiv.className).toContain("border-red-300");
      expect(errorDiv.className).toContain("bg-red-50");
      expect(errorDiv.className).toContain("rounded");
    });

    it("handles network error messages", () => {
      const networkError = "Failed to fetch CSV: TypeError: Failed to fetch";
      render(<ErrorDisplay error={networkError} />);

      expect(screen.getByText(networkError)).toBeTruthy();
    });

    it("handles parsing error messages", () => {
      const parseError = "Failed to parse CSV: Unexpected token";
      render(<ErrorDisplay error={parseError} />);

      expect(screen.getByText(parseError)).toBeTruthy();
    });
  });

  describe("LoadingSpinner", () => {
    it("renders with correct accessibility attributes", () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByTestId("loading-spinner");
      expect(spinner).toBeTruthy();
      expect(spinner.className).toContain("flex");
      expect(spinner.className).toContain("items-center");
      expect(spinner.className).toContain("justify-center");
    });

    it("has proper animation classes", () => {
      render(<LoadingSpinner />);

      const spinner = screen.getByTestId("loading-spinner");
      const animatedElement = spinner.querySelector(".animate-spin");

      expect(animatedElement).toBeTruthy();
      expect(animatedElement?.className).toContain("rounded-full");
      expect(animatedElement?.className).toContain("border-t-2");
      expect(animatedElement?.className).toContain("border-b-2");
    });
  });
});
