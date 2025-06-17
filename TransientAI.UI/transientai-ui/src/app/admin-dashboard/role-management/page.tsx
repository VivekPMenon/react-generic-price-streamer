'use client'

import RoleList from "@/components/admin-dashboard/manage-role/role-list";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
    return <ProtectedRoute>
        <RoleList/>
    </ProtectedRoute>;
}