import { describe, expect, it } from "vitest";
import CharacterLayout, {
  createCharacterMetadata,
} from "../../src/app/components/CharacterLayout";

describe("CharacterLayout Component", () => {
  it("renders children correctly", () => {
    const testChild = (
      <div data-testid="character-content">Character Content</div>
    );
    const layout = CharacterLayout({
      children: testChild,
      characterName: "TestCharacter",
    });

    expect(layout.type).toBe(Symbol.for("react.fragment"));
    expect(layout.props.children).toBe(testChild);
  });

  it("handles different character names", () => {
    const testChild = <div>Test</div>;
    const layout1 = CharacterLayout({
      children: testChild,
      characterName: "Hyacine",
    });
    const layout2 = CharacterLayout({
      children: testChild,
      characterName: "Castorice",
    });

    expect(layout1.props.children).toBe(testChild);
    expect(layout2.props.children).toBe(testChild);
  });
});

describe("createCharacterMetadata function", () => {
  it("creates correct metadata for character", () => {
    const metadata = createCharacterMetadata("Hyacine");

    expect(metadata.title).toBe(
      "Honkai: Star Rail Character Stats Analysis - Hyacine Analysis",
    );
    expect(metadata.description).toBe(
      "Analyze Honkai: Star Rail's characters stats based on different scenarios or their abilities.",
    );
    expect(metadata.openGraph?.title).toBe(
      "Honkai: Star Rail Character Stats Analysis - Hyacine Analysis",
    );
    expect(metadata.openGraph?.description).toBe(
      "Analyze Honkai: Star Rail's characters stats based on different scenarios or their abilities.",
    );
  });

  it("handles different character names", () => {
    const castoriceMeta = createCharacterMetadata("Castorice");
    const ruanMeiMeta = createCharacterMetadata("Ruan Mei");

    expect(castoriceMeta.title).toBe(
      "Honkai: Star Rail Character Stats Analysis - Castorice Analysis",
    );
    expect(ruanMeiMeta.title).toBe(
      "Honkai: Star Rail Character Stats Analysis - Ruan Mei Analysis",
    );
  });

  it("handles empty character name", () => {
    const metadata = createCharacterMetadata("");

    expect(metadata.title).toBe(
      "Honkai: Star Rail Character Stats Analysis -  Analysis",
    );
    expect(metadata.description).toBeDefined();
  });
});
