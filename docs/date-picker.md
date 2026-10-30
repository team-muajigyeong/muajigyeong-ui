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
