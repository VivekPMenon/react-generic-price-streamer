import { MenuInfo } from "./model";

export enum Mode {
  SELL = 'sell',
  BUY = 'buy',
}

const menuInfoList: MenuInfo[] = [
  {
    id: 'macro-panel',
    route: '/dashboard/macro-panel',
    description: 'Macro Panel',
    badgeCount: 1,
    icon: 'fa-solid fa-list-check'
  },
  {
    id: 'research-reports',
    route: '/dashboard/research-reports',
    description: 'Research Reports',
    badgeCount: 1,
    icon: 'fa-solid fa-book'
  },
  // {
  //   route: '/dashboard/risk-reports',
  //   description: 'Risk Report Generation',
  //   badgeCount: 1,
  //   icon: 'fa-solid fa-bolt'
  // },
  {
    id: 'risk-reports',
    route: '/dashboard/risk-report-portal',
    description: 'Risk Report Portal',
    badgeCount: 1,
    icon: 'fa-regular fa-file'
  },
  {
    id: 'corporate-actions',
    route: '/dashboard/corporate-actions',
    description: 'Corporate Actions',
    badgeCount: 1,
    icon: 'fa-solid fa-microphone-lines'
  },
  {
    id: 'investor-relations',
    route: '/dashboard/investor-relations',
    description: 'Investor Relations',
    badgeCount: 1,
    icon: 'fa-solid fa-handshake'
  },
  {
    id: 'market-data',
    route: '/dashboard/market-data',
    description: 'Market Data',
    badgeCount: 1,
    icon: 'fas fa-chart-line'
  },
  {
    id: 'breaking-news',
    description: 'Breaking News',
    badgeCount: 5,
    icon: 'fa-solid fa-newspaper',
    route: '/dashboard/breaking-news',
  },
  {
    id: 'risk-metrics',
    description: 'Margin',
    badgeCount: 1,
    icon: 'fa-solid fa-chart-column',
    route: '/dashboard/risk-metrics',
  },
  // {
  //   description: 'Term Sheets',
  //   badgeCount: 5,
  //   icon: 'fa-solid fa-newspaper',
  //   route: '/dashboard/term-sheets',
  // },
];

const sellMenuInfoList: MenuInfo[] = [
  // {
  //   description: 'Today',
  //   badgeCount: 5,
  //   icon: 'fa-regular fa-snowflake'
  // },
  {
    description: `Today's Axes`,
    badgeCount: 4,
    icon: 'fa-solid fa-book-open',
    // children: [
    //   {description: 'Active Orders'},
    //   {description: 'Recent Trades'},
    //   {description: 'Call Notes'},
    //   {description: 'Position Changes', subDescription: '11/24 9:45am'}
    // ]
  },
  {
    description: 'Trading Activity',
    badgeCount: 3,
    icon: 'fa-solid fa-ranking-star'
  },
  {
    description: 'Market Data',
    badgeCount: 4,
    icon: 'fa-solid fa-chart-simple',
    // children: [
    //   {description: 'Breaking News', subDescription: '11/24 7:45am'},
    //   {description: 'Earnings Updates'},
    //   {description: 'Rating Changes'},
    //   {description: 'Research Notes', subDescription: '11/24 8:45am'}
    // ]
  },
  {
    description: 'Client Data',
    badgeCount: 3,
    icon: 'fa-solid fa-user'
  },
];

export function getMenuItems(mode: Mode) {
  return mode === Mode.SELL ? sellMenuInfoList : menuInfoList;
}