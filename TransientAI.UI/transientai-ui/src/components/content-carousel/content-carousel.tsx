'use client'

import styles from './content-carousel.module.scss'
import React, { useRef, useState, useEffect } from 'react'
import { EContentTypes } from './model'
import { CarouselNotifications } from './carousel-notification'
import { CarouselPnlMetrics } from './carousel-pnl-metrics'
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store'

interface ContentCarouselProps {
  contentType: EContentTypes
  title?: string
}

export function ContentCarousel ({ title, contentType }: ContentCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const {breakNewsItems} = useBreakNewsDataStore()
  useEffect(() => {
    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
    }

    // Wait for 1 second before executing the checkScroll function
    setTimeout(() => {
      checkScroll();
    }, 1000);

    const handleResize = () => {
      checkScroll()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [breakNewsItems])

  function checkScroll () {
    if (!carouselRef.current) {
      return
    }

    setCanScrollLeft(carouselRef.current.scrollLeft > 0)
    setCanScrollRight(
      carouselRef.current.scrollLeft + carouselRef.current.clientWidth <
        carouselRef.current.scrollWidth
    )
  }

  function scroll (direction: 'left' | 'right') {
    if (!carouselRef.current) {
      return
    }

    const scrollAmount = 300
    carouselRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <div className={styles['main-content']}>
      {title && <span>{title}</span>}

      <div className={styles['ribbon']}>
        <i
          className={`fa-solid fa-chevron-left ${
            !canScrollLeft ? styles['disabled'] : ''
          }`}
          onClick={() => canScrollLeft && scroll('left')}
        ></i>
        <div className={styles['tiles']} ref={carouselRef}>
          {(() => {
            switch (contentType) {
              case EContentTypes.PNLMATRICS: {
                return <CarouselPnlMetrics />
              }
              case EContentTypes.NOTIFICATION: {
                return <CarouselNotifications />
              }
              default: {
                return null
              }
            }
          })()}
        </div>

        <i
          className={`fa-solid fa-chevron-right ${
            !canScrollRight ? styles['disabled'] : ''
          }`}
          onClick={() => canScrollRight && scroll('right')}
        ></i>
      </div>
    </div>
  )
}
