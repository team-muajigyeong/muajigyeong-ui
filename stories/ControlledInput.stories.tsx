import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ControlledInput from "../src/controlled-input";

const meta = {
  title: "UI/ControlledInput", component: ControlledInput,
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
