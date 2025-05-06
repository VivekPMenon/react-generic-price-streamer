//src/components/notifications/notifications.tsx
//src/components/notifications/notifications.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './notifications.module.scss';
import { Notification, NotificationType } from '@/services/notifications';
import { resourceName as corpActionResourceName, useCorpActionsStore } from "@/services/corporate-actions";
import { Mode, menuStore } from "@/services/menu-data";
import { NotificationPopup } from './notification-popup';
import { useRouter } from 'next/navigation';
import {
  ResearchReport,
  resourceName as researchReportResourceName,
  resourceNameRiskReports,
  useResearchReportsStore,
  useRiskReportsSlice
} from '@/services/reports-data';
import { Spinner } from '@radix-ui/themes';
import {
  resourceNameInvestorRelations,
  useInvestorRelationsStore
} from "@/services/investor-relations-data/investor-relations-store";
import { InquiryFlag } from "@/services/investor-relations-data";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { resourceNameRiskMetrics, useRiskDataStore } from '@/services/risk-data/risk-data-store';
import { formatDate } from '@/lib/utility-functions/date-operations';
import { unseenItemsStore } from '@/services/unseen-items-store/unseen-items-store';
import { resourceName as BreakNewsresourceName } from '@/services/break-news/break-news-data-store';
import {
  resourceName as bloombergReportResourceName,
  macroPanelDataStore
} from '@/services/macro-panel-data/macro-panel-data-store';
import { RoleType, useUserContextStore } from '@/services/user-context';
import { pmsPnlDataStore } from "@/services/pms-pnl-data/pms-pnl-data-store";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import { translateText } from '@/i18n';

// Helper function to translate text fields within a notification
const translateNotificationText = async (notification: Notification) => {
  const translatedNotification = { ...notification };

  // Translate the title and subtitle
  if (notification.title) {
    translatedNotification.title = await translateText(notification.title);
  }

  translatedNotification.subTitle = notification.subTitle
    ? await translateText(notification.subTitle)
    : '';

  // Translate the highlights (if any)
  if (notification.highlights) {
    translatedNotification.highlights = await Promise.all(
      notification.highlights.map(async (highlight) => await translateText(highlight))
    );
  }

  return translatedNotification;
};

export interface NotificationsProps {
  onExpandCollapse?: (state: boolean) => void;
  notificationClicked?: (notification: Notification) => void;
  mode: Mode;
}

function getIconClass(type: NotificationType) {
  switch (type) {
    case NotificationType.Axes:
      return 'fa-solid fa-ban';

    case NotificationType.Clients:
      return 'fa-solid fa-user';

    case NotificationType.Trades:
      return 'fa-solid fa-newspaper';

    case NotificationType.CorpAct:
      return 'fa-solid fa-microphone-lines';

    case NotificationType.Research:
      return 'fa-solid fa-book';

    case NotificationType.RiskReport:
      return 'fa-solid fa-bolt';

    case NotificationType.Inquiries:
      return 'fa-solid fa-handshake';

    case NotificationType.BreakNews:
      return 'fa fa-whatsapp text-green-600';

    case NotificationType.Macro:
      return 'fa fa-list-check';

    case NotificationType.PmsPnl:
      return 'fa-solid fa-briefcase';
  }
}

function getPillClass(type: NotificationType) {
  switch (type) {
    case NotificationType.Axes:
    case NotificationType.Research:
      return 'pill blue';

    case NotificationType.Clients:
    case NotificationType.Macro:
      return 'pill orange';

    case NotificationType.Trades:
    case NotificationType.RiskReport:
      return 'pill pink';

    case NotificationType.CorpAct:
    case NotificationType.PmsPnl:
      return 'pill teal';

    case NotificationType.Inquiries:
      return 'pill gold';

    case NotificationType.BreakNews:
      return 'pill bg-green-600';
  }
}

const getFilterTypes = (mode: Mode) => {
  if (mode === Mode.SELL) {
    return [
      NotificationType.All,
      NotificationType.Axes,
      NotificationType.Clients,
      NotificationType.Trades
    ];
  }

  return [
    NotificationType.All,
    NotificationType.Research,
    NotificationType.Macro,
    NotificationType.RiskReport,
    NotificationType.CorpAct,
    NotificationType.Inquiries,
    NotificationType.PmsPnl
  ];
};

