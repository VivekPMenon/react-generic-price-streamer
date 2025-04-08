'use client'

import InvestorRelations from "@/components/investor-relations/investor-relations";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return <ProtectedRoute>
    <InvestorRelations></InvestorRelations>
  </ProtectedRoute>;
}

