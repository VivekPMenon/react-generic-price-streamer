'use client';

import { useState, useEffect, useContext } from 'react';
import {RowClassParams, ColDef, RowClassRules, RowDoubleClickedEvent} from 'ag-grid-community';
import { DataGrid, getNumberColDefTemplate } from '../data-grid';
import { BondInfo } from '@/services/product-browser-data';
import styles from './todays-axes.module.scss';
import { TopClients } from './top-clients';
import { Holdings } from './holdings';
import { SearchDataContext } from '@/services/search-data';
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";

const rowClassRules: RowClassRules = {};
rowClassRules[`${styles["axe"]}`] = (params: RowClassParams) => params.data.is_golden !== true;
rowClassRules[`${styles["golden-axe"]}`] = (params: RowClassParams) => params.data.is_golden === true;

function getColumnDef(): ColDef[] {
  return [
    { field: 'product_description', headerName: 'Product Description', width: 150 },
    { field: 'isin', headerName: 'ISIN', cellClass: 'orange-color', width: 120 },
    { field: 'bond_type', headerName: 'Bond Type', width: 100, hide: true },
    { field: 'bond_issuer', headerName: 'Bond Issuer', width: 180, hide: true },
    { field: 'coupon_rate', headerName: 'Coupon Rate', width: 100, hide: true },
    { field: 'b_size_m', headerName: 'B Size M', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'a_size_m', headerName: 'A Size M', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'b_yield', headerName: 'B Yield', width: 80, hide: true, ...getNumberColDefTemplate(2) },
    { field: 'a_yield', headerName: 'A Yield', width: 80, hide: true, ...getNumberColDefTemplate(2) },
    { field: 'bid_price', headerName: 'Bid Price', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'ask_price', headerName: 'Ask Price', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'b_spread', headerName: 'B Spread', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'a_spread', headerName: 'A Spread', width: 80, ...getNumberColDefTemplate(2) },
    { field: 'b_gspread', headerName: 'B G Spread', hide: true },
    { field: 'a_gspread', headerName: 'A G Spread', hide: true },
    { field: 'b_zspread', headerName: 'B Z Spread', hide: true },
    { field: 'a_zspread', headerName: 'A Z Spread', hide: true },
    { field: 'sector', headerName: 'Sector', hide: true },
    { field: 'b_axe', headerName: 'B Axe' },
    { field: 's_axe', headerName: 'S Axe' },
    { field: 'benchmark', headerName: 'Benchmark', hide: true },
    { field: 'desk_code', headerName: 'Desk Code', hide: true },
    { field: 'fitch_rating', headerName: 'Fitch Rating', hide: true },
    { field: 'maturity_date', headerName: 'Maturity Date', hide: true },
    { field: 's_and_p_rating', headerName: 'S And P Rating', hide: true },
    { field: 'moody_rating', headerName: 'Moody Rating', hide: true },
    { field: 'trader', headerName: 'Trader', hide: true },
    { field: 'level', headerName: 'Level', hide: true },
  ];
}

export function TodaysAxes() {
  const { searchData, setSearchData } = useContext(SearchDataContext);
  const { isTodaysAxesLoading, todaysAxes, loadTodaysAxes } = useProductBrowserStore();

  useEffect(() => {
    loadTodaysAxes(searchData.id);
  }, [loadTodaysAxes, searchData.id]);

  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  function onRowDoubleClicked(event: RowDoubleClickedEvent<BondInfo>) {
    setSearchData({
      description: event.data?.product_description,
      id: event.data?.isin
    });
  }

  return (
    <div className={styles['todays-axes']}>
      <div className={styles['axes']}>
        <div className='sub-header'>Axes</div>

        <DataGrid
          isSummaryGrid={true}
          loading={isTodaysAxesLoading}
          rowData={todaysAxes}
          columnDefs={columnDefs}
          onRowDoubleClicked={onRowDoubleClicked} >
        </DataGrid>
      </div>

      <div className={styles['clients-and-holdings']}>
        <TopClients />
        <Holdings />
      </div>
    </div>
  );
} 
