import { useContext } from 'react';
import styles from './header.module.scss';
import { SearchDataContext } from '@/services/search-data';

export function Header() {

  const { searchData, setSearchData } = useContext(SearchDataContext);

  return (
    <header>
      <div className={styles.title}>
        <img src="/images/logo.png" />
        TransientAI
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

      <div className='profile-pic'>
        VM
      </div>
    </header>
  );
}