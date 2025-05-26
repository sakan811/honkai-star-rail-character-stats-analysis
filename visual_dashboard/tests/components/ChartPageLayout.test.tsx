import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChartPageLayout from "../../src/app/components/ChartPageLayout";

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

describe("ChartPageLayout Component", () => {
  const defaultProps = {
    title: "Test Chart Title",
    buttonColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-700",
    children: <div data-testid="test-child">Test Content</div>,
  };

  it("renders with correct title", () => {
    render(<ChartPageLayout {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Test Chart Title");
    expect(heading.className).toContain("text-slate-50");
  });

  it("renders back button with correct href and styles", () => {
    render(<ChartPageLayout {...defaultProps} />);

    const backLink = screen.getByRole("link");
    expect(backLink.getAttribute("href")).toBe("/");
    expect(backLink.textContent).toBe("← Back");
    expect(backLink.className).toContain("bg-blue-500");
    expect(backLink.className).toContain("hover:bg-blue-700");
  });

  it("renders children content", () => {
    render(<ChartPageLayout {...defaultProps} />);

    expect(screen.getByTestId("test-child")).toBeTruthy();
    expect(screen.getByText("Test Content")).toBeTruthy();
  });

  it("applies custom button colors correctly", () => {
    const customProps = {
      ...defaultProps,
      buttonColor: "bg-red-400",
      hoverColor: "hover:bg-red-600",
    };

    render(<ChartPageLayout {...customProps} />);

    const backLink = screen.getByRole("link");
    expect(backLink.className).toContain("bg-red-400");
    expect(backLink.className).toContain("hover:bg-red-600");
  });

  it("has responsive design classes", () => {
    render(<ChartPageLayout {...defaultProps} />);

    // Look for the main container div instead of main element
    const container = screen.getByText("Test Chart Title").closest("div");
    expect(container?.className).toContain("min-h-screen");

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toContain("text-2xl");
    expect(heading.className).toContain("md:text-3xl");
  });
});
