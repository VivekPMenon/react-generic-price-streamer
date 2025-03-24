import {formatDecimal, formatInteger} from "@/lib/utility-functions";
import {GetRowIdParams, SortDirection} from "ag-grid-community";
import styles from "@/components/macro-panel/macro-panel.module.scss";

const cellClassRules: {[key: string]: any} = {};
cellClassRules[`${styles["cell-numeric"]}`] = (params: any) => params.value === 0.0;
cellClassRules[`${styles["cell-positive"]}`] = (params: any) => params.value > 0.0;
cellClassRules[`${styles["cell-negative"]}`] = (params: any) => params.value < 0.0;

export const equityFuturesColumnDefs = [
    {
        field: 'group_name',
        cellClass: styles['cell'],
        rowGroup: true,
        hide: true
    },
    {
        field: 'name',
        headerName: 'Equity Futures',
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
        valueFormatter: (params: any) => formatDecimal(params.data?.value, '', 2),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'net_change',
        headerName: 'Net Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.net_change, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 90,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'percent_change',
        headerName: '% Chg',
        sort: 'desc' as SortDirection,
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.percent_change, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

export const fxColumnDefs = [
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
        filter: false,
        floatingFilter: false,
        pinned: true,
        width: 90
    },
    {
        field: 'price',
        headerName: 'Last Price',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: any) => formatDecimal(params.data?.price, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 85,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change',
        headerName: '1D Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.change, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 90,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change_percentage',
        headerName: '1D % Chg',
        sort: 'desc' as SortDirection,
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.change_percentage, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

export const treasuryColumnDefs = [
    {
        field: 'group_name',
        cellClass: styles['cell'],
        rowGroup: true,
        hide: true
    },
    {
        field: 'name',
        headerName: 'US Treasuries',
        cellClass: styles['cell'],
        filter: false,
        floatingFilter: false,
        pinned: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
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
        valueFormatter: (params: any) => formatDecimal(params.data?.rate, '', 2),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 90
    },
    {
        field: 'one_day_change_bps',
        headerName: 'Yield 1D Chg (bps)',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatInteger(params.data?.one_day_change_bps, ''),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 70
    },
    {
        field: 'ytd_change_bps',
        headerName: 'Yield YTD Chg (bps)',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatInteger(params.data?.ytd_change_bps, ''),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 90
    }
];

export const cryptoColumnDefs = [
    {
        field: 'name',
        headerName: 'Coin',
        cellClass: styles['cell'],
        filter: false,
        floatingFilter: false,
        pinned: true,
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'price',
        headerName: 'Last Price',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: any) => formatDecimal(params.data?.price, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 100,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change',
        headerName: '1D Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.change, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'change_percentage',
        headerName: '1D % Chg',
        sort: 'desc' as SortDirection,
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.change_percentage, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        width: 95,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

export function handleDataRendered(params: any) {
    if (params?.sizeColumnsToFit) {
        params.sizeColumnsToFit();
    } else if (params?.api?.sizeColumnsToFit) {
        params.api.sizeColumnsToFit();
    }
}

export const groupRowRendererParams = {
    suppressCount: true,
    suppressPadding: true
};

export function getRowHeight(params: any){
    if (params.node.group && !params.node.firstChild) {
        return 60;
    }
    return 30;
}

export function getEquityFuturesRowHeight(params: any){
    if (params.node.group && !params.node.firstChild) {
        return 60;
    }
    return 35;
}

export const fxGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}

export const treasuryGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}

export const cryptoGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}

export const equityFuturesGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}
