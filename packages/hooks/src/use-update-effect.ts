import { useEffect, useRef } from 'react';

const useUpdateEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
  }, deps);
};

export default useUpdateEffect;

