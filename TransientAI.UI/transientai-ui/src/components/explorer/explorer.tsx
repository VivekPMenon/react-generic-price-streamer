'use client';

import { useMenuStore } from '@/services/menu-data';
import styles from './explorer.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuInfo } from '@/services/menu-data';

export interface NotificationsProps {
  onExpandCollapse?: (state: boolean) => void;
  onNavigate?: () => void;
}

export function Explorer(props: NotificationsProps) {
  const router = useRouter();
  const { activeMenuList, fullMenuList, selectedMenu, setActiveMenu } = useMenuStore();
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

  return (
    <div className={`${styles.explorer} widget`}>
      <div className="widget-title">
        Explorer
      </div>

      <div className="menu">
        {fullMenuList.map(menuInfo => (
          <div className="menu-item" key={menuInfo.description}>

            <div 
              className={`parent-menu ${menuInfo.description === selectedMenu?.description ? 'active' : ''}`}
              onClick={() => onMenuClick(menuInfo)}
            >
              <span className={`icon ${menuInfo.icon}`}></span>
              <span className="text">{menuInfo.description}</span>
              {menuInfo.badgeCount && menuInfo.badgeCount > 0 && (
                <span className="badge">{menuInfo.badgeCount}</span>
              )}
            </div>

            {menuInfo.children && menuInfo.children.map(childMenu => (
              <div className="submenu" key={childMenu.description}>
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