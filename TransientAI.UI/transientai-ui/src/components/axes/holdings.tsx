import { useEffect, useState } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import { ClientHolding, clientHoldingsDataService } from "@/services/client-holding-data";

export function Holdings() {

  const [rowData, setRowData] = useState<ClientHolding[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  useEffect(() => {
    const loadClientHoldings = async () => {
      const bonds = await clientHoldingsDataService.getClientHoldings();
      setRowData(bonds);
    };

    loadClientHoldings();
  }, []);


  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'client_name',
        headerName: 'Client',
        width: 120
      },
      {
        field: 'security',
        headerName: 'Security',
        cellClass: 'orange-color',
        width: 120
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'par_held',
        headerName: 'Current Holding',
        width: 140,
        sort: 'desc'
      }
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