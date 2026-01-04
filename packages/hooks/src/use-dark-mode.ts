import { useEffect, useState } from 'react';

export interface UseDarkModeOptions {
  initialValue?: boolean;
  storageKey?: string;
}

const useDarkMode = (options: UseDarkModeOptions = {}): [boolean, () => void] => {
  const { initialValue, storageKey = 'darkMode' } = options;
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue ?? false;
    }

    if (initialValue !== undefined) {
      return initialValue;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error reading dark mode from localStorage:', error);
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(isDark));
    } catch (error) {
      console.warn('Error saving dark mode to localStorage:', error);
    }

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark, storageKey]);

  const toggle = () => {
    setIsDark((prev) => !prev);
  };

  return [isDark, toggle];
};

export default useDarkMode;

