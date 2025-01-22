'use client';

import { useContext, useEffect, useState } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef, RowDoubleClickedEvent } from "ag-grid-community";
import { BondTrade, ClientHolding, clientHoldingsDataService } from "@/services/client-holding-data";
import { marketDataService, Price } from "@/services/market-data";
import { SearchDataContext } from "@/services/search-data";

export function MarketDataTable() {

  const { searchData, setSearchData } = useContext(SearchDataContext);

  const [prices, setPrices] = useState<Price[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  useEffect(() => {
    const loadPrices = async () => {
      const prices = await marketDataService.getMarketDataPrices(searchData.id);
      setPrices(prices);
    };

    loadPrices();
  }, [searchData.id]);

  function onRowDoubleClicked(event: RowDoubleClickedEvent<Price>) {
    setSearchData({
      description: event.data?.bond,
      id: event.data?.isin
    });
  }

  function getColumnDef(): ColDef[] {
    return [
      { field: 'bond', headerName: 'Bond', width: 130, cellClass: 'orange-color' },
      { field: 'date', headerName: 'Date', hide: true },
      { field: 'isin', headerName: 'ISIN' },
      { field: 'source', width: 100, headerName: 'Source' },
      { field: 'mid_price', width: 90, headerName: 'Mid Price', ...getNumberColDefTemplate(2) },
      { field: 'mid_spread', width: 90, headerName: 'Mid Spread', ...getNumberColDefTemplate(2) },
      { field: 'mid_yield', width: 90, headerName: 'Mid Yield', ...getNumberColDefTemplate(2) },

      { field: 'bond_issuer', headerName: 'Bond Issuer' },
      { field: 'time', headerName: 'Time' },
    ];
  }

  return (
    <div className="height-100p">
      <div className='sub-header'>Prices</div>

      <DataGrid isSummaryGrid={true}
        rowData={prices}
        columnDefs={columnDefs}
        onRowDoubleClicked={onRowDoubleClicked}>
      </DataGrid>
    </div>
  );
}