'use client';

import { useEffect, useState } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { BondTrade, ClientHolding, clientHoldingsDataService } from "@/services/client-holding-data";
import { marketDataService, Price } from "@/services/market-data";

export function MarketDataTable() {

  const [prices, setPrices] = useState<Price[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  useEffect(() => {
    const loadPrices = async () => {
      const prices = await marketDataService.getMarketDataPrices();
      setPrices(prices);
    };

    loadPrices();
  }, []);


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
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  );
}