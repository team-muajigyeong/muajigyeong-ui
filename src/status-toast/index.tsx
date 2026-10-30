"use client";

import { useEffect, useState } from "react";

import styles from "./style.module.css";

export type StatusToastProps = {
  /** 화면에 표시할 메시지. 빈 문자열이면 토스트를 숨깁니다. */
  message: string;
  /** 보조 기술에 전달할 별도 안내 문구. */
  announcement?: string;
  /** 표시 시간(밀리초). 기본값은 5000입니다. */
  duration?: number;
  /** 같은 메시지를 다시 표시하려면 이 값을 변경하세요. */
  notificationId?: string | number;
  /** 위치를 포함해 사용하는 쪽에서 지정하는 스타일. */
  className?: string;
  tone?: "default" | "error";
};

/** 초점을 이동하지 않고 일시적인 피드백을 알립니다. */
export default function StatusToast({ message, announcement, duration = 5000, tone = "default", notificationId, className }: StatusToastProps) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, message, notificationId]);

  return (
    <div
      className={[styles.toast, className].filter(Boolean).join(" ")}
      data-visible={message && visible ? "true" : "false"}
      data-tone={tone}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      aria-relevant="additions text"
    >
      {announcement ? (
        <span key={notificationId}>
          <span aria-hidden="true">{message}</span>
          <span className={styles.visuallyHidden}>{announcement}</span>
        </span>
      ) : (
        <span key={notificationId}>{message}</span>
      )}
    </div>
  );
}
