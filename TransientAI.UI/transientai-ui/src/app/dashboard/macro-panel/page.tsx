'use client'

import { MacroPanel } from "@/components/macro-panel/macro-panel";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  // return <ProtectedRoute resourceName="risk-metrics">
  //   <RiskMetrics></RiskMetrics>
  // </ProtectedRoute>;

  return <ProtectedRoute>
    <MacroPanel></MacroPanel>
  </ProtectedRoute>;
}