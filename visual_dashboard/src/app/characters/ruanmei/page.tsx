"use client";

import ChartPageLayout from "../../components/ChartPageLayout";
import RuanMeiChart from "../../components/characters/RuanMeiChart";

export default function RuanMeiPage() {
  return (
    <ChartPageLayout
      title="Ruan Mei A6 Break Effect Damage Analysis"
      buttonColor="bg-rose-400"
      hoverColor="hover:bg-rose-600"
    >
      <RuanMeiChart />
    </ChartPageLayout>
  );
}
