# DatePicker

작성 중이던 Calendar를 DatePicker로 정리했다. 공개 경로는 `@muajigyeong/ui/date-picker`이며,
루트에서도 DatePicker, useDatePickerSelection, DatePickerProps, DateRange를 가져올 수 있다.
아직 게시되지 않았던 Calendar·CalendarSample·useCalenderSelection 이름은 공개하지 않는다.
CSS 내부 calendar 클래스와 기존 디자인·선택 로직·주석은 유지한다.

## 기간 선택 예제

```tsx
"use client";

import { useState } from "react";
import dayjs from "dayjs";
import DatePicker, { useDatePickerSelection } from "@muajigyeong/ui/date-picker";
import "@muajigyeong/ui/theme.css";

export default function DateSelection() {
  const controller = useState(false);
  const handler = useDatePickerSelection([dayjs("2026-10-15"), dayjs("2026-10-19")]);
  return <>
    <button type="button" onClick={() => controller[1](true)}>날짜 선택</button>
    <DatePicker mode="range" minimumDate={dayjs("2026-10-01")} maximumDate={dayjs("2026-11-30")}
      dateHandler={handler} modalController={controller} />
    <output>{handler.startDate?.format("YYYY-MM-DD")} / {handler.endDate?.format("YYYY-MM-DD")}</output>
  </>;
}
```

mode="date"는 하루를 선택하고 양쪽 값에 같은 날짜를 저장한다. 이미 선택한 날짜를 다시 누르면 해제된다.
mode="range"는 시작·종료를 순서대로 선택한다. 시작보다 이른 날짜를 고르면 새 시작으로 바뀐다.
완료된 기간에서 날짜를 누르면 새 기간을 시작하며, 위의 시작/종료 카드를 누르면 해당 끝점을 수정한다.
선택은 즉시 handler에 반영된다. 닫기나 Escape는 선택을 되돌리지 않는다.

minimumDate·maximumDate는 Dayjs 값이고 양 끝 날짜를 포함한다. 기본값은 1900-01-01과 오늘이다.
최초 선택값도 이 범위에 맞춰 전달한다. 날짜 제한은 선택을 막으며 월 이동 자체를 제한하지 않는다.
dateHandler를 생략하면 내부 선택 상태를 사용한다. 처음부터 미선택 상태는 useDatePickerSelection([null, null])이다.
외부 열기 버튼에서 modalController를 true로 변경한다. 닫기 버튼과 Escape는 false로 변경한다.
모달은 기본적으로 닫혀 있으며 열기 버튼 자체는 소비자가 제공한다.

## Storybook

UI / DatePicker에 Default, Range, Bounded, EmptyRange, InternalSelection 예제를 제공한다.
실제 DatePicker를 문서 대상으로 지정해 props와 JSDoc을 표시한다. Dayjs와 상태 객체는 Controls에서
일반 JSON으로 편집하지 않으며 예제 코드에서 생성한다. 소스 보기는 실제 DatePicker JSX를 보여준다.
CalendarSample은 패키지 구현에서 분리하고 Storybook의 열기 버튼·결과 표시 예제로 대체했다.

## 보완 및 검증 — 2026-10-30

- ESM의 use client 경계, 공개 타입·export, dayjs·classnames 의존성을 추가했다.
- 조건부 훅 호출을 제거하고 닫기 버튼 및 Escape를 모달 상태와 연결했다.
- 고유 제목 ID를 연결해 대화상자 이름을 제공하고 요일 헤더에 row 역할을 추가했다.
- UI 타입 검사·ESM 빌드·Storybook 정적 빌드, 12개 컴포넌트 및 색상표 브라우저 회귀 검증 통과.
- 단일 날짜·해제·기간 시작/종료 수정·날짜 제한·월 이동·키보드·닫기/재열기·포커스 복귀 검증 통과.
- 390px 모바일 표시와 기존 기간 선택 디자인을 확인했다.

```bash
npm run typecheck
npm run test:browser
npm pack
```

설치된 Edge를 쓰려면 PowerShell에서 $env:PLAYWRIGHT_CHANNEL = 'msedge'를 지정한다.


## 0.5.1 적용 전 보완 — 2026-11-02

