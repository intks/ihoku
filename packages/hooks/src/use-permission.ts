import { useEffect, useState } from 'react';

export type PermissionName =
  | 'camera'
  | 'microphone'
  | 'notifications'
  | 'persistent-storage'
  | 'push'
  | 'geolocation'
  | 'accelerometer'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'magnetometer'
  | 'midi'
  | 'payment-handler'
  | 'screen-wake-lock';

export type PermissionState = 'granted' | 'denied' | 'prompt' | null;

const usePermission = (permissionName: PermissionName): PermissionState => {
  const [state, setState] = useState<PermissionState>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return;
    }

    let isMounted = true;

    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: permissionName as PermissionDescriptor['name'] });
        if (isMounted) {
          setState(result.state);
        }

        const handleChange = () => {
          if (isMounted) {
            setState(result.state);
          }
        };

        result.addEventListener('change', handleChange);

        return () => {
          result.removeEventListener('change', handleChange);
        };
      } catch (error) {
        if (isMounted) {
          setState(null);
        }
      }
    };

    checkPermission();

    return () => {
      isMounted = false;
    };
  }, [permissionName]);

  return state;
};

export default usePermission;

