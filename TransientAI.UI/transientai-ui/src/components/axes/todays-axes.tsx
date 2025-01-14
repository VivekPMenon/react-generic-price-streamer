'use client';

import { useState, useContext, useMemo, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import { DataGrid } from '../data-grid';
import { BondInfo, productBrowserDataService } from '@/services/product-browser-data';

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
      { field: 'product_description', headerName: 'Product Description' },
      { field: 'isin', headerName: 'ISIN' },
      { field: 'bond_type', headerName: 'Bond Type' },
      { field: 'bond_issuer', headerName: 'Bond Issuer' },
      { field: 'coupon_rate', headerName: 'Coupon Rate' },
      { field: 'b_size_m', headerName: 'B Size M' },
      { field: 'a_size_m', headerName: 'A Size M' },
      { field: 'b_yield', headerName: 'B Yield' },
      { field: 'a_yield', headerName: 'A Yield' },
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
    <div className='height-100p'>
      <DataGrid
        rowData={rowData}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  );
} 
