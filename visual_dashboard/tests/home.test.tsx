import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "../src/app/page";

// Mock next/link since we're testing outside of a Next.js environment
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

describe("Home page", () => {
  it("renders the title correctly", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain(
      "Honkai: Star Rail Character Stats Analysis",
    );
  });
  it("displays the Hyacine button", () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: /hyacine/i });
    expect(button).toBeDefined();
  });
  it("has a link to the Hyacine page", () => {
    render(<Home />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/hyacine");
  });
});
