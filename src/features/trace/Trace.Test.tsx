// Trace.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Trace } from './Trace';
import { SearchDataContext } from '../../business-services/search-data-context';
import traceJson from '../../business-services/pricing-data/trace.json';

// Mocking DataGrid component
jest.mock('../../common-components/data-grid', () => ({
  DataGrid: ({ rowData, columnDefs }: { rowData: any; columnDefs: any }) => (
    <div data-testid="data-grid">
      <div>Row Count: {rowData?.length}</div>
      <div>Column Count: {columnDefs?.length}</div>
    </div>
  )
}));

describe('Trace Component', () => {
  it('renders Trace component with default data', () => {
    const mockSearchData = { text: '' };

    render(
      <SearchDataContext.Provider value={{ searchData: mockSearchData }}>
        <Trace />
      </SearchDataContext.Provider>
    );

    // Verify the widget label is displayed
    expect(screen.getByText('Trace')).toBeInTheDocument();

    // Verify DataGrid renders with the correct number of rows
    const rowDataCount = traceJson.length; // assuming traceJson is an array
    expect(screen.getByText(`Row Count: ${rowDataCount}`)).toBeInTheDocument();

    // Verify DataGrid renders with the correct number of columns
    expect(screen.getByText('Column Count: 22')).toBeInTheDocument(); // Since columnDefs have 22 fields
  });

  it('filters data based on search context', () => {
    const mockSearchData = { text: 'CUSIP141905' }; // example search text

    render(
      <SearchDataContext.Provider value={{ searchData: mockSearchData }}>
        <Trace />
      </SearchDataContext.Provider>
    );

    // Verify filtered data is displayed (assuming some rows match the filter condition)
    const filteredCount = traceJson.filter((item: any) =>
      item.securityID.includes(mockSearchData.text)
    ).length;
    expect(screen.getByText(`Row Count: ${filteredCount}`)).toBeInTheDocument();
  });
});