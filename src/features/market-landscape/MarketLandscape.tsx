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
        data: [20, 22, 21, 23, 25, 24] // Main spline series data
      }
    ]
  };

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      )}
    </div>
  );
}
