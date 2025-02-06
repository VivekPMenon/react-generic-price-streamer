import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from 'react';
import styles from './notifications.module.scss';
import { Notification, NotificationType } from '@/services/notifications';
import { notificationsDataService } from '@/services/notifications/notifiations-data-service';
import { corpActionsDataService, CorporateAction } from "@/services/corporate-actions";

export interface NotificationsProps {
  onExpandCollapse: (state: boolean) => void;
}

export function Notifications(props: NotificationsProps) {
  const notifications: Notification[] = notificationsDataService.getNotifications();

  const filterTypes = [
    'All',
    // NotificationType.Axes,
    // NotificationType.Clients,
    // NotificationType.Trades,
    NotificationType.Research,
    NotificationType.CorpAct
  ];

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>(NotificationType.Research);
  const [selectedCorpAction, setSelectedCorpAction] = useState<CorporateAction>({});

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

      case NotificationType.CorpAct:
        return 'fa-solid fa-microphone-lines';

      case NotificationType.Research:
        return 'fa-solid fa-book';
    }
  }

  function getPillClass(type: NotificationType) {
    switch (type) {
      case NotificationType.Axes:
      case NotificationType.Research:
        return 'pill blue';

      case NotificationType.Clients:
        return 'pill orange';

      case NotificationType.Trades:
        return 'pill pink';

      case NotificationType.CorpAct:
        return 'pill teal';
    }
  }

  function openNotification(id: string) {
    const corpActions = corpActionsDataService.getCorpActions();
    const selectedAction = corpActions.find(action => action.eventId === id);
    setSelectedCorpAction(selectedAction!);
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

                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <div className={styles['notification-menu-icon']} onClick={() => openNotification(notification.id!)}>
                        <i className='fa-solid fa-ellipsis ml-3'></i>
                      </div>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="DialogOverlay" />
                      <Dialog.Content className="DialogContentSmall">
                        <Dialog.Title className="DialogTitle">
                          <i className="fa-solid fa-circle-exclamation red-color"></i>
                          {selectedCorpAction.eventDescription}
                        </Dialog.Title>
                        <Dialog.Description className="DialogDescription">

                        </Dialog.Description>
                        <div className={styles['alert-content']}>
                          <span className={styles['highlight']}>ACTION Required: Deadline Approaching - Response Required</span>

                          <div style={{ padding: '20px 50px' }}>

                            <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                              <div className='font-bold text-right'>Announcement Id:</div>
                              <div className='text-left'>{selectedCorpAction.eventId}</div>
                            </div>
                            <div className="grid grid-cols-[40%_60%] gap-3 fs-14  p-1">
                              <div className='font-bold text-right'>Account:</div>
                              <div className="text-left">{selectedCorpAction.accountId}</div>
                            </div>
                            <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                              <div className='font-bold text-right'>Holding Quantity:</div>
                              <div className="text-left">{selectedCorpAction.holdingQuantity}</div>
                            </div>
                            <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                              <div className='font-bold text-right'>Term Details:</div>
                              <div className="text-left">{selectedCorpAction.termDetails}</div>
                            </div>
                            <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                              <div className='font-bold text-right'>Entitled Product Id:</div>
                              <div className="text-left">{selectedCorpAction.entitledProductId}</div>
                            </div>
                            <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                              <div className='font-bold text-right'>Pay Date:</div>
                              <div className="text-left">{selectedCorpAction.paydate}</div>
                            </div>
                          </div>

                          <div>
                            <Dialog.DialogClose>
                              <button className="button me-2">Read More</button>
                              <button className="secondary-button">Close</button>
                            </Dialog.DialogClose>
                          </div>
                        </div>

                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
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