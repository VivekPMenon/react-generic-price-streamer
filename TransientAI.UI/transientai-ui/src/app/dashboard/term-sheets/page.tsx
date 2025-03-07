'use client'

import {TermSheets} from "@/components/term-sheets";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
  return <ProtectedRoute>
    <TermSheets></TermSheets>
  </ProtectedRoute>
}
