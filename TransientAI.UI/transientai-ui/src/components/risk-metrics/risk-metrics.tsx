import { useMemo } from "react";
import { DataGrid, getCurrencyColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { useRiskDataStore } from "@/services/risk-data/risk-data-store";
import { useDeviceType } from "@/lib/hooks";

export function RiskMetrics() {

  const deviceType = useDeviceType();
  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), [deviceType]);
  const { riskMetricsItems } = useRiskDataStore();  

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'name',
        headerName: 'Manager',
        width: deviceType === 'mobile' ? 140 : 150,
        cellClass: 'fs-15'
      },
      {
        field: 'entity',
        headerName: 'Entity',
        width: deviceType === 'mobile' ? 80: 100,
      },
      {
        field: 'margin_excess',
        headerName: 'GS Margin Excess',
        // wrapHeaderText: true,
        width: deviceType === 'mobile' ? 130: 150,
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
