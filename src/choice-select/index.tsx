"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./style.module.css";

export type ChoiceSelectOption = {
  /** 부모에서 전달하는 제어 값. */
  value: string;
  /** 화면과 보조 기술에 제공하는 필드 이름. */
  label: string;
};

export type ChoiceSelectProps = {
  /** 부모에서 전달하는 제어 값. */
  value: string;
  /** 선택 가능한 값과 화면에 표시할 이름 목록. */
  options: readonly ChoiceSelectOption[];
  /** 변경할 값을 전달합니다. 이 콜백에서 부모 상태를 갱신하세요. */
  onChange: (value: string) => void;
  /** 값이 비어 있을 때 표시할 안내 문구. */
  placeholder: string;
  /** 선택 컨트롤의 접근 가능한 이름. */
  ariaLabel?: string;
  /** 도움말을 담은 요소의 ID. */
  ariaDescribedBy?: string;
  /** 사용자 입력을 비활성화합니다. */
  disabled?: boolean;
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

/**
 * 부모에서 상태를 제어하는 공통 UI. 애플리케이션 상태와 도메인 데이터는 사용하는 쪽에서 관리합니다.
 * @param props 표시 및 상호작용 설정.
 */
export default function ChoiceSelect({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
}: ChoiceSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedIndex = useMemo(() => options.findIndex((option) => option.value === value), [options, value]);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex]?.label ?? placeholder : placeholder;
  const accessibleLabel = ariaLabel
    ? selectedIndex >= 0
      ? `${ariaLabel}, 현재 ${selectedLabel}`
      : ariaLabel
    : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    optionRefs.current[nextIndex]?.focus();
  }, [isOpen, selectedIndex]);

  const openList = () => {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  };

  const closeList = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={cx(styles.trigger, disabled && styles.isDisabled)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`choice-list-${id}`}
        aria-label={accessibleLabel}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => {
          if (isOpen) {
            closeList();
            return;
          }

          openList();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openList();
          }
        }}
      >
        <span className={styles.label}>{selectedLabel}</span>
        <span className={styles.icon}>
          <FaChevronDown aria-hidden="true" />
        </span>
      </button>

      {isOpen ? (
        <div
          id={`choice-list-${id}`}
          className={styles.list}
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              id={`choice-option-${id}-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={cx(styles.option, option.value === value && styles.isSelected)}
              onClick={() => {
                selectOption(option.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(index, 1);
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(index, -1);
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectOption(option.value);
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  closeList();
                }

                if (event.key === "Tab") {
                  setIsOpen(false);
                }
              }}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
