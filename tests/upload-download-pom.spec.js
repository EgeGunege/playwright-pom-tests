// tests/upload-download-pom.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';
import { ExcelUtils } from '../page-objects/utils/excel-utils.js';
import { UploadDownloadPage } from '../page-objects/pages/upload-download-page.js';

test('Upload & Download Excel validation (POM + ExcelUtils)', async ({ page }, testInfo) => {
  const filePath = path.join(testInfo.outputDir, 'download.xlsx');

  const textSearch = 'Mango';
  const updateValue = '350';
  const updatedColumnAliases = ['Price', 'price'];
  const rowIdHeaderAliases = ['Fruit Name', 'fruit_nam'];
  const sheetName = 'Sheet1';

  const excel = new ExcelUtils();
  const uploadDownload = new UploadDownloadPage(page);

  await uploadDownload.goTo(process.env.UPLOAD_DOWNLOAD_URL);
  await uploadDownload.downloadAndSave(filePath);

  await excel.updateCellByHeaders({
    filePath,
    sheetName,
    headerRow: 1,
    rowIdHeader: rowIdHeaderAliases,
    rowIdValue: textSearch,
    targetHeader: updatedColumnAliases,
    newValue: updateValue,
  });

  await uploadDownload.uploadFile(filePath);

  const priceColIdx = await uploadDownload.findColumnIndexByAliases(updatedColumnAliases);
  expect(priceColIdx).toBeGreaterThanOrEqual(0);

  const row = uploadDownload.getRowByExactCellText(textSearch);
  await expect(uploadDownload.getCellInRowByIndex(row, priceColIdx)).toHaveText(
    new RegExp(`^\\s*${updateValue}\\s*$`)
  );
});
