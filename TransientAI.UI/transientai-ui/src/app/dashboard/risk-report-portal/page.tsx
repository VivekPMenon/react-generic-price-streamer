'use client'

import RiskReportsUploader from "@/components/risk-reports/risk-reports-uploader";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return <ProtectedRoute>
    <RiskReportsUploader></RiskReportsUploader>
  </ProtectedRoute>
}
