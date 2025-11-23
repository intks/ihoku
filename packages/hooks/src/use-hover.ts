import { useCallback, useRef } from 'react';

import useDisclosure from './use-disclosure';

const useHover = (delay = 0) => {
  const { isOpen: isHover, onOpen, onClose } = useDisclosure();
  const previousNode = useRef<Element | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => onOpen(), delay);
    } else {
      onOpen();
    }
  }, [delay, onOpen]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    onClose();
  }, [onClose]);

  const customRef = useCallback(
    (node: Element | null) => {
      if (previousNode.current?.nodeType === Node.ELEMENT_NODE) {
        previousNode.current.removeEventListener('mouseenter', handleMouseEnter);
        previousNode.current.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (node?.nodeType === Node.ELEMENT_NODE) {
        node.addEventListener('mouseenter', handleMouseEnter);
        node.addEventListener('mouseleave', handleMouseLeave);
      }

      previousNode.current = node;
    },
    [handleMouseEnter, handleMouseLeave]
  );

  return { ref: customRef, isHover };
};

export default useHover;
