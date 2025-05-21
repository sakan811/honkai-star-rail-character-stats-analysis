// visual_dashboard\src\app\hyacine\layout.tsx
import { SITE_DESCRIPTION, SITE_TITLE } from "@/app/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_TITLE} - Hyacine Analysis`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_TITLE} - Hyacine Analysis`,
    description: SITE_DESCRIPTION,
  },
};

export default function HyacineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
