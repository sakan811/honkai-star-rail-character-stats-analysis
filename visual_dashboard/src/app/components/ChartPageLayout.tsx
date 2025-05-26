"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ChartPageLayoutProps {
  title: string;
  buttonColor: string;
  hoverColor: string;
  children: ReactNode;
}

export default function ChartPageLayout({
  title,
  buttonColor,
  hoverColor,
  children,
}: ChartPageLayoutProps) {
  return (
    <div className="flex flex-col items-center p-4 md:p-6 w-full h-full min-h-screen bg-gradient-to-b from-cyan-500 to-amber-200">
      <Link
        href="/"
        className={`self-start mb-4 ${buttonColor} ${hoverColor} text-slate-50 font-medium rounded px-4 py-2 transition-colors duration-200`}
      >
        ← Back
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-slate-50 text-center">
        {title}
      </h1>

      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}
