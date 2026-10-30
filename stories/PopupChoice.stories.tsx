import type { Meta, StoryObj } from "@storybook/react-vite";
import { PopupChoice } from "../src/popup-choice";
const meta = { title: "UI/PopupChoice", component: PopupChoice,
  args: { label: "항목 고르기", name: "choice", options: ["항목 가", "항목 나", "항목 다"] },
} satisfies Meta<typeof PopupChoice>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Empty: Story = { name: "빈 목록", args: { options: [] } };
export const Multiple: Story = { name: "여러 인스턴스", render: function Multiple(args) {
  return <><PopupChoice {...args} name="first" label="첫 번째 선택" /><PopupChoice {...args} name="second" label="두 번째 선택" /></>;
} };
