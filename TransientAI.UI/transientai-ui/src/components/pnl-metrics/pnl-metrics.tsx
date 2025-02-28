'use client'

import styles from './pnl-metrics.module.scss';
import {PnlMetric, pnlMetricsService} from "@/services/pnl-metrics";
import React, { useRef, useState, useEffect } from 'react';

export function PnlMetrics() {

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [items, setItems] = useState<Array<PnlMetric>>([]);

  useEffect(() => {
    pnlMetricsService
        .getMetrics()
        .then(metrics => setItems(metrics))
        .catch(_ => setItems([]));
  }, []);

  useEffect(() => {
    checkScroll();

    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
    }

    const handleResize = () => {
      checkScroll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function checkScroll() {
    if (!carouselRef.current) {
      return;
    }

    setCanScrollLeft(carouselRef.current.scrollLeft > 0);
    setCanScrollRight(carouselRef.current.scrollLeft + carouselRef.current.clientWidth < carouselRef.current.scrollWidth);
  }

  function scroll(direction: 'left' | 'right') {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }

  return (
    <div className={styles['pnl-metrics']}>
      PnL And Financial Resource Metrics
      
      <div className={styles['ribbon']}>
        <i
          className={`fa-solid fa-chevron-left ${!canScrollLeft ? styles['disabled'] : ''}`}
          onClick={() => canScrollLeft && scroll('left')}
        ></i>

        <div className={styles['tiles']} ref={carouselRef}>
          {items.map((item, index) => (
            <div key={index} className={styles['tile']}>
              <div>{item.title}</div>
              <div className='orange-color fs-14'>{item.amount}</div>
            </div>
          ))}
        </div>

        <i
          className={`fa-solid fa-chevron-right ${!canScrollRight ? styles['disabled'] : ''}`}
          onClick={() => canScrollRight && scroll('right')}>
        </i>
      </div>
    </div>
  );
}
