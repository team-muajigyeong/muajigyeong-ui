import { SystemDocsContainer } from "./SystemDocsContainer";
import type { Preview } from "@storybook/react-vite";
import "../src/theme.css";
import "./preview.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: { layout: "padded", controls: { expanded: true }, docs: { container: SystemDocsContainer } },
};
export default preview;
