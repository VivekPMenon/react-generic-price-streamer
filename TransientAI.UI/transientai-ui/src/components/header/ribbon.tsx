import styles from './ribbon.module.scss';
import React, { useRef, useState, useEffect } from 'react';

const items = [
  { title: 'PLGMVEPs', amount: '6.86' },
  { title: 'PL', amount: '5,560' },
  { title: 'LongPL', amount: '5,968' },
  { title: 'ShortPL', amount: '408' },
  { title: 'GMVUsage', amount: '10.65%' },
  { title: 'PLIDIsAssetsBPs', amount: '8.24' },
  { title: 'PLIBISTotalGM', amount: '0.91' },
  { title: 'DeltaAdjGross', amount: '1,063,356' },
  { title: 'DeltaAdjGrossPct', amount: '11%' },
  { title: 'ExposureGross', amount: '1,063,356.49' },
  { title: 'DeltaAdj', amount: '187,989' },
  { title: 'Exposure', amount: '187,989' },
  { title: 'Delta%', amount: '1.88' },
  { title: 'LongDeltaAdj', amount: '437,084' },
  { title: 'LongDeltaAdj%', amount: '4.38' },
  { title: 'ShortDeltaAdj', amount: '-625,673' },
  { title: 'ShortDeltaAdj%', amount: '6.27' },
  { title: 'Exposure%', amount: '-1.88' }
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
