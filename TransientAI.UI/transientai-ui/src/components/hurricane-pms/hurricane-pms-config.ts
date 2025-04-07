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
        field: 'name',
        headerName: 'Portfolio',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum',
        pinned: true,
    },
    {
        field: 'pl',
        headerName: 'P&L',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum'
    },
    {
        field: 'delta_adj_gross',
        headerName: 'Delta Adj Gross',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum'
    },
    {
        field: 'gmv_usage_percent',
        headerName: 'GMV Usage',
        width: 85,
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum'
    },
    {
        field: 'delta_adj',
        headerName: 'Delta Adj',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum'
    },
    {
        field: 'total_assets',
        headerName: 'Total Assets',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum'
    },
]

export const managerDetailsColDefs: ColDef[] = [
    {
        field: 'name',
        headerName: 'Manager',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'strategy',
        headerName: 'Strategy',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'order_side_1',
        headerName: 'Order Side',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'security_type',
        headerName: 'Security type',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'country_group',
        headerName: 'Country Group',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'ticker',
        headerName: 'Ticker',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'security_description',
        headerName: 'security Description',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'quantity',
        headerName: 'Quantity',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'status',
        headerName: 'Price Status',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'trade_date',
        headerName: 'Trade Date',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'settlement_date',
        headerName: 'Settlement Date',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'executing_broker',
        headerName: 'Execution Broker',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'clearing_broker',
        headerName: 'Cleaning Broker',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'currency',
        headerName: 'Security Currency',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
]

export const profitColDefs: ColDef[] = [
    {
        field: 'portfolio_manager',
        headerName: 'Profolio Manager',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'security',
        headerName: 'Security',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'last_price',
        headerName: 'Last Price',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'pl',
        headerName: 'P&L',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'pl_bps',
        headerName: 'PLBPs',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },

]

export const lossColDefs: ColDef[] = [
    {
        field: 'portfolio_manager',
        headerName: 'Profolio Manager',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'manager',
        headerName: 'Security',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'last_price',
        headerName: 'Last Price',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'pl',
        headerName: 'P&L',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        width: 85,
        aggFunc: 'sum'
    },
    {
        field: 'pl_bps',
        headerName: 'PLBPs',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum'
    },

]

export const defaultGridOptions: GridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data),
    autoSizeStrategy: {
        type: 'fitCellContents',
    },
};