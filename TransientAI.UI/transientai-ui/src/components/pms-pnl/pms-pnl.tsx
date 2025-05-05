'use client'

import React, {memo, useEffect, useState} from 'react';
import {useDeviceType} from "@/lib/hooks";
import {pmsPnlDataStore} from "@/services/pms-pnl-data/pms-pnl-data-store";
import {DataGrid} from "@/components/data-grid";
import {
    columnDefs, handleGridSizeChanged, handleFirstDataRendered, defaultGridOptions
} from './pms-pnl-config';
import styles from './pms-pnl.module.scss';
import i18n from '../../i18n'; 
// import { UserRole, useUserContextStore } from '@/services/user-context';

function PmsPnl() {
    const reportDate = pmsPnlDataStore.use.reportDate();
    const isLoading = pmsPnlDataStore.use.isLoading();
    const report = pmsPnlDataStore.use.report();

    const deviceType = useDeviceType();
    const isMobile = deviceType !== 'desktop';

    return (
    <div>
        <div className={`${styles['header']} notranslate sub-header`}>{`${i18n.t('pms_1.pnl_dashboard')}${reportDate?.toLocaleDateString() ?? ''}`}</div>
        <div className={`${styles['pms-panel']}`}>
            <DataGrid
                domLayout={'normal'}
                height={isMobile ? 500 : '95%'}
                isSummaryGrid={false}
                suppressStatusBar={true}
                suppressFloatingFilter={false}
                rowData={report?.data}
                columnDefs={columnDefs}
                loading={isLoading}
                gridOptions={defaultGridOptions}
                onGridSizeChanged={handleGridSizeChanged}
                onFirstDataRendered={handleFirstDataRendered}
                suppressStickyTotalRow={false}
                grandTotalRow='top'
            />
        </div>
    </div>);
}

export default memo(PmsPnl);
