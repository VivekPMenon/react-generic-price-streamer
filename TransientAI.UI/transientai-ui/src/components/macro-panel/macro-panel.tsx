import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import {DataGrid} from "@/components/data-grid";
import {formatDecimal} from "@/lib/utility-functions";
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
            pinned: 'left'
        },
        {
            field: 'price',
            headerName: 'Last Price',
            cellClass: styles['cell-numeric'],
            valueFormatter: (params: any) => formatDecimal(params.data?.price, '', 4),
            filter: false,
            floatingFilter: false,
            headerClass: 'ag-right-aligned-header'
        },
        {
            field: 'change',
            headerName: '1D Chg',
            cellClassRules: cellClassRules,
            valueFormatter: (params: any) => formatDecimal(params.data?.change, '', 4),
            filter: false,
            floatingFilter: false,
            headerClass: 'ag-right-aligned-header'
        },
        {
            field: 'change_percentage',
            headerName: '1D % Chg',
            sort: 'desc',
            cellClassRules: cellClassRules,
            valueFormatter: (params: any) => formatDecimal(params.data?.change_percentage, '-', 2) + '%',
            filter: false,
            floatingFilter: false,
            headerClass: 'ag-right-aligned-header'
        }
    ];
const treasuryColumnDefs = [
    {
        field: 'name',
        headerName: 'US Treasuries',
        cellClass: styles['cell'],
        filter: false,
        floatingFilter: false,
        pinned: 'left'
    },
    {
        field: 'rate',
        headerName: 'Yield',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: any) => formatDecimal(params.data?.rate, '', 3),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header'
    },
    {
        field: 'one_day_change_bps',
        headerName: 'Yield 1D Chg (bps)',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.one_day_change_bps, '', 2),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        wrapHeaderText: true,
        autoHeaderHeight: true,
    },
    {
        field: 'ytd_change_bps',
        headerName: 'Yield YTD Chg (bps)',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.ytd_change_bps, '', 2),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header',
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
];

const cryptoColumnDefs = [
    {
        field: 'name',
        headerName: 'FX',
        cellClass: styles['cell'],
        filter: false,
        floatingFilter: false,
        pinned: 'left'
    },
    {
        field: 'price',
        headerName: 'Last Price',
        cellClass: styles['cell-numeric'],
        valueFormatter: (params: any) => formatDecimal(params.data?.price, '', 4),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header'
    },
    {
        field: 'change',
        headerName: '1D Chg',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.change, '', 4),
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header'
    },
    {
        field: 'change_percentage',
        headerName: '1D % Chg',
        sort: 'desc',
        cellClassRules: cellClassRules,
        valueFormatter: (params: any) => formatDecimal(params.data?.change_percentage, '-', 2) + '%',
        filter: false,
        floatingFilter: false,
        headerClass: 'ag-right-aligned-header'
    }
];

export function MacroPanel() {
  const { treasuryYields, fxRates, cryptos, isLoading } = useMacroPanelDataStore();

  return (
    <div className={`${styles['macro-panel']}`}>
        <div className={styles['fx-container']}>
            <div className="sub-header">FX Moves</div>
            <div className="sub-header">Change from the close</div>
            <DataGrid
                isSummaryGrid={false}
                rowData={fxRates}
                columnDefs={fxColumnDefs}
                loading={isLoading}
            />
        </div>
        <div className={styles['yields-container']}>
            <div className="sub-header">Yield Curve Changes</div>
            <div className="sub-header">Mid Yields</div>
            <DataGrid
                isSummaryGrid={false}
                rowData={treasuryYields}
                columnDefs={treasuryColumnDefs}
                loading={isLoading}
            />
        </div>
        <div className={styles['crypto-container']}>
            <div className="sub-header">Crypto</div>
            <div className="sub-header">Change from the close</div>
            <DataGrid
                isSummaryGrid={false}
                rowData={cryptos}
                columnDefs={cryptoColumnDefs}
                loading={isLoading}
            />
        </div>
    </div>
  );
}