'use client';

import {Mode, useMenuStore} from '@/services/menu-data';
import styles from './explorer.module.scss';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { MenuInfo } from '@/services/menu-data';

export interface NotificationsProps {
  onExpandCollapse?: (state: boolean) => void;
  onNavigate?: () => void;
  mode: Mode;
}

export function Explorer(props: NotificationsProps) {
  const router = useRouter();
  const { initializeMenus, fullMenuList, selectedMenu, setActiveMenu } = useMenuStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
  }, [props.mode])

  return (
    <div className={`${styles.explorer} widget`}>
      <div className="widget-title">
        Explorer
      </div>

      <div className="menu">
        {fullMenuList.map(menuInfo => (
          <div className="menu-item" key={menuInfo.id}>

            <div 
              className={`parent-menu ${menuInfo.id === selectedMenu?.id ? 'active' : ''}`}
              onClick={() => onMenuClick(menuInfo)}
            >
              <span className={`icon ${menuInfo.icon}`}></span>
              <span className="text">{menuInfo.description}</span>
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
        ))}
      </div>
    </div>
  );
}