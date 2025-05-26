import { render, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";

export const setupChartTest = async (Component: React.ComponentType) => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.queryByTestId("loading-spinner")).not.toBeTruthy();
  });
};

export const mockChartData = (data: any[]) => {
  const Papa = vi.mocked(await import("papaparse"));
  Papa.default.parse = vi.fn((_, options) => {
    if (options.complete) {
      options.complete({
        data,
        meta: { fields: Object.keys(data[0]) },
      });
    }
  });
};