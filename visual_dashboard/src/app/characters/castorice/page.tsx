"use client";

import ChartPageLayout from "../../components/ChartPageLayout";
import CastoriceChart from "../../components/characters/CastoriceChart";

export default function CastoricePage() {
  return (
    <ChartPageLayout
      title="Castorice Newbud Energy Analysis"
      buttonColor="bg-purple-400"
      hoverColor="hover:bg-purple-600"
    >
      <CastoriceChart />
    </ChartPageLayout>
  );
}