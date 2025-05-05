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

// Example user interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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
  const userOptions: DropdownOption<User>[] = previewUserList.map(user => ({
    value: user.id,
    label: `${user.name} (${user.role})`,
    data: user
  }));

  // Find the currently selected option
  const selectedOption = selectedPreviewUser 
    ? {
        value: selectedPreviewUser.id,
        label: `${selectedPreviewUser.name} (${selectedPreviewUser.role})`,
        data: selectedPreviewUser
      } 
    : null;

    const handleSelectChange = (selected: DropdownOption<User> | null) => {
      if (selected) {
        setSelectedPreviewUser(selected.data);
      } else {
        setSelectedPreviewUser(null);
      }
    };


    // Mock fetch users (replace with your actual API call)
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Viewer' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Editor' },
        { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'Admin' },
      ];
      
      setPreviewUserList(mockUsers);
      
      // Optionally set default selection
      // setSelectedUser(mockUsers[0]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

        <SharedDropdown
          options={userOptions}
          value={selectedOption}
          onChange={handleSelectChange}
          isLoading={isLoading}
          placeholder="Select a user"
          noOptionsMessage={() => "No users available"}
          // Optional customizations
          className="text-base"
          isSearchable={true}
          darkMode={true}
        />

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
