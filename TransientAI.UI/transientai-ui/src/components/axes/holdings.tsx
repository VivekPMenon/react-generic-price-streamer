import { useContext, useEffect, useState } from "react";
import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef, RowDoubleClickedEvent } from "ag-grid-community";
import { ClientHolding, clientHoldingsDataService } from "@/services/client-holding-data";
import { SearchDataContext } from "@/services/search-data";

export function Holdings() {

  const { searchData, setSearchData } = useContext(SearchDataContext);

  const [rowData, setRowData] = useState<ClientHolding[]>();
  const [columnDefs] = useState<ColDef[]>(getColumnDef());

  useEffect(() => {
    const loadClientHoldings = async () => {
      const bonds = await clientHoldingsDataService.getClientHoldings(searchData.id);
      setRowData(bonds);
    };

    loadClientHoldings();
  }, [searchData?.id]);

  function onRowDoubleClicked(event: RowDoubleClickedEvent<ClientHolding>) {
    setSearchData({
      description: event.data?.security,
      id: event.data?.isin
    });
  }

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

  return (
    <div>
      <div className='sub-header'>Holdings</div>

      <DataGrid isSummaryGrid={true}
        rowData={rowData}
        columnDefs={columnDefs}
        onRowDoubleClicked={onRowDoubleClicked}>
      </DataGrid>
    </div>
  );
}