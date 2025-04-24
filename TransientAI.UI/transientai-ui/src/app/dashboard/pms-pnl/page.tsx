'use client'

import ProtectedRoute from "@/components/route-guards/protected-route";
import PmsPnl from "@/components/pms-pnl/pms-pnl";

export default function Page() {
  return <ProtectedRoute resourceName="pms-pnl">
    <PmsPnl></PmsPnl>
  </ProtectedRoute>;
}

