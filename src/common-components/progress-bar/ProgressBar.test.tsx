// ProgressBar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar, { ProgressBarProps } from './ProgressBar';

describe('ProgressBar Component', () => {
  const defaultProps: ProgressBarProps = {
    completed: 50
  };

  it('renders the ProgressBar component', () => {
    render(<ProgressBar {...defaultProps} />);

    // Check if the progress bar container is rendered
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('applies default styles', () => {
    render(<ProgressBar {...defaultProps} />);

    const filler = screen.getByRole('progressbar').querySelector('div > div');
    expect(filler).toHaveStyle(`background: #6a1b9a`);
    expect(filler).toHaveStyle(`width: 50%`);
  });

  it('renders with custom styles and props', () => {
    const customProps: ProgressBarProps = {
      completed: 75,
      bgColor: '#ff0000',
      height: '30px',
      width: '80%',
      labelAlignment: 'center',
      isLabelVisible: true,
      customLabel: '75% Complete'
    };
    render(<ProgressBar {...customProps} />);

    // Check if the custom styles are applied
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');

    const filler = progressBar.querySelector('div > div');
    expect(filler).toHaveStyle(`background: #ff0000`);
    expect(filler).toHaveStyle(`width: 75%`);
    expect(filler).toHaveStyle(`height: 30px`);

    // Check if the custom label is rendered
    expect(screen.getByText('75% Complete')).toBeInTheDocument();
  });

  it('hides label when isLabelVisible is false', () => {
    render(<ProgressBar {...defaultProps} isLabelVisible={false} />);

    // Check if the label is not rendered
    const label = screen.queryByText('50%');
    expect(label).not.toBeInTheDocument();
  });

  it('renders label outside when labelAlignment is set to outside', () => {
    render(<ProgressBar {...defaultProps} labelAlignment="outside" />);

    // Check if the label is rendered outside
    const outsideLabel = screen.getByText('50%');
    expect(outsideLabel).toBeInTheDocument();
    expect(outsideLabel.closest('div')).toHaveStyle('display: flex');
  });

  it('handles indeterminate state', () => {
    render(<ProgressBar {...defaultProps} isIndeterminate />);

    // Check if indeterminate animation is applied
    const filler = screen.getByRole('progressbar').querySelector('div > div');
    expect(filler).toHaveStyle(`width: 100%`);
    expect(filler).toHaveStyle(`animation: indeterminate 1.5s infinite linear`);
  });
});
