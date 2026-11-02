import { useState } from "react";
import dayjs from "dayjs";
import { AlertDialog, type BaseDialogProps } from "../src/modal-dialogs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DatePicker, { useDatePickerSelection } from "../src/date-picker";
import "./date-picker.css";

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: { docs: { source: { type: "dynamic" } } },
  args: { mode: "date", minimumDate: dayjs("2026-10-01"), maximumDate: dayjs("2026-11-30") },
  argTypes: { minimumDate: { control: false }, maximumDate: { control: false }, dateHandler: { control: false }, modalController: { control: false }, mode: { control: "radio", options: ["date", "range"] } },
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
