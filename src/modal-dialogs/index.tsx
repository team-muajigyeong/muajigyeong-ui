"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { Dispatch, HTMLAttributes, ReactElement, ReactNode, RefAttributes, RefObject, SetStateAction } from "react";
import useFocusTrap from "../internal/use-focus-trap.js";
import { createCX } from "../internal/single-class.js";
import styles from "./style.module.css";
const { cx } = createCX(styles);
/** 브라우저 기본 모달 대화상자의 표시 및 초기 초점 설정. */
export type AlertDialogOptions = {
  hideTitle?: boolean;
  closeButtonPlacement?: "start" | "end";
  initialFocus?: "first" | "title";
};

/** 대화상자의 공통 속성. OpenButton은 전달받은 ref와 onClick을 실제 버튼에 연결해야 합니다. */
export type BaseDialogProps = {
  children: ReactNode;
  title: string;
  CloseButton?: (props: HTMLAttributes<HTMLButtonElement>) => ReactElement;
  OpenButton: (props: HTMLAttributes<HTMLButtonElement> & RefAttributes<HTMLButtonElement>) => ReactElement;
  /** @deprecated 호환성을 위해 유지합니다. 확인 동작은 children에서 처리하세요. */
  onOK?: () => void;
  onCancel?: () => void;
  onAfterClose?: () => void;
  /** 실제 열기 요소가 사라지거나 비활성화되는 경우 지정할 복귀 위치. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  options?: AlertDialogOptions;
  className?:string
  modalController?:[boolean,Dispatch<SetStateAction<boolean>>]
};

/** 대화상자 외곽과 스크롤 가능한 본문의 속성. */
export type AlertDialogProps = BaseDialogProps & {
  props?: HTMLAttributes<HTMLDivElement>;
  bodyProps?: HTMLAttributes<HTMLDivElement>;
};

/** 초점을 내부에 유지하고 Escape로 닫으며, 닫은 뒤 열기 요소로 초점을 돌려주는 기본 모달 대화상자. */
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
  returnFocusRef,
  className,
  ...props
}: AlertDialogProps) => {
  const dlgRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const titleRef = useRef<HTMLDivElement>(null);
  const internalController = useState(false);
  const [isOpen, setIsOpen] = modalController ?? internalController;

  const closeDialog = () => {
    setIsOpen(false);
    onCancel?.();
  };

  useEffect(() => {
    const dialog = dlgRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      // A closed native dialog cannot receive focus; apply title focus after opening.
      if (options?.initialFocus === "title") titleRef.current?.focus();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen, options?.initialFocus]);

  useFocusTrap({
    containerRef: dlgRef,
    initialFocusRef: options?.initialFocus === "title" ? titleRef : undefined,
    active: isOpen,
    // 네이티브 dialog가 닫혀 바깥 영역의 inert가 해제된 뒤 onClose에서 복귀한다.
    restoreFocus: false,
  });

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
          if (event.currentTarget.open) return;
          if (isOpen) {
            setIsOpen(false);
          }
          // 제어용 숨겨진 버튼은 건너뛰고 실제 열기 요소로 복귀한다.
          // 다시 렌더된 열기 버튼과 중첩 모달 안의 복귀 위치도 지원한다.
          for (const target of [returnFocusRef?.current, openerRef.current, previousFocusRef.current]) {
            if (!target?.isConnected || target === document.body || target.matches(":disabled")
              || target.closest('[hidden], [inert], [aria-hidden="true"], dialog:not([open])')
              || target.getClientRects().length === 0 || getComputedStyle(target).visibility === "hidden") continue;
            target.focus();
            if (document.activeElement === target) break;
          }
          previousFocusRef.current = null;
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
