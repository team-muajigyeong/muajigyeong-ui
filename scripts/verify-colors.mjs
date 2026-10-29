import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

/** Verify exported palette variables, mode switching and responsive Storybook swatches. */
export async function verifyColors(page, base) {
  const css = await readFile(new URL('../src/theme.css', import.meta.url), 'utf8');
  const names = [...css.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map(match => match[1]);
  assert.equal(names.length, 52);
  await page.goto(base + '?id=design-tokens-colors--comparison&viewMode=story');
  await page.locator('[data-scheme="dark"] [data-swatch="--coral-100"]').waitFor();
  const modes = {};
  for (const mode of ['light', 'dark']) {
    const panel = page.locator('[data-scheme="' + mode + '"]');
    assert.equal(await panel.locator('[data-token]').count(), names.length);
    const swatches = await panel.locator('[data-swatch]').evaluateAll(elements => elements.map(el => ({
      token: el.dataset.swatch,
      color: getComputedStyle(el).backgroundColor,
      valid: CSS.supports('color', getComputedStyle(el).getPropertyValue(el.dataset.swatch).trim()),
    })));
    assert.equal(swatches.length, 51);
    assert.ok(swatches.every(swatch => swatch.valid), 'All swatches must resolve to a valid CSS color');
    modes[mode] = Object.fromEntries(swatches.map(swatch => [swatch.token, swatch.color]));
    assert.equal(modes[mode]['--brand-teal'], 'rgb(0, 156, 180)');
  }
  assert.notEqual(modes.light['--color-text'], modes.dark['--color-text']);
  assert.notEqual(modes.light['--color-primary'], modes.dark['--color-primary']);
  assert.equal(modes.light['--coral-500'], modes.dark['--coral-500']);
  for (const mode of ['light', 'dark']) {
    const actual = await page.evaluate(mode => {
      document.documentElement.className = 'theme-' + mode;
      return getComputedStyle(document.documentElement).colorScheme;
    }, mode);
    assert.equal(actual, mode);
  }
  await page.evaluate(() => document.documentElement.className = '');
  await page.setViewportSize({ width: 390, height: 800 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.setViewportSize({ width: 1000, height: 800 });
  console.log('PASS: 52 palette variables, 51 swatches per mode, theme classes and mobile layout');
}
