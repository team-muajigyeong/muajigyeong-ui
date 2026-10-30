import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ChoiceSelect from "../src/choice-select";

const meta = {
  title: "UI/ChoiceSelect", component: ChoiceSelect,
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
