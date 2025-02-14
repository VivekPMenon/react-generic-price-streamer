import styles from './ribbon.module.scss'
import React, { useRef } from "react";
import { motion } from "framer-motion";

const items = [
  { title: "Margin Excess", amount: "USD 593,809.54" },
  { title: "Exposure/Cross", amount: "USD 1,987,555.45" },
  { title: "DeltaAdj", amount: "USD 865,789" },
  { title: "Net P&L", amount: "USD 1,123,456" },
  { title: "Collateral", amount: "USD 750,000" },
  { title: "Leverage", amount: "USD 2,000,000" },
];

export function Ribbon() {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: any) => {
    if (carouselRef.current) {
      const scrollAmount = 250;
      carouselRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles['ribbon']}>
      <i className='fa-solid fa-chevron-left'></i>
      {
        items.map(item =>
          <div className={styles['tile']}>
            <div> {item.title}</div>
            <div> {item.amount}</div>
          </div>
        )
      }
      <i className='fa-solid fa-chevron-right'></i>
    </div>
  );
}
