'use client'

import { RiskReports } from "@/components/risk-reports/risk-reports";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return <ProtectedRoute>
    <RiskReports></RiskReports>
  </ProtectedRoute>
}
