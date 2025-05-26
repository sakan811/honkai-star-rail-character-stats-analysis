import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CastoricePage from "../../src/app/characters/castorice/page";

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock CastoriceChart component
vi.mock("../../src/app/components/characters/CastoriceChart", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="castorice-chart">Castorice Chart Component</div>
  ),
}));

describe("Castorice Page", () => {
  it("renders the page title correctly", () => {
    render(<CastoricePage />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Castorice Newbud Energy Analysis");
  });

  it("displays back button with correct link", () => {
    render(<CastoricePage />);

    const backLink = screen.getByText(/← Back/i);
    expect(backLink).toBeTruthy();
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("uses purple button styling", () => {
    render(<CastoricePage />);

    const backButton = screen.getByText(/← Back/i);
    expect(backButton.className).toContain("bg-purple-400");
    expect(backButton.className).toContain("hover:bg-purple-600");
  });

  it("includes the CastoriceChart component", () => {
    render(<CastoricePage />);

    expect(screen.getByTestId("castorice-chart")).toBeTruthy();
    expect(screen.getByText("Castorice Chart Component")).toBeTruthy();
  });
});
