import { useCallback, useRef, useState } from 'react';

export interface UseLongPressOptions {
  threshold?: number;
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

export interface UseLongPressReturn {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

const useLongPress = (
  onLongPress: () => void,
  options: UseLongPressOptions = {},
): UseLongPressReturn => {
  const { threshold = 400, onStart, onFinish, onCancel } = options;
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetRef = useRef<EventTarget | null>(null);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (onStart) {
        onStart();
      }
      timeoutRef.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
        if (onFinish) {
          onFinish();
        }
      }, threshold);
    },
    [onLongPress, threshold, onStart, onFinish],
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (shouldTriggerClick && !longPressTriggered) {
        onCancel?.();
      }
      setLongPressTriggered(false);
    },
    [longPressTriggered, onCancel],
  );

  return {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      targetRef.current = e.target;
      start(e);
    },
    onMouseUp: (e: React.MouseEvent) => {
      clear(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      clear(e, false);
    },
    onTouchStart: (e: React.TouchEvent) => {
      targetRef.current = e.target;
      start(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      clear(e);
    },
  };
};

export default useLongPress;

