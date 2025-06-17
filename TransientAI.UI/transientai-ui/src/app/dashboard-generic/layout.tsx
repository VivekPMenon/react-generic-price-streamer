'use client'
import { Explorer } from '@/components/explorer/explorer'
import { Header } from '@/components/header/header'
import { Chatbot } from '@/components/chatbot/chatbot';
import { Notifications } from '@/components/notifications';
import {useEffect, useState} from 'react';
import {menuStore, Mode} from "@/services/menu-data";
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
import {useRouter} from "next/navigation";

const MODE: Mode = Mode.SELL;

const serviceInitializer = new ServiceInitializer(MODE)

export default function DashboardLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // todo.. unable to add this to the root of the app, as it is server-side rendered, create an intermediate layout that will act as root for all client dashboards
  const { loadUserContext, isLoading, isAuthenticated } = useUserContextStore();
  const [isFullPageView, setIsFullPageView] = useState<boolean>(false);
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [handleChatbot, setHandleChatbot] = useState<boolean>(false);
  const selectedMenu = menuStore.use.selectedMenu();
  const deviceType = useDeviceType();

  useEffect(() => {
    loadUserContext()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      window.history.replaceState({}, document.title, window.location.pathname)
      serviceInitializer.initialize();
    }
  }, [isAuthenticated])

  useEffect(() => {
    setIsFullPageView(selectedMenu?.fullPage === true);
  }, [selectedMenu]);

  function onExpandCollapse (panelName: string, isExpanded: boolean) {
    const latestExpandedPanels = [...expandedPanels]

    if (isExpanded) {
      latestExpandedPanels.push(panelName)
    } else {
      const index = latestExpandedPanels.findIndex(panel => panel === panelName)
      latestExpandedPanels.splice(index, 1)
    }

    setExpandedPanels(latestExpandedPanels)
  }

  function onMenuToggle () {
    setIsMenuVisible(!isMenuVisible)
  }

  let content = null;
  let bottomContent = null;
  if (!isFullPageView) {
    let upperContent = null;
    if (deviceType === 'mobile') {
      upperContent = (
          <div
              onClick={() => setHandleChatbot(false)}
              className='w-full flex justify-between items-center p-2 sticky top-0 bg-inherit'
          >
            Chatbot <i className='fa-regular fa-circle-xmark'></i>
          </div>
      );
    }

    content = (
        <div
            className={`${styles['right-panel']} ${
                handleChatbot && deviceType === 'mobile'
                    ? styles['collapsed']
                    : ''
            }`}
        >
          {upperContent}
          <Chatbot />
        </div>
    );

    if (deviceType === 'mobile') {
      bottomContent = (
        <div
            className='w-10 h-10 flex items-center justify-center fixed bottom-5 right-2 bg-gray-500 rounded-full p-1 text-sm'
            onClick={() => setHandleChatbot(true)}
        >
          <i className='fa-regular fa-message'></i>
        </div>
      );
    }
  }

  return (
    <MsalProvider instance={msalInstance}>
      {isLoading || !isAuthenticated ? (
        <div className='p-2 flex gap-2 items-center justify-center height-100p'>
          <Spinner size={'3'}></Spinner>
          Trying to authenticate you. Please wait...
        </div>
      ) : (
        <div className={styles.home}>
          <Header mode={MODE} isMenuVisible={isMenuVisible} onMenuToggle={onMenuToggle} />
          <main>
            <div
              className={`${styles['left-panel']} ${
                !isMenuVisible && deviceType === 'mobile'
                  ? styles['collapsed']
                  : ''
              }`}
            >
              {!expandedPanels.includes('notifications') ? (
                <Explorer
                  mode={MODE}
                  onExpandCollapse={isExpanded =>
                    onExpandCollapse('explorer', isExpanded)
                  }
                  onNavigate={() => setIsMenuVisible(false)}
                />
              ) : (
                <></>
              )}
              {!expandedPanels.includes('explorer') ? (
                <Notifications
                  onExpandCollapse={isExpanded =>
                    onExpandCollapse('notifications', isExpanded)
                  }
                  mode={MODE}
                />
              ) : (
                <></>
              )}
            </div>

            <div className={`${styles['middle-panel']} ${
                  isMenuVisible && deviceType === 'mobile'
                    ? styles['collapsed']
                    : ''
                  }`}
                >
              <DashboardTabs className={!isFullPageView ? styles['dashboard-tabs'] : undefined }>{children}</DashboardTabs>
              {!isFullPageView && (<div className={`grid md:grid-cols-2 md:grid-rows-2 gap-3 basis-[60%]`}>
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
              )}
            </div>

            {content}
            {bottomContent}

          </main>
        </div>
      )}
    </MsalProvider>
  )
}
