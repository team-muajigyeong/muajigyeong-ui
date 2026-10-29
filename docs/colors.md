# 전체 공통 색상표

본 프로젝트의 `src/app/globals.css`를 기준으로 52개 변수를 동기화했다.
브랜드 2개, Sand 11개, Teal 12개, Coral 11개, 용도별 색상 15개와 배경 표현식 1개다.
색상 이름과 값, 기존 주석을 보존했다. 앱 전역 CSS는 변경하지 않았다.
개별 화면의 전용 변수와 직접 지정한 색상 값은 공통 색상표에 포함하지 않는다.

## 직접 컴포넌트 만들기

독립 프로젝트의 진입점에서 테마를 한 번 불러온다. UI 저장소 Storybook은 이미 가져온다.

```tsx
import "@muajigyeong/ui/theme.css";
```

```css
.my-card {
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}
.my-button {
  color: var(--color-on-primary);
  background-color: var(--color-primary);
}
.my-accent { border-color: var(--coral-500); }
```

일반 UI에는 용도별 --color-* 변수를 사용하면 밝은 모드와 어두운 모드에 대응한다.
--sand-*, --teal-*, --coral-* 및 --brand-*는 고정 색상이다.
기본 color-scheme은 light dark로 시스템 설정을 따른다.
html에 theme-light 또는 theme-dark 클래스를 지정해 모드를 고정할 수 있다.

Storybook의 **Design Tokens / Colors**에서 전체 이름과 원래 CSS 값을 확인한다.
Light, Dark, Comparison 예제로 두 모드의 실제 색상을 비교할 수 있다.
--bg-linear-gradient는 앱의 기존 표현식을 그대로 제공한다. light-dark() 안의
linear-gradient()는 색상 값이 아니므로 브라우저에서 유효한 배경 이미지로 처리되지 않을 수 있다.
이 항목은 색상 견본 대신 원문을 표시하며, 이번 동기화에서 앱의 표현식을 변경하지 않았다.

## 다시 동기화하기

UI 저장소에서 실행한다. 앱 경로가 다르면 인수를 변경한다.

```bash
npm run sync:colors -- ../muajigyeong/src/app/globals.css
npm run sync:colors -- ../muajigyeong/src/app/globals.css --check
```

첫 명령은 src/theme.css와 Storybook 색상 메타데이터를 함께 갱신한다.
--check는 파일을 수정하지 않고 앱 원본과 다르면 실패한다.
색상표 영역의 마커가 변경되거나 정의되지 않은 색상 변수를 참조하면 실패해 수동 확인을 요구한다.
패키지는 빌드된 dist/theme.css를 기존 theme.css export로 제공한다. 새 런타임 의존성은 없다.
