import type { Meta, StoryObj } from "@storybook/react-vite";
import { colorTokens } from "./color-tokens";
import "./colors.css";

/** 선택한 색상 모드에서 공통 CSS 변수의 실제 색상을 확인합니다. */
function ColorPalette({ scheme }: { scheme: "light" | "dark" }) {
  const groups = [
    ["브랜드", "--brand-"], ["Sand", "--sand-"], ["Teal", "--teal-"],
    ["Coral", "--coral-"], ["용도별 색상", "--color-"], ["배경 표현식", "--bg-"],
  ];
  return <section className="palette-panel" style={{ colorScheme: scheme }} data-scheme={scheme}>
    <h2>{scheme === "light" ? "밝은 모드" : "어두운 모드"}</h2>
    <p>변수명을 복사해 CSS에서 var(--color-primary)처럼 사용하세요.</p>
    {groups.map(([label, prefix]) => <section key={prefix}>
      <h3>{label}</h3>
      <div className="palette-grid">{colorTokens.filter(token => token.name.startsWith(prefix)).map(token =>
        <article className="palette-token" key={token.name} data-token={token.name}>
          {prefix !== "--bg-" ? <div className="palette-swatch" data-swatch={token.name} aria-hidden="true" style={{ backgroundColor: 'var(' + token.name + ')' }} /> : <p>앱의 배경 표현식 원문</p>}
          <code>{token.name}</code><pre>{token.value}</pre>
        </article>
      )}</div>
    </section>)}
  </section>;
}
const meta = { title: "Design Tokens/Colors", component: ColorPalette,
  args: { scheme: "light" }, parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ColorPalette>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "밝은 테마" };
export const Dark: Story = { name: "어두운 테마", args: { scheme: "dark" } };
export const Comparison: Story = { name: "테마 비교", render: () => <div className="palette-comparison"><ColorPalette scheme="light" /><ColorPalette scheme="dark" /></div> };
