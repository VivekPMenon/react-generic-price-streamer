'use client'

import {MarketDataTable} from "@/components/market-data/market-data-table";
import {Traces} from "@/components/market-data/traces";
import styles from './market-data-panel.module.scss';

export function MarketDataPanel() {
    return (
        <div className={styles.marketDataPanel}>
            <div className={styles.marketDataTable}><MarketDataTable /></div>
            <div className={styles.traces}><Traces /></div>
        </div>
    );
}