import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import { ICellRendererParams } from 'ag-grid-community';
import { formatInteger } from '@/lib/utility-functions';

const PLHighchartsRenderer = (props: ICellRendererParams) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const value = props.value || 0;
  const isNegative = value < 0;
  const color = isNegative ? '#ff4d4f' : '#caf2b6';
  const formattedValue = formatInteger(value, '');

  useEffect(() => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent',
          height: 30,
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0],
          renderTo: chartRef.current
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
          tickLength: 0
        },
        yAxis: {
          title: { text: null },
          labels: { enabled: false },
          gridLineWidth: 0,
          min: 0
        },
        plotOptions: {
          bar: {
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0,
            dataLabels: { enabled: false }
          }
        },
        series: [{
          type: 'bar',
          name: 'P&L',
          data: [Math.abs(value)],
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, // left to right
            stops: [
              [0, 'rgba(102, 255, 153, 0.9)'],   // vibrant mint green (start)
              [0.7, 'rgba(153, 255, 204, 0.6)'], // soft green (mid)
              [1, 'rgba(255, 255, 255, 0.3)']    // near white with transparency (end)
            ]
          },
          
          opacity: 0.9
        }]
        
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
        overflow: 'hidden'
      }}
    >
      {/* Chart in background */}
      <div
        ref={chartRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />

      {/* Foreground content */}
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
          // color: isNegative ? '#ff4d4f' : '#ffffff',
        }}
      >
        <span>$</span>
        <span className='text-right'>{formattedValue}</span>
      </div>
    </div>
  );
};


export default PLHighchartsRenderer;