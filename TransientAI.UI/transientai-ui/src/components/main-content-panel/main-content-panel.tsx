'use client';

import styles from './main-content-panel.module.scss';
import { Box, Tabs } from "@radix-ui/themes";
import { TabInfo } from './model';
import { useContext, useMemo } from 'react';
import { ActiveMenuData, MenuContextData, MenuInfo } from '@/services/menu-data';
import { TodaysAxes } from '../axes/todays-axes';
import { TradingActivity } from '../trading-activity';
import { MarketDataTable } from '../market-data/market-data-table';
import { Traces } from '../market-data/traces';
import { BreakingNews } from '../breaking-news';
import { ResearchReports } from '../research-reports';

export function MainContentPanel() {
  const defaultTab = 'Daily Insights';

  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);

  const tabs = useMemo<TabInfo[]>(() => calculateTabs(activeMenuData!), [activeMenuData?.activeMenuList]);

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
      ...activeMenuData,
      selectedMenu: { description: tab.description }
    });
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

    event.stopPropagation();
  }

  return (
    <div className={`${styles['main-content']} widget`}>
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
        </Tabs.List>

        {/* TODO... Use Router here so that dynamical loading of components can be done */}
        {/* Use constants for the menu names */}
        <Box pt="3" className='height-100p pb-15px'>

          {
            activeMenuData?.selectedMenu?.description === defaultTab ?
              <div className='height-100p tab-content'>
                <TodaysAxes></TodaysAxes>
              </div> : <></>
          }

          {
            activeMenuData?.selectedMenu?.description === `Today's Axes` ?
              <div className='height-100p tab-content'>
                <TodaysAxes></TodaysAxes>
              </div> : <></>
          }

          {
            activeMenuData?.selectedMenu?.description === `Trading Activity` ?
              <div className='height-100p tab-content'>
                <TradingActivity></TradingActivity>
              </div> : <></>
          }

          {
            activeMenuData?.selectedMenu?.description === `Market Data` ?
              <div className={`${styles['market-data']}`}>
                <MarketDataTable></MarketDataTable>
                <Traces></Traces>
              </div> : <></>
          }

          {
            activeMenuData?.selectedMenu?.description === `Breaking News` ?
              <div className='height-100p tab-content'>
                <BreakingNews></BreakingNews>
              </div> : <></>
          }

          {
            activeMenuData?.selectedMenu?.description === `Research Reports` ?
              <div className='height-100p tab-content'>
                <ResearchReports></ResearchReports>
              </div> : <></>
          }
        </Box>
      </Tabs.Root>
    </div>
  );
}