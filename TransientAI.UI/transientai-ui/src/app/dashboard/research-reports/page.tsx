'use client'
//src/app/dashboard/research-reports/page.tsx
import { ResearchReports } from "@/components/research-reports";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return <ProtectedRoute>
    <ResearchReports></ResearchReports>
  </ProtectedRoute>;
}

