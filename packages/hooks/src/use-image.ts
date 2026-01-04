import { useEffect, useState } from 'react';

export interface UseImageReturn {
  loading: boolean;
  error: Error | null;
  src: string | null;
}

const useImage = (url: string | null): UseImageReturn => {
  const [state, setState] = useState<UseImageReturn>({
    loading: true,
    error: null,
    src: null,
  });

  useEffect(() => {
    if (!url) {
      setState({ loading: false, error: null, src: null });
      return;
    }

    const img = new Image();
    let isMounted = true;

    img.onload = () => {
      if (isMounted) {
        setState({ loading: false, error: null, src: url });
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setState({
          loading: false,
          error: new Error(`Failed to load image: ${url}`),
          src: null,
        });
      }
    };

    img.src = url;

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};

export default useImage;

