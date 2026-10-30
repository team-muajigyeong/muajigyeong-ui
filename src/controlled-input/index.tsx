"use client";

import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

import styles from "./style.module.css";

export type ControlledInputProps = {
  /** 화면과 보조 기술에 제공하는 필드 이름. */
  label: string;
  /** 값이 비어 있을 때 표시할 안내 문구. */
  placeholder?: string;
  /** 부모에서 전달하는 제어 값. */
  value: string;
  /** 변경할 값을 전달합니다. 이 콜백에서 부모 상태를 갱신하세요. */
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  readOnly?: boolean;
  /** 사용자 입력을 비활성화합니다. */
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  name?: string;
  id?: string;
  /** 보조 기술에 입력값이 유효하지 않음을 알립니다. */
  invalid?: boolean;
  /** 오류 또는 도움말을 담은 요소의 ID. */
  describedBy?: string;
  /** input 대신 textarea를 렌더링합니다. */
  multiline?: boolean;
  /** 여러 줄 입력에서 표시할 행 수. */
  rows?: number;
};

/**
 * 부모에서 상태를 제어하는 공통 UI. 애플리케이션 상태와 도메인 데이터는 사용하는 쪽에서 관리합니다.
 * @param props 표시 및 상호작용 설정.
 */
export default function ControlledInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly = false,
  disabled = false,
  required = false,
  maxLength,
  name,
  id,
  invalid,
  describedBy,
  multiline = false,
  rows = 4,
}: ControlledInputProps) {
  const commonProps = {
    id,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    name,
    placeholder,
    value,
    readOnly,
    disabled,
    required,
    maxLength,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
  };

  return (
    <label className={styles.field}>
      <span>{label}</span>
      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input {...commonProps} type={type} />
      )}
    </label>
  );
}
