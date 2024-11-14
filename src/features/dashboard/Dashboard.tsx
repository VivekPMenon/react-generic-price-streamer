import { SearchDataContextProvider } from '../../business-services/search-data-context';
import { DashboardHeader } from '../dashboard-header';
import { Pricing } from '../pricing';
import { Trace } from '../trace';
import React from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import darkTheme from '../../common-components/charts/dark-theme';
import { MarketLandscape } from '../market-landscape';

Highcharts.setOptions(darkTheme);

export function Dashboard() {

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
        data: [305, 310, 298, 320, 330, 315] // Random fluctuating data for demonstration
      },
      {
        name: 'AAPL',
        data: [150, 160, 155, 170, 165, 158] // Random fluctuating data for demonstration
      },
      {
        name: 'ATT',
        data: [28, 32, 27, 30, 29, 33] // Random fluctuating data for demonstration
      }
    ]
  };

  return (
    <div className="multi-widget-dashboard ">
      <SearchDataContextProvider>
        <DashboardHeader></DashboardHeader>

        <div className="dashboard-content">
          <Pricing></Pricing>

          <div className='bottom-widgets'>            
            <MarketLandscape></MarketLandscape>
            <Trace></Trace>
          </div>
        </div>
      </SearchDataContextProvider>
    </div>
  );
} 
