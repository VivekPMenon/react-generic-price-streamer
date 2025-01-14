'use client';

import styles from './main-content-panel.module.scss';
import { Box, Tabs } from "@radix-ui/themes";
import { TabInfo } from './model';
import { useContext, useMemo, useState } from 'react';
import { ActiveMenuData, MenuContextData, MenuInfo } from '@/services/menu-data';
import { TodaysAxes } from '../axes/todays-axes';

export function MainContentPanel() {
  const defaultTab = 'Daily Insights';

  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);

  const tabs = useMemo<TabInfo[]>(() => calculateTabs(activeMenuData!), [activeMenuData]);

  function calculateTabs(activeMenuData: ActiveMenuData) {
    const tabs: TabInfo[] = [
      {
        description: defaultTab
      }
    ];

    if (!activeMenuData?.activeMenuList) {
      return tabs;
    }

    activeMenuData?.activeMenuList.forEach(menu => {
      tabs.push({
        description: menu.description
      });
    });

    return tabs;
  }

  function selectTab(tab: TabInfo) {
    setActiveMenuData!({
      activeMenuList: activeMenuData?.activeMenuList,
      selectedMenu: activeMenuData?.activeMenuList?.find(activeMenu => activeMenu.description === tab.description)
    });
  }

  function closeTab(tab: TabInfo) {
    const newMenuList: MenuInfo[] = [...activeMenuData?.activeMenuList!];
    const index = newMenuList?.findIndex(menu => menu.description === tab.description);
    newMenuList?.splice(index!, 1);

    const newSelectedMenu = tab.description === activeMenuData?.selectedMenu?.description ? newMenuList[0] : activeMenuData?.selectedMenu;

    setActiveMenuData!({
      activeMenuList: newMenuList,
      selectedMenu: newSelectedMenu
    });
  }

  return (
    <div className={styles['main-content']}>
      <Tabs.Root defaultValue={defaultTab} 
        value={activeMenuData?.selectedMenu?.description} 
        className='height-100p'
        >
        <Tabs.List>
          {
            tabs.map(tab => (
              <Tabs.Trigger value={tab.description!}
                onClick={() => selectTab(tab)} key={tab.description}>
                {tab.description}

                {tab.description === defaultTab ? <></> : <i className={`${styles['close-button']} fa-solid fa-xmark`} onClick={() => closeTab(tab)}></i>}
              </Tabs.Trigger>
            ))
          }
        </Tabs.List>

        {/* TODO... Use Router here so that dynamical loading of components can be done */}
        <Box pt="3" className='height-100p pb-15px'>
          <Tabs.Content value={defaultTab} className='height-100p'>
            <div className='height-100p tab-content'>
              <TodaysAxes></TodaysAxes>
            </div>
          </Tabs.Content>

          <Tabs.Content value="documents">

          </Tabs.Content>

          <Tabs.Content value="settings">

          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}