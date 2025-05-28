// constants.test.ts
import { describe, expect, it } from "vitest";
import { SITE_TITLE, SITE_DESCRIPTION } from "../src/app/constants";

describe("Constants", () => {
  it("exports the correct site title", () => {
    expect(SITE_TITLE).toBe("Honkai: Star Rail Character Stats Analysis");
  });

  it("exports the correct site description", () => {
    expect(SITE_DESCRIPTION).toBe(
      "Analyze Honkai: Star Rail's characters stats based on different scenarios or their abilities.",
    );
  });
});
