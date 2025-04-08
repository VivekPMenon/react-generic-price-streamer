
import dynamic from 'next/dynamic';
import React from 'react';
import Highcharts from 'highcharts';

// Use dynamic import for client-side rendering
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });

export const AssetAllocationChart = ({ data }) => {
  // Default data matching the image (21% Equity, 76% Cash, 3% Equity Option)

  const colorMap = {
    "Government Bond": "#2980b9",
    "Equity": "#e67e22",
    "Equity Option": "#27ae60",
    "Corporate Bond": "#8e44ad",
    "Index Option": "#16a085",
    "Index Future": "#c0392b",
    "Equity Swap": "#d35400",
    "Bond Future": "#34495e",
    "Commodity Future Option": "#7f8c8d"
  };
  

  const calculateChartData = (data: TradeItem[]): ChartItem[] => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    data.forEach(item => {
      const type = item.security_type;
      const qty = item.quantity || 0;
      const price = item.price || 0;
      const value = qty * price;
  
      if (!totals[type]) {
        totals[type] = 0;
      }
  
      totals[type] += value;
      grandTotal += value;
    });
  
    const chartData: ChartItem[] = Object.entries(totals).map(([type, totalValue]) => {
      const percentage = parseFloat(((totalValue / grandTotal) * 100).toFixed(2));
      return {
        name: type,
        y: percentage === 0 ? null : percentage,
        color: colorMap[type] || "#95a5a6",
      };
    });
    return chartData;
  };

  const chartData = calculateChartData(data);
  const getChartOptions = () => {
    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: '#0C101B', // Matching background from reference
        spacing: [10, 0, 30, 0], // Add space at bottom for legend
        height:"215px"
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
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
      },
      plotOptions: {
        pie: {
          innerSize: '60%',
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.2f}%',
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

type TradeItem = {
  security_type: string;
  quantity: number;
  [key: string]: any; 
};

type ChartItem = {
  name: string;
  y: number | null;
  color: string;
};
