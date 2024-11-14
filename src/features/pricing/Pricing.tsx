import { useState, useEffect, useContext } from 'react';
import { ColDef } from 'ag-grid-community';
import { MultiSelect } from 'react-multi-select-component';
import { DataGrid, getNumberColDefTemplate } from '../../common-components/data-grid';
import { pricingDataService } from '../../business-services/pricing-data';
import { SearchDataContext } from '../../business-services/search-data-context';

export function Pricing() {

  const [allInstruments, setAllInstruments] = useState<any>([]); // todo add type
  const [columnDefs] = useState<ColDef[]>(getColumnDefs());
  const [selected, setSelected] = useState([]);
  const { searchData } = useContext(SearchDataContext);

  const sectorOptions = [
    { "label": "Technology", "value": "Technology" },
    { "label": "Healthcare", "value": "Healthcare" },
    { "label": "Financials", "value": "Financials" },
    { "label": "Consumer Discretionary", "value": "Consumer Discretionary" },
    { "label": "Consumer Staples", "value": "Consumer Staples" },
    { "label": "Energy", "value": "Energy" },
    { "label": "Industrials", "value": "Industrials" },
    { "label": "Materials", "value": "Materials" },
    { "label": "Utilities", "value": "Utilities" },
    { "label": "Real Estate", "value": "Real Estate" },
    { "label": "Communication Services", "value": "Communication Services" }
  ];

  const tickerOptions = [
    { "label": "Apple Inc.", "value": "AAPL" },
    { "label": "Microsoft Corporation", "value": "MSFT" },
    { "label": "Amazon.com, Inc.", "value": "AMZN" },
    { "label": "Tesla, Inc.", "value": "TSLA" },
    { "label": "Alphabet Inc. (Class A)", "value": "GOOGL" },
    { "label": "Meta Platforms, Inc.", "value": "META" },
    { "label": "NVIDIA Corporation", "value": "NVDA" },
    { "label": "Berkshire Hathaway Inc. (Class B)", "value": "BRK.B" },
    { "label": "JPMorgan Chase & Co.", "value": "JPM" },
    { "label": "Johnson & Johnson", "value": "JNJ" }
  ];

  let filteredInstruments: any[] = [];

  applySearchFilter();

  useEffect(() => {
    const loadInstruments = async () => {
      const instruments = await pricingDataService.getSecurities();
      setAllInstruments(instruments);
    };

    loadInstruments();
  }, []);

  function applySearchFilter() {
    if (!allInstruments?.length) {
      return;
    }

    // todo.. apply isin, sedol, desc and upper case etc..
    filteredInstruments = allInstruments
      .filter((instrument: any) => !searchData?.text || instrument.cusip.includes(searchData.text));
  }

  return (
    <div className='widget pricing-widget'>
      <div className='widget-header'>
        <span className='widget-label'>Pricing</span>
      </div>

      <div className='widget-content full-height'>
        <div className='d-flex mb-2'>
          <MultiSelect
            className="dark"
            options={sectorOptions}
            value={selected}
            onChange={setSelected}
            labelledBy='Select Sector'
            overrideStrings={{selectSomeItems : 'Select Sector...'}}
            />

          <MultiSelect
            className="dark"
            options={tickerOptions}
            value={selected}
            onChange={setSelected}
            labelledBy="Select Ticker"
            overrideStrings={{selectSomeItems : 'Select Ticker...'}}
            />
        </div>
        

        <DataGrid 
          rowData={filteredInstruments}
          columnDefs={columnDefs}>
        </DataGrid>
      </div>
    </div>
  );

  function getColumnDefs(): ColDef[] {
    return [
      {
        field: 'id',
        headerName: 'Security ID',
        width: 100
      },
      {
        field: 'ticker',
        headerName: 'Ticker',
        width: 90
      },
      {
        field: 'cusip',
        headerName: 'Cusip',
        width: 100
      },
      {
        field: 'isin',
        headerName: 'ISIN',
        width: 100
      },
      {
        field: 'sedol',
        headerName: 'SEDOL',
        width: 100
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'coupon',
        headerName: 'Coupon',
        width: 90
      },
      {
        field: 'maturity',
        headerName: 'Maturity',
        width: 100
      },
      {
        field: 'security',
        headerName: 'Description',
        width: 240
      },
      {
        field: 'quoteType',
        headerName: 'Quote Type',
        width: 100
      },
      {
        field: 'bmkIsin',
        headerName: 'Benchmark',
        width: 100
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'bid',
        headerName: 'Bid',
        width: 90
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'ask',
        headerName: 'Ask',
        width: 90
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'bidYield',
        headerName: 'Bid Yield',
        width: 90
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'askYield',
        headerName: 'Ask Yield',
        width: 90
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'bidSpread',
        headerName: 'Bid Spread',
        width: 90
      },
      {
        ...getNumberColDefTemplate(2),
        field: 'askSpread',
        headerName: 'Ask Spread',
        width: 90
      },
    ];
  }
} 