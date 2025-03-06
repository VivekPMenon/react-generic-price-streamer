import { useRef } from 'react';
import {Virtualizer} from "@tanstack/virtual-core";

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

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

  return { scrollToElementId };
}

export function useScrollToVirtualizeIndex() {
  const scrollToVirtualizeIndex = (func: () => void) => {
    setTimeout(() => {
      func();
    }, 0);
  };

  return { scrollToVirtualizeIndex };
}
