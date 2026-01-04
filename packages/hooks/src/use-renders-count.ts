import { useRef } from 'react';

const useRendersCount = (): number => {
  const rendersCount = useRef(0);
  rendersCount.current += 1;
  return rendersCount.current;
};

export default useRendersCount;

