"use client";

import styles from "./style.module.css";

export type FormActionButtonsProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  /** 작업 중에도 버튼에 초점을 둘 수 있지만 확인 동작은 실행하지 않습니다. */
  confirmBusy?: boolean;
  cancelDisabled?: boolean;
  className?: string;
  /** 취소 버튼에 추가할 CSS 클래스. 사용하는 애플리케이션에서 정의합니다. */
  cancelButtonClassName?: string;
  /** 확인 버튼에 추가할 CSS 클래스. 사용하는 애플리케이션에서 정의합니다. */
  confirmButtonClassName?: string;
  density?: "default" | "compact";
};

/** 사용하는 쪽에서 지정한 콜백과 스타일로 취소·확인 버튼을 표시합니다. */
export default function FormActionButtons({
  cancelLabel = "취소",
  confirmLabel = "저장",
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmBusy = false,
  cancelDisabled = false,
  className = "",
  density = "default",
  cancelButtonClassName,
  confirmButtonClassName,
}: FormActionButtonsProps) {
  return (
    <div className={[styles.wrapper, density === "compact" ? styles.compact : "", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={[styles.cancelButton, cancelButtonClassName].filter(Boolean).join(" ")}
        onClick={onCancel}
        disabled={cancelDisabled}
      >
        <span>{cancelLabel}</span>
      </button>
      <button
        type="button"
        className={[styles.confirmButton, confirmButtonClassName].filter(Boolean).join(" ")}
        onClick={() => { if (!confirmBusy) onConfirm(); }}
        disabled={confirmDisabled}
        aria-disabled={confirmDisabled || confirmBusy}
      >
        <span>{confirmLabel}</span>
      </button>
    </div>
  );
}
