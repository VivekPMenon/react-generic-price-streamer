'use cient';

import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType() {
  const [device, setDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    function updateDeviceType() {
      const width = window.innerWidth;
      setDevice(getDeviceType());
    }

    updateDeviceType(); // Set initial value
    window.addEventListener('resize', updateDeviceType);

    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return device;
}

export function getDeviceType(): DeviceType {
  const width = window.innerWidth;

  if (width <= 480) {
    return 'mobile';
  } else if (width <= 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}
