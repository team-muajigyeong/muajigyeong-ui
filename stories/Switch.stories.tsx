import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Switch from "../src/switch";

const meta = { title: "UI/Switch", component: Switch,
  argTypes: {
    "label": {
      description: "스위치에 연결된 화면 표시 이름.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "ariaLabel": {
      description: "화면 표시 이름 대신 사용할 접근 가능한 이름.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "icon": {
      description: "라벨과 함께 표시할 React 아이콘입니다.",
      control: false,
      table: { type: { summary: "ReactElement<IconType, string | JSXElementConstructor<any>> | undefined" } },
    },
    "pressed": {
      description: "부모에서 제어하는 상태. setPressed도 전달한 경우에만 적용됩니다.",
      control: false,
      table: { type: { summary: "boolean | undefined" } },
    },
    "labelClassName": {
      description: "바깥 label에 추가할 클래스. 기본 className은 input에 적용됩니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "setPressed": {
      description: "변경할 상태를 전달합니다. 부모에서 제어하려면 pressed와 함께 사용하세요.",
      control: false,
      table: { type: { summary: "Dispatch<SetStateAction<boolean>> | ((prev: boolean) => void) | undefined" } },
    },
    "onChangeCallback": {
      description: "내부·외부 상태 관리 모두에서 사용자 변경마다 다음 상태를 한 번 전달합니다.",
      control: false,
      table: { type: { summary: "((value: boolean) => void) | undefined" } },
    },
    "className": {
      description: "추가 CSS 클래스입니다.",
      control: false,
      table: { type: { summary: "string | undefined" } },
    },
    "checked": {
      description: "상속된 속성이지만 현재 checked는 pressed 또는 내부 상태로 결정됩니다.",
      control: false,
      table: { type: { summary: "boolean | undefined" } },
    },
    "disabled": {
      description: "사용자 입력을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "name": {
      description: "폼 입력 이름입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "required": {
      description: "폼 제출 시 필수 입력입니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "value": {
      description: "기본 input의 값입니다.",
      control: false,
      table: { type: { summary: "string | number | readonly string[] | undefined" } },
    },
    "onChange": {
      description: "내부 이벤트 핸들러가 우선합니다. 변경 알림은 onChangeCallback을 사용하세요.",
      control: false,
      table: { type: { summary: "ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined" } },
    },
    "defaultChecked": {
      description: "상속된 속성이지만 내부 상태의 초기값은 false입니다.",
      control: false,
      table: { type: { summary: "boolean | undefined" } },
    },
    "id": {
      description: "입력 요소의 고유 ID입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
  },
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
