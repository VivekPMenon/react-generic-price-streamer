'use client'

import { useEffect, useState } from 'react'
import styles from './content-carousel.module.scss'
import { Notification, NotificationType } from '@/services/notifications'
import { useMenuStore } from '@/services/menu-data'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utility-functions/date-operations'
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store'

function getIconClass (type: NotificationType) {
  switch (type) {
    case NotificationType.Axes:
      return 'fa-solid fa-ban'

    case NotificationType.Clients:
      return 'fa-solid fa-user'

    case NotificationType.Trades:
      return 'fa-solid fa-newspaper'

    case NotificationType.CorpAct:
      return 'fa-solid fa-microphone-lines'

    case NotificationType.Research:
      return 'fa-solid fa-book'

    case NotificationType.RiskReport:
      return 'fa-solid fa-bolt'

    case NotificationType.Inquiries:
      return 'fa-solid fa-handshake'

    case NotificationType.BreakNews:
      return 'fa fa-whatsapp !text-green-600'

    case NotificationType.Macro:
      return 'fa fa-list-check'
  }
}

function getPillClass (type: NotificationType) {
  switch (type) {
    case NotificationType.Axes:
    case NotificationType.Research:
      return 'pill blue'

    case NotificationType.Clients:
    case NotificationType.Macro:
      return 'pill orange'

    case NotificationType.Trades:
    case NotificationType.RiskReport:
      return 'pill pink'

    case NotificationType.CorpAct:
      return 'pill teal'

    case NotificationType.Inquiries:
      return 'pill gold'

    case NotificationType.BreakNews:
      return 'pill bg-green-600'
  }
}

export function CarouselNotifications () {
  const router = useRouter()
  const { breakNewsItems, setSelectedBreakNewsItem, setGroupId } =
    useBreakNewsDataStore()
  const { fullMenuList, setActiveMenu } = useMenuStore()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] =
    useState<Notification>({}) // todo..

  // todo ... we will be fetching the entire notification types from an API instead of UI individually calling each categories and stitching
  useEffect(() => loadNotifications(), [breakNewsItems])

  function loadNotifications () {
    const newNotifications: Notification[] = [
      ...breakNewsItems.map(news => ({
        id: news.id?.toString(),
        title: news.short_message,
        type: NotificationType.BreakNews,
        highlights: [`${formatDate(news?.sender_time || '')}`]
      }))
    ]

    newNotifications.sort((x, y) => (y.timestamp ?? -1) - (x.timestamp ?? -1))

  setNotifications(prevNotifications => {
    const hasChanged = JSON.stringify(prevNotifications) !== JSON.stringify(newNotifications);
     if (hasChanged) {
      // Update the state
      const latestNotification = newNotifications[0];
      if (window.location.pathname === "/dashboard/breaking-news" && latestNotification) {
        onNotificationClick(latestNotification);
      }
      return newNotifications;
    }

    return prevNotifications;
  });
  }

  function onNotificationClick (notification: Notification) {
    let newRoute = ''
    switch (notification.type) {
      case NotificationType.BreakNews:
        const selectedNewsItem = breakNewsItems.find(
          news => news.id == notification.id
        )
        setSelectedBreakNewsItem(selectedNewsItem!)
        setGroupId(selectedNewsItem?.group_id || null)
        router.push((newRoute = '/dashboard/breaking-news')) // todo.. remove the route hardcoding
        break
    }

    const menuForRoute = fullMenuList.find(menu => menu.route === newRoute)
    if (menuForRoute) {
      setActiveMenu(menuForRoute)
    }
    setSelectedNotification(notification)
  }

  return (
    <>
      {notifications.map((item: any) => (
        <div
          className={`${styles['tile']} ${
            item.id === selectedNotification.id ? styles['active'] : ''
          }`}
          key={item.id!}
          onClick={() => onNotificationClick(item)}
        >
          <div className={styles['notification-title']}>
            <i className={getIconClass(item.type!)}></i>
            <span className={`${styles.name} truncate`}>{item.title}</span>
            <div className={styles['notification-menu']}>
              <div className={getPillClass(item.type!)}>{item.type}</div>
            </div>
          </div>

          <div className={styles['notification-content']}>
            <div className='blue-color'>{item.subTitle}</div>
            <div className={styles['messages']}>
              <ul className='list-disc pl-8 off-white-color-alt'>
                {item.highlights?.map((i: any) => (
                  <li key={item.id + i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
