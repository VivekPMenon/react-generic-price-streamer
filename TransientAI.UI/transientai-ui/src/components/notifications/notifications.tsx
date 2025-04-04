//src/components/notifications/notifications.tsx
'use client'

import { useEffect, useMemo, useState, useRef } from 'react';
import styles from './notifications.module.scss';
import { Notification, NotificationType } from '@/services/notifications';
import { useCorpActionsStore, resourceName as corpActionResourceName } from "@/services/corporate-actions";
import { useMenuStore } from "@/services/menu-data";
import { NotificationPopup } from './notification-popup';
import { useRouter } from 'next/navigation';
import { useResearchReportsStore, useRiskReportsSlice, resourceName as researchReportResourceName, resourceNameRiskReports, ResearchReport } from '@/services/reports-data';
import { Spinner } from '@radix-ui/themes';
import { resourceNameInvestorRelations, useInvestorRelationsStore } from "@/services/investor-relations-data/investor-relations-store";
import { InquiryFlag } from "@/services/investor-relations-data";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { resourceNameRiskMetrics, useRiskDataStore } from '@/services/risk-data/risk-data-store';
import { formatDate } from '@/lib/utility-functions/date-operations';
import { useUnseenItemsStore } from '@/services/unseen-items-store/unseen-items-store';
import { resourceName as BreakNewsresourceName } from '@/services/break-news/break-news-data-store';
import { resourceName as bloombergReportResourceName, useMacroPanelDataStore } from '@/services/macro-panel-data/macro-panel-data-store';
import { RoleType, useUserContextStore } from '@/services/user-context';
import {usePmsPnlDataStore} from "@/services/pms-pnl-data/pms-pnl-data-store";
import { useTranslation } from 'react-i18next'; // Import the translation hook


