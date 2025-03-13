'use client'

import styles from './pnl-metrics.module.scss';
import React, { useRef, useState, useEffect } from 'react';
import { formatCurrency } from "@/lib/utility-functions";
import { useRiskDataStore } from "@/services/risk-data/risk-data-store";

export function PnlMetrics() {

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { riskMetricsItemsFiltered } = useRiskDataStore();

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
          {riskMetricsItemsFiltered?.map((item, index) => (
            <div key={index} className={styles['tile']}>
              <div className={styles['pnl-type']}>Margin Excess</div>
              <div className={styles['user-pnl']}>
                {item.name}: <div className='orange-color fs-14'>{formatCurrency(Number(item.margin_excess))}</div>
              </div>
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
