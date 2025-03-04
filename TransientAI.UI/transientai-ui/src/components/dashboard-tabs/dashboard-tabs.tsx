'use client';

import styles from './dashboard-tabs.module.scss';
import { Box, Tabs } from "@radix-ui/themes";
import { TabInfo } from './model';
import { ReactNode, useContext, useMemo, useState } from 'react';
import { ActiveMenuData, MenuContextData, MenuInfo } from '@/services/menu-data';
import { useRouter } from 'next/navigation';
import { useDeviceType } from '@/lib/hooks';

export interface DashboardTabsProps {
  children?: ReactNode;
}

export function DashboardTabs({children}: DashboardTabsProps) {
  const defaultTab = 'Research Reports';

  const router = useRouter();

  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);
  const deviceType = useDeviceType();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const tabs = useMemo<TabInfo[]>(() => calculateTabs(activeMenuData!), [activeMenuData?.activeMenuList]);

  function calculateTabs(activeMenuData: ActiveMenuData) {
    const tabs: TabInfo[] = [
    ];

    if (!activeMenuData?.activeMenuList) {
      return tabs;
    }

    if(deviceType === 'mobile') {
      return [
        {
          description: activeMenuData?.selectedMenu?.description,
          route: activeMenuData?.selectedMenu?.route
        }
      ];
    }

    activeMenuData?.activeMenuList.forEach(menu => {
      tabs.push({
        description: menu.description,
        route: menu.route
      });
    });

    return tabs;
  }

  function selectTab(tab: TabInfo) {
    setActiveMenuData!({
      ...activeMenuData,
      selectedMenu: { description: tab.description }
    });

    router.push(tab.route!);
  }

  function closeTab(event: any, tab: TabInfo) {
    const newMenuList: MenuInfo[] = [...activeMenuData?.activeMenuList!];
    const index = newMenuList?.findIndex(menu => menu.description === tab.description);
    newMenuList?.splice(index!, 1);

    const newSelectedMenu = tab.description === activeMenuData?.selectedMenu?.description ? tabs[0] : activeMenuData?.selectedMenu;

    setActiveMenuData!({
      ...activeMenuData,
      activeMenuList: newMenuList,
      selectedMenu: newSelectedMenu
    });

    router.push(newSelectedMenu?.route!);
    event.stopPropagation();
  }

  return (
    <div className={`${styles['main-content']} widget ${isExpanded ? 'expanded' : ''}`}>
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

                {tab.description === defaultTab ? <></> :
                  <i className={`${styles['close-button']} fa-solid fa-xmark`} onClick={event => closeTab(event, tab)}></i>}
              </Tabs.Trigger>
            ))
          }

          {/* <div className={styles['expand-collapse-toggler']} onClick={() => setIsExpanded(!isExpanded)}>
            <i className='fa-solid fa-expand toggler'></i>
          </div> */}
        </Tabs.List>

        
        <Box pt="3" className='height-100p pb-15px'>
          {children}
        </Box>
      </Tabs.Root>
    </div>
  );
}