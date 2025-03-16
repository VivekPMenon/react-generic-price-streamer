'use client';

import styles from './dashboard-tabs.module.scss';
import { Box, Tabs } from '@radix-ui/themes';
import { TabInfo } from './model';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceType } from '@/lib/hooks';
import { useUnseenItemsStore } from '@/services/unseen-items-store/unseen-items-store';
import { useMenuStore } from '@/services/menu-data';

export interface DashboardTabsProps {
  children?: ReactNode;
}

export function DashboardTabs({ children }: DashboardTabsProps) {
  const defaultTab = 'Macro Panel';
  const router = useRouter();
  const deviceType = useDeviceType();

  const { unseenItems: unseen, resetUnseenItems } = useUnseenItemsStore();
  const { activeMenuList, selectedMenu, setActiveMenu, closeTab } = useMenuStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const tabs = useMemo<TabInfo[]>(() => calculateTabs(), [activeMenuList, selectedMenu]);

  useEffect(() => {
    if (selectedMenu?.id && unseen[selectedMenu.id]) {
      resetUnseenItems(selectedMenu.id);
    }
  }, [selectedMenu?.id, unseen, resetUnseenItems]);
  
  function calculateTabs() {
    if (!activeMenuList) return [];

    if (deviceType === 'mobile') {
      return selectedMenu
        ? [{ id: selectedMenu.id, description: selectedMenu.description, route: selectedMenu.route }]
        : [];
    }

    return activeMenuList.map(menu => ({
      id: menu.id,
      description: menu.description,
      route: menu.route
    }));
  }

  function selectTab(tab: TabInfo) {
    if (!tab.route) return;
    setActiveMenu({ id: tab.id, description: tab.description, route: tab.route });
    router.push(tab.route);
  }

  function handleCloseTab(event: React.MouseEvent, tab: TabInfo) {
    event.stopPropagation();
    if (!tab.id) return
    closeTab(tab.id);
  }

  return (
    <div className={`${styles['main-content']} widget ${isExpanded ? 'expanded' : ''}`}>
      <Tabs.Root defaultValue={defaultTab} value={selectedMenu?.description || defaultTab} className="height-100p">
        <Tabs.List>
          {tabs.map(tab => {
            const unseenCount = unseen[tab.id || 0];

            return (
              <Tabs.Trigger
                key={tab.id}
                value={tab.description || 'Untitled'} 
                onClick={() => selectTab(tab)}
                className={unseenCount > 0 ? 'flash' : ''}
              >
                {tab.description}
                {unseenCount > 0 && <span className="ml-1 orange-color">({unseenCount})</span>}
                {tab.description !== defaultTab && (
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