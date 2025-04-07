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

const WorldMapChart = () => (
  <HighchartsReact
    highcharts={Highcharts}
    constructorType="mapChart"
    options={options}
  />
);

export default WorldMapChart;
