import { useRef } from 'react';

export function useScrollTo<T extends HTMLElement>(offset = 0) {
  const scrollTargetRef = useRef<T>(null);

  const scrollToTarget = () => {
    setTimeout(() => {
      if (scrollTargetRef.current) {
        const y = scrollTargetRef.current.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 0);
  };

  return { scrollTargetRef, scrollToTarget };
}

export function useScrollToElementId(offset = 0) {
  const scrollToElementId = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

      if (isVisible) return;

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

  return { scrollToElementId };
}

