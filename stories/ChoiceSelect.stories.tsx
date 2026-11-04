import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ChoiceSelect from "../src/choice-select";

const meta = {
  title: "UI/ChoiceSelect", component: ChoiceSelect,
  argTypes: {
    "value": {
      description: "부모에서 전달하는 제어 값.",
      control: false,
      table: { type: { summary: "string" } },
    },
    "options": {
      description: "선택 가능한 값과 화면에 표시할 이름 목록.",
      control: false,
      table: { type: { summary: "readonly ChoiceSelectOption[]" } },
    },
    "onChange": {
      description: "변경할 값을 전달합니다. 이 콜백에서 부모 상태를 갱신하세요.",
      control: false,
      table: { type: { summary: "(value: string) => void" } },
    },
    "placeholder": {
      description: "값이 비어 있을 때 표시할 안내 문구.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "ariaLabel": {
      description: "선택 컨트롤의 접근 가능한 이름.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "ariaDescribedBy": {
      description: "도움말을 담은 요소의 ID.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "disabled": {
      description: "사용자 입력을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
  },
  args: { value: "", placeholder: "선택하세요", ariaLabel: "표시 순서", options: [{ value: "recent", label: "최신순" }, { value: "name", label: "이름순" }], onChange: () => {} },
} satisfies Meta<typeof ChoiceSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Selected: Story = { name: "값 선택됨", args: { value: "recent" } };
export const Interactive: Story = { name: "상태 변경",
  render: function Interactive(args) {
    const [value, setValue] = useState(args.value);
    return <ChoiceSelect {...args} value={value} onChange={setValue} />;
  },
};
