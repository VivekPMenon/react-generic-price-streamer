import { useMemo } from "react";
import { DataGrid, getCurrencyColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { useRiskDataStore } from "@/services/risk-data/risk-data-store";
import {formatCurrency} from "@/lib/utility-functions";

export function RiskMetrics() {

  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);
  const { riskMetricsItems } = useRiskDataStore();  

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'name',
        headerName: 'Manager',
        width: 200,
        cellClass: 'fs-15'
      },
      {
        field: 'entity',
        headerName: 'Entity',
        width: 200
      },
      {
        field: 'margin_excess',
        headerName: 'GS Margin Excess',
        width: 200,
        ...getCurrencyColDefTemplate()
      }
    ];
  }

  return (
    <div className="height-100p">
      <DataGrid isSummaryGrid={true}
        rowData={riskMetricsItems}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  )
}