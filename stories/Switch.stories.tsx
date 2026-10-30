import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Switch from "../src/switch";

const meta = { title: "UI/Switch", component: Switch,
  args: { label: "알림 사용" } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Controlled: Story = { name: "외부 상태 제어", render: function Controlled(args) {
  const [pressed, setPressed] = useState(true);
  const [changes, setChanges] = useState(0);
  return <><Switch {...args} id="controlled-switch" pressed={pressed} setPressed={setPressed}
    labelClassName="consumer-label" className="consumer-input"
    onChangeCallback={() => setChanges(n => n + 1)} />
    <output>상태 {String(pressed)}, 변경 {changes}</output>
    <button onClick={() => setPressed(true)}>외부에서 켜기</button></>;
} };
export const CallbackControlled: Story = { name: "콜백으로 상태 제어", render: function CallbackControlled(args) {
  const [pressed, setPressed] = useState(true);
  return <><Switch {...args} pressed={pressed} setPressed={() => undefined} onChangeCallback={setPressed} />
    <output>{String(pressed)}</output></>;
} };
export const Multiple: Story = { name: "여러 인스턴스", render: function Multiple() {
  return <><Switch label="첫 번째" /><Switch label="두 번째" ariaLabel="두 번째 설정" /></>;
} };
