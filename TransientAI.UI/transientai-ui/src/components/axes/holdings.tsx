import { useState } from "react";
import { DataGrid } from "../data-grid";
import { ColDef } from "ag-grid-community";

export function Holdings() {
  const rowData = [
    {
      "ClientName": "Vanguard",
      "Security": "AAPL",
      "Holding": 150
    },
    {
      "ClientName": "Goldman Sachs",
      "Security": "GOOGL",
      "Holding": 75
    },
    {
      "ClientName": "Morgan Stanley",
      "Security": "AMZN",
      "Holding": 200
    },
    {
      "ClientName": "BlackRock",
      "Security": "MSFT",
      "Holding": 50
    },
    {
      "ClientName": "JP Morgan",
      "Security": "TSLA",
      "Holding": 100
    }
  ];
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  function getColumnDef(): ColDef[] {
    return [
      { field: 'ClientName', headerName: 'Client', width: 150 },
      { field: 'Security', headerName: 'Security', cellClass: 'orange-color', width: 120 },
      { field: 'Holding', headerName: 'Current Holding', width: 150 }
    ];
  }

  return (
    <div>
      <div className='sub-header'>Holdings</div>

      <DataGrid isSummaryGrid={true}
        rowData={rowData}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  );
}