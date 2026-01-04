import { useEffect, useRef } from 'react';

const isEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }

    if (!isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

const useDeepCompareEffect = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const depsRef = useRef<React.DependencyList>();
  const signalRef = useRef(0);

  if (!isEqual(depsRef.current, deps)) {
    depsRef.current = deps;
    signalRef.current += 1;
  }

  useEffect(effect, [signalRef.current]);
};

export default useDeepCompareEffect;

