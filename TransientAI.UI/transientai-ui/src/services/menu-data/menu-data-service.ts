import { MenuInfo } from "./model";

export const menuInfoList: MenuInfo[] = [
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
  {
    description: 'Breaking News',
    badgeCount: 5,
    icon: 'fa-solid fa-newspaper'
  },
  {
    description: 'Research Reports',
    badgeCount: 1,
    icon: 'fa-solid fa-book'
  },
  {
    description: 'Corporate Actions',
    badgeCount: 1,
    icon: 'fa-solid fa-microphone-lines'
  },
];