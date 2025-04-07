import styles from './hurricane-pms.module.scss';
import {
    FirstDataRenderedEvent,
    GetRowIdParams,
    GridSizeChangedEvent,
    ColDef,
    ValueFormatterParams,
    GridOptions,
    CellClassRules,
    CellClassParams,
    IRowNode
} from "ag-grid-community";

export const columnDefs: ColDef[] = [
    {
        field: 'manager',
        headerName: 'Portfolio',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        valueFormatter: (params: ValueFormatterParams) => '',
        width: 85,
        aggFunc: 'sum'
    },
]