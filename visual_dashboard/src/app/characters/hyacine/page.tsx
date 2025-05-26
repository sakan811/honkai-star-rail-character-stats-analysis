"use client";

import ChartPageLayout from "../../components/ChartPageLayout";
import HyacineChart from "../../components/characters/HyacineChart";

export default function HyacinePage() {
  return (
    <ChartPageLayout
      title="Hyacine A6 Trace Healing Bonus Analysis"
      buttonColor="bg-green-400"
      hoverColor="hover:bg-green-600"
    >
      <HyacineChart />
    </ChartPageLayout>
  );
}
