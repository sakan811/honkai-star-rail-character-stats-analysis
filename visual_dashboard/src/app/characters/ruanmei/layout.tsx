import CharacterLayout, {
  createCharacterMetadata,
} from "../../components/CharacterLayout";

export const metadata = createCharacterMetadata("Ruan Mei");

export default function RuanMeiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CharacterLayout characterName="Ruan Mei">{children}</CharacterLayout>;
}
