import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import darkTheme from '../../common-components/charts/dark-theme';
import { useState } from 'react';

Highcharts.setOptions(darkTheme);

export function MarketLandscape() {

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const options = {
    chart: {
      type: 'spline'
    },
    title: {
      text: ''
    },
    xAxis: {
      title: {
        text: 'Time Period'
      },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] // Example time labels
    },
    yAxis: {
      title: {
        text: 'Price (USD)'
      }
    },
    series: [
      {
        name: 'MSFT',
        type: 'spline',
        data: [305, 310, 298, 320, 330, 315] // Main spline series data
      },
      {
        name: 'AAPL',
        type: 'spline',
        data: [150, 160, 155, 170, 165, 158] // Main spline series data
      },
      {
        name: 'ATT',
        type: 'spline',
        data: [28, 32, 27, 30, 29, 33] // Main spline series data
      },
      {
        name: 'MSFT Trades',
        type: 'scatter',
        data: [[0, 350], [2, 250], [4, 400]], // Example scatter points for trades
        marker: {
          symbol: 'circle'
        },
        tooltip: {
          pointFormat: 'Trade Price: {point.y} USD'
        }
      },
      {
        name: 'AAPL Trades',
        type: 'scatter',
        data: [[1, 180], [3, 220], [5, 200]], // Example scatter points for trades
        marker: {
          symbol: 'triangle'
        },
        tooltip: {
          pointFormat: 'Trade Price: {point.y} USD'
        }
      },
      {
        name: 'ATT Trades',
        type: 'scatter',
        data: [[0, 29], [2, 28], [4, 34]], // Example scatter points for trades
        marker: {
          symbol: 'square'
        },
        tooltip: {
          pointFormat: 'Trade Price: {point.y} USD'
        }
      }
    ]
  };

  function toggle() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className={isExpanded ? 'widget expanded': 'widget'}>
      <div className="widget-header">
        <span className="widget-label">Market Landscape - Work In Progress</span>

        <div className='toggler' onClick={toggle}>
          <i className={isExpanded ? 'cil-window-restore' : 'cil-window-maximize'}></i>
        </div>
      </div>
      <div className='widget-body'>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
} 
