'use client';

import { Explorer } from '@/components/explorer/explorer';
import { Header } from '../../components/header/header'
import styles from './layout.module.scss';
import { Notifications } from '@/components/notifications';
import { Suspense, useState } from 'react';
import { DashboardTabs } from '@/components/dashboard-tabs/dashboard-tabs';
import { PnlMetrics } from '@/components/pnl-metrics/pnl-metrics';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

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

  return (
    <div className={styles.home}>
      <Header></Header>
      <main>
        <div className={styles['left-panel']}>
          {
            !expandedPanels.includes('notifications') ?
              <Explorer onExpandCollapse={isExpanded => onExpandCollapse('explorer', isExpanded)}>
              </Explorer> : <></>
          }
          {
            !expandedPanels.includes('explorer') ?
              <Notifications onExpandCollapse={isExpanded => onExpandCollapse('notifications', isExpanded)}>
              </Notifications> : <></>
          }
        </div>

        <div className={styles['middle-panel']}>
          <PnlMetrics></PnlMetrics>
          
          <DashboardTabs>
            {children}
          </DashboardTabs>
        </div>
      </main>
    </div>
  );
}
