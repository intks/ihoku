import { useEffect, useRef } from 'react';

export type KeyType = number | string;
export type KeyPredicate = (event: KeyboardEvent) => KeyType | boolean | undefined;
export type KeyFilter = KeyType | KeyType[] | ((event: KeyboardEvent) => boolean);
export type KeyEvent = 'keydown' | 'keyup';

export type Target = HTMLElement | Document | Window | (() => HTMLElement | Document | Window) | null;

export interface UseKeyDownOptions {
  events?: KeyEvent[];
  target?: Target;
  exactMatch?: boolean;
  useCapture?: boolean;
}

const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const aliasKeyCodeMap: Record<string, number | number[]> = {
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  pausebreak: 19,
  capslock: 20,
  esc: 27,
  space: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  leftarrow: 37,
  uparrow: 38,
  rightarrow: 39,
  downarrow: 40,
  insert: 45,
  delete: 46,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  leftwindowkey: 91,
  rightwindowkey: 92,
  meta: isAppleDevice ? [91, 93] : [91, 92],
  selectkey: 93,
  numpad0: 96,
  numpad1: 97,
  numpad2: 98,
  numpad3: 99,
  numpad4: 100,
  numpad5: 101,
  numpad6: 102,
  numpad7: 103,
  numpad8: 104,
  numpad9: 105,
  multiply: 106,
  add: 107,
  subtract: 109,
  decimalpoint: 110,
  divide: 111,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  numlock: 144,
  scrolllock: 145,
  semicolon: 186,
  equalsign: 187,
  comma: 188,
  dash: 189,
  period: 190,
  forwardslash: 191,
  graveaccent: 192,
  openbracket: 219,
  backslash: 220,
  closebracket: 221,
  singlequote: 222,
};

const modifierKey = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => {
    if (event.type === 'keyup') {
      const metaCodes = aliasKeyCodeMap.meta as number[];
      return metaCodes.includes(event.keyCode);
    }
    return event.metaKey;
  },
};

const isValidKeyType = (value: unknown): value is string | number => {
  return typeof value === 'string' || typeof value === 'number';
};

const countKeyByEvent = (event: KeyboardEvent): number => {
  const countOfModifier = Object.keys(modifierKey).reduce((total, key) => {
    const modifier = modifierKey[key as keyof typeof modifierKey];
    if (modifier(event)) {
      return total + 1;
    }
    return total;
  }, 0);

  return [16, 17, 18, 91, 92].includes(event.keyCode) ? countOfModifier : countOfModifier + 1;
};

const genFilterKey = (event: KeyboardEvent, keyFilter: KeyType, exactMatch: boolean): KeyType | false => {
  if (!event.key) {
    return false;
  }

  if (typeof keyFilter === 'number') {
    return event.keyCode === keyFilter ? keyFilter : false;
  }

  const genArr = keyFilter.split('.');
  let genLen = 0;

  for (const key of genArr) {
    const genModifier = modifierKey[key as keyof typeof modifierKey];
    const aliasKeyCode = aliasKeyCodeMap[key.toLowerCase()];

    if (genModifier && genModifier(event)) {
      genLen++;
    } else if (aliasKeyCode) {
      if (Array.isArray(aliasKeyCode)) {
        if (aliasKeyCode.includes(event.keyCode)) {
          genLen++;
        }
      } else if (aliasKeyCode === event.keyCode) {
        genLen++;
      }
    }
  }

  if (exactMatch) {
    return genLen === genArr.length && countKeyByEvent(event) === genArr.length ? keyFilter : false;
  }
  return genLen === genArr.length ? keyFilter : false;
};

const genKeyFormatter = (keyFilter: KeyFilter, exactMatch: boolean): KeyPredicate => {
  if (typeof keyFilter === 'function') {
    return keyFilter;
  }
  if (isValidKeyType(keyFilter)) {
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter, exactMatch);
  }
  if (Array.isArray(keyFilter)) {
    return (event: KeyboardEvent) => keyFilter.find((item) => genFilterKey(event, item, exactMatch));
  }
  return () => Boolean(keyFilter);
};

const getTargetElement = (target: Target | undefined, defaultElement: Window): HTMLElement | Document | Window => {
  if (!target) {
    return defaultElement;
  }

  if (typeof target === 'function') {
    return target() || defaultElement;
  }

  return target;
};

const defaultEvents: KeyEvent[] = ['keydown'];

const useKeyDown = (
  keyFilter: KeyFilter,
  eventHandler: (event: KeyboardEvent, key: KeyType) => void,
  options?: UseKeyDownOptions,
) => {
  const { events = defaultEvents, target, exactMatch = false, useCapture = false } = options || {};
  const eventHandlerRef = useRef(eventHandler);
  const keyFilterRef = useRef(keyFilter);

  useEffect(() => {
    eventHandlerRef.current = eventHandler;
  }, [eventHandler]);

  useEffect(() => {
    keyFilterRef.current = keyFilter;
  }, [keyFilter]);

  useEffect(() => {
    const el = getTargetElement(target, window);
    if (!el) {
      return;
    }

    const callbackHandler = (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      const genGuard = genKeyFormatter(keyFilterRef.current, exactMatch);
      const keyGuard = genGuard(keyEvent);
      const firedKey = isValidKeyType(keyGuard) ? keyGuard : keyEvent.key;

      if (keyGuard) {
        return eventHandlerRef.current?.(keyEvent, firedKey);
      }
    };

    for (const eventName of events) {
      el.addEventListener(eventName, callbackHandler, useCapture);
    }

    return () => {
      for (const eventName of events) {
        el.removeEventListener(eventName, callbackHandler, useCapture);
      }
    };
  }, [events, target, exactMatch, useCapture]);
};

export default useKeyDown;
