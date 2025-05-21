// hyacine-page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HyacinePage from "../../src/app/hyacine/page";

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

// Mock HyacineChart component
vi.mock("../src/app/components/HyacineChart", () => ({
  __esModule: true,
  default: () => <div data-testid="hyacine-chart">Hyacine Chart Component</div>,
}));

describe("Hyacine Page", () => {
  it("renders the page title correctly", () => {
    render(<HyacinePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Hyacine A6 Trace Healing Bonus Analysis");
  });

  it("displays back button with correct link", () => {
    render(<HyacinePage />);
    const backLink = screen.getByText(/← Back/i);
    expect(backLink).toBeTruthy();
    expect(backLink.getAttribute("href")).toBe("/");
  });

  it("includes the HyacineChart component", () => {
    render(<HyacinePage />);
    expect(screen.getByTestId("hyacine-chart")).toBeTruthy();
  });
});