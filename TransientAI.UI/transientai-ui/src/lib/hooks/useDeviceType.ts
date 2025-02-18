import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType() {
  const [device, setDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    function updateDeviceType() {
      const width = window.innerWidth;

      if (width <= 480) {
        setDevice('mobile');
      } else if (width <= 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    }

    updateDeviceType(); // Set initial value
    window.addEventListener('resize', updateDeviceType);

    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return device;
}