export interface NotificationsProps {
  onExpandCollapse?: (state: boolean) => void;
  notificationClicked?: (notification: Notification) => void;
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

const filterTypes = [
  NotificationType.All,
  // NotificationType.Axes,
  // NotificationType.Clients,
  // NotificationType.Trades,
  NotificationType.Research,
  NotificationType.Macro,
  NotificationType.RiskReport,
  NotificationType.CorpAct,
  NotificationType.Inquiries,
  NotificationType.PmsPnl,
  // NotificationType.BreakNews
];

export const filterTypeToResourceMap: { [key: string]: string } = {
  'All': '',
  [NotificationType.Research]: researchReportResourceName,
  [NotificationType.RiskReport]: resourceNameRiskReports,
  [NotificationType.CorpAct]: corpActionResourceName,
  [NotificationType.Inquiries]: resourceNameInvestorRelations,
  [NotificationType.BreakNews]: BreakNewsresourceName
};

export function Notifications(props: NotificationsProps) {
  const { t } = useTranslation(); // Get the translation function
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const { isLoading, reports: researchReports, setSelectedReport: setSelectedResearchReport } = useResearchReportsStore();
  const { isLoading: isRiskReportLoading, riskReports, setSelectedReport: setSelectedRiskReport } = useRiskReportsSlice();
  const { isLoading: isCorpActionsLoading, loadedCorpActions, selectedCorpAction, setSelectedCorpAction, loadCorpActions, loadPmCorpActions } = useCorpActionsStore();
  const { isLoading: isInquiriesLoading, inquiries } = useInvestorRelationsStore();
  const { isLoading: isRiskDataLoading, lastUpdatedTimestamp } = useRiskDataStore();
  const { isLoading: isPmsPnlReportLoading, reportDate } = usePmsPnlDataStore();
  // const { isLoading: isBreakingNewsLoading, breakNewsItems, setSelectedBreakNewsItem, setGroupId } = useBreakNewsDataStore();
  const { isLoading: isBloombergEmailReportsLoading, bloombergEmailReports, setSelectedReport } = useMacroPanelDataStore();
  const { resetUnseenItems, unseenItems } = useUnseenItemsStore();
  const { fullMenuList, activeMenuList, setActiveMenu } = useMenuStore();
  const { userContext } = useUserContextStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification>({}); // todo..
  const [selectedType, setSelectedType] = useState<string>(NotificationType.Research);
  const previousSelectedType = useRef<string|null>(null);

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
  useEffect(() => loadNotifications(), [
    researchReports,
    riskReports,
    inquiries,
    loadedCorpActions,
    lastUpdatedTimestamp,
    reportDate,
    bloombergEmailReports
  ]);

  useEffect(() => {
    if(userContext.role == RoleType.PM) {
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

  function loadNotifications() {
    const newNotifications: Notification[] = [
      // ...notifications,
      ...bloombergEmailReports
        .map(bloombergEmailReport => ({
          id: bloombergEmailReport.received_date,
          resourceName: bloombergReportResourceName,
          title: bloombergEmailReport.subject,
          // subTitle: researchReport.concise_summary,
          type: NotificationType.Macro,
          timestamp: bloombergEmailReport.received_date ? new Date(bloombergEmailReport.received_date).getTime() : new Date().getTime(),
          highlights: [
             `${t('notification.date')}: ${formatDate(bloombergEmailReport.received_date)}`
          ]
        })),
      ...researchReports
        .map(researchReport => ({
          id: researchReport.id,
          resourceName: researchReportResourceName,
          title: researchReport.name,
          // subTitle: researchReport.concise_summary,
          type: NotificationType.Research,
          timestamp: researchReport.received_date ? new Date(researchReport.received_date).getTime() : new Date().getTime(),
          highlights: getResearchReportHighlights(researchReport)
        })),
      ...riskReports
        .map(riskReport => ({
          id: riskReport.id,
          resourceName: resourceNameRiskReports,
          title: riskReport.filename,
          type: NotificationType.RiskReport,
          timestamp: riskReport.uploaded ? riskReport.uploaded.getTime() : new Date().getTime(),
          highlights: [
            `Date: ${riskReport.uploaded!}`
          ]
        })),
      ...loadedCorpActions
        .map(corpAction => ({
          id: corpAction.eventId,
          resourceName: corpActionResourceName,
          title: `TICKER: ${corpAction.ticker} \n ${corpAction.security?.name}`,
          type: NotificationType.CorpAct,
          subTitle: `<span class=${corpAction.actionRequired ? 'text-red-500' :'text-green-500'}>${corpAction.eventType} - ${corpAction.eventStatus}<span/>`,
          timestamp: corpAction?.receivedDate ? new Date(corpAction.receivedDate).getTime() : new Date().getTime(),
          highlights: [
            `ISIN: ${corpAction.isin!}, ID: ${corpAction.eventId}`,
            `No Accounts: ${corpAction.accounts?.length ? (corpAction.accounts?.length +' '+'Account: ' + corpAction.accounts[0].accountNumber): ''} ${corpAction.accounts && corpAction.accounts?.length > 1 ? ' +'+(corpAction.accounts?.length-1)+'More accts' : ''}`,
            `Pay Date: ${formatDate(corpAction.dates?.pay_date)}`,
            `Holding: ${corpAction.holdingQuantity}`,
            `Version: ${corpAction.version}`,
          ]
        })),
      ...inquiries
        .map(inquiry => ({
          id: inquiry.id,
          title: `${inquiry.subject}`,
          type: NotificationType.Inquiries,
          subTitle: inquiry.inquiry ? inquiry.inquiry : '',
          timestamp: inquiry.due_date ? new Date(inquiry.due_date).getTime() : 0,
          highlights: [
            `Due: ${inquiry.due_date ? new Date(inquiry.due_date).toDateString() : ''}`,
            `Assigned to: ${inquiry.assignee_name}`,
            `${inquiry.flag ? InquiryFlag[inquiry.flag] : ''}`,
          ]
        })),
      {
        id: 'risk-metrics-notification',
        title: `GS Margin Excess Updated`,
        type: NotificationType.RiskReport,
        timestamp: lastUpdatedTimestamp ? new Date(lastUpdatedTimestamp).getTime() : 0,
        highlights: [
          formatDate(lastUpdatedTimestamp)
        ]
      },
      {
        id: 'pms-pnl-notification',
        title: t('notification.pnl_dashboard', { date: reportDate?.toLocaleDateString() }),
        type: NotificationType.PmsPnl,
        timestamp: reportDate ? reportDate.getTime() : 0,
        highlights: [
          formatDate(reportDate?.toISOString())
        ]
      },
      
      // ...breakNewsItems
      //   .map(news => ({
      //     id: news.id?.toString(),
      //     title: news.message,
      //     sideTitle: 'WhatsApp',
      //     type: NotificationType.BreakNews,
      //     highlights: [
      //       `${formatDate(news?.sender_time_info || '')}`,
      //     ]
      //   }))
    ];

    newNotifications.sort((x, y) => (y.timestamp ?? -1) - (x.timestamp ?? -1));

    setNotifications(newNotifications);
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
    //TODO .. create a common component for WIdget with transclusion so that widget tiel etc. can be reused
    <div className={`${styles.notifications} widget`}>
          <div className='widget-title'>
      {t('notification.title')}  {/* Translates the title */}
      <i className='fa-solid fa-expand toggler' onClick={() => expandOrCollapsePanel()} title={t('notification.expand')}></i>
    </div>

      <div className='horizontal-scrollable-div filters'>
      {filterTypes.map(filterType => {
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