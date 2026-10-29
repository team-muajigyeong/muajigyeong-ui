"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { Dispatch, HTMLAttributes, ReactElement, ReactNode, RefAttributes, SetStateAction } from "react";
import useFocusTrap from "../internal/use-focus-trap.js";
import { createCX } from "../internal/single-class.js";
import styles from "./style.module.css";
const { cx } = createCX(styles);
/** Display and initial-focus options for a native modal dialog. */
export type AlertDialogOptions = {
  hideTitle?: boolean;
  closeButtonPlacement?: "start" | "end";
  initialFocus?: "first" | "title";
};

/** Compatible dialog contract; OpenButton must forward its ref and onClick to a button. */
export type BaseDialogProps = {
  children: ReactNode;
  title: string;
  CloseButton?: (props: HTMLAttributes<HTMLButtonElement>) => ReactElement;
  OpenButton: (props: HTMLAttributes<HTMLButtonElement> & RefAttributes<HTMLButtonElement>) => ReactElement;
  /** @deprecated Reserved for compatibility; handle confirmation in children. */
  onOK?: () => void;
  onCancel?: () => void;
  onAfterClose?: () => void;
  options?: AlertDialogOptions;
  className?:string
  modalController?:[boolean,Dispatch<SetStateAction<boolean>>]
};

/** Props for the dialog shell and its scrollable body. */
export type AlertDialogProps = BaseDialogProps & {
  props?: HTMLAttributes<HTMLDivElement>;
  bodyProps?: HTMLAttributes<HTMLDivElement>;
};

/** Native modal with focus containment, Escape dismissal and opener focus restoration. */
export const AlertDialog = ({
  children,
  title,
  modalController,
  OpenButton,
  CloseButton,
  options,
  bodyProps,
  onCancel,
  onAfterClose,
  className,
  ...props
}: AlertDialogProps) => {
  const dlgRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const titleRef = useRef<HTMLDivElement>(null);
  const internalController = useState(false);
  const [isOpen, setIsOpen] = modalController ?? internalController;

  const closeDialog = () => {
    setIsOpen(false);
    onCancel?.();
  };

  useFocusTrap({
    containerRef: dlgRef,
    initialFocusRef: options?.initialFocus === "title" ? titleRef : undefined,
    active: isOpen,
  });
  useEffect(() => {
    const dialog = dlgRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      // A closed native dialog cannot receive focus; apply title focus after opening.
      if (options?.initialFocus === "title") titleRef.current?.focus();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen, options?.initialFocus]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) {
        return;
      }

      // 중첩 모달과 선택 목록은 가장 안쪽의 열린 요소부터 닫는다.
      if (!(event.target instanceof Element) || event.target.closest("dialog") !== dlgRef.current) return;

      event.preventDefault();
      closeDialog();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel, setIsOpen]);

  return (
    <>
      <OpenButton
        ref={openerRef}
        onClick={() => {
          setIsOpen(true);
        }}
      />

      <dialog
        {...props}
        ref={dlgRef}
        aria-labelledby={titleId}
        className={[cx("alert-dialog"),className].join(" ")}
        onCancel={(event) => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          closeDialog();
        }}
        onClose={(event) => {
          if (event.target !== event.currentTarget) return;
          if (isOpen) {
            setIsOpen(false);
          }
          // 렌더 과정에서 열기 버튼이 교체되어도 현재 버튼으로 복귀한다.
          // dialog가 닫힌 뒤 실행해야 바깥 모달의 inert 상태가 해제된다.
          openerRef.current?.focus();
          onAfterClose?.();
        }}
        onClick={(event) => {
          if (event.target === dlgRef.current) {
            closeDialog();
          }
        }}
      >
        <div {...bodyProps} className={[cx("body"),bodyProps?.className].join(" ")}>
          {options?.closeButtonPlacement === "start" ? (
            <div className={cx("button-list")}>
              {CloseButton ? (
                <CloseButton onClick={closeDialog} />
              ) : (
                <button type="button" onClick={closeDialog}>
                  <span>{"닫기"}</span>
                </button>
              )}
            </div>
          ) : null}
          <div
            ref={titleRef}
            id={titleId}
            tabIndex={-1}
            className={cx("title", {"visually-hidden": options?.hideTitle})}
          >
            <h1>
              <span>{title}</span>
            </h1>
          </div>
          <div className={cx("content")}>{children}</div>
          {options?.closeButtonPlacement !== "start" ? (
          <div className={cx("button-list")}>
            {CloseButton ? (
              <CloseButton onClick={closeDialog} />
            ) : (
              <button type="button" onClick={closeDialog}>
                <span>{"닫기"}</span>
              </button>
            )}
          </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
};
