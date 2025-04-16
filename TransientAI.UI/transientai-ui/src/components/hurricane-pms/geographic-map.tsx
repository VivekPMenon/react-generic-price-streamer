import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import mapDataWorld from '@highcharts/map-collection/custom/world.geo.json';
import * as mapModule from 'highcharts/modules/map';

// Safe way to initialize the module
if (typeof (mapModule as any).default === 'function') {
  (mapModule as any).default(Highcharts);
} else if (typeof mapModule === 'function') {
  (mapModule as any)(Highcharts);
}

const staticData: [string, number][] = [
  ['us', 54.6],
  ['gb', 33.4],
  ['jp', 45.7],
  ['fr', 80.2],
  ['in', 53.6],
  ['cn', 23.4],
];

const options: Highcharts.Options = {
  chart: {
    map: mapDataWorld as any,
     height:"250px",
     backgroundColor: '#0C101B'
  },
  title: {
    text: 'Static World Map - Sample Data',
    style: { color: '#ffffff' },
  },
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: 'bottom',
    },
  },
  colorAxis: {
    min: -1000000, // or your real min
    max: 1000000,  // or your real max
    stops: [
      [0, '#ff0008'],
      [0.5, '#fb585d'],
      [1, '#12ff24'],
    ]
  },
  series: [
    {
      type: 'map',
      name: 'Price',
      data: [],
      joinBy: ['hc-key', 'hc-key'],
      states: {
        hover: {
          color: '#BADA55',
        },
      },
      dataLabels: {
        enabled: false,
        format: '{point.name}: {point.value}',
      },
    },
  ],
};

const WorldMapChart = (data: any) => {
  console.log(data)
  const calculateCountryGroupData = (data: any): [string, number][] => {
    const totals: Record<string, number> = {};

    data.data.forEach((item: any) => {
      const countryGroup = item.iso_a2 // Normalize the country group name
      // const qty = item.quantity || 0;
      // const price = item.price || 0;
      const value = item.market_value || 0; 

      if (!totals[countryGroup]) {
        totals[countryGroup] = 0;
      }

      totals[countryGroup] += value;
    });

    const countryData: [string, number][] = Object.entries(totals).map(([countryGroup, totalValue]) => [
      countryGroup,
      parseFloat(totalValue.toFixed(2)),  // Round to 2 decimals
    ]);
 
    return countryData;
  };

   //TO DO need to get the ISO code in response we cannot map it if we have full text to geo json

  // Calculate dynamic country group data
  const dynamicDataForMap = calculateCountryGroupData(data);
  const transformedData = dynamicDataForMap.map(([country, value]) => ({
    'hc-key': country,  // Convert country name to lowercase or map to an appropriate key
    value,
  }));
//  console.log('transformedData', transformedData);
  // Update the map options with dynamic data
  const updatedOptions = {
    ...options,
    series: [
      {
        ...(options.series?.[0] || {}), 
        data: transformedData,  
      },
    ],
  };

  return (
    <div className="map-container">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType="mapChart"
        options={updatedOptions}
      />
    </div>
  );
};

export default WorldMapChart;
