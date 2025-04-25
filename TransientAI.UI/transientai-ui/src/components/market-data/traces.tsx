'use client';

import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";

const columnDef: ColDef[] = [
    { field: 'security', headerName: 'Bond', cellClass: 'orange-color' },
    { field: 'side', headerName: 'Side', width: 70 },
    { field: 'traded_price', headerName: 'Px', wrapHeaderText: true, width: 100, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'traded_spread', headerName: 'Spd', wrapHeaderText: true, width: 100, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'date', headerName: 'Date', width: 90 },
    { field: 'time', headerName: 'Time', width: 90 },

    { field: 'isin', headerName: 'ISIN', hide: true },
    { field: 'size_m', headerName: 'Size (K)', width: 90, hide: true, ...getNumberColDefTemplate(0, false, '-') },

    { field: 'spread_change', headerName: 'Spd Change', wrapHeaderText: true, hide: true, width: 130, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'price_change', headerName: 'Px Change', wrapHeaderText: true, hide: true, },
    { field: 'traded_yield', headerName: 'Yield', wrapHeaderText: true, hide: true, width: 100, ...getNumberColDefTemplate(2, false, '-') },
    { field: 'yield_change', headerName: 'Yield Change', wrapHeaderText: true, hide: true,  },
    { field: 'maturity', headerName: 'Maturity', hide: true },
    { field: 'rating', headerName: 'Rating', hide: true },
    { field: 'asw', headerName: 'ASW', hide: true },
    { field: 'coupon', headerName: 'Coupon', headerClass: 'ag-right-aligned-header', hide: true },
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