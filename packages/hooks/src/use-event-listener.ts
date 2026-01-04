import { useEffect, useRef } from 'react';

export type EventTarget = Window | Document | HTMLElement | null;

export interface UseEventListenerOptions {
  enabled?: boolean;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

const useEventListener = <K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: EventTarget,
  options?: UseEventListenerOptions,
): void => {
  const { enabled = true, ...eventOptions } = options || {};
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const targetElement = element || window;
    if (!targetElement) {
      return;
    }

    const eventListener = (event: Event) => {
      handlerRef.current(event as WindowEventMap[K]);
    };

    targetElement.addEventListener(eventName, eventListener, eventOptions);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, eventOptions);
    };
  }, [eventName, element, enabled, eventOptions.capture, eventOptions.once, eventOptions.passive]);
};

export default useEventListener;

