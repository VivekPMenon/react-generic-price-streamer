import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import { ICellRendererParams } from 'ag-grid-community';
import { formatInteger } from '@/lib/utility-functions';

const PLredChartRenderer = (props: ICellRendererParams) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const value = props.value || 0;
  const formattedValue = formatInteger(value, '');
  const isNegative = value < 0;

  // Calculate the height proportion for the bar.
  const maxValue = 121270; // Maximum value based on data
  const absValue = Math.abs(value);
  
  // Calculate percentage of the maximum for visualization
  const heightPercentage = Math.min(100, (absValue / maxValue) * 100);

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
          lineWidth: 0,
          lineColor: 'transparent',
          tickLength: 0,
        },
        yAxis: {
          title: { text: null },
          labels: { enabled: false },
          gridLineWidth: 0,
          min: -maxValue,  // Allow for negative values
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
            data: [value],  // Use actual value, not absolute
            color: {
              linearGradient: { x1: 1, y1: 0, x2: 0, y2: 0 },
              stops: [
                [0, 'rgba(255, 77, 79, 0.9)'],
                [0.7, 'rgba(255, 153, 153, 0.6)'],
                [1, 'rgba(255, 255, 255, 0.3)']
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
          [isNegative ? 'right' : 'left']: 0,
          width: `${heightPercentage}%`,
          height: '100%',
          background: `linear-gradient(to ${isNegative ? 'left' : 'right'}, rgba(255,77,79,0.9), rgba(255,153,153,0.6), rgba(255,255,255,0.3))`,
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
          // color: isNegative ? '#ff4d4f' : 'inherit', // Add red text color for negative values
        }}
      >
        <span>$</span>
        <span className="text-right">{formattedValue}</span>
      </div>
    </div>
  );
};

export default PLredChartRenderer;