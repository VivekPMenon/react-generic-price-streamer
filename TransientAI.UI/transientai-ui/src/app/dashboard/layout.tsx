'use client';

import { Explorer } from '@/components/explorer/explorer';
import { Header } from '../../components/header/header'
import styles from './layout.module.scss';
import { Notifications } from '@/components/notifications';
import { Suspense, useEffect, useState } from 'react';
import { DashboardTabs } from '@/components/dashboard-tabs/dashboard-tabs';
import { PnlMetrics } from '@/components/pnl-metrics/pnl-metrics';
import { useDeviceType } from '@/lib/hooks';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const deviceType = useDeviceType();

  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  // useEffect(() => {
  //   if (deviceType !== 'mobile') {
  //     setIsMenuVisible(true);
  //   } else {
  //     setIsMenuVisible(false);
  //   }
  // }, [deviceType]); // todo.. not using useeffect

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
    <div className={styles.home}>
      <Header isMenuVisible={isMenuVisible} onMenuToggle={onMenuToggle}></Header>

      <main>
        <div className={`${styles['left-panel']} ${!isMenuVisible && deviceType === 'mobile' ? styles['collapsed'] : ''}`}>
          {
            !expandedPanels.includes('notifications') ?
              <Explorer
                onExpandCollapse={isExpanded => onExpandCollapse('explorer', isExpanded)}
                onNavigate={() => setIsMenuVisible(false)}>
              </Explorer> : <></>
          }
          {
            !expandedPanels.includes('explorer') ?
              <Notifications onExpandCollapse={isExpanded => onExpandCollapse('notifications', isExpanded)}>
              </Notifications> : <></>
          }
        </div>

        <div className={`${styles['middle-panel']} ${isMenuVisible && deviceType === 'mobile' ? styles['collapsed'] : ''}`}>
          <PnlMetrics></PnlMetrics>

          <DashboardTabs>
            {children}
          </DashboardTabs>
        </div>
      </main>
    </div>
  );
}
