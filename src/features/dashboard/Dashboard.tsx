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



export function Dashboard() {

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
