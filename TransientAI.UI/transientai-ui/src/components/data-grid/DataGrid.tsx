'use client';

import { forwardRef, useCallback, useMemo, useRef } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';

export interface IDataGridProps extends AgGridReactProps {
  showGridTopSummary?: boolean;
  height?: number|string;
  isSummaryGrid?: boolean;
  suppressStatusBar?: boolean;
  suppressFloatingFilter?: boolean;
}

// Expose the Grid API via ref
export const DataGrid = forwardRef<GridApi | null, IDataGridProps>((props, ref) => {
  const gridRef = useRef<GridApi | null>(null);

  const finalProps: AgGridReactProps = {
    defaultColDef: {
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: true,
      width: 120,
      suppressHeaderFilterButton: true,
      ...props.defaultColDef
    },
    sideBar: false,
    enableRangeSelection: true,
    ...props
  };

  const onGridReady = useCallback((event: GridReadyEvent) => {
    gridRef.current = event.api;

    // Expose the Grid API to parent via ref
    if (ref && typeof ref === 'object') {
      ref.current = event.api;
    }

    const toolpanelid = gridRef.current.getOpenedToolPanel();
    if (toolpanelid) {
      gridRef.current.closeToolPanel();
    }
  }, [ref]);

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
    <div className={`ag-theme-balham-dark height-100p ${props.isSummaryGrid ? 'summary-grid' : ''}`} 
      style={{ height: props.height }}>
      <AgGridReact
        {...finalProps}
        statusBar={props.suppressStatusBar ? undefined : props.isSummaryGrid ? undefined : statusBar}
        onGridReady={onGridReady}
        rowHeight={props.isSummaryGrid ? 60 : 35}
        headerHeight={props.isSummaryGrid ? 60 : 35}
        floatingFiltersHeight={props.suppressFloatingFilter ? 0 : props.isSummaryGrid ? 25 : 20}
      />
    </div>
  );
});

export default DataGrid;
