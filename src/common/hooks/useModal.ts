import { useCallback, useRef, useState, useEffect } from "react";
import useFocusTrap from "@charlietango/use-focus-trap";

export default function useModal(initialState = false) {
  const [isOpen, setOpen] = useState(initialState);
  const close = useCallback(() => setOpen(false), []);
  const open = useCallback(() => setOpen(true), []);
  const ref = useRef<HTMLElement>();
  // The focus trap is used to make sure the user can't tab out of the modal.
  const focusTrapRef = useFocusTrap(isOpen);
  const modalRef = useCallback(
    (node: HTMLElement | null) => {
      focusTrapRef(node);
      if (node) {
        ref.current = node;
      }
    },
    [focusTrapRef]
  );

  // close on esc key
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handler(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      close();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, isOpen]);

  // close on click outside of modal
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handler(event: MouseEvent) {
      if (!ref.current) {
        return;
      }
      const target = event.target as HTMLElement;
      if (ref.current.contains(target)) {
        return;
      }
      close();
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [close, isOpen]);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const overflow = document.documentElement.style.overflow;
    const paddingRight = document.documentElement.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.documentElement.style.overflow = overflow;
      document.documentElement.style.paddingRight = paddingRight;
    };
  }, [isOpen]);

  return { modalRef, isOpen, open, close };
}
