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
      { field: 'bond_type', headerName: 'Bond Type', width: 100 },
      { field: 'bond_issuer', headerName: 'Bond Issuer', width: 180 },
      { field: 'coupon_rate', headerName: 'Coupon Rate', width: 120 },
      { field: 'b_size_m', headerName: 'B Size M', width: 120 },
      { field: 'a_size_m', headerName: 'A Size M', width: 120 },
      { field: 'b_yield', headerName: 'B Yield', width: 120 },
      { field: 'a_yield', headerName: 'A Yield', width: 120 },
      { field: 'bid_price', headerName: 'Bid Price' },
      { field: 'ask_price', headerName: 'Ask Price' },
      { field: 'b_spread', headerName: 'B Spread' },
      { field: 'a_spread', headerName: 'A Spread' },
      { field: 'b_gspread', headerName: 'B G Spread' },
      { field: 'a_gspread', headerName: 'A G Spread' },
      { field: 'b_zspread', headerName: 'B Z Spread' },
      { field: 'a_zspread', headerName: 'A Z Spread' },
      { field: 'sector', headerName: 'Sector' },
      { field: 'b_axe', headerName: 'B Axe' },
      { field: 's_axe', headerName: 'S Axe' },
      { field: 'benchmark', headerName: 'Benchmark' },
      { field: 'desk_code', headerName: 'Desk Code' },
      { field: 'fitch_rating', headerName: 'Fitch Rating' },
      { field: 'maturity_date', headerName: 'Maturity Date' },
      { field: 's_and_p_rating', headerName: 'S And P Rating' },
      { field: 'moody_rating', headerName: 'Moody Rating' },
      { field: 'trader', headerName: 'Trader' },
      { field: 'level', headerName: 'Level' },
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
