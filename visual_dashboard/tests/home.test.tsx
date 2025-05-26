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

  it("displays character buttons", () => {
    render(<Home />);
    const hyacineButton = screen.getByRole("button", { name: /hyacine/i });
    const castoriceButton = screen.getByRole("button", { name: /castorice/i });

    expect(hyacineButton).toBeDefined();
    expect(castoriceButton).toBeDefined();
  });

  it("has links to character pages", () => {
    render(<Home />);
    const links = screen.getAllByRole("link");
    const linkHrefs = links.map((link) => link.getAttribute("href"));

    expect(linkHrefs).toContain("/characters/hyacine");
    expect(linkHrefs).toContain("/characters/castorice");
  });
});
