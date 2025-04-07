'use client';
// BarChart.tsx
import dynamic from 'next/dynamic';
import React from 'react';
import Highcharts from 'highcharts';

// Use dynamic import for client-side rendering
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

const issuerData = [
  { name: 'JAPANESE YEN', value: 14.00 },
  { name: 'CANADIAN DOLLAR', value: 10.00 },
  { name: 'SWISS FRANC', value: 9.90 },
  { name: 'FEDEX CORP', value: 8.00 },
  { name: 'ISHARES MSCI JAPAN ETF', value: 7.50 },
  { name: 'MICROSOFT', value: 7.00 },
  { name: 'ROCHE HLDG AG', value: 6.20 },
  { name: 'ASML TECHNOLOGIES NV', value: 5.80 },
  { name: 'CARRIER GLOBAL CORP', value: 5.60 },
  { name: 'SWISS FRANC', value: 5.20 },
  { name: 'BRITISH POUND', value: 3.75 },
  { name: 'NESTLE CORP SPONSOR', value: 3.75 },
  { name: 'SANOFI-AVENTIS HOLDING NV', value: 3.00 },
  { name: 'MOODYS CORP HOME', value: 3.00 },
  { name: 'RIO TINTO PLC GROUP ADR', value: 2.00 },
  { name: 'ALIBABA GROUP HOLDING SP ADR', value: 2.00 },
  { name: 'DIAGEO PLC GROUP', value: 1.25 },
  { name: 'DEERE & CO', value: 1.20 },
  { name: 'GLENCORE MINING CHTD SECURE', value: 1.00 },
  { name: 'ROCKWELL AUTOMATION INC', value: 1.00 },
  { name: 'DOLLARAMA INC', value: 0.80 },
  { name: 'ALPHABET INC CL A', value: 0.80 },
  { name: 'ENERGY TRANSFER LP', value: 0.50 },
  { name: 'CVS', value: 0.25 },
  { name: 'QQQ', value: 0.20 }
];

function getChartOptions() {
  // Sort data in descending order
  const sortedData = [...issuerData].sort((a, b) => b.value - a.value);
  
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: "525px",
      backgroundColor: '#0C101B', 
    },
    title: {
      text: 'Issuer Exposure',
      style: {
        color: '#FFF',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: sortedData.map(item => item.name),
      labels: {
        style: {
          color: '#8FB0D3',
          fontSize: '10px'
        }
      },
      lineColor: '#444'
    },
    yAxis: {
      title: {
        style: {
          color: '#888'
        }
      },
      labels: {
        style: {
          color: '#888'
        },
        format: '{value}%'
      },
      gridLineColor: '#333'
    },
    tooltip: {
      valueSuffix: '%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      style: {
        color: '#FFF'
      },
      borderColor: '#666'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{y:.2f}%',
          style: {
            color: '#FFF',
            textOutline: 'none',
            fontSize: '10px'
          }
        },
        borderRadius: 2,
        pointWidth: 14
      },
      series: {
        color: '#0088FF'
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'bar', // Explicitly define type to satisfy TypeScript
      name: 'Exposure',
      data: sortedData.map(item => item.value)
    }]
  };

  return chartOptions;
}

export const BarChart = () => {
  return (
    <div className="h-full w-full p-2">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={getChartOptions()} 
      />
    </div>
  );
};

export default BarChart;