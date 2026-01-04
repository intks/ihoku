import { useEffect, useRef } from 'react';

export interface UseIntervalOptions {
  immediate?: boolean;
}

const useInterval = (
  callback: () => void,
  delay: number | null,
  options: UseIntervalOptions = {},
): void => {
  const { immediate = false } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    if (immediate) {
      callbackRef.current();
    }

    const intervalId = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, [delay, immediate]);
};

export default useInterval;

