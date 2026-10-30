import type { Meta, StoryObj } from "@storybook/react-vite";
import SectionWithHeader from "../src/section-with-header";
const meta = { title: "UI/SectionWithHeader", component: SectionWithHeader,
  args: { level: 2, title: "섹션 제목", children: "섹션 본문" } } satisfies Meta<typeof SectionWithHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Subsection: Story = { name: "하위 섹션", args: { level: 3 } };
