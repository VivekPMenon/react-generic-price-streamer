'use client'

import { NotesAi } from "@/components/notes-ai/notes-ai";
import ProtectedRoute from "@/components/route-guards/protected-route";

export default function Page() {
    return <ProtectedRoute>
        <NotesAi></NotesAi>
    </ProtectedRoute>;
}

