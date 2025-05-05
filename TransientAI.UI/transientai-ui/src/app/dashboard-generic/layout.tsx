'use client';
import { Explorer } from '@/components/explorer/explorer';
import { Header } from '@/components/header/header'
import { Chatbot } from '@/components/chatbot/chatbot';
import { Notifications } from '@/components/notifications';
import {useEffect, useState} from 'react';
import {Mode} from "@/services/menu-data";
import {DashboardTabs} from "@/components/dashboard-tabs/dashboard-tabs";
import {MsalProvider} from '@azure/msal-react';
import {Spinner} from "@radix-ui/themes";
import {useUserContextStore} from "@/services/user-context";
import {useDeviceType} from "@/lib/hooks";
import {ServiceInitializer} from "@/services/startup/initializer";
import {TradingActivity} from "@/components/trading-activity";
import {Holdings} from "@/components/axes/holdings";
import {Traces} from "@/components/market-data";
import {BondNews} from "@/components/news/bond-news";

import msalInstance from '../msal-config';
import styles from './page.module.scss';
import 'react-tooltip/dist/react-tooltip.css'

const MODE: Mode = Mode.SELL;

const serviceInitializer = new ServiceInitializer(MODE);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // todo.. unable to add this to the root of the app, as it is server side rendered, create an intermediate layout that wil act as root for all client dashbaords
  const { loadUserContext, isLoading, isAuthenticated } = useUserContextStore();

  useEffect(() => {
    loadUserContext();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      window.history.replaceState({}, document.title, window.location.pathname);
      serviceInitializer.initialize();
    }
  }, [isAuthenticated]);

  const deviceType = useDeviceType();

  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);

  function onExpandCollapse(panelName: string, isExpanded: boolean) {
    const latestExpandedPanels = [...expandedPanels];

    if (isExpanded) {
      latestExpandedPanels.push(panelName);
    } else {
      const index = latestExpandedPanels.findIndex(panel => panel === panelName);
      latestExpandedPanels.splice(index, 1);
    }

    setExpandedPanels(latestExpandedPanels);
  }

  function onMenuToggle() {
    setIsMenuVisible(!isMenuVisible);
  }

  return (
      <MsalProvider instance={msalInstance}>
        {
          isLoading || !isAuthenticated ?
              <div className='p-2 flex gap-2 items-center justify-center height-100p'>
                <Spinner size={"3"}></Spinner>
                Trying to authenticate you. Please wait...
              </div>
              :
      <div className={styles.home}>
        <Header isMenuVisible={isMenuVisible} onMenuToggle={onMenuToggle} />
        <main>
          <div className={`${styles['left-panel']} ${!isMenuVisible && deviceType === 'mobile' ? styles['collapsed'] : ''}`}>
            {
              !expandedPanels.includes('notifications') ?
                  <Explorer
                      mode={MODE}
                      onExpandCollapse={isExpanded => onExpandCollapse('explorer', isExpanded)} /> : <></>
            }
            {
              !expandedPanels.includes('explorer') ?
                  <Notifications
                      onExpandCollapse={isExpanded => onExpandCollapse('notifications', isExpanded)}
                      mode={MODE} /> : <></>
            }
          </div>

          <div className={`${styles['middle-panel']}`}>
            <div className={`${styles['middle-panel-top']} ${isMenuVisible && deviceType === 'mobile' ? styles['collapsed'] : ''}`}>
              {/*<ContentCarousel*/}
              {/*    contentType={EContentTypes.NOTIFICATION}*/}
              {/*/>*/}
              <DashboardTabs>
                {children}
              </DashboardTabs>
            </div>

            <div className={`${styles['middle-panel-bottom-widgets']}`}>
              <div className={styles.tradingActivity}>
                <TradingActivity />
              </div>
              <div className={styles.holdingsPanel}>
                <Holdings />
              </div>
              <div className={styles.newsPanel}>
                <BondNews />
              </div>
              <div className={styles.tracesPanel}>
                <Traces />
              </div>
            </div>
          </div>

          <div className={styles['right-panel']}>
            <Chatbot />
          </div>
        </main>
      </div>
        }
      </MsalProvider>
  );
}