import type { ReactNode } from "react";

import styles from "./style.module.css";

export type SectionWithHeaderProps = {
  /** 사용하는 문서의 구조에 맞는 제목 단계. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** 화면에 표시할 섹션 제목. */
  title: string;
  children?: ReactNode;
};

/** 클라이언트 컴포넌트 경계 없이 의미 있는 section 요소를 렌더링합니다. */
const SectionWithHeader = ({ children, level = 2, title }: SectionWithHeaderProps) => {
  const Header = `h${level}` as const;

  return (
    <section className={styles.section}>
      <Header className={styles.title}>
        <span>{title}</span>
      </Header>
      {children}
    </section>
  );
};

export default SectionWithHeader;
