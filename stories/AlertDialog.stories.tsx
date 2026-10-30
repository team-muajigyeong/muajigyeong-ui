import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, type BaseDialogProps } from "../src/modal-dialogs";
import { PopupChoice } from "../src/popup-choice";

const OpenButton: BaseDialogProps["OpenButton"] = props => <button {...props} type="button">대화상자 열기</button>;
const meta = { title: "UI/AlertDialog", component: AlertDialog,
  args: { title: "대화상자 예제", OpenButton, children: <><label>대화상자 입력<input /></label><button type="button">본문의 마지막 동작</button></> },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const TitleFocus: Story = { name: "제목에 초기 초점", args: { options: { initialFocus: "title" } } };
export const HiddenTitle: Story = { name: "제목 숨김", args: { options: { hideTitle: true } } };
export const CloseAtStart: Story = { name: "닫기 버튼 우선 배치", args: { options: { closeButtonPlacement: "start" } } };
export const Controlled: Story = { name: "외부 상태 제어", render: function Controlled(args) {
  const controller = useState(false);
  const [cancelCount, setCancelCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  return <><AlertDialog {...args} modalController={controller}
    OpenButton={OpenButton}
    CloseButton={props => <button {...props} type="button">닫기</button>}
    onCancel={() => setCancelCount(n => n + 1)} onAfterClose={() => setClosedCount(n => n + 1)}
    className="consumer-dialog" bodyProps={{ className: "consumer-body", role: "region", "aria-label": "대화상자 본문" }}>
    <button type="button" onClick={() => controller[1](false)}>확인</button>
  </AlertDialog><output>취소 {cancelCount}, 닫힘 {closedCount}</output>
  <button type="button" onClick={() => controller[1](true)}>외부에서 열기</button></>;
} };
export const Nested: Story = { name: "중첩 대화상자", args: { children: <>
  <AlertDialog title="내부 대화상자" OpenButton={props => <button {...props} type="button">내부 대화상자 열기</button>}>
    <input aria-label="내부 입력" />
  </AlertDialog>
  <PopupChoice label="항목 고르기" name="nested-choice" options={["항목 가", "항목 나"]} />
</> } };
export const LongContent: Story = { name: "긴 콘텐츠", args: { options: { initialFocus: "title" }, children: <>
  {Array.from({ length: 30 }, (_, i) => <p key={i}>문단 {i + 1}: 작은 화면에서도 스크롤할 수 있는 콘텐츠입니다.</p>)}
  <button type="button">마지막 동작</button>
</> } };

const HiddenOpenButton: BaseDialogProps["OpenButton"] = props => <button {...props} type="button" hidden>숨겨진 열기 버튼</button>;
export const HiddenTrigger: Story = { name: "숨겨진 열기 버튼", render: function HiddenTrigger(args) {
  const controller = useState(false);
  return <><button type="button" onClick={() => controller[1](true)}>실제 열기 버튼</button>
    <AlertDialog {...args} modalController={controller} OpenButton={HiddenOpenButton} />
  </>;
} };
export const ReturnFocus: Story = { name: "초점 복귀 위치", render: function ReturnFocus(args) {
  const controller = useState(false);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  return <><button ref={returnFocusRef} type="button">대체 초점 위치</button>
    <button type="button" disabled={controller[0]} onClick={() => controller[1](true)}>실제 열기 버튼</button>
    <AlertDialog {...args} modalController={controller} OpenButton={HiddenOpenButton} returnFocusRef={returnFocusRef} />
  </>;
} };
