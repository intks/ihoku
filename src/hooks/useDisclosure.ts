import { useState, useCallback } from 'react';

type UseDisclosureOptions = {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

type UseDisclosureReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const useDisclosure = (
  options: UseDisclosureOptions = {}
): UseDisclosureReturn => {
  const {
    isOpen: isOpenProp = false,
    onOpen,
    onClose,
  } = options;

  const [isOpen, setIsOpen] = useState<boolean>(isOpenProp);

  const open = useCallback((): void => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback((): void => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback((): void => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }
      return next;
    });
  }, [onOpen, onClose]);

  return {
    open,
    close,
    toggle,
    isOpen,
  };
};

export default useDisclosure;
