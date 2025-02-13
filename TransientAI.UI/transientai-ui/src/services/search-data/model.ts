
export interface SearchData {
  id?: string;
  description?: string;
  type?: string;
}

export interface SearchDataContextType {
  searchData: SearchData;
  setSearchData: (searchDate: SearchData) => void;
}