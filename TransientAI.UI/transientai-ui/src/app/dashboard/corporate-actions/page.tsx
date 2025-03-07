'use client'

import { CorporateActions } from "@/components/corporate-actions/corporate-actions";
import ProtectedRoute from "@/components/route-guards/protected-route";
import { useUserContextStore } from "@/services/user-context";

export default function Page() {
  return <ProtectedRoute>
    <CorporateActions></CorporateActions>
  </ProtectedRoute>;
}

