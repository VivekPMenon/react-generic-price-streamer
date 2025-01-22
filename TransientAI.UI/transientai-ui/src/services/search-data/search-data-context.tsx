'use client';

import { createContext, useState } from "react";
import { SearchData, SearchDataContextType } from "./model";

export const SearchDataContext = createContext<SearchDataContextType>({
  searchData: {},
  setSearchData: () => { }
});

export function SearchDataContextProvider({ children }: any) {

  const [searchData, setSearchData] = useState<SearchData>({});

  return <SearchDataContext.Provider value={{ searchData, setSearchData }}>
    {children}
  </SearchDataContext.Provider>;
}