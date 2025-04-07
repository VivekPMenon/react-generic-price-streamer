
import dynamic from 'next/dynamic';
import React from 'react';
import Highcharts from 'highcharts';

// Use dynamic import for client-side rendering
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

export const AssetAllocationChart = ({ data = [] }) => {
  // Default data matching the image (21% Equity, 76% Cash, 3% Equity Option)
  const chartData = data.length ? data : [
    { name: 'Equity', y: 21, color: '#3498db' },
    { name: 'Cash', y: 76, color: '#ff7730' },
    { name: 'Equity Option', y: 3, color: '#2ecc71' }
  ];

  const getChartOptions = () => {
    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: '#0C101B', // Matching background from reference
        height: '280px',
        spacing: [10, 0, 30, 0] // Add space at bottom for legend
      },
      title: {
        text: 'Asset Class Allocation',
        align: 'center',
        style: {
          color: '#FFD700',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
      },
      plotOptions: {
        pie: {
          innerSize: '60%',
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
            distance: 10,
            style: {
              color: '#FFFFFF',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          },
          center: ['50%', '45%'] 
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          color: '#FFFFFF',
          fontWeight: 'normal'
        },
        symbolRadius: 0,
        y: 10 // Move legend down a bit
      },
      series: [{
        type: 'pie', // Explicitly setting the series type
        name: 'Allocation',
        // colorByPoint: true,
        data: chartData
      }],
      credits: {
        enabled: false
      }
    };

    return options;
  };

  return (
    <div className="h-full w-full p-2">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={getChartOptions()} 
      />
    </div>
  );
};

export default AssetAllocationChart;