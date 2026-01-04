import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseFetchOptions extends RequestInit {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseFetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

const useFetch = <T = any>(
  url: string | null,
  options: UseFetchOptions = {},
): UseFetchState<T> & { refetch: () => Promise<void>; reset: () => void } => {
  const { immediate = true, onSuccess, onError, ...fetchOptions } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!url) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (isMountedRef.current) {
        setState({ data, error: null, loading: false });
        onSuccess?.(data);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      const fetchError = error instanceof Error ? error : new Error(String(error));

      if (isMountedRef.current) {
        setState({
          data: null,
          error: fetchError,
          loading: false,
        });
        onError?.(fetchError);
      }
    }
  }, [url, fetchOptions, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
    });
  }, []);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, url, fetchData]);

  return { ...state, refetch: fetchData, reset };
};

export default useFetch;

