import assert from "node:assert/strict";

/** Checkbox의 이름 연결, 초기값, 클릭과 키보드 상태 변경을 검증합니다. */
export async function verifyCheckbox(page, base) {
  await page.goto(base + "?id=ui-checkbox--initially-checked&viewMode=story");
  const initial = page.getByRole("checkbox", { name: "기본 선택", exact: true });
  await initial.waitFor();
  assert.equal(await initial.isChecked(), true);
  await initial.focus();
  await page.keyboard.press("Space");
  assert.equal(await initial.isChecked(), false);

  await page.goto(base + "?id=ui-checkbox--external-label&viewMode=story");
  const checkbox = page.getByRole("checkbox", { name: "서비스 소식 이메일", exact: true });
  await checkbox.waitFor();
  assert.equal(await checkbox.getAttribute("aria-label"), null);
  assert.ok(await checkbox.getAttribute("aria-labelledby"));
  assert.ok(await checkbox.getAttribute("aria-describedby"));
  await page.getByText("서비스 소식 이메일", { exact: true }).click();
  assert.equal(await checkbox.isChecked(), true);
  await checkbox.focus();
  await page.keyboard.press("Space");
  assert.equal(await checkbox.isChecked(), false);

  await page.goto(base + "?id=ui-checkbox--docs&viewMode=docs");
  for (const prop of ["checked", "onChange", "defaultChecked", "aria-labelledby"]) {
    await page.getByRole("row").filter({ has: page.getByText(prop, { exact: true }) }).first().waitFor();
  }
  console.log("PASS: Checkbox initial state, external label, description, pointer/keyboard and Docs");
}
