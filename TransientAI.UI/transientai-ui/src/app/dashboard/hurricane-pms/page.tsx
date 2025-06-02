"use client";

import { PmsLive } from "@/components/hurricane-pms";
import { PmsLiveNew } from "@/components/pms-live-new";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {

  return (
    <ProtectedRoute resourceName = 'Hurricane PMS'>
      {/* <PmsLive /> */}
      <PmsLiveNew></PmsLiveNew>
    </ProtectedRoute>
  );
};
