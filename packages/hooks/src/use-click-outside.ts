import { useEffect, useRef, type RefObject } from 'react';

export interface UseClickOutsideOptions {
  handler: (event: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
}

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  options: UseClickOutsideOptions,
): RefObject<T> => {
  const { handler, enabled = true } = options;
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [enabled]);

  return ref;
};

export default useClickOutside;

