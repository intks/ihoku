import { useEffect } from 'react';

const useLockBodyScroll = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [locked]);
};

export default useLockBodyScroll;

