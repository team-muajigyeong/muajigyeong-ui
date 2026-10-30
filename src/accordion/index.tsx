"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";

import styles from "./style.module.css";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  /** 패널의 접근 가능한 이름. */
  panelLabel?: string;
};

export type AccordionProps = {
  /** 고유 ID를 가진 패널 목록. 한 번에 하나의 패널만 열립니다. */
  items: readonly AccordionItem[];
  /** 문서 구조에 맞는 제목 단계. 기본값은 3이며 스타일에는 영향을 주지 않습니다. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * 제목을 눌러 내용을 펼치는 아코디언. 한 번에 하나의 패널만 열립니다.
 * @param props 표시 및 상호작용 설정.
 */
export default function Accordion({ items, headingLevel = 3 }: AccordionProps) {
  const Heading = `h${headingLevel}` as `h${1 | 2 | 3 | 4 | 5 | 6}`;
  const instanceId = useId();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleItem(itemId: string) {
    setExpandedId((current) => current === itemId ? null : itemId);
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const buttonId = `${instanceId}-${item.id}-button`;
        const panelId = `${instanceId}-${item.id}-panel`;

        return (
          <section className={styles.item} key={item.id}>
            <Heading className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.title}</span>
                <FaChevronDown aria-hidden="true" />
              </button>
            </Heading>
            <div
              id={panelId}
              className={styles.panel}
              role="region"
              aria-label={item.panelLabel ?? "답변"}
              hidden={!isExpanded}
            >
              {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
