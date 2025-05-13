import {MarketData, PeriodType} from "@/services/market-data";
import Highcharts, {RangeSelectorButtonsOptions} from "highcharts";
import dynamic from "next/dynamic";
import {enumToKeyValuePair, KeyValuePair} from "@/lib/utility-functions/enum-operations";
import "highcharts/modules/accessibility";
export const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

export type OLHCData = [number, number|undefined, number|undefined, number|undefined, number|undefined];

export function getFilterButtons(): RangeSelectorButtonsOptions[] {
    const keyValuePairs = enumToKeyValuePair(PeriodType);
    return keyValuePairs.map((value: KeyValuePair): RangeSelectorButtonsOptions | null => {
        const key = (value.value as string).toUpperCase();
        switch (key) {
            case 'YTD':
                return {
                    type: 'ytd',
                    text: key,
                };
            case 'MAX':
                return {
                    type: 'all',
                    text: 'All',
                };
            default:
                if (key.endsWith('D')) {
                    return {
                        type: 'day',
                        count: parseInt(key),
                        text: key,
                    }
                }
                if (key.endsWith('MO')) {
                    const count = parseInt(key);
                    return {
                        type: 'month',
                        count: count,
                        text: count + 'M',
                    }
                }
                if (key.endsWith('Y')) {
                    const count = parseInt(key);
                    return {
                        type: 'year',
                        count: count,
                        text: count + 'Y',
                    }
                }
                return null;
        }
    }).filter(button => button !== null);
}

export type MarketDataProvider = () => MarketData[]|null|undefined;

export function getChartOptions(
    marketDataProvider: MarketDataProvider,
    isNegative: boolean = false,
    ignoreNegative: boolean = false,
    enableExporting: boolean = true) {

    const marketData = marketDataProvider();
    let seriesData: [number, number|undefined, number|undefined, number|undefined, number|undefined][] = [];
    if (marketData?.length) {
        const today = new Date().setHours(0, 0, 0, 0);
        seriesData = marketData
            .filter(data => data.timestamp && data.timestamp.getTime() >= today)
            .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime())
            .map(data => {
                return [data.timestamp!.getTime(), data.open, data.high, data.low, data.close];
            });
    }

    let gradientStart: string;
    let gradientEnd: string;
    let areaStart: string;
    let areaEnd: string;
    let line: string;
    if (ignoreNegative || !isNegative) {
        gradientStart = 'rgba(25, 135, 84, 0.4)';
        gradientEnd = 'rgba(25, 135, 84, 0)';
        areaStart = 'rgba(0, 255, 0, 0.4)';
        areaEnd = 'rgba(0, 255, 0, 0)';
        line = '#28a745';
    } else {
        gradientStart = 'rgba(135,25,25,0.4)';
        gradientEnd = 'rgba(135, 25, 25, 0)';
        areaStart = 'rgba(255,0,0,0.4)';
        areaEnd = 'rgba(255,0,0,0)';
        line = '#a82929';
    }

    const chartOptions: Highcharts.Options = {
        chart: {
            backgroundColor: '#0C101B',
            height: '100px',
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            labels: { enabled: false, style: { color: '#dddddd' } },
            gridLineWidth: 0,
            crosshair: false
        },
        yAxis: {
            title: { text: null },
            labels: { enabled: false, style: { color: '#dddddd' } },
            gridLineWidth: 0,
            crosshair: false
        },
        navigator: {
            enabled: false,
            height: 50,
        },
        scrollbar: {
            enabled: false,
        },
        rangeSelector: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, gradientStart], // Green at top
                        [1, gradientEnd],   // Transparent at bottom
                    ],
                },
                lineColor: line, // Bright green line
                lineWidth: 2,
                marker: { enabled: false },
                threshold: null,
            },
        },
        series: [
            {
                type: 'area', // Add an area chart overlay for gradient effect
                name: 'Trend',
                data: seriesData.map(d => [d[0], d[4]]), // Use closing price for the area chart
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, areaStart], // Bright green at top
                        [1, areaEnd],   // Fully transparent at bottom
                    ],
                },
                lineColor: line, // Bright green line
                lineWidth: 2,
                enableMouseTracking: false,
                marker: { enabled: false },
                threshold: null,
            },
        ],
        tooltip: {
            enabled: false,
            valueDecimals: 2
        },
        exporting: {
            enabled: enableExporting,
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