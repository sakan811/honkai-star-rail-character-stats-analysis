"use client";

import Link from "next/link";
import HyacineChart from "../components/HyacineChart";

export default function HyacinePage() {
  return (
    <div className="flex flex-col items-center p-4 md:p-6 w-full h-full min-h-screen bg-gradient-to-b from-cyan-500 to-amber-200">
      <Link
        href="/"
        className="self-start mb-4 bg-green-400 hover:bg-green-600 text-slate-50 font-medium rounded px-4 py-2 transition-colors duration-200"
      >
        ← Back
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-slate-50 text-center">
        Hyacine A6 Trace Healing Bonus Analysis
      </h1>

      <div className="w-full max-w-5xl">
        <HyacineChart />
      </div>
    </div>
  );
}