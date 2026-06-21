import { useState, useCallback } from 'react';

interface UseModalOptions {
  onClose?: () => void;
}

export function useModal(initialState = false, options?: UseModalOptions) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
