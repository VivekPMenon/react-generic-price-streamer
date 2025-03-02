'use client'

import { CorporateActions } from "@/components/corporate-actions/corporate-actions";
import { useUserContextStore } from "@/services/user-context";

export default function Page() {
  const { userContext } = useUserContextStore();

  return <CorporateActions></CorporateActions>
}