import { useMemo } from 'react';

const useDefault = <T>(value: T | null | undefined, defaultValue: T): T => {
  return useMemo(() => {
    return value ?? defaultValue;
  }, [value, defaultValue]);
};

export default useDefault;

