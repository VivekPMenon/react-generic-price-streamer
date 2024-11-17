// Pricing.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pricing } from './Pricing';
import { SearchDataContext } from '../../business-services/search-data-context';
import { pricingDataService } from '../../business-services/pricing-data';

// Mock DataGrid and MultiSelect components
jest.mock('../../common-components/data-grid', () => ({
  DataGrid: ({ rowData, columnDefs }: any) => (
    <div data-testid="data-grid">
      <div>Row Count: {rowData?.length || 0}</div>
      <div>Column Count: {columnDefs?.length || 0}</div>
    </div>
  )
}));

jest.mock('react-multi-select-component', () => ({
  MultiSelect: ({ options, value, onChange, labelledBy }: any) => (
    <div data-testid="multi-select">
      <span>{labelledBy}</span>
      <button onClick={() => onChange([options[0]])}>Select First Option</button>
    </div>
  )
}));

jest.mock('../../business-services/pricing-data', () => ({
  pricingDataService: {
    getSecurities: jest.fn().mockResolvedValue([
      { id: '1', ticker: 'AAPL', cusip: '12345', isin: 'US12345', security: 'Apple Inc.', quoteType: 'Equity' },
      { id: '2', ticker: 'MSFT', cusip: '67890', isin: 'US67890', security: 'Microsoft Corp.', quoteType: 'Equity' }
    ])
  }
}));

describe('Pricing Component', () => {
  it('renders Pricing component and DataGrid with initial data', async () => {
    const mockSearchData = { text: '' };

    render(
      <SearchDataContext.Provider value={{ searchData: mockSearchData }}>
        <Pricing />
      </SearchDataContext.Provider>
    );

    expect(screen.getByText('Pricing')).toBeInTheDocument();

    // Wait for async data to load
    const rowDataCount = await screen.findByText('Row Count: 2');
    expect(rowDataCount).toBeInTheDocument();
  });

  it('filters instruments based on search data context', async () => {
    const mockSearchData = { text: 'AAPL' };

    render(
      <SearchDataContext.Provider value={{ searchData: mockSearchData }}>
        <Pricing />
      </SearchDataContext.Provider>
    );

    const filteredRowDataCount = await screen.findByText('Row Count: 1');
    expect(filteredRowDataCount).toBeInTheDocument();
  });

  it('renders and interacts with MultiSelect components', async () => {
    const mockSearchData = { text: '' };

    render(
      <SearchDataContext.Provider value={{ searchData: mockSearchData }}>
        <Pricing />
      </SearchDataContext.Provider>
    );

    // Check for MultiSelect components and simulate selection
    const multiSelects = screen.getAllByTestId('multi-select');
    expect(multiSelects.length).toBe(2);

    fireEvent.click(screen.getAllByText('Select First Option')[0]);
  });
});
