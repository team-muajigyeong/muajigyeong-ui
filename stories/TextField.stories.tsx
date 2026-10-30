import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AOSTextField } from "../src/text-field";

const meta = { title: "UI/TextField", component: AOSTextField,
  args: { label: "입력값" } } satisfies Meta<typeof AOSTextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Password: Story = { name: "비밀번호", args: { type: "password", label: "비밀번호" } };
export const Compact: Story = { name: "좁은 간격", args: { density: "compact" } };
export const Stacked: Story = { name: "상단 라벨", args: { labelPlacement: "stacked", icon: <span aria-hidden="true">@</span> } };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const ReadOnly: Story = { name: "읽기 전용", args: { readOnly: true, getValue: "읽기 전용" } };
export const Controlled: Story = { name: "외부 상태 제어", render: function Controlled(args) {
  const [value, setValue] = useState("초기값");
  return <><AOSTextField {...args} id="controlled-field" getValue={value} setValue={setValue} />
    <output>{value}</output><button onClick={() => setValue("")}>지우기</button></>;
} };
export const Multiple: Story = { name: "여러 인스턴스", render: function Multiple() {
  return <><AOSTextField label="첫 번째" /><AOSTextField label="두 번째" /></>;
} };
export const NativeControlled: Story = { name: "기본 입력 속성으로 제어", render: function NativeControlled(args) {
  const [value, setValue] = useState("");
  return <><AOSTextField {...args} labelPlacement="stacked" value={value} onChange={e => setValue(e.target.value)} />
    <output>{value}</output><button onClick={() => setValue("")}>지우기</button></>;
} };
