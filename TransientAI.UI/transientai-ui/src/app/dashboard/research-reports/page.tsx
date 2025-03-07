'use client'

import { ResearchReports } from "@/components/research-reports";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return <ProtectedRoute>
    <ResearchReports></ResearchReports>
  </ProtectedRoute>;
}

