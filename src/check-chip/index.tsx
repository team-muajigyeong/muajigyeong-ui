"use client";

import { useId } from "react";
import styles from "./style.module.css";

export type CheckChipProps = {
  /** 화면과 보조 기술에 제공하는 필드 이름. */
  label: string;
  /** 입력 요소에 연결할 추가 설명. */
  description?: string;
  /** 부모에서 제어하는 선택 상태. */
  checked: boolean;
  /** 변경할 값을 전달합니다. 이 콜백에서 부모 상태를 갱신하세요. */
  onChange: (checked: boolean) => void;
};

/**
 * 부모에서 상태를 제어하는 공통 UI. 애플리케이션 상태와 도메인 데이터는 사용하는 쪽에서 관리합니다.
 * @param props 표시 및 상호작용 설정.
 */
export default function CheckChip({ label, description, checked, onChange }: CheckChipProps) {
  const id = useId();
  return (
    <label className={[styles.chip, checked ? styles.isChecked : ""].filter(Boolean).join(" ")}>
      <input
        type="checkbox"
        checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-description` : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.text}>
        <span id={`${id}-label`} className={styles.label}>{label}</span>
        {description ? <span id={`${id}-description`} className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
}
