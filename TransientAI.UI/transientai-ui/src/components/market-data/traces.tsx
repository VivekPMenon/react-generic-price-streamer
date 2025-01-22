'use client';

import { useEffect, useState } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { marketDataService, Price, TraceData } from "@/services/market-data";

export function Traces() {

  const [traces, setTraces] = useState<TraceData[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  useEffect(() => {
    const loadTraces = async () => {
      const traces = await marketDataService.getTraces();
      setTraces(traces);
    };

    loadTraces();
  }, []);

  function getColumnDef(): ColDef[] {
    return [
      { field: 'security', headerName: 'Bond', cellClass: 'orange-color' },
      { field: 'isin', headerName: 'ISIN' },
      { field: 'date', headerName: 'Date', width: 90 },
      { field: 'side', headerName: 'Side', width: 70},
      { field: 'size_m', headerName: 'Size (M)', width: 90, ...getNumberColDefTemplate(0) },
      { field: 'spread_change', headerName: 'Spread Change', width: 90, ...getNumberColDefTemplate(2) },
      { field: 'time', headerName: 'Time', width: 90 },
      { field: 'traded_price', headerName: 'Traded Price', width: 100, ...getNumberColDefTemplate(2) },
      { field: 'traded_spread', headerName: 'Traded Spread', width: 100, ...getNumberColDefTemplate(2) },
      { field: 'traded_yield', headerName: 'Traded Yield', width: 100, ...getNumberColDefTemplate(2) },
      { field: 'yield_change', headerName: 'Yield Change' },
      { field: 'maturity', headerName: 'Maturity' },
      { field: 'price_change', headerName: 'Price Change' },
      { field: 'rating', headerName: 'Rating' },
      { field: 'asw', headerName: 'ASW' },
      { field: 'coupon', headerName: 'Coupon' },
    ];
  }

  return (
    <div className="height-100p">
      <div className='sub-header'>Traces</div>

      <DataGrid isSummaryGrid={true}
        rowData={traces}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  );
}