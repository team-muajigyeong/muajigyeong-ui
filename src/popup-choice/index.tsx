"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import useFocusTrap from "../internal/use-focus-trap.js";
import styles from "./style.module.css";

/** 확인을 누르면 선택을 적용하고, 취소 또는 Escape를 누르면 변경을 버립니다. */
export type PopUpChoiceProps = {
  label: string;
  name: string;
  options: string[];
};

const DEFAULT_OPTION_LABEL = "\uC635\uC158 \uC120\uD0DD";
const CANCEL_LABEL = "\uCDE8\uC18C";
const CONFIRM_LABEL = "\uD655\uC778";

/** 내부에서 선택 상태를 관리하는 기존 API를 유지하는 라디오 선택 대화상자. */
export function PopupChoice({ label, options, name }: PopUpChoiceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const radioListRef = useRef<HTMLInputElement[]>([]);
  const id = useId();

  const [selection, setSelection] = useState<number>(-1);
  const [tempSelection, saveTempSelection] = useState<number>(-1);
  const [selectionName, updateSelectionName] = useState<string>(DEFAULT_OPTION_LABEL);
  const [isOpen, setIsOpen] = useState(false);

  useFocusTrap({ containerRef: dialogRef, returnFocusRef: openerRef, active: isOpen });

  const open = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
    saveTempSelection(selection);
  };

  const close = (callback?: () => void) => {
    dialogRef.current?.close();
    setIsOpen(false);
    callback?.();
  };

  const chooseCompletion = () => {
    close(() => {
      setSelection(tempSelection);
    });
  };

  const cancelation = () => {
    close(() => {
      saveTempSelection(selection);
    });
  };

  useEffect(() => {
    updateSelectionName(radioListRef.current[selection]?.labels?.[0].textContent ?? DEFAULT_OPTION_LABEL);
  }, [selection]);

  return (
    <>
      <button ref={openerRef} type="button" onClick={open} className={styles["choice-opener"]} aria-haspopup="dialog" aria-controls={`dlg_${id}`} aria-expanded={isOpen}>
        {label}
        <div className={styles["choice-inner"]}>
          <span className={styles["choice-value"]}>
            <span>{selectionName}</span>
          </span>
          <span className={styles["choice-icon"]}>
            <FaChevronDown />
          </span>
        </div>
      </button>

      <dialog
        aria-labelledby={`title_${id}`}
        id={`dlg_${id}`}
        className={styles["choice-dialog"]}
        ref={dialogRef}
        onCancel={(event) => {
          event.preventDefault();
          cancelation();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            cancelation();
          }
        }}
      >
        <div className={styles["choice-body"]}>
          <h2 id={`title_${id}`}>
            <span>{DEFAULT_OPTION_LABEL}</span>
          </h2>
          <div className={styles["choice-options"]}>
            {options.map((option, index) => (
              <label key={index} htmlFor={`option${index + 1}_${id}`}>
                <input
                  type="radio"
                  ref={(element) => {
                    if (element) {
                      radioListRef.current[index] = element;
                    }
                  }}
                  name={name}
                  id={`option${index + 1}_${id}`}
                  defaultValue={index}
                  checked={index === tempSelection}
                  onChange={() => {
                    saveTempSelection(index);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div className={styles["button-list"]}>
            <button type="button" onClick={cancelation}>
              <span>{CANCEL_LABEL}</span>
            </button>
            <button type="button" onClick={chooseCompletion}>
              <span>{CONFIRM_LABEL}</span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