- 날짜와 월 이동을 포함한 모든 버튼을 `type="button"`으로 지정했다. 폼 안의 달력 조작으로 저장이나 검색이 실행되지 않는다.
- 열면 현재 선택일에 초점을 둔다. 미선택일 때는 오늘을 기준으로 하되 날짜 제한 범위 안에서 시작한다. 닫은 동안 외부에서 값을 바꾸면 다시 열 때 새 날짜를 표시한다.
- 날짜 격자에는 Tab 정지점이 하나만 있다. 좌우 방향키는 하루, 상하 방향키는 일주일, Home/End는 일요일/토요일, Page Up/Down은 이전/다음 달, Shift+Page Up/Down은 이전/다음 해로 이동한다. 월·연도 이동 시 없는 날짜는 해당 월의 마지막 날짜로 이동한다.
- Enter/Space는 날짜를 선택한다. 제한 밖 날짜도 탐색해 안내를 들을 수 있지만 선택은 할 수 없다. 월 이동 자체를 제한하지 않는 기존 동작을 유지한다.
- 날짜 이름에 연도를 포함하고, 월 변경은 polite live 영역으로 알린다. 기간을 선택하면 기간 안의 날짜에도 선택 상태를 제공한다.
- 다른 공용 모달과 같은 내부 초점 관리 훅을 사용한다. Tab/Shift+Tab은 열린 창 안에서 순환하고 Escape는 현재 달력만 닫는다.
- `title`로 대화상자의 용도를 설명하고, `headingLevel`로 제목 단계를 지정할 수 있다. 기본 제목 단계는 기존 h1에서 h2로 바뀌었다. `returnFocusRef`는 열기 버튼이 교체될 때 사용할 복귀 요소다.
- 고정 320px 콘텐츠 너비를 제거했다. 달력은 화면 폭 안에 들어오며 큰 글자에서는 세로 스크롤로 내용을 확인한다.
- 기존 Storybook에 ‘폼 안에서 날짜 선택’ 예제를 추가했다. 공용 모달 안의 폼, 명시적인 저장, 외부에서 확인일 불러오기를 함께 제공한다.

### 무아지경에 연결할 때 유지할 계약

선택은 즉시 `dateHandler`에 반영되며 닫기/Escape가 값을 되돌리지 않는 기존 계약은 유지한다.
‘기간 적용’이나 ‘저장’ 때 확정하는 화면에서는 별도의 임시 선택 상태를 전달하고, 확정 시에만 실제 값에 반영한다.
여행 일정에서는 `maximumDate`를 지정해 미래 날짜를 허용한다. 확인일 입력은 한국 시간 기준 오늘을 상한으로 전달한다.
필수 여부, 빈 값, 오류 안내, `YYYY-MM-DD` 변환과 서버 검사는 소비 앱에서 유지한다.

키보드 동작 참고: [W3C APG 날짜 선택 대화상자](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/).
자동 검사는 실제 NVDA·센스리더의 음성 낭독 검사를 대신하지 않는다.


### 보완 후 검증 결과

2026-11-02에 타입 검사, ESM·타입 선언 빌드, Storybook 정적 빌드와 기존 12개 컴포넌트 브라우저 검사를 통과했다.
DatePicker는 폼 제출 방지(마우스·Enter·Space), 단일 Tab 정지점, 방향키·Home/End·월/연도 이동,
월말 보정, 선택 제한, 기간 양 끝 수정, 중첩 모달의 Escape·초점 복귀, 외부 값 변경 후 재열기를 검사했다.
320px·390px 및 글자 100%·200%에서 대화상자가 화면 가로 범위를 넘지 않는지 확인했으며 밝은/어두운 화면도 확인했다.
0.5.1은 무아지경의 날짜 입력 교체를 위한 배포 버전이다. Storybook의 열기 버튼과 선택 날짜 사이에 간격을 두고, 좁은 화면에서는 줄바꿈되도록 보완했다. 소비 앱은 이 버전의 검증된 원격 커밋을 고정해서 설치한다.

## 0.5.2 시작일·종료일별 열기

`initialRangeBoundary="start"` 또는 `"end"`로 열 때 수정할 날짜를 지정한다.
각각 현재 시작일 또는 종료일에 초점을 두며 해당 날짜를 바로 수정한다. 시작일이 비어 있으면 먼저 시작일을 선택하도록 안내한다.
선택한 뒤에도 기간 안의 다른 날짜를 이어서 고르는 기존 기능은 유지한다. 이 옵션은 열 때만 적용되며 기존 사용처의 기본 동작은 바뀌지 않는다.
Storybook의 기존 DatePicker 문서에 ‘시작일 바로 수정’·‘종료일 바로 수정’을 추가했다.

## 0.5.3 닫기 키 안내 — 2026-11-02

키보드 도움말에 `Escape(ESC)로 닫습니다.`를 표시한다. 키 이름을 키보드 표기와 함께 알아볼 수 있도록 한 문구 보완이며 닫기·기간 선택 동작은 바뀌지 않는다.

무아지경 앱은 0.5.3 기능 커밋 `c7343ee2f9afa6c21b69552966e4e5abbbffcf68`을 고정해 사용한다. 앱에서 기본 네이티브 날짜 입력과 공용 달력을 함께 제공하고 시작일·종료일의 각 버튼이 `initialRangeBoundary`를 전달한다. 날짜의 필수 여부·미래 상한·저장 처리는 앱에서 관리한다.
