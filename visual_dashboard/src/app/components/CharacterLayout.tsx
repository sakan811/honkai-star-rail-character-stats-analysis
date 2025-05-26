import { SITE_DESCRIPTION, SITE_TITLE } from "@/app/constants";
import { Metadata } from "next";

interface CharacterLayoutProps {
  children: React.ReactNode;
  characterName: string;
}

export function createCharacterMetadata(characterName: string): Metadata {
  return {
    title: `${SITE_TITLE} - ${characterName} Analysis`,
    description: SITE_DESCRIPTION,
    openGraph: {
      title: `${SITE_TITLE} - ${characterName} Analysis`,
      description: SITE_DESCRIPTION,
    },
  };
}

export default function CharacterLayout({ children }: CharacterLayoutProps) {
  return <>{children}</>;
}