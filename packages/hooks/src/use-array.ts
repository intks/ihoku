import { useCallback, useState } from 'react';

export interface UseArrayReturn<T> {
  array: T[];
  setArray: (array: T[] | ((prev: T[]) => T[])) => void;
  push: (item: T) => void;
  pop: () => void;
  shift: () => void;
  unshift: (item: T) => void;
  remove: (index: number) => void;
  removeBy: (predicate: (item: T) => boolean) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  reset: () => void;
}

const useArray = <T>(initialArray: T[] = []): UseArrayReturn<T> => {
  const [array, setArray] = useState<T[]>(initialArray);

  const push = useCallback((item: T) => {
    setArray((prev) => [...prev, item]);
  }, []);

  const pop = useCallback(() => {
    setArray((prev) => prev.slice(0, -1));
  }, []);

  const shift = useCallback(() => {
    setArray((prev) => prev.slice(1));
  }, []);

  const unshift = useCallback((item: T) => {
    setArray((prev) => [item, ...prev]);
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeBy = useCallback((predicate: (item: T) => boolean) => {
    setArray((prev) => prev.filter((item) => !predicate(item)));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray((prev) => prev.map((el, i) => (i === index ? item : el)));
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const reset = useCallback(() => {
    setArray(initialArray);
  }, [initialArray]);

  return {
    array,
    setArray,
    push,
    pop,
    shift,
    unshift,
    remove,
    removeBy,
    update,
    clear,
    reset,
  };
};

export default useArray;

