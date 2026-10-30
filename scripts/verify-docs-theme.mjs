import assert from "node:assert/strict";

/** Verify initial load and live OS theme changes on the static documentation site. */
export async function verifyDocsTheme(page, base) {
  const url = base + '?id=ui-datepicker--docs&viewMode=docs';
  const capture = () => page.evaluate(() => {
    const style = selector => { const el=document.querySelector(selector); if(!el) throw new Error(selector); return getComputedStyle(el); };
    return {
      background: style('.sbdocs-wrapper').backgroundColor,
      title: style('.sbdocs h1').color,
      preview: style('.sbdocs-preview').backgroundColor,
      table: style('.docblock-argstable').color,
    };
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(url);
  await page.locator('.docblock-argstable').waitFor();
  const light = await capture();
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(before => getComputedStyle(document.querySelector('.sbdocs-wrapper')).backgroundColor !== before, light.background);
  const dark = await capture();
  assert.notEqual(dark.title, light.title);
  assert.notEqual(dark.preview, light.preview);
  assert.notEqual(dark.background, 'rgb(255, 255, 255)');
  await page.getByText('Show code', { exact: true }).first().click();
  await page.locator('.sbdocs-preview pre').first().waitFor();
  await page.reload();
  await page.locator('.docblock-argstable').waitFor();
  assert.equal((await capture()).background, dark.background);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(before => getComputedStyle(document.querySelector('.sbdocs-wrapper')).backgroundColor === before, light.background);
  assert.equal((await capture()).title, light.title);
  console.log('PASS: Docs content, preview and title follow system theme on load and live changes');
}
