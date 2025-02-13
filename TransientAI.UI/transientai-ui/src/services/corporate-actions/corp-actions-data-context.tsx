'use client';

import { createContext, useState } from "react";
import { CorpActionsData, CorpActionsDataContextType } from "./model";

export const CorpActionsDataContext = createContext<CorpActionsDataContextType>({
  corpActionsData: {
    corpActions: []
  },
  setCorpActionsData: () => { }
});

export function CorpActionsDataContextProvider({ children }: any) {

  const [corpActionsData, setCorpActionsData] = useState<CorpActionsData>({});

  return <CorpActionsDataContext.Provider value={{ corpActionsData, setCorpActionsData }}>
    {children}
  </CorpActionsDataContext.Provider>
}