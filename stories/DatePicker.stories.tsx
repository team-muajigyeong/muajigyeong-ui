import { useState } from "react";
import dayjs from "dayjs";
import { AlertDialog, type BaseDialogProps } from "../src/modal-dialogs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DatePicker, { useDatePickerSelection } from "../src/date-picker";
import "./date-picker.css";

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  argTypes: {
    initialRangeBoundary: {
      description: "기간 달력을 열 때 수정할 날짜입니다. 생략하면 자동으로 정합니다.",
      control: "radio", options: ["start", "end"],
      table: { type: { summary: '"start" | "end" | undefined' } },
    },
    title: {
      description: "대화상자 제목입니다. 기본값은 날짜 선택입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    headingLevel: {
      description: "화면의 제목 구조에 맞춘 단계입니다. 기본값은 2입니다.",
      control: "select", options: [1, 2, 3, 4, 5, 6],
      table: { type: { summary: "1 | 2 | 3 | 4 | 5 | 6 | undefined" } },
    },
    returnFocusRef: {
      description: "닫은 뒤 초점을 돌려줄 요소입니다.",
      control: false,
      table: { type: { summary: "RefObject<HTMLElement | null> | undefined" } },
    },
    "minimumDate": {
      description: "선택 가능한 가장 이른 날짜. 기본값은 1900-01-01입니다.",
      control: false,
      table: { type: { summary: "dayjs.Dayjs | undefined" } },
    },
    "maximumDate": {
      description: "선택 가능한 가장 늦은 날짜. 기본값은 오늘입니다.",
      control: false,
      table: { type: { summary: "dayjs.Dayjs | undefined" } },
    },
    "dateHandler": {
      description: "useDatePickerSelection이 반환한 선택 상태. 생략하면 내부에서 관리합니다.",
      control: false,
      table: { type: { summary: "ReturnType<typeof useDatePickerSelection> | undefined" } },
    },
    "modalController": {
      description: "부모에서 제어하는 열림 상태와 상태 변경 함수.",
      control: false,
      table: { type: { summary: "[boolean, (value: boolean) => void] | undefined" } },
    },
    "mode": {
      description: "하루 또는 양 끝 날짜를 포함한 기간 선택. 기본값은 date입니다.",
      control: "radio",
      options: ["date","range"],
      table: { type: { summary: "\"range\" | \"date\" | undefined" } },
    },
  },
  parameters: { docs: { source: { type: "dynamic" } } },
  args: { mode: "date", minimumDate: dayjs("2026-10-01"), maximumDate: dayjs("2026-11-30") },
  render: function Example(args) {
    const handler = useDatePickerSelection([dayjs("2026-10-15"), dayjs("2026-10-19")]);
    const controller = useState(false);
    return <div className="date-picker-example"><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
      <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
      <DatePicker {...args} dateHandler={handler} modalController={controller} />
    </div>;
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본", render: function SingleDate(args) {
  const handler = useDatePickerSelection([dayjs("2026-10-15"), dayjs("2026-10-15")]);
  const controller = useState(false);
  return <div className="date-picker-example"><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
    <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
    <DatePicker {...args} dateHandler={handler} modalController={controller} />
  </div>;
} };
export const Range: Story = { name: "기간 선택", args: { mode: "range" } };
export const Bounded: Story = { name: "날짜 제한", args: { minimumDate: dayjs("2026-10-10"), maximumDate: dayjs("2026-10-20") }, render: Default.render };
export const EmptyRange: Story = { name: "선택 전 기간", args: { mode: "range", minimumDate: dayjs().startOf("month"), maximumDate: dayjs().endOf("month") }, render: function EmptyRange(args) {
  const handler = useDatePickerSelection([null, null]);
  const controller = useState(false);
  return <div className="date-picker-example"><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
    <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
    <DatePicker {...args} dateHandler={handler} modalController={controller} />
  </div>;
} };
export const InternalSelection: Story = { name: "내부 선택 상태", render: function InternalSelection(args) {
  const controller = useState(false);
  return <div className="date-picker-example"><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button><DatePicker {...args} minimumDate={dayjs().startOf("month")} maximumDate={dayjs().endOf("month")} modalController={controller} /></div>;
} };


const FormOpener: BaseDialogProps["OpenButton"] = props => <button {...props} type="button">날짜 입력 폼 열기</button>;
/** 실제 앱처럼 폼과 공용 모달 안에서 사용해 날짜 선택이 저장을 실행하지 않는지 확인합니다. */
export const FormContext: Story = { name: "폼 안에서 날짜 선택", render: function FormDateSelection(args) {
  const outer = useState(false);
  const controller = useState(false);
  const handler = useDatePickerSelection([dayjs("2026-10-15"), dayjs("2026-10-15")]);
  const [submissions, setSubmissions] = useState(0);
  return <AlertDialog title="확인 기록 입력" OpenButton={FormOpener} modalController={outer}>
    <form className="date-picker-example-form" onSubmit={event => { event.preventDefault(); setSubmissions(value => value + 1); }}>
      <label>기록 이름 <input name="name" defaultValue="시설 확인" required /></label>
      <div className="date-picker-example">
        <button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
        <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
      </div>
      <button type="button" onClick={() => handler.setSelection([dayjs("2026-11-20"), dayjs("2026-11-20")])}>다른 확인일 불러오기</button>
      <DatePicker {...args} dateHandler={handler} modalController={controller} title="확인일 선택" headingLevel={3} />
      <button type="submit">기록 저장</button>
      <output aria-label="폼 제출 횟수">{submissions}</output>
    </form>
  </AlertDialog>;
} };

/** 시작일·종료일 입력란에 각각 달력 버튼을 연결할 때 쓰는 옵션입니다. */
export const StartDate: Story = { name: "시작일 바로 수정", args: { mode: "range", initialRangeBoundary: "start" } };
export const EndDate: Story = { name: "종료일 바로 수정", args: { mode: "range", initialRangeBoundary: "end" } };
