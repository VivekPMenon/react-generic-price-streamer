'use client';

import {RowClassParams, ColDef, RowClassRules, RowDoubleClickedEvent, RowClickedEvent} from 'ag-grid-community';
import {DataGrid, getNumberColDefTemplate} from '../data-grid';
import { BondInfo } from '@/services/product-browser-data';
import styles from './todays-axes.module.scss';
import { TopClients } from './top-clients';
import {productBrowserStore} from "@/services/product-browser-data/product-browser-store";

const rowClassRules: RowClassRules = {};
rowClassRules[`${styles["axe"]}`] = (params: RowClassParams) => params.data.is_golden !== true;
rowClassRules[`${styles["golden-axe"]}`] = (params: RowClassParams) => params.data.is_golden === true;

const columnDefs: ColDef[] = [
    { field: 'product_description', headerName: 'Description', width: 150 },
    { field: 'isin', headerName: 'ISIN', cellClass: 'orange-color', width: 120 },
    { field: 'b_spread', headerName: 'B Spread', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'a_spread', headerName: 'A Spread', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'benchmark', headerName: 'Benchmark', width: 80 },
    { field: 'bid_price', headerName: 'Bid Price', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'ask_price', headerName: 'Ask Price', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'b_yield', headerName: 'B Yield', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'a_yield', headerName: 'A Yield', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'b_size_m', headerName: 'B Size (K)', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'a_size_m', headerName: 'A Size (K)', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'b_axe', headerName: 'B Axe' },
    { field: 's_axe', headerName: 'S Axe' },

    { field: 'sector', headerName: 'Sector', width: 100 , hide: true },
    { field: 's_and_p_rating', headerName: 'S&P Rating', hide: true  },
    { field: 'bond_type', headerName: 'Type', width: 100, hide: true  },
    { field: 'coupon_rate', headerName: 'Coupon', width: 100, hide: true  },
    { field: 'maturity_date', headerName: 'Maturity', hide: true  },
    { field: 'bond_issuer', headerName: 'Bond Issuer', width: 180, hide: true },
    { field: 'coupon_rate', headerName: 'Coupon Rate', width: 100, hide: true },
    { field: 'b_gspread', headerName: 'B G Spread', hide: true },
    { field: 'a_gspread', headerName: 'A G Spread', hide: true },
    { field: 'b_zspread', headerName: 'B Z Spread', hide: true },
    { field: 'a_zspread', headerName: 'A Z Spread', hide: true },
    { field: 'desk_code', headerName: 'Desk Code', hide: true },
    { field: 'fitch_rating', headerName: 'Fitch Rating', hide: true },
    { field: 'moody_rating', headerName: 'Moody Rating', hide: true },
    { field: 'trader', headerName: 'Trader', hide: true },
    { field: 'product_id', headerName: 'ID', width: 150 },
];

export function TodaysAxes() {
    const isAxesLoading = productBrowserStore.use.isAxesLoading();
    const axes = productBrowserStore.use.axes();
    const setSelectedBond = productBrowserStore.use.setSelectedBond();

    function onRowDoubleClicked(event: RowDoubleClickedEvent<BondInfo>) {
        if (event.data) {
            setSelectedBond(event.data);
        }
    }

    return (
        <div className={styles['todays-axes']}>
            <div className={styles['axes']}>
                <div className='sub-header'>Axes</div>
                <DataGrid
                    isSummaryGrid={false}
                    width={'100%'}
                    loading={isAxesLoading}
                    rowData={axes}
                    columnDefs={columnDefs}
                    onRowDoubleClicked={onRowDoubleClicked}
                    rowClassRules={rowClassRules}
                    suppressStatusBar={true}
                    gridOptions={{
                        suppressRowHoverHighlight: true,
                    }}
                />
            </div>
            <div className={styles['clients']}>
                <TopClients/>
            </div>
        </div>
    );
}
