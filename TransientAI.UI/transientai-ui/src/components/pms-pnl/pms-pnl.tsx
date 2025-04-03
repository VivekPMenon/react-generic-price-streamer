'use client'

import React from 'react';
import {useDeviceType} from "@/lib/hooks";
import {usePmsPnlDataStore} from "@/services/pms-pnl-data/pms-pnl-data-store";
import {DataGrid} from "@/components/data-grid";
import {
    columnDefs, handleGridSizeChanged, handleFirstDataRendered, getGridOptions
} from './pms-pnl-config';
import styles from './pms-pnl.module.scss';

export function PmsPnl() {
    const { reportDate, isLoading, report } = usePmsPnlDataStore();
    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

    return (
    <div>
        <div className={`${styles['header']} sub-header`}>P&L Dashboard for {reportDate?.toLocaleString() ?? ''}</div>
        <div className={`${styles['pms-panel']}`}>
            <DataGrid
                domLayout={'normal'}
                height={isMobile ? 500 : 600}
                isSummaryGrid={false}
                suppressStatusBar={true}
                suppressFloatingFilter={false}
                rowData={report?.length && report[0]}
                columnDefs={columnDefs}
                loading={isLoading}
                gridOptions={getGridOptions(isMobile)}
                onGridSizeChanged={handleGridSizeChanged}
                onFirstDataRendered={handleFirstDataRendered}
                suppressStickyTotalRow={false}
                pinnedTopRowData={report?.length && [report[1]]}
            />
        </div>
    </div>);
}
