import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AOSTextField } from "../src/text-field";

const meta = { title: "UI/TextField", component: AOSTextField,
  argTypes: {
    "ref": {
      description: "실제 input 요소에 연결할 React ref입니다.",
      control: false,
      table: { type: { summary: "Ref<HTMLInputElement> | undefined" } },
    },
    "autoComplete": {
      description: "브라우저 자동 완성 힌트입니다.",
      control: false,
      table: { type: { summary: "HTMLInputAutoCompleteAttribute | undefined" } },
    },
    "disabled": {
      description: "사용자 입력을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "maxLength": {
      description: "최대 입력 문자 수입니다.",
      control: "number",
      table: { type: { summary: "number | undefined" } },
    },
    "name": {
      description: "폼 입력 이름입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "placeholder": {
      description: "값이 비었을 때 표시할 안내 문구입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "readOnly": {
      description: "읽기 전용 입력으로 표시합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "required": {
      description: "폼 제출 시 필수 입력입니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "type": {
      description: "입력 요소 종류입니다.",
      control: false,
      table: { type: { summary: "\"email\" | \"tel\" | \"search\" | \"text\" | \"date\" | \"password\" | \"url\" | undefined" } },
    },
    "value": {
      description: "기본 input의 값입니다.",
      control: false,
      table: { type: { summary: "string | number | readonly string[] | undefined" } },
    },
    "onChange": {
      description: "기본 input 변경 이벤트입니다. value와 함께 사용하세요.",
      control: false,
      table: { type: { summary: "ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined" } },
    },
    "defaultValue": {
      description: "기본값 속성입니다. 내부 value가 지정되므로 초기값은 getValue 또는 value로 제어하세요.",
      control: false,
      table: { type: { summary: "string | number | readonly string[] | undefined" } },
    },
    "className": {
      description: "바깥 label에 추가할 CSS 클래스입니다.",
      control: false,
      table: { type: { summary: "string | undefined" } },
    },
    "id": {
      description: "입력 요소의 고유 ID입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "label": {
      description: "입력 요소에 연결된 화면 표시 이름.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "icon": {
      description: "라벨과 함께 표시할 React 아이콘입니다.",
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
    "getValue": {
      description: "부모에서 제어하는 입력값. setValue와 함께 사용하고 기본 value/onChange와 혼용하지 마세요.",
      control: false,
      table: { type: { summary: "string | undefined" } },
    },
    "setValue": {
      description: "getValue를 갱신하는 부모 상태 변경 함수. 내부 상태를 사용하려면 두 속성을 모두 생략하세요.",
      control: false,
      table: { type: { summary: "Dispatch<SetStateAction<string>> | undefined" } },
    },
    "density": {
      description: "기본 또는 좁은 입력 필드 간격.",
      control: false,
      table: { type: { summary: "\"default\" | \"compact\" | undefined" } },
    },
    "labelPlacement": {
      description: "떠 있는 라벨 또는 입력 위에 배치하는 라벨.",
      control: false,
      table: { type: { summary: "\"floating\" | \"stacked\" | undefined" } },
    },
  },
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
