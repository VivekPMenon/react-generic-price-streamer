// DataGrid.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DataGrid, IDataGridProps } from './DataGrid';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent } from 'ag-grid-community';

// Mock the AgGridReact component
jest.mock('ag-grid-react', () => ({
  AgGridReact: jest.fn(({ onGridReady }) => {
    // Simulate onGridReady call with a mock event
    const gridApiMock = { getOpenedToolPanel: jest.fn(() => 'panelId'), closeToolPanel: jest.fn() };
    const gridReadyEvent = { api: gridApiMock };
    if (onGridReady) onGridReady(gridReadyEvent);
    return <div data-testid="ag-grid-mock">AgGridReact Component</div>;
  })
}));

describe('DataGrid Component', () => {
  const defaultProps: IDataGridProps = {
    height: 400,
    rowData: [{ id: 1, name: 'Sample' }],
    columnDefs: [{ field: 'id' }, { field: 'name' }],
    showGridTopSummary: true
  };

  it('renders the DataGrid component', () => {
    render(<DataGrid {...defaultProps} />);

    // Check if the grid container is rendered
    const gridContainer = screen.getByTestId('ag-grid-mock');
    expect(gridContainer).toBeInTheDocument();
  });

  it('applies default column definitions and props', () => {
    render(<DataGrid {...defaultProps} />);

    // Check if AgGridReact is rendered with the expected props
    expect(AgGridReact).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultColDef: expect.objectContaining({
          floatingFilter: true,
          filter: 'agTextColumnFilter',
          sortable: true,
          resizable: true,
          width: 120
        }),
        statusBar: expect.any(Object),
        onGridReady: expect.any(Function)
      }),
      {}
    );
  });

  it('handles onGridReady correctly and closes an open tool panel if present', () => {
    render(<DataGrid {...defaultProps} />);

    // Since the gridApi mock closes the tool panel, we check if that function was called
    const gridApiMock = (AgGridReact as jest.Mock).mock.calls[0][0].onGridReady().api;
    expect(gridApiMock.closeToolPanel).toHaveBeenCalled();
  });

  it('renders with a specified height', () => {
    const heightProp = 600;
    render(<DataGrid {...defaultProps} height={heightProp} />);

    // Check if the outer container applies the correct height
    const container = screen.getByTestId('ag-grid-mock').closest('div');
    expect(container).toHaveStyle(`height: ${heightProp}px`);
  });
});
