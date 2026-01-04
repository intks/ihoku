import { useEffect, useState } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface UseScrollOptions {
  element?: HTMLElement | Window | null;
  enabled?: boolean;
}

const useScroll = (options: UseScrollOptions = {}): ScrollPosition => {
  const { element = typeof window !== 'undefined' ? window : null, enabled = true } = options;
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !element) {
      return;
    }

    const handleScroll = () => {
      if (element === window) {
        setPosition({
          x: window.scrollX || window.pageXOffset,
          y: window.scrollY || window.pageYOffset,
        });
      } else if (element instanceof HTMLElement) {
        setPosition({
          x: element.scrollLeft,
          y: element.scrollTop,
        });
      }
    };

    handleScroll();
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [element, enabled]);

  return position;
};

export default useScroll;

