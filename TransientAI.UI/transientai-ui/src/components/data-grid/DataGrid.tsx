'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import styles from './datagrid.module.scss';
import { GridApi, GridReadyEvent } from "ag-grid-community";
import 'ag-grid-enterprise';

export interface IDataGridProps extends AgGridReactProps {
  showGridTopSummary?: boolean;
  height?: number;
}

export function DataGrid(props: IDataGridProps) {

  let gridApi: GridApi;

  const finalProps: AgGridReactProps = {
    defaultColDef: {
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: true,
      width: 120,
      ...props.defaultColDef
    },
    sideBar: false,
    enableRangeSelection: true,
    ...props
  };

  const onGridReady = useCallback((event: GridReadyEvent) => {
    gridApi = event.api;

    const toolpanelid = gridApi.getOpenedToolPanel();
    if (toolpanelid) {
      gridApi.closeToolPanel();
    }
  }, []);

  const statusBar = useMemo(() => {
    return {
      statusPanels: [
        { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },        
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' },
      ],
    };
  }, []);

  return (
    <>
      <div className="ag-theme-balham-dark height-100p" style={{ height: props.height }}>
        <AgGridReact {...finalProps}
          statusBar={statusBar}
          onGridReady={onGridReady}>
        </AgGridReact>
      </div>
    </>
  );
}