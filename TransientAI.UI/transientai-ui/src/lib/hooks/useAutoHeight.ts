import { useState, useEffect, useRef, useCallback } from 'react';
import { useDeviceType } from './useDeviceType';

const useAutoHeight = (dependencies: any[] = []) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>('auto');
  const deviceType = useDeviceType();

  const updateHeight = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate available height
    const offsetBottom = deviceType === 'mobile' ? 100 : 30;
    let availableHeight = viewportHeight - rect.top - offsetBottom - 1; // Small buffer

    // Ensure a minimum height to prevent collapse
    if (availableHeight < 100) availableHeight = 500;

    setMaxHeight(`${availableHeight}px`);
  }, []);

  useEffect(() => {
    updateHeight(); // Set initial height

    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [updateHeight]);

  useEffect(() => {
    if (!ref.current) return;

    // Use ResizeObserver for content changes inside the div
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [updateHeight]);

  // Force recalculation when dependencies (like API data) change
  useEffect(() => {
    updateHeight();
  }, [...dependencies]);

  return [ref, maxHeight] as const; // Tuple return
};

export default useAutoHeight;
