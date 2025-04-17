'use client';

import { DataGrid } from "../data-grid";
import { ColDef } from "ag-grid-community";
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";

function getColumnDef(): ColDef[] {
  return [
    // {
    //   field: 'date',
    //   headerName: 'Date',
    //   width: 100,
    //   cellClass: 'date-cell', // Optional: Apply date styling
    // },
    // {
    //   field: 'trader',
    //   headerName: 'Trader',
    //   width: 100,
    // },
    {
      field: 'security',
      headerName: 'Security',
      width: 150,
      cellClass: 'orange-color'
    },
    {
      field: 'product_description',
      headerName: 'Description',
      width: 150,
      cellClass: 'orange-color'
    },
    // {
    //   ...getNumberColDefTemplate(2),
    //   field: 'price',
    //   headerName: 'Price',
    //   width: 100,
    //   cellClass: 'numeric-cell',
    // },
    // {
    //   ...getNumberColDefTemplate(2),
    //   field: 'amount',
    //   headerName: 'Amount',
    //   width: 100,
    // },
    // {
    //   ...getNumberColDefTemplate(2),
    //   field: 'spread',
    //   headerName: 'Spread',
    //   width: 100,
    //   cellClass: 'numeric-cell',
    // },
    {
      field: 'trade_status',
      headerName: 'Trade Status',
      width: 100,
      cellClass: 'status-cell', // Optional: Add styling for trade status
    },
    // {
    //   field: 'trade_type',
    //   headerName: 'Trade Type',
    //   width: 100,
    // },
    // {
    //   ...getNumberColDefTemplate(2, false, '-'),
    //   field: 'yield_',
    //   headerName: 'Yield',
    //   width: 100,
    //   cellClass: 'numeric-cell',
    // },
    // {
    //   field: 'benchmark',
    //   headerName: 'Benchmark',
    //   width: 100,
    // },
    // {
    //   field: 'bond_issuer',
    //   headerName: 'Bond Issuer',
    //   width: 200,
    //   cellClass: 'orange-color'
    // },
    // {
    //   field: 'bond_type',
    //   headerName: 'Bond Type',
    //   width: 100,
    // },
    {
      field: 'institution_name',
      headerName: 'Institution',
      width: 100,
    },
    // {
    //   field: 'level',
    //   headerName: 'Level',
    //   width: 100,
    //   cellClass: 'numeric-cell',
    // },
    // {
    //   field: 'maturity',
    //   headerName: 'Maturity',
    //   width: 100,
    //   cellClass: 'date-cell',
    // },
  ];
}

const columnDefs = getColumnDef();

export function TradingActivity() {
  const { isTradesForBondLoading, bondTrades } = useProductBrowserStore();

  return (
      <div className="height-100p">
        <div className='sub-header'>Trade Activity</div>
        <DataGrid
          height={'100%'}
          width={'100%'}
          isSummaryGrid={false}
          suppressStatusBar={true}
          loading={isTradesForBondLoading}
          rowData={bondTrades}
          columnDefs={columnDefs}
        />
    </div>
  );
}