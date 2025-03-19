'use client'

import styles from './content-carousel.module.scss'
import React from 'react'
import { formatCurrency } from '@/lib/utility-functions'
import { useRiskDataStore } from '@/services/risk-data/risk-data-store'

export function CarouselPnlMetrics () {
  const { riskMetricsItemsFiltered } = useRiskDataStore();

  return (
    <>
      {riskMetricsItemsFiltered?.map((item, index) => (
        <div key={index} className={styles['tile']}>
          <div className={styles['pnl-type']}>Margin Excess</div>
          <div className={styles['user-pnl']}>
            {item.name}:{' '}
            <div className='orange-color fs-14'>
              {formatCurrency(Number(item.margin_excess))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
