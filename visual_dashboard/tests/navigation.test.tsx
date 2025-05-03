import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "../src/app/page";
import DashboardPage from "../src/app/dashboard/page";
import AnaxaPage from "../src/app/dashboard/anaxa/page";

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

describe("Navigation flow", () => {
  // Since we can't test actual navigation in these unit tests,
  // we'll check that the link structure forms a connected graph
  it("ensures correct navigation path from home to dashboard", () => {
    render(<Home />);
    const dashboardLink = screen.getByRole("link");
    expect(dashboardLink.getAttribute("href")).toBe("/dashboard");
  });

  it("ensures correct navigation from dashboard to home", () => {
    render(<DashboardPage />);
    const homeLink = screen.getByText("Back to Home");
    expect(homeLink.getAttribute("href")).toBe("/");
  });

  it("ensures correct navigation from dashboard to character page", () => {
    render(<DashboardPage />);
    const anaxaLink = screen.getByText("Anaxa");
    expect(anaxaLink.getAttribute("href")).toBe("/dashboard/anaxa");
  });

  it("ensures correct navigation from character page back to dashboard", () => {
    render(<AnaxaPage />);
    const backLink = screen.getByText("← Back");
    expect(backLink.getAttribute("href")).toBe("/dashboard");
  });
});
