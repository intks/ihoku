import { useCallback, useRef } from 'react';

const useDebounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return useCallback(
    (...args: T) => {
      clearTimer();

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay]
  );
};

export default useDebounce;
