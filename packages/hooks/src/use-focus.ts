import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export interface UseFocusOptions {
  autoFocus?: boolean;
}

export interface UseFocusReturn<T extends HTMLElement> {
  ref: RefObject<T>;
  focused: boolean;
  setFocus: () => void;
  setBlur: () => void;
}

const useFocus = <T extends HTMLElement = HTMLInputElement>(
  options: UseFocusOptions = {},
): UseFocusReturn<T> => {
  const { autoFocus = false } = options;
  const ref = useRef<T>(null);
  const [focused, setFocused] = useState(false);

  const setFocus = useCallback(() => {
    ref.current?.focus();
    setFocused(true);
  }, []);

  const setBlur = useCallback(() => {
    ref.current?.blur();
    setFocused(false);
  }, []);

  useEffect(() => {
    if (autoFocus && ref.current) {
      setFocus();
    }
  }, [autoFocus, setFocus]);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleFocus = () => {
      setFocused(true);
    };

    const handleBlur = () => {
      setFocused(false);
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { ref, focused, setFocus, setBlur };
};

export default useFocus;

