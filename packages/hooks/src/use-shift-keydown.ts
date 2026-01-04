import useKeyDown, { type UseKeyDownOptions, type KeyType } from './use-key-down';

export interface UseShiftKeydownOptions extends Omit<UseKeyDownOptions, 'exactMatch'> {
  exactMatch?: boolean;
}

const useShiftKeydown = (
  key: KeyType | null,
  eventHandler: (event: KeyboardEvent, key: KeyType) => void,
  options?: UseShiftKeydownOptions,
) => {
  const { exactMatch = true, ...restOptions } = options || {};

  const keyFilter = key ? `shift.${key}` : 'shift';

  return useKeyDown(keyFilter, eventHandler, {
    ...restOptions,
    exactMatch,
  });
};

export default useShiftKeydown;

