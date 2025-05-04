"use client";
import { Metadata } from "next";
import Link from "next/link";
import { SITE_DESCRIPTION, SITE_TITLE } from "../layout";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function DashboardPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors duration-200 text-sm shadow"
        >
          Back to Home
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Character Dashboards</h2>
        <div className="flex justify-center gap-4">
          <a
            href="/dashboard/anaxa"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 text-lg shadow"
          >
            Anaxa
          </a>
          <a
            href="/dashboard/castorice"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 text-lg shadow"
          >
            Castorice
          </a>
          <a
            href="/dashboard/ruanmei"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 text-lg shadow"
          >
            Ruan Mei
          </a>
        </div>
      </div>
    </main>
  );
}
