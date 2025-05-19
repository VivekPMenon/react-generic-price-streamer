'use client';

import styles from './dashboard-tabs.module.scss';
import { Box, Tabs } from '@radix-ui/themes';
import { TabInfo } from './model';
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceType } from '@/lib/hooks';
import { unseenItemsStore } from '@/services/unseen-items-store/unseen-items-store';
import { menuStore } from '@/services/menu-data';

export interface DashboardTabsProps {
  children?: ReactNode;
}

export function DashboardTabs({ children }: DashboardTabsProps) {
  const router = useRouter();
  const deviceType = useDeviceType();

  const unseen = unseenItemsStore.use.unseenItems();
  const resetUnseenItems = unseenItemsStore.use.resetUnseenItems();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const previousSelectedMenu = useRef<string|undefined>(undefined);
  const activeMenuList = menuStore.use.activeMenuList();
  const selectedMenu = menuStore.use.selectedMenu();
  const setActiveMenu = menuStore.use.setActiveMenu();
  const closeTab = menuStore.use.closeTab();
  const defaultMenu = menuStore.use.defaultMenu();

  const tabs = useMemo<TabInfo[]>(() => calculateTabs(), [activeMenuList, selectedMenu]);

  useEffect(() => {
    const previousValue = previousSelectedMenu.current;
    if (previousValue === undefined || previousValue === selectedMenu?.id) {
      return;
    }

    if (previousValue && unseen[previousValue]) {
      resetUnseenItems(previousValue);
    }
  }, [selectedMenu?.id, unseen, resetUnseenItems]);

  function calculateTabs() {
    if (!activeMenuList) return [];

    if (deviceType === 'mobile') {
      return selectedMenu
        ? [{ id: selectedMenu.id, description: selectedMenu.description, route: selectedMenu.route, key: selectedMenu.key }]
        : [];
    }

    return activeMenuList.map(menu => ({
      id: menu.id,
      description: menu.description,
      route: menu.route,
      key: menu.key,
    }));
  }

  function selectTab(tab: TabInfo) {
    if (!tab.route) return;
    previousSelectedMenu.current = selectedMenu?.id;
    setActiveMenu({ id: tab.id, description: tab.description, route: tab.route,key: tab.key });
    router.push(tab.route);
  }

 function handleCloseTab(event: React.MouseEvent, tab: TabInfo) {
  event.stopPropagation();
  if (!tab.id) return;

  // Store the current tab index before closing
  const currentIndex = tabs.findIndex(t => t.id === tab.id);
  closeTab(tab.id);
 
  if (selectedMenu?.id === tab.id) {
    previousSelectedMenu.current = tab.id;
    const tabsAfterClose = calculateTabs().filter(t => t.id !== tab.id);
    let nextTab = defaultMenu;
    if (tabsAfterClose.length > 0) {
      const nextIndex = Math.min(currentIndex, tabsAfterClose.length - 1);
      nextTab = tabsAfterClose[nextIndex];
    }
    
    setActiveMenu(nextTab);
    router.push(nextTab.route!);
  }
}
  

  return (
    <div className={`widget height-100p ${isExpanded ? 'expanded' : ''}`}>
      <Tabs.Root defaultValue={defaultMenu?.description} value={selectedMenu?.description || defaultMenu?.description} className="height-100p">
        <Tabs.List>
          {tabs.map(tab => {
            const unseenCount = unseen[tab.id || 0];

            return (
              <Tabs.Trigger
                key={tab.key}
                value={tab.description || 'Untitled'}
                onClick={() => selectTab(tab)}
                className={unseenCount > 0 ? 'flash' : ''}
              >
                {tab.description}
                {unseenCount > 0 && <span className="ml-1 orange-color">({unseenCount})</span>}
                {tab.id !== defaultMenu.id && (
                  <i className={`${styles['close-button']} fa-solid fa-xmark`} onClick={(event) => handleCloseTab(event, tab)}></i>
                )}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        <Box pt="3" className="height-100p pb-15px">
          {children}
        </Box>
      </Tabs.Root>
    </div>
  );
}