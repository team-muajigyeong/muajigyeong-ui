import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ControlledInput from "../src/controlled-input";

const meta = {
  title: "UI/ControlledInput", component: ControlledInput,
  argTypes: {
    "label": {
      description: "화면과 보조 기술에 제공하는 필드 이름.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "placeholder": {
      description: "값이 비어 있을 때 표시할 안내 문구.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "value": {
      description: "부모에서 전달하는 제어 값.",
      control: false,
      table: { type: { summary: "string" } },
    },
    "onChange": {
      description: "변경할 값을 전달합니다. 이 콜백에서 부모 상태를 갱신하세요.",
      control: false,
      table: { type: { summary: "(value: string) => void" } },
    },
    "type": {
      description: "입력 요소의 종류입니다.",
      control: false,
      table: { type: { summary: "HTMLInputTypeAttribute | undefined" } },
    },
    "readOnly": {
      description: "입력값을 읽기 전용으로 표시합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "disabled": {
      description: "사용자 입력을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "required": {
      description: "폼 제출 시 필수 입력으로 처리합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "maxLength": {
      description: "입력 가능한 최대 문자 수입니다.",
      control: "number",
      table: { type: { summary: "number | undefined" } },
    },
    "name": {
      description: "폼 전송에 사용할 입력 이름입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "id": {
      description: "입력 요소의 고유 ID입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "invalid": {
      description: "보조 기술에 입력값이 유효하지 않음을 알립니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "describedBy": {
      description: "오류 또는 도움말을 담은 요소의 ID.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "multiline": {
      description: "input 대신 textarea를 렌더링합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "rows": {
      description: "여러 줄 입력에서 표시할 행 수.",
      control: "number",
      table: { type: { summary: "number | undefined" } },
    },
  },
  args: { label: "이름", value: "", placeholder: "이름을 입력하세요", onChange: () => {} },
} satisfies Meta<typeof ControlledInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Multiline: Story = { name: "여러 줄 입력", args: { multiline: true, label: "설명", rows: 4 } };
export const Disabled: Story = { name: "비활성", args: { disabled: true, value: "비활성 입력" } };
export const Invalid: Story = { name: "유효하지 않은 입력", args: { invalid: true, required: true } };
export const Interactive: Story = { name: "상태 변경",
  render: function Interactive(args) {
    const [value, setValue] = useState(args.value);
    return <ControlledInput {...args} value={value} onChange={setValue} />;
  },
};
