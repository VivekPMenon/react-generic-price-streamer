'use server';

import { Notification, NotificationType } from "./model";
import corpActionsRaw from './corp-actions.json';
import riskReportsJson from './risk-reports.json';

export async function getNotifications(): Promise<Notification[]> {
  const notifications: Notification[] = [
    // {
    //   title:'BA 2.8 03/01/2027',
    //   type: NotificationType.Axes,
    //   subTitle: '$10MM at 92.75 (+215bp)',
    //   highlights: [
    //     'Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper',
    //     'Orders of Airbus 318 surprisingly grow faster than expected',
    //     'Technical support at current levels'
    //   ]
    // },
    // {
    //   title:'KR 5 09/15/2034',
    //   type: NotificationType.Axes,
    //   subTitle: '$10MM at 92.75 (+215bp)',
    //   highlights: [
    //     'Expected gross margin improvement with latest PPI report indicating lower food input costs',
    //     `Partnership with Ocado's automated solutions yielding results as online orders grow with return to office drive`
    //   ]
    // },
    // {
    //   title:'Vanguard portfolio review',
    //   type: NotificationType.Clients,
    //   highlights: [
    //     `Review Vanguard's bond portfolio to assess the need for any rebalancing or adding treasuries as hedges amid rising inflation expectations`
    //   ]
    // },
    // {
    //   title:'BlackRock risk parameter update',
    //   type: NotificationType.Clients,
    //   highlights: [
    //     `BlackRock has updated their risk parameters, so we need to reassess the high-yield bond exposure in their portfolio`
    //   ]
    // },
    // {
    //   title:`Onboard PIMCO's John Smith`,
    //   type: NotificationType.Clients,
    //   highlights: [
    //     `Coordinate with PIMCO team to onboard their new ETF fund trader John Smith`
    //   ]
    // },
    // {
    //   title:`BlackRock`,
    //   subTitle: '$10MM Buy',
    //   type: NotificationType.Trades,
    //   highlights: [
    //     `Purchased $10MM in 10-year U.S. Treasury bonds at a 4% coupon rate for a low-risk, stable return`
    //   ]
    // },
    // {
    //   title:`California State Teachers`,
    //   subTitle: '$50MM Acquisition',
    //   type: NotificationType.Trades,
    //   highlights: [
    //     `Acquired $50 million in investment-grade corporate bonds from Apple Inc. with a 5-year maturity and a 3.8% yield`
    //   ]
    // },
    // {
    //   title:`Nuveen`,
    //   subTitle: '$50MM Buy',
    //   type: NotificationType.Trades,
    //   highlights: [
    //     `Bought $5MM worth of California municipal bonds with a 3.5% tax-exempt yield for tax efficiency`
    //   ]
    // },
    {
      title: 'GS: Ruminations - Macro, Micro',
      type: NotificationType.Research,
      subTitle: '',
      highlights: [
        'Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper',
        'Orders of Airbus 318 surprisingly grow faster than expected',
        'Technical support at current levels'
      ]
    },
    {
      title: 'GS Spec Sales: Feedback, Flows and Catalysts',
      type: NotificationType.Research,
      subTitle: '',
      highlights: [
        'Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper',
        'Orders of Airbus 318 surprisingly grow faster than expected',
        'Technical support at current levels'
      ]
    },
    {
      title: `Mandatory Event Information 
        Update: ${corpActionsRaw['83778079'].current_state.event_type}: ${corpActionsRaw['83778079'].current_state.security.name}, 
        ISIN: ${corpActionsRaw['83778079'].current_state.security.identifiers.isin}`,
      subTitle: `Account No: ${corpActionsRaw['83778079'].current_state.accounts[0].account_number}, Holding Capacity: ${corpActionsRaw['83778079'].current_state.accounts[0].holding_quantity}`,
      type: NotificationType.CorpAct,
      id: '83778079',
      highlights: [
        `Term Details: ${corpActionsRaw['83778079'].current_state.terms[0].term_number} ${corpActionsRaw['83778079'].current_state.terms[0].type}`,
        `Entitled Product ID: ${corpActionsRaw['83778079'].current_state.terms[0].security_details.product_id!}`,
        `Pay Date: ${corpActionsRaw['83778079'].current_state.terms[0].pay_date!}`
      ]
    },
    {
      title: `Mandatory Event Information 
        Update: ${corpActionsRaw['83526858'].current_state.event_type}: ${corpActionsRaw['83526858'].current_state.security.name}, 
        ISIN: ${corpActionsRaw['83526858'].current_state.security.identifiers.isin}`,
      subTitle: `Account No: ${corpActionsRaw['83526858'].current_state.accounts[0].account_number}, Holding Capacity: ${corpActionsRaw['83526858'].current_state.accounts[0].holding_quantity}`,
      type: NotificationType.CorpAct,
      id: '83526858',
      highlights: [
        `Term Details: ${corpActionsRaw['83526858'].current_state.terms[0].term_number} ${corpActionsRaw['83526858'].current_state.terms[0].type}`,
        `Entitled Product ID: ${corpActionsRaw['83526858'].current_state.terms[0].security_details.product_id!}`,
        `Pay Date: ${corpActionsRaw['83526858'].current_state.terms[0].pay_date!}`
      ]
    },
  ];

  const riskNotifications: Notification[] = riskReportsJson.map(riskReportJson => {
    return {
      type: NotificationType.RiskReport,
      title: riskReportJson.portfolio,
      highlights: [
        riskReportJson.reportType,
        riskReportJson.date
      ]
    };
  });

  return notifications.concat(riskNotifications);
}