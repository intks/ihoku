import { useEffect, useState } from 'react';

export interface UseScriptOptions {
  async?: boolean;
  defer?: boolean;
  id?: string;
  onLoad?: () => void;
  onError?: (error: Event) => void;
}

export interface UseScriptReturn {
  loading: boolean;
  error: Error | null;
  ready: boolean;
}

const useScript = (src: string | null, options: UseScriptOptions = {}): UseScriptReturn => {
  const { async = true, defer = false, id, onLoad, onError } = options;
  const [state, setState] = useState<UseScriptReturn>({
    loading: true,
    error: null,
    ready: false,
  });

  useEffect(() => {
    if (!src || typeof document === 'undefined') {
      return;
    }

    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = async;
      script.defer = defer;
      if (id) {
        script.id = id;
      }

      script.onload = () => {
        setState({ loading: false, error: null, ready: true });
        onLoad?.();
      };

      script.onerror = (error) => {
        setState({ loading: false, error: new Error(`Failed to load script: ${src}`), ready: false });
        onError?.(error);
      };

      document.body.appendChild(script);
    } else {
      if (script.getAttribute('data-loaded') === 'true') {
        setState({ loading: false, error: null, ready: true });
      }
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [src, async, defer, id, onLoad, onError]);

  return state;
};

export default useScript;

