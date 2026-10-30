import { useState } from "react";
import dayjs from "dayjs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DatePicker, { useDatePickerSelection } from "../src/date-picker";

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: { docs: { source: { type: "dynamic" } } },
  args: { mode: "date", minimumDate: dayjs("2026-10-01"), maximumDate: dayjs("2026-11-30") },
  argTypes: { minimumDate: { control: false }, maximumDate: { control: false }, dateHandler: { control: false }, modalController: { control: false }, mode: { control: "radio", options: ["date", "range"] } },
  render: function Example(args) {
    const handler = useDatePickerSelection([dayjs("2026-10-15"), dayjs("2026-10-19")]);
    const controller = useState(false);
    return <><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
      <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
      <DatePicker {...args} dateHandler={handler} modalController={controller} />
    </>;
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: function SingleDate(args) {
  const handler = useDatePickerSelection([dayjs("2026-10-15"), dayjs("2026-10-15")]);
  const controller = useState(false);
  return <><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
    <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
    <DatePicker {...args} dateHandler={handler} modalController={controller} />
  </>;
} };
export const Range: Story = { args: { mode: "range" } };
export const Bounded: Story = { args: { minimumDate: dayjs("2026-10-10"), maximumDate: dayjs("2026-10-20") }, render: Default.render };
export const EmptyRange: Story = { args: { mode: "range", minimumDate: dayjs().startOf("month"), maximumDate: dayjs().endOf("month") }, render: function EmptyRange(args) {
  const handler = useDatePickerSelection([null, null]);
  const controller = useState(false);
  return <><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button>
    <output aria-label="선택 결과">{handler.startDate?.format("YYYY-MM-DD") ?? "미선택"} / {handler.endDate?.format("YYYY-MM-DD") ?? "미선택"}</output>
    <DatePicker {...args} dateHandler={handler} modalController={controller} />
  </>;
} };
export const InternalSelection: Story = { render: function InternalSelection(args) {
  const controller = useState(false);
  return <><button type="button" onClick={() => controller[1](true)}>날짜 선택 열기</button><DatePicker {...args} minimumDate={dayjs().startOf("month")} maximumDate={dayjs().endOf("month")} modalController={controller} /></>;
} };
