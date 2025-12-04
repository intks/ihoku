import { useState, useCallback } from 'react';

import useDebounce from './use-debounce';

interface UseDebounceUpdateInputReturn {
  inputValue: string;
  debouncedValue: string;
  handleChangeInputValue: (value: string) => void;
}

/**
 * @description 500ms is the default delay for debounce update input
 * @param delay - The delay in milliseconds for debounce update input
 * @returns An object containing the input value, debounced value, and a function to handle input value changes
 */
function useDebounceUpdateInput(delay = 500): UseDebounceUpdateInputReturn {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const debouncedSetValue = useDebounce((value: string) => {
    setDebouncedValue(value);
  }, delay);

  const handleChangeInputValue = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedSetValue(value);
    },
    [debouncedSetValue]
  );

  return {
    inputValue,
    debouncedValue,
    handleChangeInputValue,
  };
}

export default useDebounceUpdateInput;
