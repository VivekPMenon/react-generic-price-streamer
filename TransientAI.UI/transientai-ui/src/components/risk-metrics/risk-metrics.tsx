import { useMemo } from "react";
import { DataGrid, getCurrencyColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { useRiskDataStore } from "@/services/risk-data/risk-data-store";
import { useDeviceType } from "@/lib/hooks";

export function RiskMetrics() {

  const deviceType = useDeviceType();
  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);
  const { riskMetricsItems } = useRiskDataStore();  

  function getColumnDef(): ColDef[] {
    const columnWidth = deviceType === 'mobile' ? 130 : 200;
    return [
      {
        field: 'name',
        headerName: 'Manager',
        width: columnWidth,
        cellClass: 'fs-15'
      },
      {
        field: 'entity',
        headerName: 'Entity',
        width: columnWidth
      },
      {
        field: 'margin_excess',
        headerName: 'GS Margin Excess',
        width: columnWidth,
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