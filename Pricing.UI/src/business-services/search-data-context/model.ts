import { Dispatch, SetStateAction } from 'react';

export interface SearchData {
  text?: string;
}

export interface SearchDataContextType {
  searchData?: SearchData;
  setSearchData?: Dispatch<SetStateAction<SearchData>>;
}