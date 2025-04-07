'use client';
// BarChart.tsx
import dynamic from 'next/dynamic';
import React from 'react';
import Highcharts from 'highcharts';

// Use dynamic import for client-side rendering
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

const issuerData = [
  { name: 'JAPANESEYEN', value: 15.68 },
  { name: 'ALPHABET', value: 11.45 },
  { name: 'AMAZON.COM', value: 8.92 },
  { name: 'APPLE', value: 8.02 },
  { name: 'NVIDIA CORP', value: 7.63 },
  { name: 'FACEBOOK', value: 7.07 },
  { name: 'TESLA', value: 6.01 },
  { name: 'UNITED HEALTHCARE', value: 3.82 },
  { name: 'JP MORGAN', value: 3.27 },
  { name: 'PROCTER & GAMBLE', value: 3.15 },
  { name: 'MASTERCARD', value: 3.02 },
  { name: 'WALMART', value: 2.86 },
  { name: 'INTEL', value: 2.39 },
  { name: 'SUPER INTERNATIONAL', value: 2.04 },
  { name: 'MCDONALDS', value: 1.96 },
  { name: 'CISCO SYSTEMS', value: 1.85 },
  { name: 'PEPSICO', value: 1.68 },
  { name: 'CHEVRON', value: 1.52 },
  { name: 'ORACLE', value: 1.43 },
  { name: 'HOME DEPOT', value: 1.26 },
  { name: 'OTHER', value: 0.97 }
];

function getChartOptions() {
  // Sort data in descending order
  const sortedData = [...issuerData].sort((a, b) => b.value - a.value);
  
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: '#0C101B', // Matching background from reference
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
        text: 'Percentage (%)',
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