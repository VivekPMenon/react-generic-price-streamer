'use client';

import { DataGrid, getNumberColDefTemplate } from "../../components/data-grid";
import { ColDef } from "ag-grid-community";
import stpFeedJson from './stp-feed-mock.json';

const columnDefs: ColDef[] = [
  { headerName: 'Status', field: 'status', floatingFilter: false },
  { headerName: 'Date', field: 'date' , floatingFilter: false},
  { headerName: 'Last Update', field: 'lastUpdate' , floatingFilter: false},
  { headerName: 'File Name', field: 'fileName', flex: 1, floatingFilter: false },
  { headerName: 'Total Rows', field: 'totalRows', floatingFilter: false },
  { headerName: 'Rows Failed', field: 'rowsFailed', floatingFilter: false },
  { headerName: 'Rows Succeeded', field: 'rowsSucceeded', floatingFilter: false },
  { headerName: 'Status Messages', field: 'statusMessages', floatingFilter: false },
  { headerName: 'External Platform', field: 'externalPlatform' , floatingFilter: false},
  { headerName: 'File Owner', field: 'fileOwner', floatingFilter: false },
  { headerName: 'External Platform Id', field: 'externalPlatformId', floatingFilter: false },
  { headerName: 'Error Report', field: 'errorReport', floatingFilter: false },
];

export function StpFeeds() {

  return (
    <div className="height-100p">
      <DataGrid
        isSummaryGrid={false}
        suppressStatusBar={true}
        rowData={stpFeedJson as any}
        columnDefs={columnDefs}>
      </DataGrid>
    </div>
  );
}