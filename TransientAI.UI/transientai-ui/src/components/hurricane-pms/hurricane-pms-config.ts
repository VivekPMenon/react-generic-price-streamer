import { formatInteger } from '@/lib/utility-functions';
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
import PLHighchartsRenderer from './PLHighchartsRenderer';
import PLredChartRenderer from './PLredChartsRenderer'

export const columnDefs: ColDef[] = [
    {
        field: 'name',
        headerName: 'Portfolio',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        aggFunc: 'sum',
    },
    {
        field: 'pl',
        headerName: 'P&L',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellStyle: params => params.value < 0 ? { color: '#ff4d4f' } : { color: '#52c41a' },
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.pl, ''),
        aggFunc: 'sum'
    },
    {
        field: 'delta_adj_gross',
        headerName: 'Delta Adj Gross',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        valueFormatter: (params: ValueFormatterParams) => {
            const value = params.data?.delta_adj_gross;
            return value != null ? `$ ${formatInteger(value, '')}` : '';
        },
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
        valueFormatter: (params: ValueFormatterParams) => {
            const value = params.data?.delta_adj;
            return value != null ? `$ ${formatInteger(value, '')}` : '';
        },
        aggFunc: 'sum'
    },
    {
        field: 'total_assets',
        headerName: 'Total Assets',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.total_assets, ''),
        aggFunc: 'sum'
    },
]

export const managerDetailsColDefs: ColDef[] = [
    {
        field: 'manager_name',
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
        field: 'order_side',
        headerName: 'Order Side',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        cellStyle: params => params.value !== "Buy" ? { color: '#ff4d4f' } : { color: '#52c41a' },
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
        // Use the React component
        cellRenderer: PLHighchartsRenderer,
        valueFormatter: (params: ValueFormatterParams) => formatInteger(params.data?.pl, ''),
        aggFunc: 'sum',
        cellStyle: { color: '#52c41a' },
        width: 130 // Ensure enough space for the chart
    },
    {
        field: 'pl_bps',
        headerName: 'PLBPs',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        valueFormatter: (params: ValueFormatterParams) => {
            const value = params.value;
            return value != null ? `${value} bps` : '';
        },
        cellStyle: { color: '#52c41a' },
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
        width: 130,
        cellRenderer: PLredChartRenderer, 
        valueFormatter: (params: ValueFormatterParams) => {
            const value = params.data?.pl;
            return value != null ? `$ ${formatInteger(value, '')}` : '';
        },
        cellStyle: { color: '#ff4d4f' },
        aggFunc: 'sum'
    },
    {
        field: 'pl_bps',
        headerName: 'PLBPs',
        headerClass: `${styles['table-header']} ag-right-aligned-header`,
        valueFormatter: (params: ValueFormatterParams) => {
            const value = params.value;
            return value != null ? `${value} bps` : '';
        },
        cellStyle: { color: '#ff4d4f' },
        aggFunc: 'sum'
    },

]

export const defaultGridOptions: GridOptions = {
    autoSizeStrategy: {
        type: 'fitCellContents',
    },
};