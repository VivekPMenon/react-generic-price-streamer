'use client'

import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";

const columnDefs: ColDef[] = [
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


export function Holdings() {
  const { isSimilarBondsLoading, similarBonds } = useProductBrowserStore();

  return (
      <div className="height-100p">
        <div className='sub-header'>Holdings</div>

        <DataGrid
          height={'100%'}
          width={'100%'}
          isSummaryGrid={false}
          suppressStatusBar={true}
          loading={isSimilarBondsLoading}
          rowData={similarBonds}
          columnDefs={columnDefs}
        />
      </div>
  );
}