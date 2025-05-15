'use client'

import UserList from "@/components/admin-dashboard/manage-user/user-list";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
    return <ProtectedRoute>
        <UserList/>
    </ProtectedRoute>;
}