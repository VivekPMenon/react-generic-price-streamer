import { useRef } from 'react';

export function useScrollTo<T extends HTMLElement>(offset = 0) {
  const scrollTargetRef = useRef<T>(null);

  const scrollToTarget = () => {
    setTimeout(() => {
      if (scrollTargetRef.current) {
        const y = scrollTargetRef.current.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  return { scrollTargetRef, scrollToTarget };
}
