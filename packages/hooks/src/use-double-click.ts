import { useCallback, useRef } from 'react';

export interface UseDoubleClickOptions {
  threshold?: number;
  onSingleClick?: () => void;
}

const useDoubleClick = (
  onDoubleClick: () => void,
  options: UseDoubleClickOptions = {},
): {
  onClick: () => void;
} => {
  const { threshold = 300, onSingleClick } = options;
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (clickCountRef.current === 1) {
        onSingleClick?.();
      } else if (clickCountRef.current === 2) {
        onDoubleClick();
      }
      clickCountRef.current = 0;
    }, threshold);
  }, [onDoubleClick, onSingleClick, threshold]);

  return {
    onClick: handleClick,
  };
};

export default useDoubleClick;

