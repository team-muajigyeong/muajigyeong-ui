import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import StatusToast from "../src/status-toast";
const meta = { title: "UI/StatusToast", component: StatusToast,
  argTypes: {
    "message": {
      description: "화면에 표시할 메시지. 빈 문자열이면 토스트를 숨깁니다.",
      control: "text",
      table: { type: { summary: "string" } },
    },
    "announcement": {
      description: "보조 기술에 전달할 별도 안내 문구.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "duration": {
      description: "표시 시간(밀리초). 기본값은 5000입니다.",
      control: "number",
      table: { type: { summary: "number | undefined" } },
    },
    "notificationId": {
      description: "같은 메시지를 다시 표시하려면 이 값을 변경하세요.",
      control: false,
      table: { type: { summary: "string | number | undefined" } },
    },
    "className": {
      description: "위치를 포함해 사용하는 쪽에서 지정하는 스타일.",
      control: false,
      table: { type: { summary: "string | undefined" } },
    },
    "tone": {
      description: "알림 종류입니다. error는 긴급 알림으로 전달합니다.",
      control: false,
      table: { type: { summary: "\"default\" | \"error\" | undefined" } },
    },
  },
  args: { message: "저장했습니다", duration: 5000 } } satisfies Meta<typeof StatusToast>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Error: Story = { name: "오류", args: { message: "저장하지 못했습니다", tone: "error" } };
export const Announcement: Story = { name: "보조 기술 안내", args: { announcement: "변경한 내용을 저장했습니다" } };
export const Repeat: Story = { name: "메시지 반복", args: { duration: 2000 }, render: function Repeat(args) {
  const [notificationId, setNotificationId] = useState(0);
  return <><button onClick={() => setNotificationId(n => n + 1)}>같은 메시지 다시 알림</button>
    <StatusToast {...args} notificationId={notificationId} /></>;
} };
