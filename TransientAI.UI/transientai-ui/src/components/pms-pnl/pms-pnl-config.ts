import {formatInteger} from "@/lib/utility-functions";
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
import styles from "@/components/pms-pnl/pms-pnl.module.scss";
import {executeAsync} from "@/lib/utility-functions/async";

function isPinned(node: IRowNode): boolean {
    return node.rowPinned === 'top';
}

function isManagerField(colDef: ColDef): boolean {
    return colDef.field === 'manager';
}

function isNoFeesField(colDef: ColDef): boolean {
    return (colDef.field?.endsWith('NoFees') ?? false);
}

enum CellType {
    TotalCell = 0,
    TotalNumericCell = 1,
    ManagerCell = 2,
    NoFeesCell = 3,
    WithFeesCell = 4,
}

function calculateCellType(params: CellClassParams): CellType {
    if (isPinned(params.node)) {
        return isManagerField(params.colDef)
            ? CellType.TotalCell
            : CellType.TotalNumericCell;
    }
    if (isManagerField(params.colDef)) {
        return CellType.ManagerCell;
    }
    return isNoFeesField(params.colDef)
        ? CellType.NoFeesCell
        : CellType.WithFeesCell;
}

const cellClassRules: CellClassRules = {};
cellClassRules[`${styles["total-cell"]}`] = (params: CellClassParams) => calculateCellType(params) === CellType.TotalCell;
cellClassRules[`${styles["total-cell-numeric"]}`] = (params: CellClassParams) => calculateCellType(params) === CellType.TotalNumericCell;
cellClassRules[`${styles["manager-cell"]}`] = (params: CellClassParams) => calculateCellType(params) === CellType.ManagerCell;
cellClassRules[`${styles["white-cell-numeric"]}`] = (params: CellClassParams) => calculateCellType(params) === CellType.NoFeesCell;
cellClassRules[`${styles["muted-cell-numeric"]}`] = (params: CellClassParams) => calculateCellType(params) === CellType.WithFeesCell;

export const columnDefs: ColDef[] = [
    {
        field: 'manager',
        headerName: 'Manager',
        headerClass: styles['table-header'],
        cellClassRules: cellClassRules,
        pinned: true,
        width: 150,
    },
    {
        field: 'dayPnl',
        headerName: 'Day PnL',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.dayPnl, ''),
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'mtdPnl',
        headerName: 'MTD PnL',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.mtdPnl, ''),
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'ytdPnl',
        headerName: 'YTD PnL',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.ytdPnl, ''),
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'dayPnlNoFees',
        headerName: 'Day PnL w/o Fees',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.dayPnlNoFees, ''),
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        aggFunc: 'sum'
    },
    {
        field: 'mtdPnlNoFees',
        headerName: 'MTD PnL w/o Fees',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.mtdPnlNoFees, ''),
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        aggFunc: 'sum'
    },
    {
        field: 'ytdPnlNoFees',
        headerName: 'YTD PnL w/o Fees',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.ytdPnlNoFees, ''),
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        aggFunc: 'sum'
    },
];

export function handleFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.resetRowHeights();
    params.api.sizeColumnsToFit();
}

export function handleGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.resetRowHeights();
    executeAsync(() => params.api.sizeColumnsToFit(), 10);
}

export const getGridOptions = (isMobile: boolean): GridOptions => ({
    getRowId: (params: GetRowIdParams) => String(params.data.manager),
    autoSizeStrategy: {
        type: isMobile ? 'fitCellContents'  : 'fitGridWidth',
    },
})