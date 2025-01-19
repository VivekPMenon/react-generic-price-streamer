'use client';

import { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import { DataGrid } from '../data-grid';
import { BondInfo, productBrowserDataService } from '@/services/product-browser-data';
import styles from './todays-axes.module.scss';
import { TopClients } from './top-clients';
import { Holdings } from './holdings';

export function TodaysAxes() {

  const [rowData, setRowData] = useState<BondInfo[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  useEffect(() => {
    const loadAxesAsync = async () => {
      const bonds = await productBrowserDataService.getTodaysAxes();
      setRowData(bonds);
    };

    loadAxesAsync();
  }, []);

  function getColumnDef(): ColDef[] {
    return [
      { field: 'product_description', headerName: 'Product Description', width: 150 },
      { field: 'isin', headerName: 'ISIN', cellClass: 'orange-color', width: 120 },
      { field: 'bond_type', headerName: 'Bond Type', width: 100, hide: true },
      { field: 'bond_issuer', headerName: 'Bond Issuer', width: 180, hide: true },
      { field: 'coupon_rate', headerName: 'Coupon Rate', width: 120, hide: true },
      { field: 'b_size_m', headerName: 'B Size M', width: 120 },
      { field: 'a_size_m', headerName: 'A Size M', width: 120 },
      { field: 'b_yield', headerName: 'B Yield', width: 120, hide: true },
      { field: 'a_yield', headerName: 'A Yield', width: 120, hide: true },
      { field: 'bid_price', headerName: 'Bid Price', hide: true },
      { field: 'ask_price', headerName: 'Ask Price', hide: true },
      { field: 'b_spread', headerName: 'B Spread', hide: true },
      { field: 'a_spread', headerName: 'A Spread', hide: true },
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

  return (
    <div className={styles['todays-axes']}>
      <div className={styles['axes']}>
        <div className='sub-header'>Axes</div>

        <DataGrid isSummaryGrid={true}
          rowData={rowData}
          columnDefs={columnDefs}>
        </DataGrid>
      </div>

      <div className={styles['clients-and-holdings']}>
        <TopClients></TopClients>
        <Holdings></Holdings>
      </div>
    </div>
  );
} 
