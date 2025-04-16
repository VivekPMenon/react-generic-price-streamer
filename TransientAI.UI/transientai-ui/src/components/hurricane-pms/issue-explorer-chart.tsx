'use client';
// BarChart.tsx
import dynamic from 'next/dynamic';
import React from 'react';
import Highcharts from 'highcharts';

// Use dynamic import for client-side rendering
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });




function getChartOptions(result: any) {
  // Sort data in descending order
  const sortedData = [...result].sort((a, b) => b.value - a.value).slice(0, 12);
  
  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: "525px" ,
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
      lineColor: '#444',
      lineWidth: 0,  
      tickLength: 0  
    },
    yAxis: {
      title: {
        text: null 
      },
      labels: {
        style: {
          color: '#888'
        },
        format: '{value}%',
        enabled: false  
      },
      gridLineColor: '#333',
      gridLineWidth: 0,  
      lineWidth: 0,     
      min: 0,           
      endOnTick: false  
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
        pointWidth: 14,
        borderWidth: 0,  
        pointPadding: 0.1      // Space between bars in the same category
      },
      series: {
        color: '#116186'
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'bar', 
      name: 'Exposure',
      data: sortedData.map(item => item.value),
      borderWidth: 0
    }]
  };

  return chartOptions;
}

export const BarChart = (data: any) => {
  const calculateTickerData = (data: any): any[] => {
    const tickerValues: Record<string, number> = {};
    let grandTotal = 0;
    data.forEach((item: any) => {
      const ticker = item.ticker;
      // const qty = item.quantity || 0;
      // const price = item.price || 0;
      const value = item.market_value || 0;
  
      if (!tickerValues[ticker]) {
        tickerValues[ticker] = 0;
      }
  
      tickerValues[ticker] += value;
      grandTotal += value;
    });
  
    const tickerData: any = Object.entries(tickerValues).map(([ticker, totalValue]) => {
      const percentage = (totalValue / grandTotal) * 100;
  
      return {
        name: ticker,
        total: parseFloat(totalValue.toFixed(2)),  
        value: parseFloat(percentage.toFixed(2)), 
      };
    });
    return tickerData;
  };
  const result = calculateTickerData(data.data);

  return (
    <div className="h-full w-full p-2">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={getChartOptions(result)} 
      />
    </div>
  );
};

export default BarChart;