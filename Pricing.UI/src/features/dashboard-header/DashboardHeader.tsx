import { Typeahead } from 'react-bootstrap-typeahead';
import { SearchDataContext } from '../../business-services/search-data-context';
import { useCallback, useContext, useState } from 'react';

export function DashboardHeader() {
  const { searchData, setSearchData } = useContext(SearchDataContext);
  const options = [
    "74403274", "164657609", "198937939", "205878837", "208709802",
    "281055836", "313507812", "338449368", "366874747", "402035356",
    "403493067", "419036658", "422519389", "488397629", "506698256",
    "616608883", "627278364", "629781898", "671103820", "677596423",
    "710849898", "750809588", "762750765", "851592056", "854608654",
    "856944332", "862560647", "881679528", "908316216"
  ];

  const onSearchTextChange = (event: any) => {
    // todo.. avoid null check usin proper types
    if (setSearchData) {
      setSearchData({ text: event });
    }
  };

  return (
    <div className="dashboard-header">
      {/* <div className='action-buttons'>
        <i className='far fa-refresh'></i>
      </div> */}

      <div className="search-box">
        <i className="fas fa-xs fa-search me-2"></i>        
        <Typeahead
          labelKey="name"
          onChange={onSearchTextChange}
          options={options}
          placeholder="Choose a Security"
          multiple
        />
      </div>

      <div className='action-buttons'>
        <i className="cil-settings"></i>
        <i className='fas fa-user-circle'></i>
        <i className='fas fa-ellipsis-v'></i>
      </div>
    </div>
  );
} 