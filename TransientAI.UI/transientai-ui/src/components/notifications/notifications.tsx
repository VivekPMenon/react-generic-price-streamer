'use client'

import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './notifications.module.scss';
import { Notification, NotificationType } from '@/services/notifications';
import { getNotifications } from '@/services/notifications/notifications-data';
import { CorpActionsDataContext, CorporateAction, getCorpActions } from "@/services/corporate-actions";
import { MenuContextData } from "@/services/menu-data";
import { NotificationPopup } from './notification-popup';
import { useRouter } from 'next/navigation';
import { useResearchReportsStore, useRiskReportsSlice } from '@/services/reports-data';
import { Spinner } from '@radix-ui/themes';

export interface NotificationsProps {
  onExpandCollapse?: (state: boolean) => void;
  notificationClicked?: (notification: Notification) => void;
}

export function Notifications(props: NotificationsProps) {

  const filterTypes = [
    'All',
    // NotificationType.Axes,
    // NotificationType.Clients,
    // NotificationType.Trades,
    NotificationType.Research,
    NotificationType.RiskReport,
    NotificationType.CorpAct,
  ];

  const router = useRouter();
  const { isLoading, reports: researchReports, setSelectedReport: setSelectedResearchReport } = useResearchReportsStore();
  const { isLoading: isRiskReportLoading, riskReports, setSelectedReport: setSelectedRiskReport } = useRiskReportsSlice();
  const { corpActionsData, setCorpActionsData } = useContext(CorpActionsDataContext);
  const { activeMenuData, setActiveMenuData } = useContext(MenuContextData);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>(NotificationType.Research);
  const [selectedCorpAction, setSelectedCorpAction] = useState<CorporateAction>({}); // todo..
  const [selectedNotification, setSelectedNotification] = useState<Notification>({}); // todo..

  const visibleNotifications = useMemo<Notification[]>(() => notifications
    .filter(notification => selectedType === 'All' || notification.type === selectedType), [
    selectedType,
    notifications
  ]);

  useEffect(() => {
    loadNotifications();
  }, [researchReports, riskReports]);

  // todo ... we will be fetching the entire notification types from an API instead of UI individually calling each categories and stitching
  async function loadNotifications() {
    const notifications = await getNotifications();
    const newNotifications = [
        ...notifications,
        ...researchReports
            .map(researchReport => ({
              id: researchReport.id,
              title: researchReport.name,
              type: NotificationType.Research,
              highlights: [
                `Sender: ${researchReport.sender!}`,
                `Date: ${researchReport.received_date!}`,
              ]
            })),
        ...riskReports
            .map(riskReport => ({
              id: riskReport.filename,
              title: riskReport.filename,
              type: NotificationType.RiskReport,
              highlights: [
                `Date: ${riskReport.uploaded!}`
              ]
            }))
    ];

    setNotifications(newNotifications);
  }

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse!(!isExpanded);
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
    }
  }

  async function onNotificationPopupTrigger(id: string) {
    const corpActions = await getCorpActions();
    const selectedAction = corpActions.find(action => action.eventId === id);
    setSelectedCorpAction(selectedAction!);
  }

  function onNotificationClick(notification: Notification) {
    switch (notification.type) {
      case NotificationType.RiskReport:
        setSelectedRiskReport(riskReports.find(report => report.id === notification.id)!);
        router.push('/dashboard/risk-reports'); // todo.. remove the route hardcoding
        break;

      case NotificationType.Research:
        setSelectedResearchReport(researchReports.find(report => report.id === notification.id)!);
        router.push('/dashboard/research-reports'); // todo.. remove the route hardcoding
        break;

      case NotificationType.CorpAct:
        break;
    }

    setSelectedNotification(notification);
    props.notificationClicked!(notification);
  }

  function onReadMoreClick() {
    setCorpActionsData({
      corpActions: [selectedCorpAction]
    });

    setActiveMenuData!({
      ...activeMenuData,
      selectedMenu: activeMenuData?.activeMenuList?.length ? activeMenuData?.activeMenuList[0] : {}
    });

    router.push('/dashboard/corporate-actions'); // todo.. remove the route hardcoding 
  }

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
              className={`${filterType === selectedType ? 'filter active' : 'filter'}`}
              onClick={() => setSelectedType(filterType)}>
              {filterType}
            </button>
          )
        }
      </div>

      <div className={`${styles['notification-items']} scrollable-div ${isExpanded ? styles['expanded'] : ''}`}>
        {
          (isLoading || isRiskReportLoading) ? <Spinner size="3" /> :
            <>
              {
                visibleNotifications.map(notification =>
                  <div className={`${styles['notification-item']} ${notification.id === selectedNotification.id ? styles['active'] : ''}`} 
                    onClick={() => onNotificationClick(notification)}>

                    <div className={styles['notification-title']}>
                      <i className={getIconClass(notification.type!)}></i>
                      <span className={styles.name}>{notification.title}</span>
                      {/* <span className={styles['notification-count']}>(6)</span> */}

                      <div className={styles['notification-menu']}>
                        <div className={getPillClass(notification.type!)}>
                          {notification.type}
                        </div>

                        <NotificationPopup
                          onTrigger={onNotificationPopupTrigger}
                          notification={selectedCorpAction}
                          onOk={onReadMoreClick}
                          notificationId={notification.id}>
                          <div>
                            <i className='fa-solid fa-ellipsis ml-3'></i>
                          </div>
                        </NotificationPopup>
                      </div>
                    </div>

                    <div className={styles['notification-content']}>
                      <div className='blue-color'>{notification.subTitle}</div>
                      <div className={styles['messages']}>
                        <ul className="list-disc pl-8 off-white-color-alt">
                          {
                            notification.highlights?.map(item => <li>{item}</li>)
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              }
            </>
        }
      </div>
    </div>
  );
}