'use client';

import dynamic from 'next/dynamic';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });
import {Instrument} from "@/services/market-data";
import { formatCurrency, formatDecimal, formatShortened } from "@/lib/utility-functions";
import Highcharts from 'highcharts';
import Highstock from 'highcharts/highstock';
import "highcharts/modules/exporting";
import styles from './market-data-tile.module.scss';

export interface MarketDataTileProps {
    instrument: Instrument,
    logoUrl: string;
    removeInstrument: (instrument: Instrument) => void;
}

function getChartOptions(instrument: Instrument) {
    let seriesData: any[] = [];
    if (instrument.marketData?.length) {
      seriesData = instrument.marketData.map(data => {
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
            type: 'day',
            count: 7,
            text: '1W', // Label for the button
          },
          {
            type: 'day',
            count: 14,
            text: '2W', // Label for the button
          },
          {
            type: 'month',
            count: 1,
            text: '1M', // Label for the button
          },
          {
            type: 'all',
            text: 'All', // Label for the button
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
          name: instrument.ticker,
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

export function MarketDataTile({instrument, logoUrl, removeInstrument}: MarketDataTileProps) {
    return (
        <div className={`${styles['tile']} scrollable-div`}>
            <div className={styles['remove-panel']}>
                <i className={`fa-solid fa-x ${styles['remove-button']}`} onClick={() => removeInstrument(instrument)}></i>
            </div>
            <div className={`${styles['company-details']} `}>
                <div className={styles['logo']}>
                    <img
                        src={logoUrl}
                        alt={instrument.company_name}
                    />
                </div>
                <div className={styles['details']}>
                    <div>{instrument.company_name}</div>
                    <div>{instrument.ticker}</div>
                </div>
            </div>
            <div className={`${styles['financial-details']}`}>
                <div>Quarterly financials</div>
                <div className={styles['financial-details-table']}>
                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div>(USD)</div>
                        <div>{instrument.financials?.latest_quarter}</div>
                        <div>Y/Y</div>
                    </div>

                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div>Revenue</div>
                        <div className="blue-color">{formatShortened(instrument.financials?.revenue, '-')}</div>
                        <div className="blue-color">{formatDecimal(instrument.financials?.yoy_revenue, '-')}%</div>
                    </div>

                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div>Net income</div>
                        <div className="blue-color">{formatShortened(instrument.financials?.net_income, '-')}</div>
                        <div className="blue-color">{formatDecimal(instrument.financials?.yoy_net_income, '-')}%</div>
                    </div>

                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div>Diluted EPS</div>
                        <div className="blue-color">{formatShortened(instrument.financials?.diluted_eps, '-')}</div>
                        <div className="blue-color">{formatDecimal(instrument.financials?.yoy_eps, '-')}%</div>
                    </div>

                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div>Net profit margin</div>
                        <div className="blue-color">{formatDecimal(instrument.financials?.net_profit_margin, '-')}%</div>
                        <div className="blue-color">{formatDecimal(instrument.financials?.yoy_net_profit_margin, '-')}%</div>
                    </div>

                    <div className="grid ">
                        <div>Earnings call</div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div>Previous</div>
                        <div>EPS</div>
                        <div>Revenue</div>
                    </div>

                    <div className="grid grid-cols-[40%_30%_30%] fs-13">
                        <div></div>
                        <div className="blue-color">{`${instrument.financials?.eps_beat ?? ''} ${formatDecimal(instrument.financials?.eps_surprise, '-')}%`}</div>
                        <div className="blue-color">{`${instrument.financials?.revenue_beat ?? ''} ${formatDecimal(instrument.financials?.revenue_surprise, '-')}%`}</div>
                    </div>
                </div>
            </div>
            <div className={styles['price-summary-table']}>
                <div className="grid grid-cols-6 gap-2 fs-13">
                    <div className="">Open</div>
                    <div className="blue-color">{formatCurrency(instrument.lastMarketData?.open, '-', false)}</div>
                    <div className="">High</div>
                    <div className="blue-color">{formatCurrency(instrument.lastMarketData?.high, '-', false)}</div>
                </div>

                <div className="grid grid-cols-6 gap-2 fs-13">
                    <div className="">Close</div>
                    <div className="blue-color">{formatCurrency(instrument.lastMarketData?.close, '-', false)}</div>

                    <div className="">Low</div>
                    <div className="blue-color">{formatCurrency(instrument.lastMarketData?.low, '-', false)}</div>
                </div>
            </div>

            <div>
                <HighchartsReact
                    highcharts={Highstock}
                    constructorType={'stockChart'}
                    options={getChartOptions(instrument)}
                />
            </div>
        </div>
    );
}