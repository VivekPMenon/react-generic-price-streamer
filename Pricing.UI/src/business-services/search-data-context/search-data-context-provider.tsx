import { createContext, useState, ReactNode } from "react";
import { SearchData, SearchDataContextType } from "./model";

interface SearchDataContextProps {
  children?: ReactNode;
}

export const SearchDataContext = createContext<SearchDataContextType>({});

export function SearchDataContextProvider({ children }: SearchDataContextProps) {
  const [searchData, setSearchData] = useState<SearchData>({text: ''});

  return (
    <SearchDataContext.Provider value={{ searchData, setSearchData }} >
      {children}
    </SearchDataContext.Provider>
  );
}