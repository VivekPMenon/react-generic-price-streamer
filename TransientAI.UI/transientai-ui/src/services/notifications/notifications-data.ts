'use server';

import { Notification, NotificationType } from "./model";
import corpActionsRaw from './corp-actions.json';
import riskReportsJson from './risk-reports.json';
import { useTranslation } from 'react-i18next'; // Import the translation hook

export async function getNotifications(): Promise<Notification[]> {
  const { t } = useTranslation(); // Get the translation function

  const notifications: Notification[] = [
    {
      title: `${t('notification.mandatory_event_update')}: ${corpActionsRaw['83778079'].current_state.event_type}: ${corpActionsRaw['83778079'].current_state.security.name}`,
      subTitle: `${t('notification.account_no')}: ${corpActionsRaw['83778079'].current_state.accounts[0].account_number}, ${t('notification.holding_capacity')}: ${corpActionsRaw['83778079'].current_state.accounts[0].holding_quantity}`,
      type: NotificationType.CorpAct,
      id: '83778079',
      highlights: [
        `${t('notification.term_details')}: ${corpActionsRaw['83778079'].current_state.terms[0].term_number} ${corpActionsRaw['83778079'].current_state.terms[0].type}`,
        `${t('notification.entitled_product_id')}: ${corpActionsRaw['83778079'].current_state.terms[0].security_details.product_id!}`,
        `${t('notification.pay_date')}: ${corpActionsRaw['83778079'].current_state.terms[0].pay_date!}`
      ]
    },
    {
      title: `${t('notification.mandatory_event_update')}: ${corpActionsRaw['83526858'].current_state.event_type}: ${corpActionsRaw['83526858'].current_state.security.name}`,
      subTitle: `${t('notification.account_no')}: ${corpActionsRaw['83526858'].current_state.accounts[0].account_number}, ${t('notification.holding_capacity')}: ${corpActionsRaw['83526858'].current_state.accounts[0].holding_quantity}`,
      type: NotificationType.CorpAct,
      id: '83526858',
      highlights: [
        `${t('notification.term_details')}: ${corpActionsRaw['83526858'].current_state.terms[0].term_number} ${corpActionsRaw['83526858'].current_state.terms[0].type}`,
        `${t('notification.entitled_product_id')}: ${corpActionsRaw['83526858'].current_state.terms[0].security_details.product_id!}`,
        `${t('notification.pay_date')}: ${corpActionsRaw['83526858'].current_state.terms[0].pay_date!}`
      ]
    },
  ];

  // Add translations for other types of notifications if needed

  return notifications.concat([]);
}
