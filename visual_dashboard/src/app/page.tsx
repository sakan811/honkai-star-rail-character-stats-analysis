import { Metadata } from "next";
import Link from "next/link";
import { SITE_TITLE, SITE_DESCRIPTION } from "./constants";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-500 to-amber-200">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-8 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center w-full text-slate-50">
          Honkai: Star Rail Character Stats Analysis
        </h1>
        <p className="text-2xl mb-10 text-center text-slate-50">
          Analyze Honkai: Star Rail characters stats based on different
          scenarios.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/hyacine">
            <button className="bg-green-400 hover:bg-green-600 text-slate-50 font-semibold rounded-lg px-8 py-3 text-lg shadow transition-colors duration-200">
              Hyacine
            </button>
          </Link>
          <Link href="/castorice">
            <button className="bg-purple-400 hover:bg-purple-600 text-slate-50 font-semibold rounded-lg px-8 py-3 text-lg shadow transition-colors duration-200">
              Castorice
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}