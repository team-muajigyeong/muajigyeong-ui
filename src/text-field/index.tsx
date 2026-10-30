"use client";

import { useId, useState } from "react";
import type { ComponentPropsWithRef, Dispatch, ReactNode, SetStateAction } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import useMount from "../internal/use-mount.js";

import styles from "./style.module.css";

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export type AOSTextFieldProps = ComponentPropsWithRef<"input"> & {
  type?: "text" | "password" | "email" | "url" | "search" | "tel" | "date";
  /** 입력 요소에 연결된 화면 표시 이름. */
  label: string;
  icon?: ReactNode;
  /** 부모에서 제어하는 입력값. setValue와 함께 사용하고 기본 value/onChange와 혼용하지 마세요. */
  getValue?: string;
  /** getValue를 갱신하는 부모 상태 변경 함수. 내부 상태를 사용하려면 두 속성을 모두 생략하세요. */
  setValue?: Dispatch<SetStateAction<string>>;
  /** 기본 또는 좁은 입력 필드 간격. */
  density?: "default" | "compact";
  /** 떠 있는 라벨 또는 입력 위에 배치하는 라벨. */
  labelPlacement?: "floating" | "stacked";
};

/** 아이콘, 라벨 배치, 비밀번호 표시 전환을 지원하는 텍스트 입력. */
export function AOSTextField({
  getValue,
  setValue,
  icon,
  type = "text",
  className,
  id: idProps,
  label,
  density = "default",
  labelPlacement = "floating",
  ...attrs
}: AOSTextFieldProps) {
  const [isValueShown, showValue] = useState<boolean>(() => type !== "password");
  const [_getValue, _setValue] = useState<string>("");
  const [currentValue, updateValue] = [getValue ?? _getValue, setValue ?? _setValue];
  const automatedId = useId();
  const didMount = useMount();
  const uid = didMount ? (idProps ?? automatedId) : idProps;

  return (
    <label className={cx(styles["txtfield-wrapper"], styles.aos, density === "compact" && styles.compact, labelPlacement === "stacked" && styles.stacked, currentValue?.length ? styles.fill : "", className)} htmlFor={uid}>
      <span className={styles["label-text"]}>
        {icon}
        <span>{label}</span>
      </span>
      <input
        onChange={(event) => {
          updateValue(event.target.value);
        }}
        type={type !== "password" ? type : isValueShown ? "text" : "password"}
        id={uid}
        value={currentValue}
        {...attrs}
      />

      {type === "password" && (
        <button
          type="button"
          className={styles["btn-show-password"]}
          aria-label="비밀번호 보기"
          aria-pressed={isValueShown}
          onClick={() => {
            showValue(!isValueShown);
          }}
        >
          {isValueShown ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </label>
  );
}
