'use client'

import { useContext } from 'react';
import styles from './header.module.scss';
import { SearchDataContext } from '@/services/search-data';
import { useDeviceType } from '@/lib/hooks';
import { useUserContextStore } from '@/services/user-context';
import ProfilePopover from './profile-popover';
import Image from 'next/image';
import { menuStore } from '@/services/menu-data';
export interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuVisible?: boolean;
}

export function Header({ onMenuToggle, isMenuVisible }: HeaderProps) {

  const { searchData, setSearchData } = useContext(SearchDataContext);
  const { userContext } = useUserContextStore();
  const deviceType = useDeviceType();
  const selectedMenu = menuStore.use.selectedMenu();

  return (
    <header>
      <div className={styles.title} onClick={onMenuToggle}>
        {
          deviceType === 'mobile' ?
            <div className={`${styles['hamburger-menu']} ${isMenuVisible ? styles.active : ''}`}>
              <i className='fa-solid fa-bars'></i>
            </div>
            :
            <img src="/images/TRANS_H_white-on-transparent.png" />
        }
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
      {selectedMenu?.id === 'hurricane-pms' && deviceType !== 'mobile' && <div>
          <Image 
            alt="Hurricane logo"
            src="/images/hurricane_logo.png" 
            className='absolute right-1/2 top-1'
            width={120}
            height={50}
          />
      </div>}

      {/* // todo remove inlines tyling */}
      <div className='flex'>
        {/* <div className={styles['welcome-message']}>
          Hi {userContext?.userName}
        </div> */}

        <div className={styles['client-logo']}>
          <img src="/images/HurricaneLogo_Brightened.png" />
          <span>HURRICANE CAPITAL</span>
          {/* {userContext?.userId} */}
        </div>

        {
          !userContext.token ?
            <div className='profile-pic'>
              <img src="/images/ProfilePic.jpeg"></img>
            </div>
            :
            <ProfilePopover userContext={userContext}></ProfilePopover>
        }

        {/* 
        <div className='profile-pic'>
          <img src="/images/ProfilePicAI.png"></img>
        </div> */}
      </div>
    </header>
  );
}
