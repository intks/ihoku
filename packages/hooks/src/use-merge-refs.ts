import { useCallback } from 'react';

const useMergeRefs = <T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> => {
  return useCallback(
    (node: T) => {
      for (const ref of refs) {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      }
    },
    [refs],
  );
};

export default useMergeRefs;

