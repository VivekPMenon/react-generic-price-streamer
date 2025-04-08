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
  ['gb', 23.4],
  ['jp', 15.7],
  ['fr', 10.2],
  ['in', 5.6],
  ['cn', 2.4],
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
    min: 0,
    stops: [
      [0, '#EFEFFF'],
      [0.5, '#FFAAAA'],
      [1, '#FF0000'],
    ],
  },
  series: [
    {
      type: 'map',
      name: 'Demo Values',
      data: staticData,
      joinBy: ['hc-key', '0'],
      states: {
        hover: {
          color: '#BADA55',
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
  ],
};

const WorldMapChart = (data) => {
  console.log(data)
  const calculateCountryGroupData = (data: any): [string, number][] => {
    const totals: Record<string, number> = {};

    data.data.forEach(item => {
      const countryGroup = item.country_group.toLowerCase(); // Normalize the country group name
      const qty = item.quantity || 0;
      const price = item.price || 0;
      const value = qty * price;

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
  // const transformedData = dynamicDataForMap.map(([country, value]) => ({
  //   'hc-key': country.toLowerCase(),  // Convert country name to lowercase or map to an appropriate key
  //   value,
  // }));
 // console.log(transformedData);
  // Update the map options with dynamic data
  const updatedOptions = {
    ...options,
    series: [
      {
        ...options.series[0],
        data: dynamicDataForMap,  
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="mapChart"
      options={updatedOptions}
    />
  );
};

export default WorldMapChart;
