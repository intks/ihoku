import { useCallback, useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);

    if (item) return JSON.parse(item);

    localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  });

  const setItem = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const finalValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
      localStorage.setItem(key, JSON.stringify(finalValue));
      setValue(finalValue);
    },
    [key, value]
  );

  return { value, setItem };
}

export default useLocalStorage;