export const filterTypeToResourceMap: { [key: string]: string } = {
  'All': '',
  [NotificationType.Research]: researchReportResourceName,
  [NotificationType.RiskReport]: resourceNameRiskReports,
  [NotificationType.CorpAct]: corpActionResourceName,
  [NotificationType.Inquiries]: resourceNameInvestorRelations,
  [NotificationType.BreakNews]: BreakNewsresourceName
};

export function Notifications(props: NotificationsProps) {
  const { t } = useTranslation(); // Get the translation function // Get the translation function
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const { isLoading, reports: researchReports, setSelectedReport: setSelectedResearchReport } = useResearchReportsStore();
  const { isLoading: isRiskReportLoading, riskReports, setSelectedReport: setSelectedRiskReport } = useRiskReportsSlice();
  const { isLoading: isCorpActionsLoading, loadedCorpActions, selectedCorpAction, setSelectedCorpAction, loadCorpActions, loadPmCorpActions } = useCorpActionsStore();

  const { isLoading: isInquiriesLoading, inquiries } = useInvestorRelationsStore();

  const { isLoading: isRiskDataLoading, lastUpdatedTimestamp } = useRiskDataStore();
  const isPmsPnlReportLoading = pmsPnlDataStore.use.isLoading();
  const reportDate = pmsPnlDataStore.use.reportDate();
  // const { isLoading: isBreakingNewsLoading, breakNewsItems, setSelectedBreakNewsItem, setGroupId } = useBreakNewsDataStore();
  // const isBloombergEmailReportsLoading = macroPanelDataStore.use.isLoading();
  const bloombergEmailReports = macroPanelDataStore.use.bloombergEmailReports();
  const setSelectedReport = macroPanelDataStore.use.setSelectedReport();
  const unseenItems = unseenItemsStore.use.unseenItems();
  const resetUnseenItems = unseenItemsStore.use.resetUnseenItems();

  const fullMenuList = menuStore.use.fullMenuList();
  const activeMenuList = menuStore.use.activeMenuList();
  const setActiveMenu = menuStore.use.setActiveMenu();

  const { userContext } = useUserContextStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification>({}); // todo..
  const [selectedType, setSelectedType] = useState<string>(props.mode === Mode.BUY ? NotificationType.Research : NotificationType.Axes);
  const previousSelectedType = useRef<string | null>(null);

  const showSpinner = isLoading || isRiskReportLoading || isCorpActionsLoading || isInquiriesLoading || isRiskDataLoading || isPmsPnlReportLoading;

  const visibleNotifications = useMemo<Notification[]>(() => notifications
    .filter(notification => selectedType === NotificationType.All || notification.type === selectedType), [
    selectedType,
    notifications
  ]);

  const virtualizer = useVirtualizer({
    count: visibleNotifications.length,
    getScrollElement: () => divRef.current,
    estimateSize: () => 200,
    overscan: 5,
    gap: 10
  });

  // todo ... we will be fetching the entire notification types from an API instead of UI individually calling each categories and stitching
  useEffect(() => loadNotifications(props.mode), [
    researchReports,
    riskReports,
    inquiries,
    loadedCorpActions,
    lastUpdatedTimestamp,
    reportDate,
    bloombergEmailReports
  ]);

  useEffect(() => {
    if (userContext.role == RoleType.PM) {
      loadPmCorpActions();
    } else {
      loadCorpActions();
    }
  }, [userContext.role]);

  useEffect(() => {
    const previousValue = previousSelectedType.current;
    if (previousValue === null || previousValue === selectedType) {
      return;
    }

    if (previousValue === NotificationType.All) {
      for (const key of Object.keys(unseenItems)) {
        if (unseenItems[key] > 0) {
          resetUnseenItems(key);
        }
      }

      return;
    }

    const additionalResourceToCheck = previousValue === NotificationType.RiskReport ? resourceNameRiskMetrics : '';

    if (unseenItems[filterTypeToResourceMap[previousValue]] > 0 || unseenItems[additionalResourceToCheck] > 0) {
      resetUnseenItems(filterTypeToResourceMap[previousValue]);
      resetUnseenItems(additionalResourceToCheck);
    }
  }, [resetUnseenItems, selectedType, unseenItems]);

  function loadNotifications(mode: Mode) {
    let notificationPromises: Promise<Notification>[];
    if (mode === Mode.BUY) {
      // Collect all notification promises in a flat array
      notificationPromises = [
        ...bloombergEmailReports.map(async (bloombergEmailReport) => ({
          id: bloombergEmailReport.received_date,
          resourceName: bloombergReportResourceName,
          title: bloombergEmailReport.subject,
          type: NotificationType.Macro,
          timestamp: bloombergEmailReport.received_date
            ? new Date(bloombergEmailReport.received_date).getTime()
            : new Date().getTime(),
          highlights: [`${t('notification.date')}: ${formatDate(bloombergEmailReport.received_date)}`]
        })),

        ...researchReports.map(async (researchReport) => ({
          id: researchReport.id,
          resourceName: researchReportResourceName,
          title: researchReport.name,
          type: NotificationType.Research,
          timestamp: researchReport.received_date
            ? new Date(researchReport.received_date).getTime()
            : new Date().getTime(),
          highlights: getResearchReportHighlights(researchReport)
        })),

        ...riskReports.map(async (riskReport) => ({
          id: riskReport.id,
          resourceName: resourceNameRiskReports,
          title: riskReport.filename,
          type: NotificationType.RiskReport,
          timestamp: riskReport.uploaded ? riskReport.uploaded.getTime() : new Date().getTime(),
          highlights: [`Date: ${riskReport.uploaded!}`]
        })),

        ...loadedCorpActions.map(async (corpAction) => ({
          id: corpAction.eventId,
          resourceName: corpActionResourceName,
          title: `TICKER: ${corpAction.ticker} \n ${corpAction.security?.name}`,
          type: NotificationType.CorpAct,
          subTitle: `<span class=${corpAction.actionRequired ? 'text-red-500' : 'text-green-500'}>${corpAction.eventType} - ${corpAction.eventStatus}<span/>`,
          timestamp: corpAction?.receivedDate ? new Date(corpAction.receivedDate).getTime() : new Date().getTime(),
          highlights: [
            `ISIN: ${corpAction.isin!}, ID: ${corpAction.eventId}`,
            `No Accounts: ${corpAction.accounts?.length ? (corpAction.accounts?.length + ' ' + 'Account: ' + corpAction.accounts[0].accountNumber) : ''} ${corpAction.accounts && corpAction.accounts?.length > 1 ? ' +' + (corpAction.accounts?.length - 1) + 'More accts' : ''}`,
            `Pay Date: ${formatDate(corpAction.dates?.pay_date)}`,
            `Holding: ${corpAction.holdingQuantity}`,
            `Version: ${corpAction.version}`
          ]
        })),

        ...inquiries.map(async (inquiry) => ({
          id: inquiry.id,
          title: `${inquiry.subject}`,
          type: NotificationType.Inquiries,
          subTitle: inquiry.inquiry ? inquiry.inquiry : '',
          timestamp: inquiry.due_date ? new Date(inquiry.due_date).getTime() : 0,
          highlights: [
            `Due: ${inquiry.due_date ? new Date(inquiry.due_date).toDateString() : ''}`,
            `Assigned to: ${inquiry.assignee_name}`,
            `${inquiry.flag ? InquiryFlag[inquiry.flag] : ''}`
          ]
        })),
      ];

      Promise.all(notificationPromises).then(async (resolvedNotifications) => {
        const translatedNotifications = await Promise.all(
          resolvedNotifications.map(translateNotificationText)
        );

        translatedNotifications.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
        setNotifications(translatedNotifications);
      });
    } else {
      notificationPromises = [
        {
          id: crypto.randomUUID(),
          title: `BA 2.8 03/01/2027`,
          type: NotificationType.Axes,
          subTitle: '$10MM at 92.75 (+215bp)',
          timestamp: 20,
          highlights: [
            `Corporate funds shun Boeing short dated bonds despite record purchases of short end IG and UST paper`,
            `Orders of Airbus 318 surprisingly grow faster than expected`,
            `Technical support at current levels`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `KR 5 09/15/2034`,
          type: NotificationType.Axes,
          subTitle: '$10MM at 92.75 (+215bp)',
          timestamp: 19,
          highlights: [
            `Expected gross margin improvement with latest PPI report indicating lower food input costs`,
            `Partnership with Ocado's automated solutions yielding results as online orders grow with return to office drive`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `Onboard PIMCO's John Smith`,
          type: NotificationType.Clients,
          timestamp: 18,
          highlights: [
            `Coordinate with PIMCO team to onboard their new ETF fund trader John Smith`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `BlackRock risk parameter update`,
          type: NotificationType.Clients,
          timestamp: 17,
          highlights: [
            `BlackRock has updated their risk parameters, so we need to reassess the high-yield bond exposure in their portfolio`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `Vanguard portfolio review`,
          type: NotificationType.Clients,
          timestamp: 16,
          highlights: [
            `Review Vanguard's bond portfolio to assess the need for any rebalancing or adding treasuries as hedges amid rising inflation expectations`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `Nuveen`,
          subTitle: '$50MM Buy',
          type: NotificationType.Trades,
          timestamp: 15,
          highlights: [
            `Bought $5MM worth of California municipal bonds with a 3.5% tax-exempt yield for tax efficiency`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `California State Teachers`,
          subTitle: '$50MM Acquisition',
          type: NotificationType.Trades,
          timestamp: 14,
          highlights: [
            `Acquired $50 million in investment-grade corporate bonds from Apple Inc. with a 5-year maturity and a 3.8% yield`
          ]
        },
        {
          id: crypto.randomUUID(),
          title: `BlackRock`,
          subTitle: '$10MM Buy',
          type: NotificationType.Trades,
          timestamp: 13,
          highlights: [
            `Purchased $10MM in 10-year U.S. Treasury bonds at a 4% coupon rate for a low-risk, stable return`
          ]
        }
      ].map(async (notification) => (Promise.resolve(notification)));
    }

    Promise.all(notificationPromises).then(async (resolvedNotifications) => {
      const translatedNotifications = await Promise.all(
        resolvedNotifications.map(translateNotificationText)
      );

      translatedNotifications.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
      setNotifications(translatedNotifications);
    });
  }

  function getResearchReportHighlights(researchReport: ResearchReport): string[] {
    const senderInfo = `${researchReport.sender} | ${formatDate(researchReport.received_date)}`;
    if (researchReport.concise_summary) {
      return [
        researchReport.concise_summary,
        senderInfo
      ];
    }

    return [
      senderInfo
    ];
  }

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse!(!isExpanded);
  }

  async function onNotificationPopupTrigger(id: string) {
    // const corpActions = await getCorpActions();
    // const selectedAction = corpActions.find(action => action.eventId === id);
    // setSelectedCorpAction(selectedAction!);
  }

  function onNotificationClick(notification: Notification) {
    let newRoute = '';
    switch (notification.type) {
      case NotificationType.RiskReport:
        if (notification.id === 'risk-metrics-notification') {
          router.push(newRoute = '/dashboard/risk-metrics');
          break;
        }
        setSelectedRiskReport(riskReports.find(report => report.id === notification.id)?.id!);
        router.push(newRoute = '/dashboard/risk-report-portal'); // todo.. remove the route hardcoding
        break;

      case NotificationType.Research:
        setSelectedResearchReport(researchReports.find(report => report.id === notification.id)!);
        router.push(newRoute = '/dashboard/research-reports'); // todo.. remove the route hardcoding
        break;

      case NotificationType.CorpAct:
        setSelectedCorpAction(loadedCorpActions.find(corpAction => corpAction.eventId === notification.id)!);
        router.push(newRoute = '/dashboard/corporate-actions'); // todo.. remove the route hardcoding
        break;

      case NotificationType.Inquiries:
        router.push(newRoute = '/dashboard/investor-relations'); // todo.. remove the route hardcoding
        break;

      case NotificationType.Macro:
        router.push(newRoute = '/dashboard/macro-panel'); // todo.. remove the route hardcoding
        setSelectedReport(bloombergEmailReports.find(report => report.received_date === notification.id)!);
        break;

      case NotificationType.PmsPnl:
        router.push(newRoute = '/dashboard/pms-pnl');
        break;

      case NotificationType.Axes:
        router.push(newRoute = '/dashboard-generic/todays-axes');
        break;

      case NotificationType.Clients:
        break;

      case NotificationType.Trades:
        break;

      // case NotificationType.BreakNews:
      //   const selectedNewsItem = breakNewsItems.find((news) => news.id == notification.id);
      //   setSelectedBreakNewsItem(selectedNewsItem!);
      //   setGroupId(selectedNewsItem?.group_id || null);
      //   router.push(newRoute = '/dashboard/breaking-news'); // todo.. remove the route hardcoding
      //   break;
    }

    const menuForRoute = fullMenuList.find(menu => menu.route === newRoute);
    if (menuForRoute) {
      setActiveMenu(menuForRoute);
    }

    setSelectedNotification(notification);
    props.notificationClicked!(notification);
  }

  function onReadMoreClick() {
    if (activeMenuList.length > 0) {
      setActiveMenu(activeMenuList[0]);
    }

    router.push('/dashboard/corporate-actions'); // todo.. remove the route hardcoding
  }

  function getUnseenItemsCount(filterType: string): number {
    return unseenItems[filterTypeToResourceMap[filterType]] ? unseenItems[filterTypeToResourceMap[filterType]] : 0;
  }

  function changeNotificationType(filterType: string) {
    previousSelectedType.current = selectedType;
    setSelectedType(filterType);
  }

  const items = virtualizer.getVirtualItems();
  return (
    //TODO .. create a common component for Widget with transclusion so that widget tiel etc. can be reused
    <div className={`${styles.notifications} widget`}>
      <div className='widget-title'>
        {t('notification.title')}  {/* Translates the title */}
        <i className='fa-solid fa-expand toggler' onClick={() => expandOrCollapsePanel()} title={t('notification.expand')}></i>
      </div>
      <div className='horizontal-scrollable-div filters'>
        {getFilterTypes(props.mode).map(filterType => {
          const unseenItemsCount = getUnseenItemsCount(filterType);
          return <button
            key={filterType}
            className={`${filterType === selectedType ? 'filter active' : 'filter'} ${unseenItemsCount > 0 ? 'flash' : ''}`}
            onClick={() => changeNotificationType(filterType)}>
            {t(`notification.${filterType.toLowerCase()}`)} {/* Translate the filter type */}
            {unseenItemsCount > 0 && <div className='bubble off-white-color'>{unseenItemsCount}</div>}
          </button>
        })}
      </div>

      <div ref={divRef} className={`${styles['notification-items']} scrollable-div ${isExpanded ? styles['expanded'] : ''}`}>
        {
          (showSpinner) ?
            <Spinner size="3" />
            :
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}>

              {
                items.map((item: VirtualItem) => (
                  <div
                    key={item.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${item.start}px)`
                    }}
                    className={`${styles['notification-item']} ${visibleNotifications[item.index].id === selectedNotification.id ? styles['active'] : ''}`}
                    ref={virtualizer.measureElement}
                    data-index={item.index}
                  >
                    <div
                      key={visibleNotifications[item.index].id!}
                      onClick={() => onNotificationClick(visibleNotifications[item.index])}
                    >
                      <div className={styles['notification-title']}>
                        <i className={getIconClass(visibleNotifications[item.index].type!)}></i>
                        <span className={`${styles.name} truncate`}>{visibleNotifications[item.index].title}</span>
                        {/* <span className={styles['notification-count']}>(6)</span> */}
                        <div className={styles['notification-menu']}>
                          {
                            visibleNotifications[item.index].sideTitle ?
                              <div className={getPillClass(visibleNotifications[item.index].type!)}>
                                {visibleNotifications[item.index].sideTitle}
                              </div>
                              :
                              <div className={getPillClass(visibleNotifications[item.index].type!)}>
                                {visibleNotifications[item.index].type}
                              </div>
                          }
                          <NotificationPopup
                            onTrigger={onNotificationPopupTrigger}
                            notification={selectedCorpAction!}
                            onOk={onReadMoreClick}
                            notificationId={visibleNotifications[item.index].id}>
                            <div>
                              <i className='fa-solid fa-ellipsis ml-3'></i>
                            </div>
                          </NotificationPopup>
                        </div>
                      </div>

                      <div className={styles['notification-content']}>
                        {
                          visibleNotifications[item.index].type == NotificationType.CorpAct ?
                            <div className='pl-5' dangerouslySetInnerHTML={{ __html: visibleNotifications[item.index].subTitle || '' }}></div> : <div className='blue-color'>{visibleNotifications[item.index].subTitle}</div>
                        }

                        <div className={styles['messages']}>
                          <ul className="list-disc pl-8 off-white-color-alt">
                            {
                              visibleNotifications[item.index].highlights?.map(i => <li key={visibleNotifications[item.index].id + i}>{i}</li>)
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
              {/*</div>*/}
            </div>
        }
      </div>
    </div>
  );
}