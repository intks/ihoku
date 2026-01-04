import { useEffect, useState } from 'react';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface UseGeolocationOptions extends PositionOptions {
  enabled?: boolean;
}

export interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  getPosition: () => void;
}

const useGeolocation = (options: UseGeolocationOptions = {}): UseGeolocationReturn => {
  const {
    enabled = true,
    enableHighAccuracy = false,
    timeout = Infinity,
    maximumAge = 0,
  } = options;

  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState(false);

  const getPosition = () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by this browser.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setPosition({
          latitude: geoPosition.coords.latitude,
          longitude: geoPosition.coords.longitude,
          accuracy: geoPosition.coords.accuracy,
          altitude: geoPosition.coords.altitude ?? null,
          altitudeAccuracy: geoPosition.coords.altitudeAccuracy ?? null,
          heading: geoPosition.coords.heading ?? null,
          speed: geoPosition.coords.speed ?? null,
        });
        setLoading(false);
      },
      (geoError) => {
        setError(geoError);
        setLoading(false);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      },
    );
  };

  useEffect(() => {
    if (enabled) {
      getPosition();
    }
  }, [enabled]);

  return { position, error, loading, getPosition };
};

export default useGeolocation;

