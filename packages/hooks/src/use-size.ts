import { useEffect, useState, type RefObject } from 'react';

export interface Size {
  width: number;
  height: number;
}

const useSize = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) {
        return;
      }

      const entry = entries[0];
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
};

export default useSize;

