import { useCallback, useState } from 'react';

export interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number | ((prev: number) => number)) => void;
}

const useCounter = (options: UseCounterOptions = {}): UseCounterReturn => {
  const { initialValue = 0, min, max, step = 1 } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + step;
      return max !== undefined ? Math.min(next, max) : next;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = prev - step;
      return min !== undefined ? Math.max(next, min) : next;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const handleSetCount = useCallback((value: number | ((prev: number) => number)) => {
    setCount((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (min !== undefined && next < min) {
        return min;
      }
      if (max !== undefined && next > max) {
        return max;
      }
      return next;
    });
  }, [min, max]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount: handleSetCount,
  };
};

export default useCounter;

