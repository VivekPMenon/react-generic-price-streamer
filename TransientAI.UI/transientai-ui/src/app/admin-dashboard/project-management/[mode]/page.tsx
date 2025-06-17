'use client'

import ManageProject from "@/components/admin-dashboard/manage-project/manage-project";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
    return <ProtectedRoute>
        <ManageProject/>
    </ProtectedRoute>;
}