'use client'

import ProtectedRoute from "@/components/route-guards/protected-route";
import PmsPnl from "@/components/pms-pnl/pms-pnl";

export default function Page() {
  return <ProtectedRoute>
    <PmsPnl></PmsPnl>
  </ProtectedRoute>;
}

