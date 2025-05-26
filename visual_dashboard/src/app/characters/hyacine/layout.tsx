import CharacterLayout, { createCharacterMetadata } from "../../components/CharacterLayout";

export const metadata = createCharacterMetadata("Hyacine");

export default function HyacineLayout({ children }: { children: React.ReactNode }) {
  return <CharacterLayout characterName="Hyacine">{children}</CharacterLayout>;
}