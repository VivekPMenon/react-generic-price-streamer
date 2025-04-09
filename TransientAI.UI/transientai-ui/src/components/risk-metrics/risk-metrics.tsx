'use client';
import { useMemo, memo } from "react";
import { DataGrid, getCurrencyColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { useRiskDataStore } from "@/services/risk-data/risk-data-store";
import { useDeviceType } from "@/lib/hooks";
import { useTranslation } from "react-i18next"; // Import i18n for translation

function RiskMetrics() {
  const { t } = useTranslation(); // Initialize translation
  const deviceType = useDeviceType();
  const { riskMetricsItems } = useRiskDataStore();  

  // Function to get column definitions with translated header text
  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), [deviceType, t]);

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'name',
        headerName: t('risk_metrics.MANAGER'), // Translated 'Manager'
        width: deviceType === 'mobile' ? 140 : 150,
        cellClass: 'fs-15'
      },
      {
        field: 'entity',
        headerName: t('risk_metrics.ENTITY'), // Translated 'Entity'
        width: deviceType === 'mobile' ? 80 : 100,
      },
      {
        field: 'margin_excess',
        headerName: t('risk_metrics.GS_MARGIN_EXCESS'), // Translated 'GS Margin Excess'
        width: deviceType === 'mobile' ? 130 : 150,
        ...getCurrencyColDefTemplate()
      }
    ];
  }

  return (
    <div className="height-100p">
      <DataGrid 
        isSummaryGrid={true}
        rowData={riskMetricsItems}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  );
}

export default memo(RiskMetrics);
