'use client';

import {Mode, menuStore} from '@/services/menu-data';
import styles from './explorer.module.scss';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { MenuInfo } from '@/services/menu-data';
import { useUserContextStore } from '@/services/user-context';
import { Skeleton } from '@radix-ui/themes';
export interface NotificationsProps {
  onExpandCollapse?: (state: boolean) => void;
  onNavigate?: () => void;
  mode: Mode;
}

export function Explorer(props: NotificationsProps) {
  const router = useRouter();

  const initializeMenus = menuStore.use.initializeMenus();
  const fullMenuList = menuStore.use.fullMenuList();
  const selectedMenu = menuStore.use.selectedMenu();
  const isLoading = menuStore.use.isLoading();
  const setActiveMenu = menuStore.use.setActiveMenu();
  const { userContext } = useUserContextStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const hurricanePmsView = 'hurricane-pms';

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse?.(!isExpanded);
  }

  function onMenuClick(selectedMenuInfo: MenuInfo) {
    setActiveMenu(selectedMenuInfo);
    router.push(selectedMenuInfo.route || '/');
    props.onNavigate?.();
  }

  useEffect(() => {
    initializeMenus(props.mode);
  }, [props.mode,initializeMenus])
  
  return (
    <div className={`${styles.explorer} widget`}>
      <div className="widget-title">
        Explorer
      </div>

      <div className="menu">
        {isLoading ? ( 
          <div className='w-full gap-4 grid grid-cols-1 justify-center p-4'>
            <Skeleton height={"20px"} width={"100%"} />
            <Skeleton height={"20px"} width={"100%"} />
            <Skeleton height={"20px"} width={"100%"} />
            <Skeleton height={"20px"} width={"100%"} />
            <Skeleton height={"20px"} width={"100%"} />
            <Skeleton height={"20px"} width={"100%"} />
            <Skeleton height={"20px"} width={"100%"} />
          </div>
        ) : (
          fullMenuList.length > 0 ? fullMenuList.map(menuInfo => (
            <div className="menu-item" key={menuInfo.id}>
              <div 
                className={`parent-menu ${menuInfo.id === selectedMenu?.id ? 'active' : ''}`}
                onClick={() => onMenuClick(menuInfo)}
              >
                <span className={`icon ${menuInfo.icon}`}></span>
                {selectedMenu?.key !== hurricanePmsView && <span className="text">{menuInfo.description}</span>}
                {menuInfo.badgeCount && menuInfo.badgeCount > 0 && (
                  <span className="badge">{menuInfo.badgeCount}</span>
                )}
              </div>

              {menuInfo.children && menuInfo.children.map(childMenu => (
                <div className="submenu" key={childMenu.id}>
                  <div className="submenu-item" onClick={() => onMenuClick(childMenu)}>
                    {childMenu.description}
                    <span className="timestamp">{childMenu.subDescription}</span>
                  </div>
                </div>
              ))}
            </div>
          )) : (
            <div className="text-center">
              No menu items found.
            </div>
          )
        )}
      </div>
    </div>
  );
}