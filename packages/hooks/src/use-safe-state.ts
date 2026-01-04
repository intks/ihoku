import { useCallback, useEffect, useRef, useState } from 'react';

const useSafeState = <T>(initialState: T | (() => T)) => {
  const isMountedRef = useRef(true);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setSafeState = useCallback((newState: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      setState(newState);
    }
  }, []);

  return [state, setSafeState] as const;
};

export default useSafeState;

