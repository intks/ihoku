import { useEffect, useRef, useState, type RefObject } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  enabled?: boolean;
}

const useIntersectionObserver = <T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {},
): [RefObject<T>, IntersectionObserverEntry | null] => {
  const { enabled = true, ...observerOptions } = options;
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
      },
      observerOptions,
    );

    const element = ref.current;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [enabled, observerOptions.root, observerOptions.rootMargin, observerOptions.threshold]);

  return [ref, entry];
};

export default useIntersectionObserver;

