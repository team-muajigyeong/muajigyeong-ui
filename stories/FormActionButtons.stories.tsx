import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FormActionButtons from "../src/form-action-buttons";
const meta = { title: "UI/FormActionButtons", component: FormActionButtons,
  argTypes: {
    "cancelLabel": {
      description: "취소 버튼 문구입니다. 기본값은 취소입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "confirmLabel": {
      description: "확인 버튼 문구입니다. 기본값은 저장입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "onCancel": {
      description: "취소 동작 시 실행할 콜백입니다.",
      control: false,
      table: { type: { summary: "() => void" } },
    },
    "onConfirm": {
      description: "확인 버튼 클릭 시 실행할 콜백입니다.",
      control: false,
      table: { type: { summary: "() => void" } },
    },
    "confirmDisabled": {
      description: "확인 버튼을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "confirmBusy": {
      description: "작업 중에도 버튼에 초점을 둘 수 있지만 확인 동작은 실행하지 않습니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "cancelDisabled": {
      description: "취소 버튼을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "className": {
      description: "추가로 적용할 CSS 클래스입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "cancelButtonClassName": {
      description: "취소 버튼에 추가할 CSS 클래스. 사용하는 애플리케이션에서 정의합니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "confirmButtonClassName": {
      description: "확인 버튼에 추가할 CSS 클래스. 사용하는 애플리케이션에서 정의합니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "density": {
      description: "간격을 선택합니다. 기본값은 default입니다.",
      control: false,
      table: { type: { summary: "\"default\" | \"compact\" | undefined" } },
    },
  },
  args: { onCancel: () => {}, onConfirm: () => {} } } satisfies Meta<typeof FormActionButtons>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Compact: Story = { name: "좁은 간격", args: { density: "compact" } };
export const Busy: Story = { name: "처리 중", args: { confirmBusy: true, confirmLabel: "저장 중" } };
export const Disabled: Story = { name: "비활성", args: { confirmDisabled: true, cancelDisabled: true } };
export const Interactive: Story = { name: "상태 변경", render: function Interactive(args) {
  const [confirmed, setConfirmed] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [busy, setBusy] = useState(false);
  return <><label><input type="checkbox" checked={busy} onChange={e => setBusy(e.target.checked)} />처리 중</label>
    <FormActionButtons {...args} confirmBusy={busy} cancelButtonClassName="consumer-cancel" confirmButtonClassName="consumer-confirm"
      onCancel={() => setCancelled(n => n + 1)} onConfirm={() => setConfirmed(n => n + 1)} />
    <output>확인 {confirmed}, 취소 {cancelled}</output></>;
} };
