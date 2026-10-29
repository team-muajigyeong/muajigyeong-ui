import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** Copy the application's shared palette without importing layout or font rules. */
const args = process.argv.slice(2);
const input = args.find(arg => arg !== "--check");
if (!input) throw new Error("Usage: npm run sync:colors -- <app/src/app/globals.css> [--check]");
const root = fileURLToPath(new URL("../", import.meta.url));
const css = (await fs.readFile(path.resolve(input), "utf8")).replaceAll("\r\n", "\n");
const start = css.indexOf("  /* === Brand bases === */");
const end = css.indexOf("  &.theme-light", start);
if (start < 0 || end < start) throw new Error("Shared palette markers changed; inspect globals.css before syncing.");
const block = css.slice(start, end).replace(/[ \t]+$/gm, "").trimEnd();
const tokens = [...block.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => ({ name, value: value.trim() }));
if (!tokens.length || tokens.some(({ name }) => !/^--(?:brand-|sand-|teal-|coral-|color-|bg-linear-gradient$)/.test(name))) throw new Error("Unexpected palette declarations");
const names = new Set(tokens.map(token => token.name));
if (names.size !== tokens.length) throw new Error("Duplicate palette variables");
for (const { value } of tokens) for (const [, dependency] of value.matchAll(/var\((--[a-zA-Z0-9-]+)/g)) {
  if (!names.has(dependency)) throw new Error("Undefined palette dependency: " + dependency);
}
const theme = '/** Synced from the application globals.css by npm run sync:colors. */\n:root {\n  color-scheme: light dark;\n' + block + '\n}\n\n:root.theme-light { color-scheme: light; }\n:root.theme-dark { color-scheme: dark; }\n';
const data = '/** Generated palette metadata for Storybook; edit the app palette and rerun sync:colors. */\nexport const colorTokens = ' + JSON.stringify(tokens, null, 2) + ' as const;\n';
for (const [file, content] of [['src/theme.css', theme], ['stories/color-tokens.ts', data]]) {
  const target = path.join(root, file);
  if (args.includes('--check')) {
    if ((await fs.readFile(target, 'utf8')).replaceAll('\r\n', '\n') !== content) throw new Error(file + ' differs from the application palette');
  } else await fs.writeFile(target, content);
}
console.log((args.includes('--check') ? 'Verified' : 'Synced') + ' ' + tokens.length + ' shared color variables');
