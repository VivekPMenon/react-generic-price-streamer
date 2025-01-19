import styles from './price-graph.module.scss';

import dynamic from 'next/dynamic';

// Dynamically import HighchartsReact with SSR disabled
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });
import Highstock from 'highcharts/highstock';

export function PriceGraph() {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'area',
      backgroundColor: '#0C101B',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      labels: { style: { color: '#dddddd' } },
      gridLineWidth: 0
    },
    yAxis: {
      title: { text: null },
      labels: { style: { color: '#dddddd' } },
      gridLineWidth: 0
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    rangeSelector: {
      enabled: true,
      inputEnabled: false,
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
            [0, 'rgba(0, 255, 0, 0.2)'], // Lighter at the top
            [1, 'rgba(0, 0, 0, 0)'],
          ],
        },
        lineColor: '#198754',
        lineWidth: 5,
        marker: { enabled: true, radius: 3 },
        threshold: null,
      },
    },
    series: [
      {
        type: 'area',
        name: 'Data',
        data: [
          [Date.UTC(2023, 0, 1, 8, 0), 152.30], // 8:00 AM
          [Date.UTC(2023, 0, 1, 9, 0), 153.10], // 9:00 AM
          [Date.UTC(2023, 0, 1, 10, 0), 152.95], // 10:00 AM
          [Date.UTC(2023, 0, 1, 11, 0), 153.50], // 11:00 AM
          [Date.UTC(2023, 0, 1, 12, 0), 153.20], // 12:00 PM
          [Date.UTC(2023, 0, 1, 13, 0), 153.00], // 1:00 PM

          [Date.UTC(2023, 0, 1, 14, 0), null],   // 2:00 PM (No data)
          [Date.UTC(2023, 0, 1, 15, 0), null],   // 3:00 PM (No data)
          [Date.UTC(2023, 0, 1, 16, 0), null],   // 4:00 PM (No data)
        ],
      },
    ],
  };

  return (
    <div className={`${styles['price-graph']} widget`}>
      Details

      <div className={`${styles['price-graph-title']}`}>
        <i className='fa-solid fa-ban'></i>
        BOEING (B.A) 5.875% 2040

        <div className='pill gray padded ml-auto rounded'>
          <i className='fa-solid fa-chart-simple'></i>
          High
        </div>
      </div>

      <HighchartsReact
        highcharts={Highstock}
        constructorType={'stockChart'}
        options={chartOptions}
      />

      <div className={styles['price-summary-table']}>
        <div className="grid grid-cols-6 gap-2 fs-13">
          <div className="">Open</div>
          <div className="blue-color">157.47</div>
          <div className="">Mkt Cap</div>
          <div className="blue-color">115.06</div>
          <div className="">GDP Score</div>
          <div className="blue-color">8</div>
        </div>

        <div className="grid grid-cols-6 gap-2 fs-13">
          <div className="">High</div>
          <div className="blue-color">157.47</div>
          <div className="">P/E Ratio</div>
          <div className="blue-color">-</div>
          <div className="">52 Week High</div>
          <div className="blue-color">158.67</div>
        </div>

        <div className="grid grid-cols-6 gap-2 fs-13">
          <div>Low</div>
          <div className="blue-color">155.47</div>
          <div className="">Div Yield</div>
          <div className="blue-color">-</div>
          <div className="">52 Week Low</div>
          <div className="blue-color">152.36</div>
        </div>
      </div>

      <div className={styles['trading-opportunity']}>
        BOEING (B.A) 5.875% 2040 Trading Opportunity

        <span>Bond Details</span>

        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>CUSIP</div>
          <div>098FGT67U</div>
        </div>
        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>Maturity</div>
          <div>2040</div>
        </div>
        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>Coupon</div>
          <div>5.2%</div>
        </div>
        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>Size</div>
          <div>$10 MM (Up to $250 MM)</div>
        </div>
        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>Axe Price</div>
          <div>92.75</div>
        </div>
        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>Spread</div>
          <div>+250bp</div>
        </div>
        <div className="grid grid-cols-[25%_75%] gap-2 fs-13 off-white-color">
          <div>Trader Note</div>
          <div>Need to move today</div>
        </div>
      </div>

      <div className={styles['market-context']}>

        <span>Market Context</span>

        <ul className="list-disc pl-5 off-white-color">
          <li>Trading 15bp wider on union headlines</li>
          <li>10bp wide to lockhead</li>
          <li>Technical support at current levels</li>
          <li>Fourth sentence in the list</li>
        </ul>
      </div>

    </div>
  );
}