"use client";

import { PmsLive } from "@/components/hurricane-pms";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return (
    <ProtectedRoute resourceName = 'Hurricane PMS'>
      <PmsLive />
    </ProtectedRoute>
  );
};
