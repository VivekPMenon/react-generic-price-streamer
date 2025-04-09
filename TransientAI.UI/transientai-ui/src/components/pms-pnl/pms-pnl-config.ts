import { formatInteger } from "@/lib/utility-functions";
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
import { executeAsync } from "@/lib/utility-functions/async";
import i18n from "../../i18n";  // Import i18n

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
        headerName: i18n.t('manager'),  // Use i18n for 'Manager'
        headerClass: styles['table-header'],
        cellClassRules: cellClassRules,
        pinned: true,
        width: 150,
    },
    {
        field: 'dayPnl',
        headerName: i18n.t('dayPnl'),  // Use i18n for 'Day PnL'
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.dayPnl, ''),
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'mtdPnl',
        headerName: i18n.t('mtdPnl'),  // Use i18n for 'MTD PnL'
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.mtdPnl, ''),
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'ytdPnl',
        headerName: i18n.t('ytdPnl'),  // Use i18n for 'YTD PnL'
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.ytdPnl, ''),
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'dayPnlNoFees',
        headerName: i18n.t('dayPnlNoFees'),  // Use i18n for 'Day PnL w/o Fees'
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
        headerName: i18n.t('mtdPnlNoFees'),  // Use i18n for 'MTD PnL w/o Fees'
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
        headerName: i18n.t('ytdPnlNoFees'),  // Use i18n for 'YTD PnL w/o Fees'
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

export const defaultGridOptions: GridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.manager),
    autoSizeStrategy: {
        type: 'fitCellContents',
    },
};
