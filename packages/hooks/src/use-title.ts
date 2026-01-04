import { useEffect } from 'react';

const useTitle = (title: string): void => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default useTitle;

