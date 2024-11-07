import { useCallback, useMemo } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import styles from './datagrid.module.scss';
import { GridApi, GridReadyEvent } from "ag-grid-community";

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
      width: 120,
      ...props.defaultColDef
    },
    sideBar: true,
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
      {/* <div className={styles["grid-summary"]}>
        <div className={styles["record-summary"]}>

        </div>
        <div className={styles["action-buttons"]}>
          <i className="cil-settings"></i>
        </div>
      </div> */}

      <div className="ag-theme-balham-dark" style={{ height: props.height }}>
        <AgGridReact {...finalProps}
          statusBar={statusBar}
          onGridReady={onGridReady}>
        </AgGridReact>
      </div>
    </>
  );
}