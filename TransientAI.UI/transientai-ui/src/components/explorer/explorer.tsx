'use client';

import { ActiveMenuData, MenuContextData, MenuInfo } from '@/services/menu-data';
import styles from './explorer.module.scss';
import { useContext, useMemo, useState } from 'react';

export interface NotificationsProps {
  onExpandCollapse: (state: boolean) => void;
}

export function Explorer(props: NotificationsProps) {

  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse(!isExpanded);
  }

  function onParentMenuClick(selectedMenuInfo: MenuInfo) {
    const newMenuList: MenuInfo[] = [...activeMenuData?.activeMenuList!];

    if (!newMenuList.find(menu => menu.description === selectedMenuInfo.description)) {
      newMenuList.push(selectedMenuInfo);
    }

    setActiveMenuData!({
      ...activeMenuData,
      activeMenuList: newMenuList,
      selectedMenu: selectedMenuInfo
    });
  }

  function onChildMenuClick(menuInfo: MenuInfo) {
    setActiveMenuData!({
      activeMenuList: [
        ...activeMenuData?.activeMenuList!,
        menuInfo
      ],
      fullMenuLIst: activeMenuData?.fullMenuLIst,
      selectedMenu: menuInfo
    });
  }

  return (
    <div className={`${styles.explorer} widget`}>
      <div className='widget-title'>
        Explorer
        <i className='fa-solid fa-expand toggler' onClick={() => expandOrCollapsePanel()}></i>
      </div>

      <div className="menu">
        {
          activeMenuData?.fullMenuLIst?.map(menuInfo => (
            <div className="menu-item" key={menuInfo.description}>

              <div className={`parent-menu ${menuInfo.description === activeMenuData?.selectedMenu?.description ? 'active' : ''}`}
                onClick={() => onParentMenuClick(menuInfo)}>
                <span className={`icon ${menuInfo.icon}`}></span>
                <span className="text">{menuInfo.description}</span>
                {menuInfo.badgeCount! > 0 ? <span className="badge">{menuInfo.badgeCount}</span> : <></>}
              </div>

              {
                menuInfo.children ? menuInfo.children.map(childMenu => (
                  <div className="submenu" key={childMenu.description}>
                    <div className="submenu-item" onClick={() => onChildMenuClick(menuInfo)}>
                      {childMenu.description}
                      <span className="timestamp">{childMenu.subDescription}</span>
                    </div>
                  </div>
                )) : <></>
              }

            </div>
          ))
        }
      </div>

    </div>
  )
}