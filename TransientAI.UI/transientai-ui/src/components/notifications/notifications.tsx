import { useMemo, useState } from 'react';
import styles from './notifications.module.scss';
import { Notification, NotificationType } from '@/services/notifications';
import { notificationsDataService } from '@/services/notifications/notifiations-data-service';

export interface NotificationsProps {
  onExpandCollapse: (state: boolean) => void;
}

export function Notifications(props: NotificationsProps) {
  const notifications: Notification[] = notificationsDataService.getNotifications();

  const filterTypes = [
    'All',
    NotificationType.Axes,
    NotificationType.Clients,
    NotificationType.Trades
  ];

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>(NotificationType.Axes);

  const visibleNotifications = useMemo<Notification[]>(() => notifications
    .filter(notification => selectedType === 'All' || notification.type === selectedType), [selectedType]);

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse(!isExpanded);
  }

  function getIconClass(type: NotificationType) {
    switch (type) {
      case NotificationType.Axes:
        return 'fa-solid fa-ban';

      case NotificationType.Clients:
        return 'fa-solid fa-user';


      case NotificationType.Trades:
        return 'fa-solid fa-newspaper';
    }
  }

  function getPillClass(type: NotificationType) {
    switch (type) {
      case NotificationType.Axes:
        return 'pill blue';

      case NotificationType.Clients:
        return 'pill orange';

      case NotificationType.Trades:
        return 'pill pink';
    }
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
          visibleNotifications.map(notification =>
            <div className={styles['notification-item']}>

              <div className={styles['notification-title']}>
                <i className={getIconClass(notification.type!)}></i>
                <span className={styles.name}>{notification.title}</span>
                {/* <span className={styles['notification-count']}>(6)</span> */}

                <div className={styles['notification-menu']}>
                  <div className={getPillClass(notification.type!)}>
                    {notification.type}
                  </div>

                  <i className='fa-solid fa-ellipsis ml-3'></i>
                </div>
              </div>

              <div className={styles['notification-content']}>
                <div className='blue-color'>{notification.subTitle}</div>
                <div className={styles['messages']}>
                  <ul className="list-disc pl-5 off-white-color">
                    {
                      notification.highlights?.map(item => <li>{item}</li>)
                    }
                  </ul>
                </div>
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
}