import { describe, expect, it } from "vitest";
import CastoriceLayout from "../../src/app/characters/castorice/layout";

describe("Castorice Layout", () => {
  it("passes children through correctly", () => {
    const testChild = (
      <div data-testid="castorice-content">Castorice Content</div>
    );
    const layout = CastoriceLayout({ children: testChild });

    expect(layout.type).toBe(Symbol.for("react.fragment"));
    expect(layout.props.children).toBe(testChild);
  });
});
