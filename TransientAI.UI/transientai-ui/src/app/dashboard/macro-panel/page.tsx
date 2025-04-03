'use client'

import ProtectedRoute from "@/components/route-guards/protected-route";
import MacroPanelTabs from "@/components/macro-panel/macro-panel-tabs";

export default function Page() {
  // return <ProtectedRoute resourceName="risk-metrics">
  //   <RiskMetrics></RiskMetrics>
  // </ProtectedRoute>;

  return <ProtectedRoute>
    <MacroPanelTabs></MacroPanelTabs>
  </ProtectedRoute>;
}