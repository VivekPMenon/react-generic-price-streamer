'use client'

import { DataGrid, getNumberColDefTemplate } from "../data-grid";
import { ColDef } from "ag-grid-community";
import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";

const columnDefs: ColDef[] = [
    {
        field: 'security',
        headerName: 'Security',
        cellClass: 'orange-color',
        width: 120
    },
    {
        field: 'bond_isin',
        headerName: 'ISIN',
        width: 120
    },
    {
        ...getNumberColDefTemplate(2),
        field: 'par_held',
        headerName: 'Position',
        width: 140,
        sort: 'desc'
    },
    {
      field: 'client_name',
      headerName: 'Client',
      width: 120,
      hide: true
    },

    {
      field: 'issuer_name',
      headerName: 'Issuer',
      width: 140,
      hide: true
    },
    {
        field: 'bond_description',
        headerName: 'Security',
        width: 120,
        hide: true
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