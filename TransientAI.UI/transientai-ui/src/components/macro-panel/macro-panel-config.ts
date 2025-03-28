import {formatDecimal, formatInteger} from "@/lib/utility-functions";
import {
    FirstDataRenderedEvent,
    GetRowIdParams,
    GridSizeChangedEvent,
    SortDirection,
    ColDef,
    RowHeightParams,
    ValueFormatterParams,
    CellClassRules,
    CellClassParams, GridOptions
} from "ag-grid-community";
import styles from "@/components/macro-panel/macro-panel.module.scss";
import {executeAsync} from "@/lib/utility-functions/async";

const cellClassRules: CellClassRules = {};
cellClassRules[`${styles["cell-numeric"]}`] = (params: CellClassParams) => params.value === 0.0;
cellClassRules[`${styles["cell-positive"]}`] = (params: CellClassParams) => params.value > 0.0;
cellClassRules[`${styles["cell-negative"]}`] = (params: CellClassParams) => params.value < 0.0;

export const equityFuturesColumnDefs: ColDef[] = [
    {
        field: 'group_name',
        cellClass: styles['cell'],
        rowGroup: true,
        hide: true
    },
    {
        field: 'name',
        headerName: 'Equity Futures',
        headerClass: styles['table-header'],
        cellClass: styles['cell'],
        filter: false,
        floatingFilter: false,
        pinned: true,
        width: 100,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'value',
        headerName: 'Value',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.value, '', 2),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'net_change',
        headerName: 'Net Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.net_change, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 90,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'percent_change',
        headerName: '% Chg',
        sort: 'desc' as SortDirection,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.percent_change, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

export const fxColumnDefs: ColDef[] = [
    {
        field: 'group_name',
        cellClass: styles['cell'],
        rowGroup: true,
        hide: true
    },
    {
        field: 'name',
        headerName: 'FX',
        cellClass: styles['cell'],
        headerClass: styles['table-header'],
        filter: false,
        floatingFilter: false,
        pinned: true,
        width: 90
    },
    {
        field: 'price',
        headerName: 'Last Price',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.price, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change',
        headerName: '1D Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.change, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 90,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change_percentage',
        headerName: '1D % Chg',
        sort: 'desc' as SortDirection,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.change_percentage, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

export const treasuryColumnDefs: ColDef[] = [
    {
        field: 'group_name',
        cellClass: styles['cell'],
        rowGroup: true,
        hide: true
    },
    {
        field: 'name',
        headerName: 'US Treasuries',
        cellClass: styles['bold-cell'],
        headerClass: styles['table-header'],
        filter: false,
        floatingFilter: false,
        pinned: true,
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        wrapText: true,
        autoHeight: true,
    },
    {
        field: 'rate',
        headerName: 'Yield',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.rate, '', 2),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 90
    },
    {
        field: 'one_day_change_bps',
        headerName: 'Yield 1D Chg (bps)',
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.one_day_change_bps, ''),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 70
    },
    {
        field: 'ytd_change_bps',
        headerName: 'Yield YTD Chg (bps)',
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.ytd_change_bps, ''),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 90
    }
];

export const cryptoColumnDefs: ColDef[] = [
    {
        field: 'name',
        headerName: 'Coin',
        headerClass: styles['table-header'],
        cellClass: styles['cell'],
        filter: false,
        floatingFilter: false,
        pinned: true,
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        wrapText: true,
        autoHeight: true,
    },
    {
        field: 'price',
        headerName: 'Last Price',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.price, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change',
        headerName: '1D Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.change, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change_percentage',
        headerName: '1D % Chg',
        sort: 'desc' as SortDirection,
        cellClassRules: cellClassRules,
        valueFormatter: (params: ValueFormatterParams) => formatDecimal(params.data?.change_percentage, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

export function handleFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.resetRowHeights();
    params.api.sizeColumnsToFit();
}

export function handleGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.resetRowHeights();
    executeAsync(() => params.api.sizeColumnsToFit(), 10);
}

export const groupRowRendererParams = {
    suppressCount: true,
    suppressPadding: true
};

export function getRowHeight(params: RowHeightParams){
    if (params.node.group && !params.node.firstChild) {
        return 40;
    }
    return 30;
}

export function getLargerRowHeight(params: RowHeightParams){
    if (params.node.group && !params.node.firstChild) {
        return 40;
    }
    return 35;
}

const defaultGridOptions: GridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.group_name) + String(params.data.name),
    autoSizeStrategy: {
        type: 'fitGridWidth',
    }
}

export const fxGridOptions: GridOptions = defaultGridOptions;

export const treasuryGridOptions: GridOptions = defaultGridOptions;

export const cryptoGridOptions : GridOptions = defaultGridOptions;

export const equityFuturesGridOptions: GridOptions = defaultGridOptions;
