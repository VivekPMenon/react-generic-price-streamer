import styles from './ribbon.module.scss';
import React, { useRef } from 'react';

const items = [
  { title: 'Margin Excess', amount: 'USD 593,809.54' },
  { title: 'Exposure/Cross', amount: 'USD 1,987,555.45' },
  { title: 'DeltaAdj', amount: 'USD 865,789' },
  { title: 'Net P&L', amount: 'USD 1,123,456' },
  { title: 'Collateral', amount: 'USD 750,000' },
  { title: 'Leverage', amount: 'USD 2,000,000' }
];

// todo. create a common carousel component
export function Ribbon() {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  function scroll(direction: 'left' | 'right') {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = 300; 
    carouselRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles['ribbon']}>
      <i className='fa-solid fa-chevron-left' onClick={() => scroll('left')}></i>

      <div className={styles['ribbon']} ref={carouselRef}>
        {items.map((item, index) => (
          <div key={index} className={styles['tile']}>
            <div>{item.title}</div>
            <div className='orange-color fs-14'>{item.amount}</div>
          </div>
        ))}
      </div>

      <i className='fa-solid fa-chevron-right' onClick={() => scroll('right')}></i>
    </div>
  );
}
