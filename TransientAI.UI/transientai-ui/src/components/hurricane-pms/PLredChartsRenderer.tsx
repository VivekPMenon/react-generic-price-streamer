import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import { ICellRendererParams } from 'ag-grid-community';
import { formatInteger } from '@/lib/utility-functions';

const PLHighchartsRenderer = (props: ICellRendererParams) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const value = props.value || 0;
  const isNegative = value < 0;
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
          renderTo: chartRef.current,
          animation: false
        },
        title: { text: undefined },
        credits: { enabled: false },
        legend: { enabled: false },
        tooltip: { enabled: false },
        xAxis: {
          categories: [''],
          labels: { enabled: false },
          reversed: true, // <--- key to reverse direction
          lineWidth: 0,
          lineColor: 'transparent',
          tickLength: 0
        },
        yAxis: {
            reversed: true,
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
        series: [
          {
            type: 'bar',
            name: 'P&L',
            data: [Math.abs(value)],
            color: {
                linearGradient: { x1: 1, y1: 0, x2: 0, y2: 0 }, // ⬅️ Right to left
                stops: [
                [0, 'rgba(255, 77, 79, 0.9)'],    // strong red
                [0.7, 'rgba(255, 153, 153, 0.6)'], // lighter red
                [1, 'rgba(255, 255, 255, 0.3)']    // fade
              ]
            },
            enableMouseTracking: false
          }
        ]
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
      {/* Chart background */}
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

      {/* Foreground value */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          fontWeight: 'bold',
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <span>$</span>
        <span className='text-right'>{formattedValue}</span>
      </div>
    </div>
  );
};

export default PLHighchartsRenderer;

