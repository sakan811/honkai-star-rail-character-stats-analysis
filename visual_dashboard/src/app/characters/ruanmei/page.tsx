"use client";

import ChartPageLayout from "../../components/ChartPageLayout";
import RuanMeiChart from "../../components/characters/RuanMeiChart";

export default function RuanMeiPage() {
  return (
    <ChartPageLayout
      title="Ruan Mei A6 Trace Break Effect Analysis"
      buttonColor="bg-blue-400"
      hoverColor="hover:bg-blue-600"
    >
      <RuanMeiChart />
    </ChartPageLayout>
  );
}
