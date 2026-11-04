import type { Meta, StoryObj } from "@storybook/react-vite";
import SectionWithHeader from "../src/section-with-header";
const meta = { title: "UI/SectionWithHeader", component: SectionWithHeader,
  argTypes: {
    "level": {
      description: "사용하는 문서의 구조에 맞는 제목 단계.",
      control: false,
      table: { type: { summary: "2 | 1 | 3 | 4 | 5 | 6" } },
    },
    "title": {
      description: "화면에 표시할 섹션 제목.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "children": {
      description: "본문으로 표시할 React 콘텐츠입니다.",
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
  },
  args: { level: 2, title: "섹션 제목", children: "섹션 본문" } } satisfies Meta<typeof SectionWithHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Subsection: Story = { name: "하위 섹션", args: { level: 3 } };
