import { SearchDataContextProvider } from '../../business-services/search-data-context';
import { DashboardHeader } from '../dashboard-header';
import { Pricing } from '../pricing';
import { RunsSummary } from '../runs-summary';
import { Trace } from '../trace';

export function Dashboard() {

  return (
    <div className="multi-widget-dashboard">
      <SearchDataContextProvider>
        <DashboardHeader></DashboardHeader>

        <div className="dashboard-content">
          <Pricing></Pricing>
          <RunsSummary></RunsSummary>
          <Trace></Trace>
          <div className="widget">
            <div className="widget-header">
              <span className="widget-label">Market Landscape - TODO</span>
            </div>
          </div>
        </div>
      </SearchDataContextProvider>
    </div>
  );
} 