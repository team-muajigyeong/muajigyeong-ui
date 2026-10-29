"use client";

import { RefObject, useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.matches(":disabled") && element.getAttribute("aria-hidden") !== "true"
      && !element.closest('[hidden], dialog:not([open])') && element.tabIndex >= 0,
  );
}

type UseFocusTrapParams = {
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
  active: boolean;
};

export default function useFocusTrap({ containerRef, initialFocusRef, returnFocusRef, restoreFocus = true, active }: UseFocusTrapParams) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previousFocusedElement =
      returnFocusRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);

    const moveFocusInside = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        return;
      }

      if (!container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }

      container.focus();
    };

    moveFocusInside();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      // 중첩 모달에서는 최상위 열린 모달의 트랩만 키보드 탐색을 처리한다.
      const dialogs = document.querySelectorAll("dialog[open]");
      const topDialog = dialogs[dialogs.length - 1];
      if (topDialog && topDialog !== container && !topDialog.contains(container)) return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (!currentElement || !container.contains(currentElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && currentElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && currentElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus) previousFocusedElement?.focus();
    };
  }, [active, containerRef, initialFocusRef, returnFocusRef, restoreFocus]);
}
