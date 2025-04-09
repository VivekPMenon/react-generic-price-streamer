'use client';

import { useTranslation } from 'react-i18next';  // Import translation hook
import { CorporateAction } from "@/services/corporate-actions";
import { ReactNode } from "react";
import styles from './notification-popup.module.scss';
import * as Dialog from "@radix-ui/react-dialog";
import i18n from '../../i18n';

export interface NotificationPopupProps {
  notificationId?: string;
  children: ReactNode;
  notification: CorporateAction;
  onTrigger: (id: string) => void;
  onOk: () => void;
}

export function NotificationPopup({ children, notification, notificationId, onOk, onTrigger }: NotificationPopupProps) {
  const { t } = useTranslation();  // Initialize translation function

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
            {/* Empty Description */}
          </Dialog.Description>
          <div className={styles['alert-content']}>
            {/* Replace static text with translated version */}
            <span className={styles['highlight']}>{t('notification.action_required')}</span>

            <div style={{ padding: '20px 50px' }}>

              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>{t('notification.announcement_id')}:</div>
                <div className="text-left">{notification?.eventId}</div>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14  p-1">
                <div className='font-bold text-right'>{t('notification.account')}:</div>
                <div className="text-left">{notification?.accounts?.length ? notification.accounts[0].accountNumber : ''}</div>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>{t('notification.holding_quantity')}:</div>
                <div className="text-left">{notification?.holdingQuantity}</div>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>{t('notification.term_details')}:</div>
                <div className="text-left">{notification?.terms?.length ? (notification.terms[0].type + ' ' + notification.terms[0].rate) : ''}</div>
              </div>

              <div className="grid grid-cols-[40%_60%] gap-3 fs-14 p-1">
                <div className='font-bold text-right'>{t('notification.pay_date')}:</div>
                <div className="text-left">{notification?.dates?.pay_date}</div>
              </div>
            </div>

            <div>
              <Dialog.DialogClose>
                <button className="button me-2" onClick={onOk}>{t('notification.read_more')}</button>
                <button className="secondary-button">{t('notification.close')}</button>
              </Dialog.DialogClose>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
