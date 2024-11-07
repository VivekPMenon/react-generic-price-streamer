import { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import { DataGrid } from '../../common-components/data-grid';
import { pricingDataService } from '../../business-services/pricing-data';

export function RunsSummary() {

  const [rowData, setRowData] = useState<any>([]); // todo add type

  const [columnDefs] = useState<ColDef[]>([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ]);

  useEffect(() => {
    const loadSecurities = async () => {
      const data = await pricingDataService.getSecuritiesWithPrices();
      setRowData(data);
    };

    loadSecurities();
  });

  const rows = [];
  for (let index = 0; index < 3; index++) {
    rows.push(
      <>
        <tr>
          <td scope="row">
            <input type='checkbox' className='form-check-input'></input>
          </td>
          <td>
            CS-HY Sell Axes
            <div className='sub-label'>Scheduled in 10 minutes</div>
          </td>
          <td>
            13:50:01
            <div className='sub-label'>Run 2 minutes ago</div>
          </td>
          <td width="30%">
            <button type='button' className='btn btn-secondary me-2'>Schedule</button>
            <button type='button' className='btn btn-secondary'>Send Run</button>
          </td>
        </tr>
        <tr>
          <td scope="row">
            <input type='checkbox' className='form-check-input'></input>
          </td>
          <td>
            CS-HY Sell Buys
            <div className='sub-label'>Scheduled in 35 minutes</div>
          </td>
          <td>
            02:50:01
            <div className='sub-label'>Run 98 minutes ago</div>
          </td>
          <td>
            <button type='button' className='btn btn-secondary me-2'>Schedule</button>
            <button type='button' className='btn btn-secondary'>Send Run</button>
          </td>
        </tr>
      </>
    );
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-label">Runs Summary</span>
      </div>

      <div className="widget-content">
        <div className='widget-summary'>
          Total Runs: 29
        </div>
        <table className='table'>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  );

  function getColumnDefs(): ColDef[] {
    return [
      {
        field: 'id',
        headerName: 'Security ID',
        width: 110
      },
      {
        field: 'ticker',
        headerName: 'Ticker',
        width: 90
      },
      {
        field: 'cusip',
        headerName: 'Cusip',
        width: 110
      },
      {
        field: 'isin',
        headerName: 'ISIN',
        width: 110
      },
      {
        field: 'sedol',
        headerName: 'SEDOL',
        width: 110
      },
      {
        field: 'coupon',
        headerName: 'Coupon',
        width: 90
      },
      {
        field: 'maturity',
        headerName: 'Maturity',
        width: 90
      },
      {
        field: 'security',
        headerName: 'Description',
        width: 140
      },
      {
        field: 'quoteType',
        headerName: 'Quote Type',
        width: 100
      },
      {
        field: 'bmkIsin',
        headerName: 'Benchmark',
        width: 110
      },
      {
        field: 'bid',
        headerName: 'Bid',
        width: 90
      },
      {
        field: 'ask',
        headerName: 'Ask',
        width: 90
      },
      {
        field: 'bidYield',
        headerName: 'Bid Yield',
        width: 90
      },
      {
        field: 'askYield',
        headerName: 'Ask Yield',
        width: 90
      },
      {
        field: 'bidSpread',
        headerName: 'Bid Spread',
        width: 90
      },
      {
        field: 'askSpread',
        headerName: 'Ask Spread',
        width: 90
      },
    ];
  }
} 
