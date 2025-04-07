import { useContext, useEffect } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef, RowDoubleClickedEvent } from "ag-grid-community";
import { ClientHolding } from "@/services/client-holding-data";
import { SearchDataContext } from "@/services/search-data";
import {useClientHoldingsStore} from "@/services/client-holding-data/client-holding-store";

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
    },
    {
      field: 'issuer_name',
      headerName: 'Issuer',
      width: 140
    },
  ];
}


export function Holdings() {
  const { searchData, setSearchData } = useContext(SearchDataContext);
  const { isClientHoldingsLoading, clientHoldings, loadClientHoldings } = useClientHoldingsStore();

  useEffect(() => {
    loadClientHoldings(searchData.id);
  }, [loadClientHoldings, searchData.id]);

  function onRowDoubleClicked(event: RowDoubleClickedEvent<ClientHolding>) {
    setSearchData({
      description: event.data?.security,
      id: event.data?.isin
    });
  }
  return (
    <div>
      <div className='sub-header'>Holdings</div>

      <DataGrid
        isSummaryGrid={true}
        loading={isClientHoldingsLoading}
        rowData={clientHoldings}
        columnDefs={getColumnDef()}
        onRowDoubleClicked={onRowDoubleClicked}>
      </DataGrid>
    </div>
  );
}