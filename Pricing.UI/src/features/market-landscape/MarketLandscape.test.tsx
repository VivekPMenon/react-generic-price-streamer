// MarketLandscape.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarketLandscape } from './MarketLandscape';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Mock the HighchartsReact component
jest.mock('highcharts-react-official', () => jest.fn(() => <div data-testid="highcharts-react">Highcharts Chart</div>));

describe('MarketLandscape Component', () => {
  it('renders the MarketLandscape component with a title and chart', () => {
    render(<MarketLandscape />);

    // Check if the widget label is rendered
    expect(screen.getByText('Market Landscape')).toBeInTheDocument();

    // Check if HighchartsReact is rendered
    expect(screen.getByTestId('highcharts-react')).toBeInTheDocument();
  });

  it('passes the correct options to HighchartsReact', () => {
    render(<MarketLandscape />);

    // Verify if HighchartsReact was called with the expected props
    expect(HighchartsReact).toHaveBeenCalledWith(
      expect.objectContaining({
        highcharts: Highcharts,
        options: expect.objectContaining({
          chart: expect.objectContaining({ type: 'spline' }),
          xAxis: expect.objectContaining({
            title: expect.objectContaining({ text: 'Time Period' }),
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
          }),
          yAxis: expect.objectContaining({
            title: expect.objectContaining({ text: 'Price (USD)' })
          }),
          series: expect.any(Array)
        })
      }),
      {}
    );
  });
});
