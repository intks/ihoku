import { useCallback, useState } from 'react';

export interface UseSetReturn<T> {
  set: Set<T>;
  add: (item: T) => void;
  remove: (item: T) => void;
  has: (item: T) => boolean;
  clear: () => void;
  reset: () => void;
  size: number;
}

const useSet = <T>(initialSet: Set<T> = new Set()): UseSetReturn<T> => {
  const [set, setSet] = useState<Set<T>>(new Set(initialSet));

  const add = useCallback((item: T) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      newSet.add(item);
      return newSet;
    });
  }, []);

  const remove = useCallback((item: T) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(item);
      return newSet;
    });
  }, []);

  const has = useCallback(
    (item: T) => {
      return set.has(item);
    },
    [set],
  );

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  const reset = useCallback(() => {
    setSet(new Set(initialSet));
  }, [initialSet]);

  return {
    set,
    add,
    remove,
    has,
    clear,
    reset,
    size: set.size,
  };
};

export default useSet;

