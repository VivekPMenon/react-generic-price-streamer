import dynamic from 'next/dynamic';
import Highcharts from 'highcharts';
import Highstock from 'highcharts/highstock';
import React, {useEffect, useState, memo} from 'react';
import {Instrument, marketDataService} from "@/services/market-data";
import {Spinner} from "@radix-ui/themes";
import styles from './macro-panel-tabs.module.scss';
import {formatDecimal} from "@/lib/utility-functions";
import {MarketDataType} from "@/services/macro-panel-data/model";

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

function getChartOptions(instrument: Instrument, isNegative: boolean = false, ignoreNegative: boolean = false) {
    let seriesData: any[] = [];
    if (instrument.marketData?.length) {
        seriesData = instrument.marketData.map(data => {
            const date = new Date(data.timestamp!);
            return [date.getTime(), data.open, data.high, data.low, data.close];
        });
    }

    let gradientStart: string;
    let gradientEnd: string;
    let areaStart: string;
    let areaEnd: string;
    let line: string;
    if (ignoreNegative && !isNegative) {
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
            enabled: false,
            selected: 1,
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
                dataGrouping: {
                    units: [['day', [1]]]
                },
            },
        ],
        tooltip: {
            enabled: false,
            valueDecimals: 2
        },
        exporting: {
            enabled: false,
        }
    };

    return chartOptions;
}

export interface MacroInstrumentProps {
    symbol?: string;
    name: string;
    value?: number;
    change?: number;
    percent?: number;
    showCharts: boolean;
    showPopupAction: (symbol: string, type?: MarketDataType, instrument?: Instrument) => void;
    changeSuffix?: string
    inverseChange?: boolean;
    type?: MarketDataType;
}

function MacroInstrument({symbol, type, name, value, change, percent, showCharts, showPopupAction, changeSuffix, inverseChange}: MacroInstrumentProps) {
    const [instrument, setInstrument] = useState<Instrument|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (symbol) {
            setIsLoading(true);
            marketDataService.getIntradayData(symbol, type)
                .then(data => {
                    if (data) {
                        setInstrument(data);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [symbol, type]);

    const isNegative = inverseChange === true
        ? ((change ?? 0.0) > 0.0)
        : ((change ?? 0.0) < 0.0);

    const isNegativeChange = ((change ?? 0.0) < 0.0);

    let content = null;
    if (showCharts) {
        content = isLoading
            ? (
                <div className={styles['market-data-no-graph']}>
                    <Spinner />
                </div>
            )
            : instrument !== null
                ? (
                    <div
                        className={styles['market-data-graph']}
                        onDoubleClick={()=> {
                            if (symbol) {
                                showPopupAction(symbol, type, instrument || undefined);
                            }
                        }}
                    >
                        <HighchartsReact
                            highcharts={Highstock}
                            constructorType={'stockChart'}
                            options={getChartOptions(instrument, isNegative, false)}
                        />
                    </div>
                )
                : (<div className={styles['market-data-no-graph']} />)
    }

    return (
        <div className={styles['market-data' + (showCharts ? '' : '-no-chart')]}>
            <div className={styles['market-data-name']}>{name}</div>
            <div className={styles['market-data-value']}>{formatDecimal(value, '', 3)}</div>
            <div className={styles['market-data-change' + (isNegative ? '-negative' : '')]}>{(isNegativeChange ? '-' : '+') + formatDecimal(Math.abs(change ?? 0.0), '', 3) + (changeSuffix ?? '')}</div>
            <div className={styles['market-data-percent' + (isNegative ? '-negative' : '')]}>({(isNegativeChange ? '-' : '+') + formatDecimal(Math.abs(percent ?? 0.0), '-', 2)}%)</div>
            {
                content
            }
        </div>
    );
}

export default memo(MacroInstrument);