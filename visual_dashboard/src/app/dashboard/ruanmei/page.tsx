import { SITE_DESCRIPTION, SITE_TITLE } from "@/app/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RuanMeiPage() {
  return (
    <div className="flex flex-col items-center p-6 w-full h-full min-h-screen">
      <a
        href="/dashboard"
        className="self-start mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded px-4 py-2 transition-colors duration-200"
      >
        ← Back
      </a>
      <iframe
        className="w-[140vh] h-[80vh] border-0"
        src="https://lookerstudio.google.com/embed/reporting/4b4d106c-9fb0-4051-9fdc-055fcb362492/page/9R4IF"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Anaxa Looker Studio Dashboard"
      />
    </div>
  );
}
