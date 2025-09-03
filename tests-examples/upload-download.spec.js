import { test, expect } from '@playwright/test';
import ExcelUtils from './utils/excel-utils.js';

test('Upload download excel validation', async ({ page }) => {
  const url = 'https://rahulshettyacademy.com/upload-download-test/index.html';
  const textSearch = 'Mango';
  const updateValue = '350';
  const updatedColumn = ['Price', 'price'];
  const rowHeader = ['Fruit Name', 'fruit_nam'];
  const filePath = 'C:/Users/egegunege/Downloads/download.xlsx';
  const sheetName = 'Sheet1';
  const excel = new ExcelUtils();
  const fileInputButton = page.locator('#fileinput');

  await page.goto(url);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download' }).click(),
  ]);
  await download.saveAs(filePath);

  await excel.updateCellByHeaders({
    filePath,
    sheetName,
    headerRow: 1,
    rowIdHeader: rowHeader,
    rowIdValue: textSearch,
    targetHeader: updatedColumn,
    newValue: updateValue,
  });

  await fileInputButton.setInputFiles(filePath);

  const desiredRow = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: textSearch, exact: true }),
  });

  const priceIdx = await findColumnIndexByAliases(page, updatedColumn);
  if (priceIdx === -1) {
    throw new Error(`Column header not found via aliases: ${JSON.stringify(updatedColumn)}`);
  }

  await expect(desiredRow.getByRole('cell').nth(priceIdx)).toHaveText(
    new RegExp(`^\\s*${updateValue}\\s*$`)
  );
});

function _canon(s) {
  return (s || '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function findColumnIndexByAliases(page, aliases) {
  let headerLocator = null;
  for (const a of aliases) {
    const loc = page
      .getByRole('columnheader', {
        name: new RegExp(`\\b${escapeRegex(a)}\\b`, 'i'),
      })
      .first();
    try {
      await loc.waitFor({ state: 'visible', timeout: 2000 });
      headerLocator = loc;
      break;
    } catch {}
  }
  if (!headerLocator) return -1;

  const ariaIdx = await headerLocator.getAttribute('aria-colindex');
  if (ariaIdx) return parseInt(ariaIdx, 10) - 1;

  const headers = page.getByRole('columnheader');
  const n = await headers.count();
  const canonAliases = aliases.map(_canon);
  for (let i = 0; i < n; i++) {
    const txt = _canon(await headers.nth(i).textContent());
    if (canonAliases.some((a) => txt.includes(a))) return i;
  }
  return -1;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
