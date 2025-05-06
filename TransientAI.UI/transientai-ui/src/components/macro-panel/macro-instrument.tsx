import Highstock from 'highcharts/highstock';
import React, {useEffect, useState, memo} from 'react';
import {MarketData, marketDataService, PeriodType} from "@/services/market-data";
import {Spinner} from "@radix-ui/themes";
import styles from './macro-panel-tabs.module.scss';
import {formatDecimal} from "@/lib/utility-functions";
import {MarketDataType} from "@/services/macro-panel-data/model";
import {HighchartsReact, getChartOptions} from "@/lib/utility-functions/highcharts-operations";

export interface MacroInstrumentProps {
    symbol?: string;
    name: string;
    value?: number;
    change?: number;
    percent?: number;
    showCharts: boolean;
    marketData?: MarketData[];
    showPopupAction: (symbol: string, type?: MarketDataType, marketData?: MarketData[]) => void;
    changeSuffix?: string
    inverseChange?: boolean;
    type?: MarketDataType;
    setReportGenerationDate?: (value: Date|null) => void;
}

function MacroInstrument({symbol, type, name, value, change, percent, marketData: data, showCharts, showPopupAction, changeSuffix, inverseChange, setReportGenerationDate}: MacroInstrumentProps) {
    const [marketData, setMarketData] = useState<MarketData[]|undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (symbol) {
            if (data?.length ?? 0 > 0) {
                setIsLoading(false);
                setMarketData(data);
                return;
            }
            setIsLoading(true);
            const controller = new AbortController();
            marketDataService.getIntradayData(symbol, PeriodType.ONE_DAY, type, controller.signal)
                .then(result => {
                    if (result) {
                        if (setReportGenerationDate && symbol === 'YMUSD') {
                            setReportGenerationDate(result.timestamp);
                        }
                        setMarketData(result.marketData);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
            return () => {
                controller.abort();
            }
        } else {
            setIsLoading(false);
        }
    }, [data, symbol, type, setReportGenerationDate]);

    const isNegative = inverseChange === true
        ? ((change ?? 0.0) > 0.0)
        : ((change ?? 0.0) < 0.0);

    const isNegativeChange = ((change ?? 0.0) < 0.0);

    let content = null;
    if (showCharts) {
        content = isLoading
            ? (
                <div className={styles['market-data-no-graph']}>
                    <Spinner/>
                </div>
            )
            : marketData !== null
                ? (
                    <div
                        className={styles['market-data-graph']}
                        onDoubleClick={() => {
                            if (symbol) {
                                showPopupAction(symbol, type, marketData);
                            }
                        }}
                    >
                        <HighchartsReact
                            highcharts={Highstock}
                            constructorType={'stockChart'}
                            options={getChartOptions(() => marketData, isNegative, false, false)}
                        />
                    </div>
                )
                : (<div className={styles['market-data-no-graph']}/>);
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