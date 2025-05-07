'use client'

import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './header.module.scss';
import { SearchDataContext } from '@/services/search-data';
import { useDeviceType } from '@/lib/hooks';
import { useUserContextStore } from '@/services/user-context';
import ProfilePopover from './profile-popover';
import Image from 'next/image';
import { menuStore } from '@/services/menu-data';
import SharedDropdown, { DropdownOption } from '../shared/ta-select/ta-select';
import { userService } from '@/services/user-context/user-service';

// Example user interface
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_external: boolean;
  role_id: number;
  is_superadmin: boolean;
  full_name: string
}

export interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuVisible?: boolean;
}

 
export function Header({ onMenuToggle, isMenuVisible }: HeaderProps) {

  const { searchData, setSearchData } = useContext(SearchDataContext);
  const { userContext } = useUserContextStore();
  const deviceType = useDeviceType();
  const selectedMenu = menuStore.use.selectedMenu();
  const [previewUserList, setPreviewUserList] = useState<User[]>([]);
  const [selectedPreviewUser, setSelectedPreviewUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert users to dropdown options format
  const userOptions = useCallback(() => {
    return Array.isArray(previewUserList)
      ? previewUserList.map(user => ({
          value: user.id,
          label: user.full_name,
          data: user
        }))
      : [];
  }, [previewUserList]);

  // Find the currently selected option
  const selectedOption = useCallback(() => {
    if (!selectedPreviewUser) return null;

    return {
      value: selectedPreviewUser.id,
      label: selectedPreviewUser.full_name,
      data: selectedPreviewUser
    };
  }, [selectedPreviewUser]);

  const handleSelectChange = useCallback((selected: DropdownOption<User> | null) => {
    try {
      if (selected) {
        setSelectedPreviewUser(selected.data);
        userService.savePreviewUserRoleId(selected.value.toString());
      } else {
        setSelectedPreviewUser(null);
        userService.savePreviewUserRoleId('');
      }
      window.location.reload();
    } catch (err) {
      console.error('Error changing preview user:', err);
    }
  }, []);

  // Fetch users with proper error handling
  const fetchUsers = useCallback(async () => {
    if (!userContext?.userInfo?.superadmin) return;

    setIsLoading(true);
    try {
      const response = await userService.getUserList();

      if (!response) {
        throw new Error('No users returned from API');
      }

      setPreviewUserList(response);

      // Initialize selected preview user from stored ID
      const previewId = userService.getPreviewUserRoleId();
      if (previewId) {
        const previewUser = response.find((user: User) => user.id === parseInt(previewId));
        if (previewUser) {
          setSelectedPreviewUser(previewUser);
        } else {
          // Handle case where stored ID doesn't match any user
          userService.savePreviewUserRoleId('');
        }
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setPreviewUserList([]);
    } finally {
      setIsLoading(false);
    }
  }, [userContext?.userInfo?.superadmin]);

  // Load users on component mount if user is superadmin
  useEffect(() => {
    if (userContext?.userInfo?.superadmin) {
      fetchUsers();
    }
  }, [fetchUsers, userContext?.userInfo?.superadmin]);


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
      {selectedMenu?.key === 'hurricane-pms' && deviceType !== 'mobile' && <div>
          <Image 
            alt="Hurricane logo"
            src="/images/hurricane_logo.png" 
            className='absolute right-1/2 top-1'
            width={120}
            height={50}
          />
      </div>}

      {/* // todo remove inlines tyling */}
      <div className='flex gap-2'>
        {/* <div className={styles['welcome-message']}>
          Hi {userContext?.userName}
        </div> */}
        {
         userContext?.userInfo?.superadmin && <SharedDropdown
            options={userOptions()}
            value={selectedOption()}
            onChange={handleSelectChange}
            isLoading={isLoading}
            placeholder="Select a user"
            noOptionsMessage={() => "No users available"}
            // Optional customizations
            className="text-base"
            isSearchable={true}
            darkMode={true}
          />
        }

        <div className={styles['client-logo']}>
          <img src="/images/HurricaneLogo_Brightened.png"  alt='logo'/>
          <span>HURRICANE CAPITAL</span>
          {/* {userContext?.userId} */}
        </div>

        {
          !userContext.token ?
            <div className='profile-pic'>
              <img src="/images/ProfilePic.jpeg" alt='profile'></img>
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
