import Highstock from "highcharts/highstock";
import dynamic from 'next/dynamic';
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

import {useState} from 'react';
import { useMacroPanelDataStore } from "@/services/macro-panel-data/macro-panel-data-store";
import {DataGrid} from "@/components/data-grid";
import { SortDirection, GetRowIdParams, CellDoubleClickedEvent } from 'ag-grid-community';
import {formatDecimal, formatInteger} from "@/lib/utility-functions";
import {CustomGroupCellRenderer} from "@/components/macro-panel/customGroupCellRenderer";
import styles from './macro-panel.module.scss';
import {MarketData, marketDataService} from "@/services/market-data";
import Highcharts from "highcharts";
import {Spinner} from "@radix-ui/themes";

const cellClassRules: {[key: string]: any} = {};
cellClassRules[`${styles["cell-numeric"]}`] = (params: any) => params.value === 0.0;
cellClassRules[`${styles["cell-positive"]}`] = (params: any) => params.value > 0.0;
cellClassRules[`${styles["cell-negative"]}`] = (params: any) => params.value < 0.0;

const fxColumnDefs = [
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
const treasuryColumnDefs = [
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

function getChartOptions(ticker: string, marketData: MarketData[]|undefined) {
    let seriesData: any[] = [];
    if (marketData?.length) {
        seriesData = marketData.map(data => {
            const date = new Date(data.date!);
            return [date.getTime(), data.open, data.high, data.low, data.close];
        });
    }

    const chartOptions: Highcharts.Options = {
        chart: {
            backgroundColor: '#0C101B',
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            labels: { style: { color: '#dddddd' } },
            gridLineWidth: 0,
        },
        yAxis: {
            title: { text: null },
            labels: { style: { color: '#dddddd' } },
            gridLineWidth: 0,
        },
        navigator: {
            enabled: true,
            height: 50,
        },
        scrollbar: {
            enabled: false,
        },
        rangeSelector: {
            enabled: true,
            inputEnabled: false,
            buttons: [
                {
                    type: 'month',
                    count: 1,
                    text: '1M',
                },
                {
                    type: 'month',
                    count: 3,
                    text: '3M',
                },
                {
                    type: 'month',
                    count: 6,
                    text: '6M',
                },
                {
                    type: 'ytd',
                    text: 'YTD',
                },
                {
                    type: 'year',
                    count: 1,
                    text: '1Y',
                },
                {
                    type: 'all',
                    text: 'All',
                }
            ],
            buttonTheme: {
                fill: '#1E2128',
                stroke: '#1E2128',
                padding: 7,
                style: {
                    color: '#FFFFFF',
                    borderRadius: 5
                },
                states: {
                    hover: {
                        fill: '#555555', // Background color on hover
                        style: {
                            color: '#FFFFFF', // Text color on hover
                        },
                    },
                    select: {
                        fill: 'white', // Background color when selected
                        style: {
                            color: 'black', // Text color when selected
                        },
                    },
                },
            },
            inputStyle: {
                color: '#FFFFFF', // Input text color
                backgroundColor: '#333333', // Input background color
            },
            labelStyle: {
                color: '#FFFFFF'
            },
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(25, 135, 84, 0.4)'], // Green at top
                        [1, 'rgba(25, 135, 84, 0)'],   // Transparent at bottom
                    ],
                },
                lineColor: '#28a745', // Bright green line
                lineWidth: 2,
                marker: { enabled: false },
                threshold: null,
            },
        },
        series: [
            {
                type: 'ohlc',
                name: ticker,
                data: seriesData,
                dataGrouping: {
                    groupAll: true,
                },
            },
            {
                type: 'area', // Add an area chart overlay for gradient effect
                name: 'Trend',
                data: seriesData.map(d => [d[0], d[4]]), // Use closing price for the area chart
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(0, 255, 0, 0.4)'], // Bright green at top
                        [1, 'rgba(0, 255, 0, 0)'],   // Fully transparent at bottom
                    ],
                },
                lineColor: '#28a745', // Bright green line
                lineWidth: 2,
                marker: { enabled: false },
                threshold: null,
            },
        ],
        tooltip: {
            valueDecimals: 2
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    theme: {
                        fill: '#1E2128'
                    }
                }
            }
        }
    };

    return chartOptions;
}

function handleDataRendered(params: any) {
    params.api.sizeColumnsToFit();
}

const groupRowRendererParams = {
    suppressCount: true,
    suppressPadding: true
};

function getRowHeight(params: any){
    if (params.node.group && !params.node.firstChild) {
        return 60;
    }
    return 30;
}

const fxGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}

const treasuryGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}

const cryptoGridOptions = {
    getRowId: (params: GetRowIdParams) => String(params.data.name),
}

export function MacroPanel() {
  const { treasuryYields, fxRates, cryptos, isLoading } = useMacroPanelDataStore();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options|null>(null);
  const [isChartLoading, setIsChartLoading] = useState(false);

  return (
      <div>
        <div className="sub-header">Morning Report: Generated {new Date(new Date().setHours(6, 0, 0)).toLocaleString()}</div>
        <div className={`${styles['macro-panel']}`}>
            <div className={styles['fx-container']}>
                <div className="sub-header">FX Moves</div>
                <div className="sub-header">Change from the close</div>
                <DataGrid
                    height={450}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    rowData={fxRates}
                    columnDefs={fxColumnDefs}
                    loading={isLoading}
                    gridOptions={fxGridOptions}
                    groupDisplayType={'groupRows'}
                    groupRowRendererParams={groupRowRendererParams}
                    groupRowRenderer={CustomGroupCellRenderer}
                    groupDefaultExpanded={1}
                    getRowHeight={getRowHeight}
                    onFirstDataRendered={handleDataRendered}
                    onCellDoubleClicked={(params: CellDoubleClickedEvent<any>) => {
                        if (params.colDef.field === 'name') {
                            setChartOptions(null);
                            setIsChartLoading(true);;
                            marketDataService.getMarketData(params.data.name)
                                .then(data => {
                                    if (data) {
                                        setChartOptions(getChartOptions(data.ticker, data.marketData))
                                    }
                                })
                                .finally(() => setIsChartLoading(false));
                        }
                    }}
                />
                <div className={styles['chart-container']}>
                    {
                        isChartLoading
                            ? (<Spinner size={"2"}/>)
                            : chartOptions && (<HighchartsReact
                                highcharts={Highstock}
                                constructorType={'stockChart'}
                                options={chartOptions}
                            />)
                    }
                </div>
            </div>
            <div className={styles['yields-container']}>
                <div className="sub-header">Yield Curve Changes</div>
                <div className="sub-header">Mid Yields</div>
                <DataGrid
                    height={500}
                    isSummaryGrid={false}
                    suppressStatusBar={true}
                    suppressFloatingFilter={true}
                    rowData={treasuryYields}
                    columnDefs={treasuryColumnDefs}
                    loading={isLoading}
                    gridOptions={treasuryGridOptions}
                    groupDisplayType={'groupRows'}
                    groupRowRendererParams={groupRowRendererParams}
                    groupRowRenderer={CustomGroupCellRenderer}
                    groupDefaultExpanded={1}
                    getRowHeight={getRowHeight}
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
                    suppressFloatingFilter={true}
                    rowData={cryptos}
                    columnDefs={cryptoColumnDefs}
                    loading={isLoading}
                    getRowHeight={getRowHeight}
                    gridOptions={cryptoGridOptions}
                    onFirstDataRendered={handleDataRendered}
                />
            </div>
        </div>
      </div>
  );
}