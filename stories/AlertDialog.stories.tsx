import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, type BaseDialogProps } from "../src/modal-dialogs";
import { PopupChoice } from "../src/popup-choice";

const OpenButton: BaseDialogProps["OpenButton"] = props => <button {...props} type="button">Open dialog</button>;
const meta = { title: "UI/AlertDialog", component: AlertDialog,
  args: { title: "Example dialog", OpenButton, children: <><label>Dialog input<input /></label><button type="button">Last content action</button></> },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const TitleFocus: Story = { args: { options: { initialFocus: "title" } } };
export const HiddenTitle: Story = { args: { options: { hideTitle: true } } };
export const CloseAtStart: Story = { args: { options: { closeButtonPlacement: "start" } } };
export const Controlled: Story = { render: function Controlled(args) {
  const controller = useState(false);
  const [cancelCount, setCancelCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  return <><AlertDialog {...args} modalController={controller}
    OpenButton={OpenButton}
    CloseButton={props => <button {...props} type="button">Dismiss</button>}
    onCancel={() => setCancelCount(n => n + 1)} onAfterClose={() => setClosedCount(n => n + 1)}
    className="consumer-dialog" bodyProps={{ className: "consumer-body", role: "region", "aria-label": "Dialog body" }}>
    <button type="button" onClick={() => controller[1](false)}>Confirm</button>
  </AlertDialog><output>cancel {cancelCount}, closed {closedCount}</output>
  <button type="button" onClick={() => controller[1](true)}>External open</button></>;
} };
export const Nested: Story = { args: { children: <>
  <AlertDialog title="Inner dialog" OpenButton={props => <button {...props} type="button">Open inner</button>}>
    <input aria-label="Inner input" />
  </AlertDialog>
  <PopupChoice label="Choose option" name="nested-choice" options={["Alpha", "Beta"]} />
</> } };
export const LongContent: Story = { args: { options: { initialFocus: "title" }, children: <>
  {Array.from({ length: 30 }, (_, i) => <p key={i}>Paragraph {i + 1}: Scrollable content for a small viewport.</p>)}
  <button type="button">Final action</button>
</> } };

const HiddenOpenButton: BaseDialogProps["OpenButton"] = props => <button {...props} type="button" hidden>Hidden trigger</button>;
export const HiddenTrigger: Story = { render: function HiddenTrigger(args) {
  const controller = useState(false);
  return <><button type="button" onClick={() => controller[1](true)}>Actual trigger</button>
    <AlertDialog {...args} modalController={controller} OpenButton={HiddenOpenButton} />
  </>;
} };
export const ReturnFocus: Story = { render: function ReturnFocus(args) {
  const controller = useState(false);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  return <><button ref={returnFocusRef} type="button">Fallback target</button>
    <button type="button" disabled={controller[0]} onClick={() => controller[1](true)}>Actual trigger</button>
    <AlertDialog {...args} modalController={controller} OpenButton={HiddenOpenButton} returnFocusRef={returnFocusRef} />
  </>;
} };
