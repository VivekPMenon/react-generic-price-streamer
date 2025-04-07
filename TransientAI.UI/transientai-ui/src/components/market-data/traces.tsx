'use client';

import { useContext, useEffect, useState } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef, RowDoubleClickedEvent } from "ag-grid-community";
import { marketDataService, TraceData } from "@/services/market-data";
import { SearchDataContext } from "@/services/search-data";

function getColumnDef(): ColDef[] {
  return [
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
}

export function Traces() {

  const { searchData, setSearchData } = useContext(SearchDataContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [traces, setTraces] = useState<TraceData[]>();

  useEffect(() => {
    const loadTraces = async () => {
      try {
        const traces = await marketDataService.getTraces(searchData.id);
        setTraces(traces);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadTraces();
  }, [searchData.id]);

  function onRowDoubleClicked(event: RowDoubleClickedEvent<TraceData>) {
    setSearchData({
      description: event.data?.security,
      id: event.data?.isin
    });
  }

  return (
    <div className="height-100p">
      <div className='sub-header'>Traces</div>

      <DataGrid
        height={'100%'}
        isSummaryGrid={true}
        loading={isLoading}
        rowData={traces}
        columnDefs={getColumnDef()}
        onRowDoubleClicked={onRowDoubleClicked}>
      </DataGrid>
    </div>
  );
}