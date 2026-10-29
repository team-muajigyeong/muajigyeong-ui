import { verifyDialogs } from "./verify-dialogs.mjs";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../storybook-static/", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) { res.writeHead(403).end(); return; }
  try {
    res.setHeader("Content-Type", types[path.extname(file)] ?? "application/octet-stream");
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, colorScheme: "light" });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}/iframe.html`;
  const story = id => page.goto(`${base}?id=${id}&viewMode=story`);

  await story("ui-sectionwithheader--default");
  await page.getByRole("heading", { name: "섹션 제목", level: 2 }).waitFor();
  assert.equal(await page.locator("section").textContent(), "섹션 제목섹션 본문");
  await story("ui-sectionwithheader--subsection");
  await page.getByRole("heading", { name: "섹션 제목", level: 3 }).waitFor();

  await story("ui-formactionbuttons--interactive");
  const confirm = page.getByRole("button", { name: "저장", exact: true });
  const cancel = page.getByRole("button", { name: "취소", exact: true });
  await confirm.click();
  await cancel.press("Enter");
  assert.equal(await page.locator("output").textContent(), "확인 1, 취소 1");
  assert.match(await confirm.getAttribute("class"), /consumer-confirm/);
  assert.match(await cancel.getAttribute("class"), /consumer-cancel/);
  assert.equal(await page.locator(".review-submit-button,.review-cancel-button").count(), 0);
  assert.notEqual(await confirm.evaluate(el => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
  await page.getByRole("checkbox", { name: "처리 중" }).check();
  await confirm.press("Enter");
  await confirm.dispatchEvent("click");
  assert.equal(await page.locator("output").textContent(), "확인 1, 취소 1");
  assert.equal(await confirm.getAttribute("aria-disabled"), "true");
  assert.equal(await confirm.evaluate(el => el.disabled), false);
  await story("ui-formactionbuttons--disabled");
  assert.equal(await page.getByRole("button", { name: "저장", exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole("button", { name: "취소", exact: true }).isDisabled(), true);

  await story("ui-statustoast--announcement");
  const announcement = page.getByText("변경한 내용을 저장했습니다", { exact: true });
  await announcement.waitFor({ state: "attached" });
  assert.equal(await announcement.evaluate(el => getComputedStyle(el).width), "1px");
  assert.equal(await announcement.evaluate(el => getComputedStyle(el).position), "absolute");
  assert.equal(await page.getByRole("status").getAttribute("aria-live"), "polite");
  await story("ui-statustoast--error");
  await page.getByRole("alert").waitFor();
  assert.equal(await page.getByRole("alert").getAttribute("aria-live"), "assertive");
  await story("ui-statustoast--repeat");
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.getAttribute("data-visible") === "false");
  await page.getByRole("button", { name: "같은 메시지 다시 알림" }).click();
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.getAttribute("data-visible") === "true");
  assert.equal(await page.getByRole("status").textContent(), "저장했습니다");
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.getAttribute("data-visible") === "false");

  await story("ui-checkchip--interactive");
  await page.getByRole("checkbox").check();
  assert.equal(await page.getByRole("checkbox").isChecked(), true);
  await story("ui-accordion--default");
  await page.getByRole("heading", { name: "사용 방법", level: 3 }).waitFor();
  const accordion = page.getByRole("button", { name: "사용 방법" });
  const defaultHeadingStyle = await accordion.evaluate(el => {
    const style = getComputedStyle(el.parentElement);
    return [style.fontSize, style.marginTop, style.marginBottom];
  });
  await accordion.click();
  assert.equal(await accordion.getAttribute("aria-expanded"), "true");
  await accordion.press("Space");
  assert.equal(await accordion.getAttribute("aria-expanded"), "false");
  await story("ui-accordion--nested-heading");
  await page.getByRole("heading", { name: "여행 일정", level: 4 }).waitFor();
  await page.getByRole("heading", { name: "사용 방법", level: 5 }).waitFor();
  assert.equal(await page.getByRole("heading", { level: 3 }).count(), 0);
  const nestedAccordion = page.getByRole("button", { name: "사용 방법" });
  assert.deepEqual(await nestedAccordion.evaluate(el => {
    const style = getComputedStyle(el.parentElement);
    return [style.fontSize, style.marginTop, style.marginBottom];
  }), defaultHeadingStyle, "heading level must not change visual styling");
  await nestedAccordion.press("Enter");
  assert.equal(await nestedAccordion.getAttribute("aria-expanded"), "true");
  const panelId = await nestedAccordion.getAttribute("aria-controls");
  assert.equal(await page.locator(`[id="${panelId}"]`).isVisible(), true);
  await nestedAccordion.press("Space");
  assert.equal(await nestedAccordion.getAttribute("aria-expanded"), "false");
  assert.equal(await page.locator(`[id="${panelId}"]`).isVisible(), false);
  await story("ui-choiceselect--interactive");
  await page.getByRole("button", { name: "표시 순서" }).press("ArrowDown");
  await page.getByRole("option", { name: "최신순" }).press("ArrowDown");
  await page.getByRole("option", { name: "이름순" }).press("Enter");
  await page.getByRole("button", { name: "표시 순서, 현재 이름순" }).waitFor();
  await story("ui-controlledinput--interactive");
  await page.getByRole("textbox", { name: "이름" }).fill("입력 확인");
  assert.equal(await page.getByRole("textbox", { name: "이름" }).inputValue(), "입력 확인");


  await story("ui-textfield--default");
  const textInput = page.getByRole("textbox", { name: "입력값" });
  await textInput.fill("입력 확인");
  await textInput.blur();
  assert.equal(await textInput.inputValue(), "입력 확인");
  assert.notEqual(await textInput.evaluate(el => getComputedStyle(el).color), "rgba(0, 0, 0, 0)");
  await story("ui-textfield--controlled");
  await page.getByRole("textbox", { name: "입력값" }).fill("부모 상태 변경");
  assert.equal(await page.locator("output").textContent(), "부모 상태 변경");
  await page.getByRole("button", { name: "지우기" }).click();
  assert.equal(await page.getByRole("textbox", { name: "입력값" }).inputValue(), "");
  assert.equal(await page.getByRole("textbox", { name: "입력값" }).getAttribute("id"), "controlled-field");
  await story("ui-textfield--native-controlled");
  await page.getByRole("textbox", { name: "입력값" }).fill("검색 입력");
  assert.equal(await page.locator("output").textContent(), "검색 입력");
  await page.getByRole("button", { name: "지우기" }).click();
  assert.equal(await page.getByRole("textbox", { name: "입력값" }).inputValue(), "");
  await story("ui-textfield--password");
  const password = page.getByLabel("비밀번호", { exact: true });
  await password.fill("example-password");
  assert.equal(await password.getAttribute("type"), "password");
  const reveal = page.getByRole("button", { name: "비밀번호 보기", exact: true });
  await reveal.press("Enter");
  assert.equal(await password.getAttribute("type"), "text");
  assert.equal(await reveal.getAttribute("aria-pressed"), "true");
  await reveal.press("Space");
  assert.equal(await password.getAttribute("type"), "password");
  assert.equal(await password.inputValue(), "example-password");
  await story("ui-textfield--disabled");
  assert.equal(await page.getByRole("textbox").isDisabled(), true);
  await story("ui-textfield--read-only");
  assert.equal(await page.getByRole("textbox").isEditable(), false);
  assert.equal(await page.getByRole("textbox").inputValue(), "읽기 전용");
  await story("ui-textfield--multiple");
  await page.getByRole("textbox", { name: "첫 번째" }).waitFor();
  await page.waitForFunction(() => [...document.querySelectorAll('input')].every(el => !!el.id));
  const fieldIds = await page.getByRole("textbox").evaluateAll(elements => elements.map(el => el.id));
  assert.equal(new Set(fieldIds).size, 2);
  assert.equal(await page.getByRole("textbox", { name: "두 번째" }).evaluate(el => el.labels[0].htmlFor === el.id), true);
  await page.getByRole("textbox", { name: "두 번째" }).click();
  assert.equal(await page.getByRole("textbox", { name: "두 번째" }).evaluate(el => el === document.activeElement), true);

  await story("ui-switch--default");
  const toggle = page.getByRole("switch", { name: "알림 사용" });
  await toggle.press("Space");
  assert.equal(await toggle.isChecked(), true);
  await toggle.press("Space");
  assert.equal(await toggle.isChecked(), false);
  await story("ui-switch--controlled");
  const controlledToggle = page.getByRole("switch", { name: "알림 사용" });
  await controlledToggle.uncheck();
  assert.equal(await page.locator("output").textContent(), "상태 false, 변경 1");
  await page.getByRole("button", { name: "외부에서 켜기" }).click();
  assert.equal(await controlledToggle.isChecked(), true);
  assert.equal(await page.locator("output").textContent(), "상태 true, 변경 1");
  assert.equal(await controlledToggle.getAttribute("id"), "controlled-switch");
  assert.match(await controlledToggle.getAttribute("class"), /consumer-input/);
  assert.equal(await page.locator("label.consumer-label").count(), 1);
  await story("ui-switch--callback-controlled");
  await page.getByRole("switch").uncheck();
  assert.equal(await page.locator("output").textContent(), "false");
  await story("ui-switch--disabled");
  assert.equal(await page.getByRole("switch").isDisabled(), true);
  await story("ui-switch--multiple");
  await page.getByRole("switch", { name: "두 번째 설정" }).waitFor();
  await page.waitForFunction(() => [...document.querySelectorAll('input')].every(el => !!el.id));
  const switchIds = await page.getByRole("switch").evaluateAll(elements => elements.map(el => el.id));
  assert.equal(new Set(switchIds).size, 2);
  await page.getByText("첫 번째", { exact: true }).click();
  assert.equal(await page.getByRole("switch", { name: "첫 번째" }).isChecked(), true);
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  assert.notEqual(await page.getByRole("switch").first().evaluate(el => getComputedStyle(el).borderTopStyle), "none");
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "no-preference" });

  await page.goto(`${base}?id=ui-formactionbuttons--docs&viewMode=docs`);
  await page.getByRole("heading", { name: "FormActionButtons", exact: true }).waitFor();
  await page.getByText("Additional class for the cancel button; owned by the consuming app.", { exact: false }).first().waitFor();
  await verifyDialogs(page, base);
  const documentedComponents = [
    ["alertdialog", "AlertDialog"], ["popupchoice", "PopupChoice"],
    ['accordion', 'Accordion'], ['checkchip', 'CheckChip'],
    ['choiceselect', 'ChoiceSelect'], ['controlledinput', 'ControlledInput'],
    ['sectionwithheader', 'SectionWithHeader'], ['formactionbuttons', 'FormActionButtons'],
    ['statustoast', 'StatusToast'], ['textfield', 'AOSTextField'], ['switch', 'Switch'],
  ];
  for (const [slug, componentName] of documentedComponents) {
    await page.goto(`${base}?id=ui-${slug}--docs&viewMode=docs`);
    await page.locator('.sbdocs').first().waitFor();
    const toggles = page.getByText('Show code', { exact: true });
    const count = await toggles.count();
    assert.ok(count > 0, 'Docs must provide source examples');
    for (let i = 0; i < count; i++) await toggles.first().click();
    await page.waitForFunction(expected => {
      const blocks = [...document.querySelectorAll('.sbdocs-preview pre')];
      return blocks.length === expected && blocks.every(el => el.textContent?.trim() && el.textContent.trim() !== '{}');
    }, count);
    for (const source of await page.locator('.sbdocs-preview pre').allTextContents()) {
      assert.match(source, new RegExp('<' + componentName + '[\\s/>]'), `JSX source must use ${componentName}: ${source}`);
    }
  }
  assert.deepEqual(errors, []);
  console.log("PASS: eleven components, modal focus/Escape/nesting, choice confirmation/cancellation, text/password inputs, switch state and keyboard, busy/disabled actions, style slots, heading levels, repeated toast, announcements, keyboard, Autodocs and PascalCase JSX source for every example");
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
