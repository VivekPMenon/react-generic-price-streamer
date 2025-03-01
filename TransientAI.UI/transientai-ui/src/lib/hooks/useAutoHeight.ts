import { useState, useEffect, useRef, useCallback } from 'react';
import { getDeviceType, useDeviceType } from './useDeviceType';

export interface AutoHeightOptions {
  dependencies?: any[];
  offsetBottom?: number;
  offsetInMobile: number;
}

// todo.. fix the scroll nuances in Mobile so that consumer component dont need to pass heightInMobile prop
const useAutoHeight = (options?: AutoHeightOptions) => {

  const ref = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>('auto');
  
  const updateHeight = () => {
    if (!ref.current) return;

    if (options?.offsetInMobile && getDeviceType() === 'mobile') {
      return setMaxHeight(`calc(100vh - ${options.offsetInMobile}px)`);
    }

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate available height
    const offsetBottom = options?.offsetBottom ? options.offsetBottom : 0;
    let availableHeight = viewportHeight - rect.top - offsetBottom - 35; // Small buffer

    // Ensure a minimum height to prevent collapse
    if (availableHeight < 100) availableHeight = 300;

    setMaxHeight(`${availableHeight}px`);
  };

  useEffect(() => {
    updateHeight(); // Set initial height

    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    // Use ResizeObserver for content changes inside the div
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Force recalculation when dependencies (like API data) change
  useEffect(() => {
    updateHeight();
  }, [options?.dependencies ? options?.dependencies : null]);

  return [ref, maxHeight] as const; // Tuple return
};

export default useAutoHeight;
