// Vitest setup - augment expect with custom matchers if needed

// Mock CSS imports
import { vi } from "vitest";

// Mock specific CSS files that are imported in your components
vi.mock("../src/app/globals.css", () => ({}));

// Mock Next.js font
vi.mock("next/font/google", () => ({
  Geist: () => ({
    className: "mocked-font-geist",
    variable: "mocked-font-geist",
    style: { fontFamily: "mocked-geist" },
  }),
  Geist_Mono: () => ({
    className: "mocked-font-geist-mono",
    variable: "mocked-font-geist-mono",
    style: { fontFamily: "mocked-geist-mono" },
  }),
}));

// Mock ResizeObserver for Recharts
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch for CSV data loading
global.fetch = vi.fn();

// Mock window.fs for file reading (used in some components)
Object.defineProperty(window, 'fs', {
  value: {
    readFile: vi.fn(),
  },
  writable: true,
});
