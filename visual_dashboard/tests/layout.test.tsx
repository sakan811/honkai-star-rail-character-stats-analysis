import { describe, expect, it } from "vitest";
import RootLayout from "../src/app/layout";

describe("Root Layout", () => {
  it("has correct structure with proper classes", () => {
    // Create test child content
    const testChild = <div data-testid="test-child">Test Content</div>;

    // Get the component structure directly without rendering to DOM
    const layout = RootLayout({ children: testChild });

    // Verify HTML structure - html > body > content
    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe("en");

    // Verify body classes
    const body = layout.props.children;
    expect(body.type).toBe("body");
    expect(body.props.className).toContain("antialiased");

    // Font classes from mocked implementation
    expect(body.props.className).toContain("mocked-font-geist");
    expect(body.props.className).toContain("mocked-font-geist-mono");

    // Children should be passed through correctly
    expect(body.props.children).toBe(testChild);
  });
});

// This test for metadata would typically be done in an integration test
// as Next.js metadata handling is not easily testable in unit tests
describe("Metadata", () => {
  it("exports correct metadata object", async () => {
    const { metadata } = await import("../src/app/layout");
    expect(metadata.title).toBe(
      "Honkai: Star Rail Character Stats Analysis",
    );
    expect(metadata.description).toBe(
      "Analyze Honkai: Star Rail's characters stats based on different scenarios or their abilities.",
    );
  });
});
