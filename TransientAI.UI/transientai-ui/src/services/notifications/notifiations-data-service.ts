import { corpActionsDataService } from "../corporate-actions";
import { Notification, NotificationType } from "./model";

class NotificationsDataService {

  getNotifications(): Notification[] {
    return [
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
        title:'GS: Ruminations - Macro, Micro',
        type: NotificationType.Research,
        subTitle: '',
        highlights: [
          'Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper',
          'Orders of Airbus 318 surprisingly grow faster than expected',
          'Technical support at current levels'
        ]
      },
      {
        title:'GS Spec Sales: Feedback, Flows and Catalysts',
        type: NotificationType.Research,
        subTitle: '',
        highlights: [
          'Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper',
          'Orders of Airbus 318 surprisingly grow faster than expected',
          'Technical support at current levels'
        ]
      },
      {
        title: corpActionsDataService.getCorpActions()[0].eventDescription,
        subTitle: `Account No: ${corpActionsDataService.getCorpActions()[0].accountId}, Holding Capacity: ${corpActionsDataService.getCorpActions()[0].holdingQuantity}`,
        type: NotificationType.CorpAct,
        highlights: [
          `Term Details: ${corpActionsDataService.getCorpActions()[0].termDetails}`,
          `Entitled Product ID: ${corpActionsDataService.getCorpActions()[0].entitledProductId}`,
          `Pay Date: ${corpActionsDataService.getCorpActions()[0].paydate}`
        ]
      },
      {
        title: corpActionsDataService.getCorpActions()[1].eventDescription,
        subTitle: `Account No: ${corpActionsDataService.getCorpActions()[1].accountId}, Holding Capacity: ${corpActionsDataService.getCorpActions()[1].holdingQuantity}`,
        type: NotificationType.CorpAct,
        highlights: [
          `Term Details: ${corpActionsDataService.getCorpActions()[1].termDetails}`,
          `Entitled Product ID: ${corpActionsDataService.getCorpActions()[1].entitledProductId}`,
          `Pay Date: ${corpActionsDataService.getCorpActions()[1].paydate}`
        ]
      },
    ];
  }
}

export const notificationsDataService = new NotificationsDataService();