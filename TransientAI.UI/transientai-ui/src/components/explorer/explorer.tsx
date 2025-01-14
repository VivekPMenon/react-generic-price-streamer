'use client';

import { ActiveMenuData, MenuContextData, MenuInfo, menuInfoList } from '@/services/menu-data';
import styles from './explorer.module.scss';
import { useContext, useMemo, useState } from 'react';

export function Explorer() {

  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);

  const [selectedTab, setSelectedTab] = useState<string>('Daily Insights');

  function onParentMenuClick(selectedMenuInfo: MenuInfo) {
    const newMenuList: MenuInfo[] = [...activeMenuData?.activeMenuList!];

    if(!newMenuList.find(menu => menu.description === selectedMenuInfo.description)) {
      newMenuList.push(selectedMenuInfo);
    }

    setActiveMenuData!({
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
      selectedMenu: menuInfo
    });
  }

  return (
    <div className={styles.explorer}>
      Explorer

      <div className="menu">
        {
          menuInfoList.map(menuInfo => (
            <div className="menu-item" key={menuInfo.description}>
              <div className='parent-menu' onClick={() => onParentMenuClick(menuInfo)}>
                <span className={`icon ${menuInfo.icon}`}></span>
                <span className="text">{menuInfo.description}</span>
                <span className="badge">{menuInfo.badgeCount}</span>
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