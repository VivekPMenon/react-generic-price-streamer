import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import {DataGrid} from "@/components/data-grid";
import { SortDirection } from 'ag-grid-community';
import {formatDecimal, formatInteger} from "@/lib/utility-functions";
import styles from './macro-panel.module.scss';

const cellClassRules: {[key: string]: any} = {};
cellClassRules[`${styles["cell-numeric"]}`] = (params: any) => params.value === 0.0;
cellClassRules[`${styles["cell-positive"]}`] = (params: any) => params.value > 0.0;
cellClassRules[`${styles["cell-negative"]}`] = (params: any) => params.value < 0.0;

const fxColumnDefs = [
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
const treasuryColumnDefs = [
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

const cryptoColumnDefs = [
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
        wrapText: true,
        autoHeight: true,
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

function handleDataRendered(params: any) {
    params.api.sizeColumnsToFit();
}

export function MacroPanel() {
  const { treasuryYields, fxRates, cryptos, isLoading } = useMacroPanelDataStore();

  return (
      <div>
        <div className="sub-header">Morning Report: Generated {new Date().toLocaleDateString()} 06:00 AM </div>
        <div className={`${styles['macro-panel']}`}>
            <div className={styles['fx-container']}>
                <div className="sub-header">FX Moves</div>
                <div className="sub-header">Change from the close</div>
                <DataGrid
                    height={875}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    rowData={fxRates}
                    columnDefs={fxColumnDefs}
                    loading={isLoading}
                    onFirstDataRendered={handleDataRendered}
                />
            </div>
            <div className={styles['yields-container']}>
                <div className="sub-header">Yield Curve Changes</div>
                <div className="sub-header">Mid Yields</div>
                <DataGrid
                    height={500}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    rowData={treasuryYields}
                    columnDefs={treasuryColumnDefs}
                    loading={isLoading}
                    onFirstDataRendered={handleDataRendered}
                />
            </div>
            <div className={styles['crypto-container']}>
                <div className="sub-header">Crypto</div>
                <div className="sub-header">Change from the close</div>
                <DataGrid
                    height={500}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    rowData={cryptos}
                    columnDefs={cryptoColumnDefs}
                    loading={isLoading}
                    onFirstDataRendered={handleDataRendered}
                />
            </div>
        </div>
      </div>
  );
}