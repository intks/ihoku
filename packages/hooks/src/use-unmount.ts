import { useEffect, useRef } from 'react';

const useUnmount = (callback: () => void): void => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
};

export default useUnmount;

