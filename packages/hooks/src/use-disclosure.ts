import { useCallback, useState } from 'react';

export interface UseDisclosureProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const useDisclosure = (props: UseDisclosureProps = {}) => {
  const { isOpen: isOpenProp,  onOpen: onOpenProp, onClose: onCloseProp } = props;
  const [isOpen, setIsOpen] = useState(isOpenProp || false);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCloseProp?.();
  }, [onCloseProp]);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onOpenProp?.();
  }, [onOpenProp]);

  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
};

export default useDisclosure;
