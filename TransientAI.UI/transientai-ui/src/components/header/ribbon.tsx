import styles from './ribbon.module.scss';
import React, { useRef, useState, useEffect } from 'react';

const items = [
  { title: 'Margin Excess', amount: 'USD 593,809.54' },
  { title: 'Exposure/Cross', amount: 'USD 1,987,555.45' },
  { title: 'DeltaAdj', amount: 'USD 865,789' },
  { title: 'Net P&L', amount: 'USD 1,123,456' },
  { title: 'Collateral', amount: 'USD 750,000' },
  { title: 'Leverage', amount: 'USD 2,000,000' },
];

export function Ribbon() {

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  );
}
