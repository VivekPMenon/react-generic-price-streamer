'use client';

import {DataGrid, getNumberColDefTemplate} from "../data-grid";
import { ColDef } from "ag-grid-community";
import {productBrowserStore} from "@/services/product-browser-data/product-browser-store";

function getColumnDef(): ColDef[] {
  return [
    {
      field: 'security',
      headerName: 'Security',
      width: 150,
      cellClass: 'orange-color'
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 100,
      cellClass: 'date-cell', // Optional: Apply date styling
    },
    {
      field: 'trade_type',
      headerName: 'Side',
      width: 100,
    },
    {
      ...getNumberColDefTemplate(2),
      field: 'amount',
      headerName: 'Amount',
      width: 100,
    },
    {
      ...getNumberColDefTemplate(2),
      field: 'spread',
      headerName: 'Spread',
      width: 100,
      cellClass: 'numeric-cell',
    },
    {
      ...getNumberColDefTemplate(2),
      field: 'price',
      headerName: 'Price',
      width: 100,
      cellClass: 'numeric-cell',
    },
    {
      field: 'institution_name',
      headerName: 'Counterparty',
      width: 100
    },
    {
      field: 'product_description',
      headerName: 'Description',
      width: 150,
      cellClass: 'orange-color',
      hide: true
    },
    {
      field: 'trade_status',
      headerName: 'Trade Status',
      width: 100,
      cellClass: 'status-cell',
      hide: true
    },
  ];
}

const columnDefs = getColumnDef();

export function TradingActivity() {
  const isTradesForBondLoading = productBrowserStore.use.isTradesForBondLoading();
  const bondTrades = productBrowserStore.use.bondTrades();

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