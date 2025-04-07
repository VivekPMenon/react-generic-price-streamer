"use client";

import { HurricanePms } from "@/components/hurricane-pms";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return (
    <ProtectedRoute>
      <HurricanePms />
    </ProtectedRoute>
  );
};
