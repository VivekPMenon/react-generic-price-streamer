'use client'

import { useEffect, useState } from 'react'
import styles from './content-carousel.module.scss'
import { useMenuStore } from '@/services/menu-data'
import { useRouter } from 'next/navigation'
import { formatDate, formatTime } from '@/lib/utility-functions/date-operations'
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store'
import { CarouselNotification, CarouselNotificationType } from './model'

function getIconClass (type: CarouselNotificationType) {
  switch (type) {
    case CarouselNotificationType.Axes:
      return 'fa-solid fa-ban'

    case CarouselNotificationType.Clients:
      return 'fa-solid fa-user'

    case CarouselNotificationType.Trades:
      return 'fa-solid fa-newspaper'

    case CarouselNotificationType.CorpAct:
      return 'fa-solid fa-microphone-lines'

    case CarouselNotificationType.Research:
      return 'fa-solid fa-book'

    case CarouselNotificationType.RiskReport:
      return 'fa-solid fa-bolt'

    case CarouselNotificationType.Inquiries:
      return 'fa-solid fa-handshake'

    case CarouselNotificationType.BreakNews:
      return 'fa fa-whatsapp !text-green-600'

    case CarouselNotificationType.Macro:
      return 'fa fa-list-check'
  }
}

function getPillClass (type: CarouselNotificationType) {
  switch (type) {
    case CarouselNotificationType.Axes:
    case CarouselNotificationType.Research:
      return 'pill blue'

    case CarouselNotificationType.Clients:
    case CarouselNotificationType.Macro:
      return 'pill orange'

    case CarouselNotificationType.Trades:
    case CarouselNotificationType.RiskReport:
      return 'pill pink'

    case CarouselNotificationType.CorpAct:
      return 'pill teal'

    case CarouselNotificationType.Inquiries:
      return 'pill gold'

    case CarouselNotificationType.BreakNews:
      return 'pill bg-green-600'
  }
}

export function CarouselNotifications () {
  const router = useRouter()
  const { breakNewsItems, setSelectedBreakNewsItem, setGroupId } =
    useBreakNewsDataStore()
  const { fullMenuList, setActiveMenu } = useMenuStore()

  const [notifications, setNotifications] = useState<CarouselNotification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<CarouselNotification>({}) // todo..

  // todo ... we will be fetching the entire notification types from an API instead of UI individually calling each categories and stitching
  useEffect(() => loadNotifications(), [breakNewsItems])

  function loadNotifications () {
    const newNotifications: CarouselNotification[] = [
      ...breakNewsItems.map(news => ({
        id: `${news.id?.toString()}-${Math.random()}`,
        title: news.short_message,
        type: CarouselNotificationType.BreakNews,
        time: `${formatTime(news?.sender_time || '')}`
        // highlights: [`${formatDate(news?.sender_time || '')}`]
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

  function onNotificationClick (notification: CarouselNotification) {
    let newRoute = ''
    switch (notification.type) {
      case CarouselNotificationType.BreakNews:
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
            {/* <div className={`${styles['notification-menu']} max-sm:!hidden`}>
              <div className={getPillClass(item.type!)}>{item.type}</div>
            </div> */}
          </div>

          <div className={styles['notification-content']}>
            <div className='blue-color'>{item.subTitle}</div>
            <div className={'text-right float-left'}>
              <span className='text-[11px]'>{item.time}</span>
              {/* <ul className='list-disc pl-8 off-white-color-alt'>
                {item.highlights?.map((i: any) => (
                  <li key={item.id + i}>{i}</li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
