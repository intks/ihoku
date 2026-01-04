import { useCallback, useState } from 'react';

export interface UseCookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const useCookie = (name: string, initialValue: string = '') => {
  const [value, setValue] = useState<string>(() => {
    if (typeof document === 'undefined') {
      return initialValue;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, val] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(val);
      }
    }
    return initialValue;
  });

  const setCookie = useCallback(
    (newValue: string, options: UseCookieOptions = {}) => {
      if (typeof document === 'undefined') {
        return;
      }

      const {
        expires,
        path = '/',
        domain,
        secure = false,
        sameSite = 'lax',
      } = options;

      let cookieString = `${name}=${encodeURIComponent(newValue)}`;

      if (expires) {
        if (typeof expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
          cookieString += `; expires=${date.toUTCString()}`;
        } else {
          cookieString += `; expires=${expires.toUTCString()}`;
        }
      }

      cookieString += `; path=${path}`;

      if (domain) {
        cookieString += `; domain=${domain}`;
      }

      if (secure) {
        cookieString += '; secure';
      }

      cookieString += `; sameSite=${sameSite}`;

      document.cookie = cookieString;
      setValue(newValue);
    },
    [name],
  );

  const removeCookie = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setValue('');
  }, [name]);

  return { value, setCookie, removeCookie };
};

export default useCookie;

