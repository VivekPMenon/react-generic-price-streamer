import { useState, useEffect } from 'react';

export function useThrottle(value: any, delay: number) {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastExecuted, setLastExecuted] = useState(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
      setLastExecuted(Date.now());
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}