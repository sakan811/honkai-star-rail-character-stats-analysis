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

// Don't use regex patterns with vi.mock - it only accepts string paths
