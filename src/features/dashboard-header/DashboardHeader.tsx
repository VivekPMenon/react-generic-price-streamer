import { SearchDataContext } from '../../business-services/search-data-context';
import { useCallback, useContext, useState } from 'react';

export function DashboardHeader() {
  const { searchData, setSearchData } = useContext(SearchDataContext);

  const onSearchTextChange = (event: any) => {
    // todo.. avoid null check usin proper types
    if (setSearchData) {
      setSearchData({ text: event.target.value });
    }
  };

  return (
    <div className="dashboard-header">
      {/* <div className='action-buttons'>
        <i className='far fa-refresh'></i>
      </div> */}

      <div className="search-box">
        <i className="fas fa-xs fa-search me-2"></i>
        <input
          type="search"
          className="form-control focus"
          placeholder="Search"
          value={searchData?.text}
          onChange={onSearchTextChange} />
      </div>

      <div className='action-buttons'>
        <i className="cil-settings"></i>
        <i className='fas fa-user-circle'></i>
        <i className='fas fa-ellipsis-v'></i>
      </div>
    </div>
  );
} 