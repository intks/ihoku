import { useCallback, useState } from 'react';

export interface UseMapReturn<K, V> {
  map: Map<K, V>;
  set: (key: K, value: V) => void;
  get: (key: K) => V | undefined;
  has: (key: K) => boolean;
  remove: (key: K) => void;
  clear: () => void;
  reset: () => void;
  size: number;
}

const useMap = <K, V>(initialMap: Map<K, V> = new Map()): UseMapReturn<K, V> => {
  const [map, setMap] = useState<Map<K, V>>(new Map(initialMap));

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const get = useCallback(
    (key: K) => {
      return map.get(key);
    },
    [map],
  );

  const has = useCallback(
    (key: K) => {
      return map.has(key);
    },
    [map],
  );

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(new Map());
  }, []);

  const reset = useCallback(() => {
    setMap(new Map(initialMap));
  }, [initialMap]);

  return {
    map,
    set,
    get,
    has,
    remove,
    clear,
    reset,
    size: map.size,
  };
};

export default useMap;

