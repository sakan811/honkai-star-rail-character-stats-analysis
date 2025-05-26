import CharacterLayout, { createCharacterMetadata } from "../../components/CharacterLayout";

export const metadata = createCharacterMetadata("Castorice");

export default function CastoriceLayout({ children }: { children: React.ReactNode }) {
  return <CharacterLayout characterName="Castorice">{children}</CharacterLayout>;
}