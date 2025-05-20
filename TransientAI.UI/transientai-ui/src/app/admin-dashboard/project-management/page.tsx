'use client'

import ManageProject from "@/components/admin-dashboard/manage-project/manage-project";
import ProjectList from "@/components/admin-dashboard/manage-project/project-list";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
    return <ProtectedRoute>
        {/* <ProjectList/> */}
        <ManageProject/>
    </ProtectedRoute>;
}