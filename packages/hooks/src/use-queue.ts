import { useCallback, useState } from 'react';

export interface UseQueueReturn<T> {
  queue: T[];
  enqueue: (item: T) => void;
  dequeue: () => T | undefined;
  peek: () => T | undefined;
  clear: () => void;
  size: number;
}

const useQueue = <T>(initialQueue: T[] = []): UseQueueReturn<T> => {
  const [queue, setQueue] = useState<T[]>(initialQueue);

  const enqueue = useCallback((item: T) => {
    setQueue((prev) => [...prev, item]);
  }, []);

  const dequeue = useCallback(() => {
    let result: T | undefined;
    setQueue((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      const [first, ...rest] = prev;
      result = first;
      return rest;
    });
    return result;
  }, []);

  const peek = useCallback(() => {
    return queue.length > 0 ? queue[0] : undefined;
  }, [queue]);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    enqueue,
    dequeue,
    peek,
    clear,
    size: queue.length,
  };
};

export default useQueue;

