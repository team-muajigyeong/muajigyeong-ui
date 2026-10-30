# @muajigyeong/ui

React 19 공통 UI 패키지. ESM 전용이며 CSS Modules를 지원하는 번들러가 필요합니다.
Next.js에 의존하지 않고 React는 사용하는 앱에서 제공합니다.

## 설치와 사용

이 저장소에서는 `npm ci`로 개발 의존성을 설치하고 패키지를 빌드합니다.
소비 프로젝트에서는 `npm pack`으로 생성한 tgz를 `npm install <파일 경로>`로 설치합니다.
원격은 `git@mua:team-muajigyeong/muajigyeong-ui.git`입니다.
SSH config의 `mua` 별칭을 사용하는 Git 패키지로 설치할 수 있습니다.
아직 npm 레지스트리에 배포되지 않았습니다.

```bash
npm install --save-exact "git+ssh://git@mua/team-muajigyeong/muajigyeong-ui.git#FULL_COMMIT_SHA"
```

FULL_COMMIT_SHA는 원격 master의 실제 전체 커밋 해시로 바꿉니다.
앱의 package.json과 package-lock.json에 선택한 커밋을 함께 기록합니다.

```tsx
"use client";

import { useState } from "react";
import CheckChip from "@muajigyeong/ui/check-chip";
import ControlledInput from "@muajigyeong/ui/controlled-input";
import ChoiceSelect from "@muajigyeong/ui/choice-select";
import Accordion from "@muajigyeong/ui/accordion";
import "@muajigyeong/ui/theme.css";

export default function Example() {
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  return (
    <>
      <CheckChip label="알림 받기" checked={checked} onChange={setChecked} />
      <ControlledInput label="이름" value={name} onChange={setName} />
      <ChoiceSelect
        value={order}
        onChange={setOrder}
        placeholder="선택하세요"
        ariaLabel="표시 순서"
        options={[{ value: "recent", label: "최신순" }]}
      />
      <Accordion items={[{ id: "help", title: "도움말", content: "안내 내용" }]} />
    </>
  );
}
```

루트에서 `import { CheckChip, type CheckChipProps } from "@muajigyeong/ui"`도 가능합니다.
각 하위 경로에서도 default 컴포넌트와 해당 Props 타입을 제공합니다.

## 스타일 계약

CSS Modules는 컴포넌트가 자동으로 불러옵니다. `theme.css`는 선택 사항이며
기존 무아지경 앱은 globals.css의 변수를 사용하므로 추가로 import하지 않습니다.
테마를 직접 제공할 때 필요한 변수:

`--color-border`, `--color-surface`, `--color-text`, `--color-body`,
`--color-textfield-border`, `--teal-400`, `--teal-500`, `--teal-700`,
`--sand-100`, `--sand-800`. `--color-focus`는 선택 사항입니다.

소비자가 폰트와 전역 box-sizing을 관리합니다. 패키지는 전역 reset을 적용하지 않습니다.
light-dark(), color-mix(), :has()를 지원하는 브라우저를 대상으로 합니다.

## 상태와 접근성

- CheckChip, ChoiceSelect, ControlledInput은 부모가 상태를 갱신해야 합니다.
- ChoiceSelect에는 구분 가능한 ariaLabel과 고유한 option value를 제공합니다.
- Accordion item id는 목록 안에서 고유해야 합니다.
- Accordion 제목은 기본적으로 h3입니다. 상위 제목에 맞춰 `<Accordion items={items} headingLevel={5} />`처럼 1~6단계를 지정할 수 있습니다. 지정한 인스턴스의 HTML 제목 단계만 변경되며 기존 스타일과 다른 사용처의 기본 h3는 유지됩니다.
- 입력 오류는 invalid와 describedBy를 통해 설명 요소에 연결합니다.
- 기존 동작과 스타일을 옮긴 단계이며 접근성 인증을 의미하지 않습니다.

## 개발 및 문서

이 독립 저장소에서 `npm run storybook`으로 예제와 props 문서를 열 수 있습니다.
`npm run build:docs`는 `storybook-static/`에 정적 문서를 생성합니다.
`npm run build`는 ESM, 타입 선언, CSS를 dist에 생성합니다.
`npm run typecheck`는 컴포넌트와 Storybook 예제·설정을 검사합니다.
UI 수정 후 소비 앱에는 새 패키지 버전을 설치해 반영합니다.

공통 구현은 이 패키지에서만 수정합니다. 기존 앱 위치에 복사본을 만들지 않습니다.
새 설명은 JSDoc으로 작성하고 stories를 함께 갱신합니다.

## 저장소 운영

이 저장소는 무아지경 앱의 packages/ui 이력을 추출해 만들었습니다.
src에는 공통 UI, stories에는 예제, .storybook에는 문서 설정만 둡니다.
앱 라우트, 업무 데이터, 환경 변수는 포함하지 않습니다.

