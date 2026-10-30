import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckChip from "../src/check-chip";

const meta = {
  title: "UI/CheckChip", component: CheckChip,
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
