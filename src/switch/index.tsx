"use client";

import { useId, useState } from "react";
import type { Dispatch, InputHTMLAttributes, ReactElement, SetStateAction } from "react";
import type { IconType } from "react-icons";

import useMount from "../internal/use-mount.js";

import styles from "./style.module.css";

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type DeniedAttrib = "type" | "role" | "aria-checked" | "aria-disabled" | "aria-label" | "aria-labelledby";

export type SwitchProps = {
  /** 스위치에 연결된 화면 표시 이름. */
  label: string;
  /** 화면 표시 이름 대신 사용할 접근 가능한 이름. */
  ariaLabel?: string;
  icon?: ReactElement<IconType>;
  /** 부모에서 제어하는 상태. setPressed도 전달한 경우에만 적용됩니다. */
  pressed?: boolean;
  /** 바깥 label에 추가할 클래스. 기본 className은 input에 적용됩니다. */
  labelClassName?: string;
  /** 변경할 상태를 전달합니다. 부모에서 제어하려면 pressed와 함께 사용하세요. */
  setPressed?: Dispatch<SetStateAction<boolean>> | ((prev: boolean) => void);
  /** 내부·외부 상태 관리 모두에서 사용자 변경마다 다음 상태를 한 번 전달합니다. */
  onChangeCallback?: (value: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, DeniedAttrib>;

/** 내부 상태 관리와 부모의 상태 제어를 지원하는 체크박스 기반 스위치. */
export default function Switch({
  label,
  ariaLabel,
  id,
  pressed,
  setPressed,
  onChangeCallback,
  icon,
  labelClassName,
  ...attrs
}: SwitchProps) {
  const [internalPressed, setInternalPressed] = useState(false);
  const isControlled = pressed !== undefined && setPressed !== undefined;
  const didMount = useMount();
  const automatedID = useId();
  const uid = didMount ? (id ?? automatedID) : id;

  const pressedState = isControlled ? pressed : internalPressed;

  const updatePressedState = (value: boolean) => {
    if (isControlled && typeof setPressed === "function") {
      setPressed(value);
      return;
    }

    setInternalPressed(value);
  };

  return (
    <label htmlFor={uid} className={cx(styles.switchLabel, labelClassName)}>
      <b>
        <span>{label}</span>
      </b>
      {icon}
      <input
        {...attrs}
        type="checkbox"
        role="switch"
        aria-label={ariaLabel}
        checked={pressedState}
        id={uid}
        onChange={(event) => {
          const checked = event.currentTarget.checked;
          updatePressedState(checked);
          onChangeCallback?.(checked);
        }}
      />
    </label>
  );
}
