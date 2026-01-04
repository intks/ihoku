import { useEffect, useRef, useState } from 'react';

export interface UseIdleOptions {
  timeout?: number;
  events?: string[];
  initialState?: boolean;
}

const defaultEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

const useIdle = (options: UseIdleOptions = {}): boolean => {
  const { timeout = 3000, events = defaultEvents, initialState = false } = options;
  const [isIdle, setIsIdle] = useState(initialState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleEvent = () => {
      setIsIdle(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, timeout);
    };

    handleEvent();

    for (const event of events) {
      window.addEventListener(event, handleEvent, { passive: true });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      for (const event of events) {
        window.removeEventListener(event, handleEvent);
      }
    };
  }, [timeout, events]);

  return isIdle;
};

export default useIdle;

