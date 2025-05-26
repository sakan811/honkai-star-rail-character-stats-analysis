import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "../../src/app/page";

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

describe("Navigation Integration", () => {
  it("home page has correct navigation links", () => {
    render(<Home />);

    const links = screen.getAllByRole("link");
    const linkHrefs = links.map((link) => link.getAttribute("href"));

    expect(linkHrefs).toContain("/hyacine");
    expect(linkHrefs).toContain("/castorice");
  });

  it("displays correct button text and styling", () => {
    render(<Home />);

    const hyacineButton = screen.getByRole("button", { name: /hyacine/i });
    const castoriceButton = screen.getByRole("button", { name: /castorice/i });

    expect(hyacineButton.className).toContain("bg-green-400");
    expect(hyacineButton.className).toContain("hover:bg-green-600");

    expect(castoriceButton.className).toContain("bg-purple-400");
    expect(castoriceButton.className).toContain("hover:bg-purple-600");
  });

  it("has responsive layout classes", () => {
    render(<Home />);

    const main = screen.getByRole("main");
    expect(main.className).toContain("max-w-4xl");
    expect(main.className).toContain("mx-auto");

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toContain("text-3xl");
    expect(heading.className).toContain("sm:text-4xl");
  });
});
