'use client'

import RiskMetrics from "@/components/risk-metrics/risk-metrics";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  // return <ProtectedRoute resourceName="risk-metrics">
  //   <RiskMetrics></RiskMetrics>
  // </ProtectedRoute>;

  return <ProtectedRoute>
    <RiskMetrics></RiskMetrics>
  </ProtectedRoute>;
}