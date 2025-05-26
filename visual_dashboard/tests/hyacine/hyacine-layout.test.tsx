// hyacine-layout.test.tsx
import { describe, expect, it } from "vitest";
import HyacineLayout from "../../src/app/characters/hyacine/layout";

describe("Hyacine Layout", () => {
  it("passes children through correctly", () => {
    const testChild = <div data-testid="test-child">Test Content</div>;
    const layout = HyacineLayout({ children: testChild });

    // The layout should directly return the children within a fragment
    expect(layout.type).toBe(Symbol.for("react.fragment"));
    expect(layout.props.children).toBe(testChild);
  });
});