1. 이 저장소에서 컴포넌트와 JSDoc, stories를 수정합니다.
2. `npm run typecheck`, `npm run build`, `npm run build:docs`를 실행합니다.
3. 변경에 맞춰 package.json 버전을 올리고 `npm pack`을 실행합니다.
4. 배포 경로가 정해지면 레지스트리에 게시하거나 불변 Git 커밋을 사용합니다.
5. 앱에서 의존성 버전과 lockfile을 갱신하고 앱 빌드를 검증합니다.

Git 의존성을 사용할 때는 prepare가 설치 시 ESM을 빌드합니다.
접근 가능한 원격 URL과 고정 커밋이 필요하며 private 저장소는 CI에도 읽기 권한이 필요합니다.
원격 저장소는 위 SSH 주소로 확정되었습니다. 레지스트리 게시 위치는 미정입니다.

앱 전환과 원격 설치 절차는 [저장소 동기화 안내](REPOSITORY-SYNC.md)를 참고하세요.

## 0.2.0 추가 컴포넌트

SectionWithHeader, FormActionButtons, StatusToast를 추가했습니다.
[사용 예제와 앱 이전 안내](docs/0.2.0.md)를 참고하세요.
버튼별 스타일은 cancelButtonClassName/confirmButtonClassName으로 전달합니다.
토스트를 같은 문구로 다시 표시하려면 notificationId를 바꿉니다.
기본 테마에는 새 컴포넌트가 사용하는 --teal-900이 포함됩니다.

브라우저 검증: npm run test:browser. 최초 npx playwright install chromium을 실행하거나
설치된 Edge를 쓰려면 PLAYWRIGHT_CHANNEL=msedge를 환경 변수로 지정합니다.

## 0.3.0 입력 컴포넌트

AOSTextField와 Switch를 추가했습니다. [사용법·호환성·검증](docs/0.3.0.md)을 참고하세요.
단순 입력과 textarea에는 ControlledInput, 떠 있는 라벨·아이콘·비밀번호 전환에는
AOSTextField를 사용합니다. 기존 getValue/setValue 및 pressed/setPressed API를 유지합니다.
추가 테마 변수는 --sand-500, --teal-200, --teal-300, --color-button-accent입니다.

## Storybook 소스 보기의 컴포넌트 이름

문서 생성기가 기본 export의 이름을 index.tsx 상위 폴더명에서 추론하면
소스 보기에 <accordion>처럼 소문자 이름이 표시될 수 있습니다.
.storybook/main.ts의 componentNameResolver는 TypeScript 선언에서 실제 React 이름을
가져오므로 함수 선언과 화살표 함수 모두 <Accordion>, <SectionWithHeader>처럼 표시합니다.
컴포넌트 구현과 ESM 공개 API는 변경하지 않습니다.

2026-09-16 검증: npm run typecheck와 npm run build:docs 통과.
PLAYWRIGHT_CHANNEL=msedge 환경에서 scripts/verify-components.mjs로 기존 동작과
아홉 컴포넌트의 모든 문서 예제에서 JSX 이름 표시를 확인했습니다.
향후 npm run test:browser에서도 이 회귀 검증을 실행합니다.

## 0.4.0 대화상자

AlertDialog와 PopupChoice를 추가했습니다. [사용법·분리 범위·검증](docs/0.4.0.md)을 참고하세요.
Storybook에서 제어 상태, 제목 포커스, 중첩 모달, 긴 내용과 선택 취소를 확인할 수 있습니다.

0.4.1은 최신 앱의 returnFocusRef·숨김 트리거 복귀 개선까지 포함합니다.

## 전체 색상표 (0.4.2)

앱의 공통 색상 변수 52개를 theme.css로 제공합니다. [사용법과 동기화](docs/colors.md)를 참고하세요.
Storybook의 Design Tokens / Colors에서 밝은 모드·어두운 모드 견본과 변수명을 확인할 수 있습니다.

## DatePicker (0.5.0)

Calendar를 DatePicker로 정리했습니다. [사용법과 변경 사항](docs/date-picker.md)을 참고하세요.
Storybook UI / DatePicker에서 단일 날짜·기간·선택 제한·미선택·내부 상태 예제를 확인할 수 있습니다.

## Docs 시스템 테마

Docs의 본문·미리보기·props 표·소스 영역은 시스템의 밝은/어두운 테마를 따릅니다.
열린 문서에서도 시스템 설정 변경을 즉시 반영합니다. `.storybook/SystemDocsContainer.tsx`에서
표준 DocsContainer의 테마를 선택하며 메뉴 UI 설정과 독립적으로 동작합니다.
`npm run test:browser`에서 최초 로드·실시간 전환·새로고침을 검증합니다.
