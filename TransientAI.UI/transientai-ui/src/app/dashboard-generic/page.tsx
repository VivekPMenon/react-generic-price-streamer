'use client';
import { Explorer } from '@/components/explorer/explorer';
import { Header } from '@/components/header/header'
import styles from './page.module.scss';

import { Chatbot } from '@/components/chatbot/chatbot';
import { Notifications } from '@/components/notifications';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { News } from '@/components/news';
import {Mode} from "@/services/menu-data";

// dynamic loading to address build issue when importing highcharts
const PriceGraph = dynamic(() => import("@/components/market-data").then(module => module.PriceGraph), { ssr: false, });

export default function Home() {

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
              <Explorer
                  mode={Mode.SELL}
                  onExpandCollapse={isExpanded => onExpandCollapse('explorer', isExpanded)}>
              </Explorer> : <></>
          }
          {
            !expandedPanels.includes('explorer') ?
              <Notifications onExpandCollapse={isExpanded => onExpandCollapse('notifications', isExpanded)}>
              </Notifications> : <></>
          }
        </div>

        <div className={styles['middle-panel']}>
          {/* <MainContentPanel></MainContentPanel> */}

          <div className={styles['middle-panel-bottom-widgets']}>
            <PriceGraph onExpandCollapse={isExpanded => onExpandCollapse('price-graph', isExpanded)}></PriceGraph>
            <News onExpandCollapse={isExpanded => onExpandCollapse('news', isExpanded)}></News>
          </div>
        </div>

        <div className={styles['right-panel']}>
          <Chatbot></Chatbot>
        </div>
      </main>
    </div>
  );
}
