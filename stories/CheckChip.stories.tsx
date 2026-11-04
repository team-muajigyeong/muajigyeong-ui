import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckChip from "../src/check-chip";

const meta = {
  title: "UI/CheckChip", component: CheckChip,
  argTypes: {
    "label": {
      description: "화면과 보조 기술에 제공하는 필드 이름.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "description": {
      description: "입력 요소에 연결할 추가 설명.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "checked": {
      description: "부모에서 제어하는 선택 상태.",
      control: false,
      table: { type: { summary: "boolean" } },
    },
    "onChange": {
      description: "변경할 값을 전달합니다. 이 콜백에서 부모 상태를 갱신하세요.",
      control: false,
      table: { type: { summary: "(checked: boolean) => void" } },
    },
  },
  args: { label: "알림 받기", description: "선택 옵션에 대한 설명", checked: false, onChange: () => {} },
} satisfies Meta<typeof CheckChip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Checked: Story = { name: "선택됨", args: { checked: true } };
export const Interactive: Story = { name: "상태 변경",
  render: function Interactive(args) {
    const [checked, setChecked] = useState(args.checked);
    return <CheckChip {...args} checked={checked} onChange={setChecked} />;
  },
};
