import { useEffect, useState } from 'react';

const useWindowFocus = (): boolean => {
  const [isFocused, setIsFocused] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return document.hasFocus();
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return isFocused;
};

export default useWindowFocus;

