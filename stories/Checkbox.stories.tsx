import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Title,
  Description,
  Controls,
  Stories,
  ArgTypes,
} from "@storybook/addon-docs/blocks";

import Checkbox from "../src/checkboxes";

const meta = { 
  title: "UI/Checkbox", 
  component: Checkbox,
  argTypes: {
    "label": {
      description: "화면과 보조 기술에 제공할 이름입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "labelIsHidden": {
      description: "라벨을 화면에서 숨기고 aria-label로 전달합니다. 기본값은 false입니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "checked": {
      description: "onChange와 함께 전달하면 외부 제어 모드로 동작합니다. defaultChecked와 함께 지정할 수 없습니다.",
      control: false,
      table: { type: { summary: "boolean | undefined" } },
    },
    "onChange": {
      description: "원본 타입은 input의 ChangeEventHandler와 (v: boolean) => void의 교차 타입입니다. 현재 구현은 boolean을 전달합니다. checked와 함께 사용합니다.",
      control: false,
      table: { type: { summary: "(ChangeEventHandler<HTMLInputElement, HTMLInputElement> & ((v: boolean) => void)) | undefined" } },
    },
    "defaultChecked": {
      description: "비제어 모드의 초기 선택값입니다. 기본값은 false이며 checked와 함께 지정할 수 없습니다.",
      control: false,
      table: { type: { summary: "boolean | undefined" } },
    },
    "disabled": {
      description: "사용자 입력을 비활성화합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "required": {
      description: "폼 제출 시 필수 입력으로 처리합니다.",
      control: "boolean",
      table: { type: { summary: "boolean | undefined" } },
    },
    "id": {
      description: "입력 요소의 고유 ID입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "name": {
      description: "폼 전송에 사용할 입력 이름입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "value": {
      description: "입력 요소에 전달할 값입니다.",
      control: false,
      table: { type: { summary: "string | number | readonly string[] | undefined" } },
    },
    "ref": {
      description: "기본 input ref 속성입니다. 전달 순서상 props.ref가 내부 ref 콜백을 덮어쓸 수 있습니다.",
      control: false,
      table: { type: { summary: "Ref<HTMLInputElement> | undefined" } },
    },
    "aria-labelledby": {
      description: "접근 가능한 이름을 제공하는 요소의 ID 목록입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "aria-describedby": {
      description: "추가 설명을 제공하는 요소의 ID 목록입니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "aria-label": {
      description: "상속 타입에는 포함되지만 현재 구현은 직접 지정 시 경고합니다. label과 labelIsHidden을 사용하세요.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
    "className": {
      description: "상속 타입에는 포함되지만 현재 구현은 input의 className을 내부 스타일로 지정합니다.",
      control: "text",
      table: { type: { summary: "string | undefined" } },
    },
  },
  tags:["autodocs"],
  parameters:{
    docs:{
      page: () => (
        <>
          <Title />
          <Description />
          <ArgTypes />
          <Stories />
        </>
      ),
      description:{
        component:"커스텀 체크박스 컴포넌트입니다."
      }
    }
  }
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본",

  args:{},
  parameters:{
    docs:{
      description:{
        story:"레이블이 없는 기본 형태의 체크박스입니다. 커스터마이징이 목적이 아니라면 사용을 권하지 않습니다. 레이블이 없기 때문에 콘솔에 워닝이 표시됩니다."
      }
    }
  }
};
export const Labeled: Story = { name: "레이블", args:{
  label:"동의"
}};
export const InitiallyChecked: Story = {
  name: "초기 선택",
  args: { label: "기본 선택", defaultChecked: true },
};
export const ExternalLabel: Story = {
  name: "외부 복합 라벨",
  render: function ExternalLabel() {
    const id = useId();
    const [checked, setChecked] = useState(false);
    return (
      <label htmlFor={id}>
        <Checkbox id={id} checked={checked}
          onChange={value => setChecked(typeof value === "boolean" ? value : value.currentTarget.checked)}
          aria-labelledby={id + "-title"} aria-describedby={id + "-description"} />
        <span id={id + "-title"}><strong>서비스 소식 이메일</strong></span>
        <small id={id + "-description"}>새 기능과 주요 서비스 소식을 받습니다.</small>
      </label>
    );
  },
};
