import { useMemo } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";

export function RiskMetrics() {

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);

  const rowData = [
    {
      "manager": "Chris Napoli",
      "gsMarginExcess": "$54,948"
    },
    {
      "manager": "Dave Neubert",
      "gsMarginExcess": "$32,286,452"
    },
    {
      "manager": "Matt Hagerty",
      "gsMarginExcess": "$379,508"
    },
    {
      "manager": "Mendon",
      "gsMarginExcess": "$2,665,833"
    },
    {
      "manager": "New Paradigm",
      "gsMarginExcess": "$97,316,009"
    },
    {
      "manager": "Snoboll (S1SP21)",
      "gsMarginExcess": "$3,147,771"
    },
    {
      "manager": "Sorengo Partners",
      "gsMarginExcess": "$337,266"
    },
    {
      "manager": "Tocaya",
      "gsMarginExcess": "$3,769,006"
    }
  ];

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'manager',
        headerName: 'Manager',
        width: 200,
        cellClass: 'fs-15'
      },
      {
        field: 'gsMarginExcess',
        headerName: 'GS Margin Excess',
        width: 200,
        cellClass: 'justify-end orange-color'
      }
    ];
  }

  return (
    <div className="height-100p">
      <DataGrid isSummaryGrid={true}
        rowData={rowData}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  )
}