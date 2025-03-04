import { CorporateAction } from "@/services/corporate-actions";
import { ReactNode } from "react";
import styles from './notification-popup.module.scss';
import * as Dialog from "@radix-ui/react-dialog";

export interface NotificationPopupProps {
  notificationId?: string;
  children: ReactNode;
  notification: CorporateAction;
  onTrigger: (id: string) => void;
  onOk: () => void;
}

export function NotificationPopup({children, notification, notificationId, onOk, onTrigger}: NotificationPopupProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className={styles['notification-menu-icon']} onClick={() => onTrigger(notificationId!)}>
          <i className='fa-solid fa-ellipsis ml-3'></i>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContentSmall">
          <Dialog.Title className="DialogTitle">
            <i className="fa-solid fa-circle-exclamation red-color"></i>
            {notification?.action}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">

          </Dialog.Description>
          <div className={styles['alert-content']}>
            <span className={styles['highlight']}>ACTION Required: Deadline Approaching - Response Required</span>

            <div style={{ padding: '20px 50px' }}>

              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>Announcement Id:</div>
                <div className='text-left'>{notification?.eventId}</div>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14  p-1">
                <div className='font-bold text-right'>Account:</div>
                <div className="text-left">{notification?.accounts?.length ? notification.accounts[0].accountNumber : ''}</div>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>Holding Quantity:</div>
                <div className="text-left">{notification?.holdingQuantity}</div>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>Term Details:</div>
                <div className="text-left">{notification?.terms?.length ? (notification.terms[0].type + ' ' + notification.terms[0].rate) : ''}</div>
              </div>
              {/*<div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">*/}
              {/*  <div className='font-bold text-right'>Entitled Product Id:</div>*/}
              {/*  <div className="text-left">{notification?.entitledProductId}</div>*/}
              {/*</div>*/}
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>Pay Date:</div>
                <div className="text-left">{notification?.dates?.pay_date}</div>
              </div>
            </div>

            <div>
              <Dialog.DialogClose>
                <button className="button me-2" onClick={onOk}>Read More</button>
                <button className="secondary-button">Close</button>
              </Dialog.DialogClose>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}