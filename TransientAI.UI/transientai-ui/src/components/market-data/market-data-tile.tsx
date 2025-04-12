'use client';
import {useEffect, useRef, useMemo} from 'react';
import dynamic from 'next/dynamic';
import {useTranslation} from 'react-i18next'; // Import translation hook
import {Instrument, marketDataService, PeriodType} from "@/services/market-data";
import {formatDecimal, formatShortened} from "@/lib/utility-functions";
import Highcharts, {RangeSelectorButtonsOptions} from 'highcharts';
import Highstock from 'highcharts/highstock';
import "highcharts/modules/exporting";
import styles from './market-data-tile.module.scss';
import {formatDateTime} from "@/lib/utility-functions/date-operations";
import {enumToKeyValuePair, KeyValuePair} from "@/lib/utility-functions/enum-operations";
import {MarketDataType} from "@/services/macro-panel-data/model";

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

type OLHCData = [number, number|undefined, number|undefined, number|undefined, number|undefined];

export interface MarketDataTileProps {
    instrument: Instrument,
    logoUrl?: string;
    removeInstrument?: (instrument: Instrument) => void;
    showFinancialData?: boolean;
    showPriceSummary?: boolean;
    className?: string;
    isNegative?: boolean;
    ignoreNegative?: boolean;
}

function getFilterButtons(): RangeSelectorButtonsOptions[] {
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

function getChartOptions(instrument: Instrument,
                         isNegative: boolean = false,
                         ignoreNegative: boolean = false) {
    let seriesData: OLHCData[] = [];
    if (instrument.marketData?.length) {
        seriesData = instrument.marketData
            .filter(data => data.timestamp)
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
    if ((ignoreNegative && isNegative) || !isNegative) {
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
            gridLineWidth: 0
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
            buttons: getFilterButtons(),
            allButtonsEnabled: true,
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
                        fill: '#555555',
                        style: {
                            color: '#FFFFFF',
                        },
                    },
                    select: {
                        fill: 'white',
                        style: {
                            color: 'black',
                        },
                    },
                },
            },
            inputStyle: {
                color: '#FFFFFF',
                backgroundColor: '#333333',
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
                        [0, areaStart],
                        [1, areaEnd],
                    ],
                },
                lineColor: line,
                lineWidth: 2,
                marker: { enabled: false },
                threshold: null,
            },
        },
        series: [
            {
                type: 'ohlc',
                name: instrument.ticker,
                data: seriesData,
                // dataGrouping: {
                //     groupAll: true,
                // },
            },
            {
                type: 'area',
                name: 'Trend',
                data: seriesData.map(d => [d[0], d[4]]),
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, gradientStart],
                        [1, gradientEnd],
                    ],
                },
                lineColor: line,
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

function addButtonHandlers(chartOptions: Highcharts.Options, chart: any, ticker: string, type?: MarketDataType) {
    const selector = chartOptions.rangeSelector;
    const buttons = selector?.buttons;
    if (buttons?.length) {
        const controller = new AbortController();
        buttons.forEach(option => {
            if (option.type === 'day' && (option.count === 1 || option.count === 3)) {
                const periodType = option.count === 1
                    ? PeriodType.ONE_DAY
                    : PeriodType.THREE_DAY;

                const func = function () {
                    let isClicked = false;
                    return function () {
                        if (!chart?.series || isClicked) {
                            return true;
                        }
                        isClicked = true;

                        chart.showLoading();
                        marketDataService.getIntradayData(ticker, periodType, type, controller.signal)
                            .then(result => {
                                if (result && result.marketData?.length) {
                                    const olhc = chart.series[0];
                                    const area = chart.series[1];
                                    result.marketData.forEach(data => {
                                        if (data.timestamp) {
                                            const time = data.timestamp!.getTime();
                                            olhc.addPoint([time, data.open, data.high, data.low, data.close], false);
                                            area.addPoint([time, data.close], false);
                                        }
                                    });
                                    chart.redraw();
                                }
                            })
                            .finally(() => {
                                chart.hideLoading();
                            });
                        return true;
                    };
                };

                option.events = {
                    click: func()
                }
            }
        });
        return () => controller.abort();
    }
}

