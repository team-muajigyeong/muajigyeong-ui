import type { Meta, StoryObj } from "@storybook/react-vite";
import Accordion from "../src/accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  args: { items: [{ id: "first", title: "사용 방법", content: "제목을 클릭하거나 Enter 또는 Space를 누르세요." }, { id: "second", title: "여러 항목", content: "한 번에 하나의 패널이 열립니다." }] },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const NestedHeading: Story = { name: "하위 제목 단계",
  args: { headingLevel: 5 },
  render: (args) => <section><h4>여행 일정</h4><Accordion {...args} /></section>,
};
export const Empty: Story = { name: "빈 목록", args: { items: [] } };
