'use client'

import { BreakingNews } from "@/components/breaking-news";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
    return <ProtectedRoute>
      <BreakingNews isExpanded={true}></BreakingNews>
    </ProtectedRoute>;
}