export function MarketDataTile({ instrument, logoUrl, removeInstrument, showFinancialData, showPriceSummary, className, ignoreNegative, isNegative }: MarketDataTileProps) {
    const { t } = useTranslation();  // Initialize translation hook
    const chartRef = useRef<any>(null);

    function handleError(e: any) {
        e.target.style.display = 'none';
    }

    const chartOptions = useMemo(
        () => getChartOptions(instrument, isNegative, ignoreNegative),
        [ignoreNegative, instrument, isNegative]);

    useEffect(() => {
        if (!chartRef.current?.chart) {
            return;
        }
        return addButtonHandlers(
            chartOptions,
            chartRef.current.chart,
            instrument.ticker,
            instrument.type);
    }, [chartRef.current?.chart, chartOptions, instrument.ticker, instrument.type]);

    let sign: string = '';
    let style: string;
    if (instrument.change === 0.0) {
        style = styles['price-change'];
    } else {
        if (instrument.change > 0.0) {
            sign = '+';
            style = styles['price-change-positive'];
        } else {
            style = styles['price-change-negative'];
        }
    }

    return (
        <div className={`${className ?? styles['tile']}`}>
            <div className={styles['remove-panel']}>
                {removeInstrument &&
                    (<i className={`fa-solid fa-x ${styles['remove-button']}`} onClick={() => removeInstrument(instrument)}></i>)}
            </div>
            <div className={`${styles['company-details']} `}>
                <div className={styles['logo']}>
                    {
                        logoUrl && (
                            <img
                                src={logoUrl}
                                alt={instrument.company_name}
                                loading={'lazy'}
                                onError={handleError}
                                height={50}
                                width={50}
                            />
                        )
                    }
                </div>
                <div className={styles['details']}>
                    <div className={styles['company-name']}>{instrument.company_name}</div>
                    <div>{instrument.ticker}</div>
                </div>
                <div className={styles['current-price-info']}>
                    <div className={styles['current-price-section']}>
                        <div className={`${styles['current-price']}`}>{formatDecimal(instrument.current_price, '-')}</div>
                        <div className={style}>{`${sign}${formatDecimal(instrument.change)}`}</div>
                        <div className={style}>{`(${sign}${formatDecimal(instrument.percent_change)}%)`}</div>
                    </div>
                    <div className={styles['price-timestamp']}>{t('market_data_1.as_of')} {formatDateTime(instrument.timestamp)}</div> {/* Translated "As of" */}
                </div>
            </div>
            {showFinancialData && (
                <div className={styles['financial-details']}>
                    <div>{t('market_data_1.quarterly_financials')}</div> {/* Translated "Quarterly financials" */}
                    <div className={styles['financial-details-table']}>
                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div>(USD)</div>
                            <div>{instrument.financials?.latest_quarter}</div>
                            <div>Y/Y</div>
                        </div>
                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div>{t('market_data_1.revenue')}</div> {/* Translated "Revenue" */}
                            <div className="blue-color">{formatShortened(instrument.financials?.revenue, '-')}</div>
                            <div className="blue-color">{formatDecimal(instrument.financials?.yoy_revenue, '-')}%</div>
                        </div>
                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div>Net income</div>
                            <div className="blue-color">{formatShortened(instrument.financials?.net_income, '-')}</div>
                            <div className="blue-color">{formatDecimal(instrument.financials?.yoy_net_income, '-')}%</div>
                        </div>

                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div>Diluted EPS</div>
                            <div className="blue-color">{formatShortened(instrument.financials?.diluted_eps, '-')}</div>
                            <div className="blue-color">{formatDecimal(instrument.financials?.yoy_eps, '-')}%</div>
                        </div>

                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div>Net profit margin</div>
                            <div className="blue-color">{formatDecimal(instrument.financials?.net_profit_margin, '-')}%</div>
                            <div className="blue-color">{formatDecimal(instrument.financials?.yoy_net_profit_margin, '-')}%</div>
                        </div>

                        <div className="grid ">
                            <div>Earnings call</div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div>Previous</div>
                            <div>EPS</div>
                            <div>Revenue</div>
                        </div>

                        <div className="grid grid-cols-[40%_30%_30%]">
                            <div></div>
                            <div className="blue-color">{`${instrument.financials?.eps_beat ?? ''} ${formatDecimal(instrument.financials?.eps_surprise, '-')}%`}</div>
                            <div className="blue-color">{`${instrument.financials?.revenue_beat ?? ''} ${formatDecimal(instrument.financials?.revenue_surprise, '-')}%`}</div>
                        </div>
                    </div>
                </div>
            )}
            {showPriceSummary && (
                <div className={styles['price-summary-table']}>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="">{t('market_data_1.open')}</div> {/* Translated "Open" */}
                        <div className="blue-color">{formatDecimal(instrument.lastMarketData?.open, '-')}</div>
                        <div className="">{t('market_data_1.high')}</div> {/* Translated "High" */}
                        <div className="blue-color">{formatDecimal(instrument.lastMarketData?.high, '-')}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="">{t('market_data_1.prev_close')}</div> {/* Translated "Prev Close" */}
                        <div className="blue-color">{formatDecimal(instrument.previous_close, '-')}</div>
                        <div className="">{t('market_data_1.low')}</div> {/* Translated "Low" */}
                        <div className="blue-color">{formatDecimal(instrument.lastMarketData?.low, '-')}</div>
                    </div>
                </div>
            )}
            <div>
                <HighchartsReact
                    ref={chartRef}
                    highcharts={Highstock}
                    constructorType={'stockChart'}
                    options={chartOptions}
                />
            </div>
        </div>
    );
}
