import { useCallback, useState } from 'react';

const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setItem = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const finalValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(key, JSON.stringify(finalValue));
        }
        
        setValue(finalValue);
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, value],
  );

  const removeItem = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
      setValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return { value, setItem, removeItem };
};

export default useSessionStorage;

