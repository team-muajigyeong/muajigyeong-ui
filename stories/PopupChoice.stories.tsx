import type { Meta, StoryObj } from "@storybook/react-vite";
import { PopupChoice } from "../src/popup-choice";
const meta = { title: "UI/PopupChoice", component: PopupChoice,
  args: { label: "Choose option", name: "choice", options: ["Alpha", "Beta", "Gamma"] },
} satisfies Meta<typeof PopupChoice>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { options: [] } };
export const Multiple: Story = { render: function Multiple(args) {
  return <><PopupChoice {...args} name="first" label="First choice" /><PopupChoice {...args} name="second" label="Second choice" /></>;
} };
