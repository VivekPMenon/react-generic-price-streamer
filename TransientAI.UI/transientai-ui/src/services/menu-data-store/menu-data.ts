import { MenuInfo } from "./model";

export const menuInfoList: MenuInfo[] = [
  {
    id: 'research-reports',
    route: '/dashboard/research-reports',
    description: 'Research Reports',
    badgeCount: 1,
    icon: 'fa-solid fa-book'
  },
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
    id: 'breaking-news',
    description: 'Breaking News',
    badgeCount: 5,
    icon: 'fa-solid fa-newspaper',
    route: '/dashboard/breaking-news',
  },
  {
    id: 'risk-metrics',
    description: 'Risk Metrics',
    badgeCount: 1,
    icon: 'fa-solid fa-chart-column',
    route: '/dashboard/risk-metrics',
  }
];