'use client';

import {Explorer} from '@/components/explorer/explorer';
import {Header} from '@/components/header/header'
import styles from './layout.module.scss';
import {Notifications} from '@/components/notifications';
import {useEffect, useState} from 'react';
import {DashboardTabs} from '@/components/dashboard-tabs/dashboard-tabs';
import {useDeviceType} from '@/lib/hooks';
import {useUserContextStore} from '@/services/user-context';
import {MsalProvider} from '@azure/msal-react';
import msalInstance from '../msal-config';
import {Spinner} from '@radix-ui/themes';
import {ContentCarousel} from '@/components/content-carousel/content-carousel';
import {EContentTypes} from '@/components/content-carousel/model';
import {Mode} from "@/services/menu-data";

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
            <Header isMenuVisible={isMenuVisible} onMenuToggle={onMenuToggle}></Header>

            <main>
              <div className={`${styles['left-panel']} ${!isMenuVisible && deviceType === 'mobile' ? styles['collapsed'] : ''}`}>
                {
                  !expandedPanels.includes('notifications') ?
                    <Explorer
                      mode={Mode.BUY}
                      onExpandCollapse={isExpanded => onExpandCollapse('explorer', isExpanded)}
                      onNavigate={() => setIsMenuVisible(false)}>
                    </Explorer> : <></>
                }
                {
                  !expandedPanels.includes('explorer') ?
                    <Notifications onExpandCollapse={isExpanded => onExpandCollapse('notifications', isExpanded)}
                      notificationClicked={() => setIsMenuVisible(false)}>
                    </Notifications> : <></>
                }
              </div>

              <div className={`${styles['middle-panel']} ${isMenuVisible && deviceType === 'mobile' ? styles['collapsed'] : ''}`}>
                <ContentCarousel
                  contentType={EContentTypes.NOTIFICATION} />
                <DashboardTabs>
                  {children}
                </DashboardTabs>
              </div>
            </main>
          </div>
      }
    </MsalProvider>
  );
}
