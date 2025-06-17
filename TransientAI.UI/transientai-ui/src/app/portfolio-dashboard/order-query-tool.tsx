'use client';

import { DataGrid, getNumberColDefTemplate } from "../../components/data-grid";
import { ColDef } from "ag-grid-community";
import ordersMock from './orders-mock.json';

const columnDefs: ColDef[] = [
  { headerName: 'Order Id', field: 'orderId', floatingFilter: false },
  { headerName: 'Status', field: 'status', floatingFilter: false },
  { headerName: 'Trade Date', field: 'tradeDate', floatingFilter: false },
  { headerName: 'Settlement Date', field: 'settlementDate', floatingFilter: false },
  { headerName: 'Order Side', field: 'orderSide', floatingFilter: false },
  { headerName: 'Quantity', field: 'quantity', floatingFilter: false },
  { headerName: 'Cashflow Type', field: 'cashflowType', floatingFilter: false },
  { headerName: 'Ticker', field: 'ticker', floatingFilter: false },
  { headerName: 'Price', field: 'price', floatingFilter: false },
  { headerName: 'Settlement Amount', field: 'settlementAmount', floatingFilter: false },
  { headerName: 'Security Description', field: 'securityDescription', floatingFilter: false },
  { headerName: 'Executing Broker', field: 'executingBroker', floatingFilter: false },
  { headerName: 'Clearing Broker', field: 'clearingBroker', floatingFilter: false },
  { headerName: 'Strategy', field: 'strategy', floatingFilter: false },
  { headerName: 'Security Currency', field: 'securityCurrency', floatingFilter: false },
  { headerName: 'Legal Entity Account', field: 'legalEntityAccount', floatingFilter: false },
  { headerName: 'Executing Trade', field: 'executingTrade', floatingFilter: false }
];

export function OrderQueryTool() {

  return (
    <div className='widget height-100p'>
      <div className='widget-title'>
        Order Query Tool

        <div className="actions">
          <div className="action-button">
            <i className="fa-thin fa-filter"></i>
          </div>
        </div>
      </div>

      <div className="height-100p">
        <div className="search-panel mt-2 flex-[1_1_20%]">
          <div className="form-field">
            <div className="form-label">
              Manager
            </div>
            <input type="text" className="form-input" />
          </div>

          <div className="form-field">
            <div className="form-label">
              Security Type
            </div>
            <input type="text" className="form-input" />
          </div>

          <div className="form-field">
            <div className="form-label">
              Order Type
            </div>
            <select className="form-select">
              <option>Select Platform</option>
            </select>
          </div>
        </div>

        <DataGrid
          isSummaryGrid={false}
          suppressStatusBar={true}
          sideBar={{
            toolPanels: ['columns', 'filters'],
            defaultToolPanel: undefined
          }}
          rowData={ordersMock as any}
          columnDefs={columnDefs}>
        </DataGrid>
      </div>
    </div>
  );
}