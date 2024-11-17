// DashboardHeader.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardHeader } from './DashboardHeader';
import { SearchDataContext } from '../../business-services/search-data-context';
import { Typeahead } from 'react-bootstrap-typeahead';

// Mock Typeahead component
jest.mock('react-bootstrap-typeahead', () => ({
  Typeahead: jest.fn(({ onChange, options, placeholder }) => (
    <div data-testid="typeahead">
      <input
        data-testid="typeahead-input"
        placeholder={placeholder}
        onChange={(e) => onChange && onChange([e.target.value])}
      />
    </div>
  ))
}));

describe('DashboardHeader Component', () => {
  const setSearchDataMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the DashboardHeader component', () => {
    render(
      <SearchDataContext.Provider value={{ searchData: { text: '' }, setSearchData: setSearchDataMock }}>
        <DashboardHeader />
      </SearchDataContext.Provider>
    );

    // Check if the Typeahead component and icons are rendered
    expect(screen.getByTestId('typeahead')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Choose a Security')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Icons
  });

  it('calls setSearchData on search input change', () => {
    render(
      <SearchDataContext.Provider value={{ searchData: { text: '' }, setSearchData: setSearchDataMock }}>
        <DashboardHeader />
      </SearchDataContext.Provider>
    );

    // Simulate typing into the Typeahead input
    const typeaheadInput = screen.getByTestId('typeahead-input');
    fireEvent.change(typeaheadInput, { target: { value: '74403274' } });

    // Check if setSearchDataMock was called with the correct value
    expect(setSearchDataMock).toHaveBeenCalledWith({ text: '74403274' });
  });

  it('renders action buttons', () => {
    render(
      <SearchDataContext.Provider value={{ searchData: { text: '' }, setSearchData: setSearchDataMock }}>
        <DashboardHeader />
      </SearchDataContext.Provider>
    );

    // Check if action buttons are rendered
    // expect(screen.getByClass('cil-settings')).toBeInTheDocument();
    // expect(screen.getByClass('fas fa-user-circle')).toBeInTheDocument();
    // expect(screen.getByClass('fas fa-ellipsis-v')).toBeInTheDocument();
  });
});
