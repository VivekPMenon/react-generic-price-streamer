import { useContext } from 'react';
import styles from './header.module.scss';
import { SearchDataContext } from '@/services/search-data';

export function Header() {

  const { searchData, setSearchData } = useContext(SearchDataContext);

  return (
    <header>
      <div className={styles.title}>
        <img src="/images/HurricaneLogo_Brightened.png" />
        HURRICANE CAPITAL
      </div>

      <div className={styles['global-search']}>
        {/* {
          searchData?.description ?
            <div className={styles['search-pill']}>
              {searchData.description}

              <i className='fa-solid fa-x'></i>
            </div>
            :
            <>
              <i className='fa-solid fa-magnifying-glass'></i>
              'Search for Instrument by Name or ID'
            </>
        } */}
        {
          searchData.description ?
            <>
              Selected Security:
              <div className={styles['selected-security']}>
                {searchData.description}

                <i className='fa-regular fa-x' onClick={() => setSearchData({})}></i>
              </div>
            </> : <></>
        }

      </div>

      <div style={{display: 'flex', gap: '10px'}}>
        {/* <img src="/images/HurricaneLogo.png" width='80px' height='85px'/> */}
        <div className='profile-pic'>
          VM
        </div>
      </div>
    </header>
  );
}