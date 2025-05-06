//src/services/menu-data/menu-data-service.ts
import { MenuInfo } from "./model";
import i18n from '../../i18n';
import { webApihandler } from "../web-api-handler";
import { useUserContextStore } from "../user-context/user-context-store";

export enum Mode {
  SELL = 'sell',
  BUY = 'buy',
}

const menuInfoList: MenuInfo[] = [
  {
    id: 'macro-panel',
    route: '/dashboard/macro-panel',
    description: i18n.t('macro_panel'),
    badgeCount: 1,
    icon: 'fa-solid fa-list-check'
  },
  {
    id: 'research-reports',
    route: '/dashboard/research-reports',
    description:i18n.t('research_reports'),  //i18n.t('research_reports'),//
    // description: i18n.t('research_reports', { defaultValue: 'Research Reports' }), //TODO//TODO
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
    description: i18n.t('risk_report_portal'),
    badgeCount: 1,
    icon: 'fa-regular fa-file'
  },
  {
    id: 'corporate-actions',
    route: '/dashboard/corporate-actions',
    description: i18n.t('corporate_actions'),
    badgeCount: 1,
    icon: 'fa-solid fa-microphone-lines'
  },
  {
    id: 'investor-relations',
    route: '/dashboard/investor-relations',
    description: i18n.t('investor_relations'),
    badgeCount: 1,
    icon: 'fa-solid fa-handshake'
  },
  {
    id: 'market-data',
    route: '/dashboard/market-data',
    description: i18n.t('market_data'),
    badgeCount: 1,
    icon: 'fas fa-chart-line'
  },
  {
    id: 'breaking-news',
    description: i18n.t('breaking_news'), // Translated breaking news title
    badgeCount: 5,
    icon: 'fa-solid fa-newspaper',
    route: '/dashboard/breaking-news',
  },
  {
    id: 'risk-metrics',
    description: i18n.t('margin'),
    badgeCount: 1,
    icon: 'fa-solid fa-chart-column',
    route: '/dashboard/risk-metrics',
  },
  {
    id: 'pms-pnl',
    description: i18n.t('pms'),
    badgeCount: 1,
    icon: 'fa-solid fa-briefcase',
    route: '/dashboard/pms-pnl',
  },
  {
    id: 'hurricane-pms',
    description: 'Hurricane PMS',
    badgeCount: 1,
    icon: 'fa-solid fa-briefcase',
    route: '/dashboard/hurricane-pms',
  },
  {
    id: 'Notes AI',
    description: 'Notes AI',
    badgeCount: 1,
    icon: 'fa-regular fa-comments',
    route: '/dashboard/notes-ai',
  }
  // {
  //   description: 'Term Sheets',
  //   displayName: 'Term Sheets',
  //   badgeCount: 5,
  //   icon: 'fa-solid fa-newspaper',
  //   route: '/dashboard/term-sheets',
  // },
];

const sellMenuInfoList: MenuInfo[] = [
  // {
  //   description: 'Today',
  //   displayName: 'Today',
  //   badgeCount: 5,
  //   icon: 'fa-regular fa-snowflake'
  // },
  {
    id: 'todays-axes',
    description: `Today's Axes`,
    badgeCount: 4,
    icon: 'fa-solid fa-book-open',
    route: '/dashboard-generic/todays-axes',
    // children: [
    //   {description: 'Active Orders'},
    //   {description: 'Recent Trades'},
    //   {description: 'Call Notes'},
    //   {description: 'Position Changes', subDescription: '11/24 9:45am'}
    // ]
  },
  {
    id: 'trading-activity',
    description: 'Trading Activity',
    badgeCount: 3,
    icon: 'fa-solid fa-ranking-star',
    route: '/dashboard-generic/trading-activity',
  },
  {
    id: 'market-data',
    description: 'Market Data',
    badgeCount: 4,
    icon: 'fa-solid fa-chart-simple',
    route: '/dashboard-generic/market-data',
    // children: [
    //   {description: 'Breaking News', subDescription: '11/24 7:45am'},
    //   {description: 'Earnings Updates'},
    //   {description: 'Rating Changes'},
    //   {description: 'Research Notes', subDescription: '11/24 8:45am'}
    // ]
  },
  // {
  //   id: 'client-data',
  //   description: 'Client Data',
  //   badgeCount: 3,
  //   icon: 'fa-solid fa-user',
  //   route: '/dashboard-generic/todays-axes',
  // },
  {
    id: 'breaking-new',
    description: 'Breaking News',
    badgeCount: 3,
    icon: 'fa-solid fa-newspaper',
    route: '/dashboard-generic/breaking-news',
  },
];

export async function getMenuItems(mode: Mode) {
  if (mode === Mode.SELL) {
    return sellMenuInfoList;
  }
  const query = `
  {
    getScreensForRole {
      role
      screens {
      id
      key
      icon
      route
      priorityId
      description 
      badgeCount
      }
    }
  }
`;
  const serviceName = 'hurricane-api-2-0';
  try {
    const response = await webApihandler.post(
      'graphql', 
      { query }, 
      undefined,
      { serviceName } 
    );
    
    const menuList = response.data.getScreensForRole.screens || [];
    // const role = response.data.getScreensForRole.role || 'Operations';
    // const setUserContext = useUserContextStore.getState().setUserContext;
    // const currentUserContext = useUserContextStore.getState().userContext;
    // setUserContext({ ...currentUserContext, role });
    const translatedMenuList: MenuInfo[] = menuList.map((menuItem: MenuInfo) => ({
      ...menuItem,
      description: i18n.t(menuItem.description || ''),
    }));

    // const sortedMenuList = translatedMenuList.sort((a, b) => (a.priorityId || 0) - (b.priorityId || 0));
    return translatedMenuList;
  } catch (error) { 
    console.error('Error fetching screens for role:', error);
    throw error;
  }
};