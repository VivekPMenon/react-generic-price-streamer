'use client';

import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";

const columnDef: ColDef[] = [
    { field: 'security', headerName: 'Bond', cellClass: 'orange-color' },
    { field: 'isin', headerName: 'ISIN' },
    { field: 'date', headerName: 'Date', width: 90 },
    { field: 'side', headerName: 'Side', width: 70 },
    { field: 'size_m', headerName: 'Size (K)', width: 90, ...getNumberColDefTemplate(0, false, '-') },
    { field: 'spread_change', headerName: 'Spread Change', wrapHeaderText: true, width: 130, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'time', headerName: 'Time', width: 90 },
    { field: 'traded_price', headerName: 'Traded Price', wrapHeaderText: true, width: 100, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'traded_spread', headerName: 'Traded Spread', wrapHeaderText: true, width: 100, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'traded_yield', headerName: 'Traded Yield', wrapHeaderText: true, width: 100, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'yield_change', headerName: 'Yield Change', wrapHeaderText: true,  },
    { field: 'maturity', headerName: 'Maturity' },
    { field: 'price_change', headerName: 'Price Change', wrapHeaderText: true,  },
    { field: 'rating', headerName: 'Rating' },
    { field: 'asw', headerName: 'ASW' },
    { field: 'coupon', headerName: 'Coupon', headerClass: 'ag-right-aligned-header' },
];

export function Traces() {
  const { isTraceLoading, traces } = useProductBrowserStore();

  return (
    <div className="height-100p">
      <div className='sub-header'>Trace</div>

      <DataGrid
        height={'100%'}
        width={'100%'}
        isSummaryGrid={false}
        suppressStatusBar={true}
        loading={isTraceLoading}
        rowData={traces}
        columnDefs={columnDef}>
      </DataGrid>
    </div>
  );
}