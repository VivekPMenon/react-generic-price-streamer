import { useState, useContext, useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { DataGrid } from '../../common-components/data-grid';
import traceJson from '../../business-services/pricing-data/trace.json';
import { SearchDataContext } from '../../business-services/search-data-context';

export function Trace() {

  const [rowData] = useState<any[]>(traceJson as any[]);
  const { searchData } = useContext(SearchDataContext);

  const filteredTraces = useMemo(() => {
    if (!rowData?.length) {
      return;
    }
    
    return rowData
      .filter((instrument: any) => !searchData?.text || instrument.securityID.includes(searchData.text));
  }, [rowData, searchData?.text]);

  const [columnDefs] = useState<ColDef[]>([
    { "field": "tradeID" },
    { "field": "executionDate" },
    { "field": "executionTime" },
    { "field": "securityID" },
    { "field": "securityType" },
    { "field": "buySellIndicator" },
    { "field": "tradePrice" },
    { "field": "tradeQuantity" },
    { "field": "counterpartyID" },
    { "field": "tradeDate" },
    { "field": "settlementDate" },
    { "field": "executionVenue" },
    { "field": "yield" },
    { "field": "spread" },
    { "field": "tradeStatus" },
    { "field": "reportingPartyID" },
    { "field": "contraPartyID" },
    { "field": "tradeReportingType" },
    { "field": "currency" },
    { "field": "priceNotation" },
    { "field": "transactionFee" },
    { "field": "specialCondition" }
  ]);

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-label">Trace</span>
      </div>

      <div className="widget-content full-height">
        <DataGrid
          rowData={filteredTraces}
          columnDefs={columnDefs}>
        </DataGrid>
      </div>
    </div>
  );
} 
