'use client'

import ProtectedRoute from "@/components/route-guards/protected-route";
import MarketData from "@/components/market-data/market-data";

export default function Page() {
    return <ProtectedRoute>
        <MarketData></MarketData>
    </ProtectedRoute>;
}

