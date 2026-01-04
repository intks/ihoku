import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface UseAsyncOptions {
  immediate?: boolean;
}

const useAsync = <T, E = Error>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {},
): UseAsyncState<T> & { execute: () => Promise<void>; reset: () => void } => {
  const { immediate = true } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const isMountedRef = useRef(true);
  const asyncFunctionRef = useRef(asyncFunction);

  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunctionRef.current();
      if (isMountedRef.current) {
        setState({ data, error: null, loading: false });
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState({
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        });
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { ...state, execute, reset };
};

export default useAsync;

