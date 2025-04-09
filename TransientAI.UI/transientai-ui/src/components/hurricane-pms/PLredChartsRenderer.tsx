import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import { ICellRendererParams } from 'ag-grid-community';
import { formatInteger } from '@/lib/utility-functions';

const PLredChartRenderer = (props: ICellRendererParams) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const value = props.value || 0;
  const formattedValue = formatInteger(value, '');

  // Calculate the height proportion for the bar.
  const maxValue = 1000000; // Maximum value based on your data
  const absValue = Math.abs(value);
  
  // Inverted height for negative P&L (closer to zero = higher bar)
  const heightPercentage = Math.min(100, (maxValue - absValue) / maxValue * 100);

  useEffect(() => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent',
          height: 30,
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0],
          renderTo: chartRef.current,
          animation: true,
        },
        title: { text: undefined },
        credits: { enabled: false },
        legend: { enabled: false },
        tooltip: { enabled: false },
        xAxis: {
          categories: [''],
          labels: { enabled: false },
          reversed: true, // Ensure the bar goes left for negative values
          lineWidth: 0,
          lineColor: 'transparent',
          tickLength: 0,
        },
        yAxis: {
          title: { text: null },
          reversed: false,
          labels: { enabled: false },
          gridLineWidth: 0,
          min: 0,
          max: maxValue,
        },
        plotOptions: {
          bar: {
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0,
            dataLabels: { enabled: false },
          },
        },
        series: [
          {
            type: 'bar',
            name: 'P&L',
            data: [absValue],  // Absolute value for bar height
            color: {
              linearGradient: { x1: 1, y1: 0, x2: 0, y2: 0 }, // Gradient effect
              stops: [
                [0, 'rgba(255, 77, 79, 0.9)'],    // Strong red for negative values
                [0.7, 'rgba(255, 153, 153, 0.6)'], // Lighter red
                [1, 'rgba(255, 255, 255, 0.3)']    // Fade effect
              ],
            },
            animation: { duration: 1000 },
          },
        ],
      });
    }
  }, [value]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          [value < 0 ? 'right' : 'left']: 0,  // Negative values expand to the left
          width: `${heightPercentage}%`,
          height: '100%',
          background: 'linear-gradient(to ' + (value < 0 ? 'left' : 'right') + ', rgba(255,77,79,0.9), rgba(255,153,153,0.6), rgba(255,255,255,0.3))',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          fontWeight: 'bold',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <span>$</span>
        <span className='text-right'>{formattedValue}</span>
      </div>
    </div>
  );
};

export default PLredChartRenderer;