'use client'

import { useContext, useEffect, useMemo, useState, useRef } from 'react';
import styles from './notifications.module.scss';
import { Notification, NotificationType } from '@/services/notifications';
import { useCorpActionsStore } from "@/services/corporate-actions";
import { MenuContextData } from "@/services/menu-data";
import { NotificationPopup } from './notification-popup';
import { useRouter } from 'next/navigation';
import { useResearchReportsStore, useRiskReportsSlice } from '@/services/reports-data';
import { Spinner } from '@radix-ui/themes';
import { useInvestorRelationsStore } from "@/services/investor-relations-data/investor-relations-store";
import { InquiryFlag } from "@/services/investor-relations-data";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useRiskDataStore } from '@/services/risk-data/risk-data-store';
import { formatDate, formatDateToHHMM } from '@/lib/utility-functions/date-operations';

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
  }
}

function getPillClass(type: NotificationType) {
  switch (type) {
    case NotificationType.Axes:
    case NotificationType.Research:
      return 'pill blue';

    case NotificationType.Clients:

    case NotificationType.RiskReport:
      return 'pill orange';

    case NotificationType.Trades:
      return 'pill pink';

    case NotificationType.CorpAct:
      return 'pill teal';

    case NotificationType.Inquiries:
      return 'pill gold';
  }
}

const filterTypes = [
  'All',
  // NotificationType.Axes,
  // NotificationType.Clients,
  // NotificationType.Trades,
  NotificationType.Research,
  NotificationType.RiskReport,
  NotificationType.CorpAct,
  NotificationType.Inquiries,
];

export function Notifications(props: NotificationsProps) {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const { isLoading, reports: researchReports, setSelectedReport: setSelectedResearchReport } = useResearchReportsStore();
  const { isLoading: isRiskReportLoading, riskReports, setSelectedReport: setSelectedRiskReport } = useRiskReportsSlice();
  const { isLoading: isCorpActionsLoading, corpActions, selectedCorpAction, setSelectedCorpAction } = useCorpActionsStore();
  const { isLoading: isInquiriesLoading, inquiries } = useInvestorRelationsStore();
  const { isLoading: isRiskDataLoading, lastUpdatedTimestamp } = useRiskDataStore();
  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>(NotificationType.Research);
  const [selectedNotification, setSelectedNotification] = useState<Notification>({}); // todo..

  const showSpinner = isLoading || isRiskReportLoading || isCorpActionsLoading || isInquiriesLoading || isRiskDataLoading;

  const visibleNotifications = useMemo<Notification[]>(() => notifications
    .filter(notification => selectedType === 'All' || notification.type === selectedType), [
    selectedType,
    notifications
  ]);

  const virtualizer = useVirtualizer({
    count: visibleNotifications.length,
    getScrollElement: () => divRef.current,
    estimateSize: (i: number) => 200,
    overscan: 5,
    gap: 10
  });

  useEffect(() => {
    loadNotifications();
  }, [researchReports, riskReports, inquiries, corpActions]);

  // todo ... we will be fetching the entire notification types from an API instead of UI individually calling each categories and stitching
  async function loadNotifications() {
    const newNotifications = [
      // ...notifications,
      ...researchReports
        .map(researchReport => ({
          id: researchReport.id,
          title: researchReport.name,
          type: NotificationType.Research,
          timestamp: researchReport.received_date ? new Date(researchReport.received_date).getTime() : new Date().getTime(),
          highlights: [
            `Sender: ${researchReport.sender!}`,
            `Date: ${researchReport.received_date!}`,
          ]
        })),
      ...riskReports
        .map(riskReport => ({
          id: riskReport.id,
          title: riskReport.filename,
          type: NotificationType.RiskReport,
          timestamp: riskReport.uploaded ? riskReport.uploaded.getTime() : new Date().getTime(),
          highlights: [
            `Date: ${riskReport.uploaded!}`
          ]
        })),
      ...corpActions
        .map(corpAction => ({
          id: corpAction.eventId,
          title: `TICKER: ${corpAction.ticker} \n ${corpAction.security?.name} \n ${corpAction.eventType} \n ${corpAction.eventStatus}`,
          type: NotificationType.CorpAct,
          subTitle: `${corpAction.accounts?.length ? ('Account No: ' + corpAction.accounts[0].accountNumber + ', Holding Capacity: ' + corpAction.accounts[0].holdingQuantity) : ''}`,
          timestamp: corpAction?.dates?.notification_date ? new Date(corpAction.dates.notification_date).getTime() : new Date().getTime(),
          highlights: [
            `ISIN: ${corpAction.isin!}, ID: ${corpAction.eventId}`,
            `Key Date: ${corpAction.keyDates!}`,
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
      }
    ];

    newNotifications.sort((x, y) => (y.timestamp ?? -1) - (x.timestamp ?? -1));

    setNotifications(newNotifications);
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
        setSelectedCorpAction(corpActions.find(corpAction => corpAction.eventId === notification.id)!);
        router.push(newRoute = '/dashboard/corporate-actions'); // todo.. remove the route hardcoding
        break;

      case NotificationType.Inquiries:
        router.push(newRoute = '/dashboard/investor-relations'); // todo.. remove the route hardcoding
        break;
    }

    // todo.. refcator, we need to associate route navigation and active menu setting using a zustand store
    const selectedMenu = activeMenuData?.fullMenuLIst?.find(menu => menu.route === newRoute)
    if (activeMenuData && !activeMenuData?.activeMenuList?.find(menu => menu.route === newRoute)) {
      activeMenuData.activeMenuList = [...activeMenuData?.activeMenuList!, selectedMenu!];
    }

    setActiveMenuData!({
      ...activeMenuData,
      selectedMenu: activeMenuData?.activeMenuList?.find(menu => menu.route === newRoute)
    });

    setSelectedNotification(notification);
    props.notificationClicked!(notification);
  }

  function onReadMoreClick() {
    // setCorpActionsData({
    //   corpActions: [selectedCorpAction]
    // });

    setActiveMenuData!({
      ...activeMenuData,
      selectedMenu: activeMenuData?.activeMenuList?.length ? activeMenuData?.activeMenuList[0] : {}
    });

    router.push('/dashboard/corporate-actions'); // todo.. remove the route hardcoding
  }

  const items = virtualizer.getVirtualItems();

  return (
    //TODO .. create a common component for WIdget with transclusion so that widget tiel etc. can be reused
    <div className={`${styles.notifications} widget`}>
      <div className='widget-title'>
        Notifications
        <i className='fa-solid fa-expand toggler' onClick={() => expandOrCollapsePanel()}></i>
      </div>

      <div className='filters'>
        {
          filterTypes.map(filterType =>
            <button
              key={filterType}
              className={`${filterType === selectedType ? 'filter active' : 'filter'}`}
              onClick={() => setSelectedType(filterType)}>
              {filterType}
            </button>
          )
        }
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
                        <span className={styles.name}>{visibleNotifications[item.index].title}</span>
                        {/* <span className={styles['notification-count']}>(6)</span> */}

                        <div className={styles['notification-menu']}>
                          <div className={getPillClass(visibleNotifications[item.index].type!)}>
                            {visibleNotifications[item.index].type}
                          </div>

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
                        <div className='blue-color'>{visibleNotifications[item.index].subTitle}</div>
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