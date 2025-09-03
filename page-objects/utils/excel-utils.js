import ExcelJS from 'exceljs';

export class ExcelUtils {
  async updateCellByHeaders({
    filePath,
    sheetName,
    rowIdHeader,
    rowIdValue,
    targetHeader,
    newValue,
    headerRow = 1,
  }) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) throw new Error(`Worksheet "${sheetName}" not found`);

    const headerMap = this._buildHeaderMap(worksheet, headerRow);

    const rowIdCol = this._resolveHeaderCol(headerMap, rowIdHeader);
    if (!rowIdCol)
      throw new Error(`Header not found for rowIdHeader: ${JSON.stringify(rowIdHeader)}`);

    const targetCol = this._resolveHeaderCol(headerMap, targetHeader);
    if (!targetCol)
      throw new Error(`Header not found for targetHeader: ${JSON.stringify(targetHeader)}`);

    const rowNumber = this._findRowByColumnValue(worksheet, rowIdCol, rowIdValue, headerRow);
    if (rowNumber === -1) {
      throw new Error(`Row not found where ${this._displayHeader(rowIdHeader)} = "${rowIdValue}"`);
    }

    const row = worksheet.getRow(rowNumber);
    row.getCell(targetCol).value = this._coerceValue(newValue);
    row.commit();
    await workbook.xlsx.writeFile(filePath);
  }

  _buildHeaderMap(worksheet, headerRow) {
    const map = new Map();
    const row = worksheet.getRow(headerRow);
    row.eachCell((cell, colNumber) => {
      const raw = (cell?.value ?? '').toString().trim();
      if (raw) map.set(this._canon(raw), colNumber);
    });
    return map;
  }

  _resolveHeaderCol(headerMap, keyOrKeys) {
    const candidates = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    for (const k of candidates) {
      const q = this._canon(k ?? '');
      if (headerMap.has(q)) return headerMap.get(q);
      for (const [canonKey, col] of headerMap.entries()) {
        if (canonKey.startsWith(q) || q.startsWith(canonKey)) return col;
      }
    }
    return 0;
  }

  _findRowByColumnValue(worksheet, colIndex, searchValue, headerRow) {
    const needle = this._canon((searchValue ?? '').toString());
    for (let r = headerRow + 1; r <= worksheet.rowCount; r++) {
      const cellVal = worksheet.getRow(r).getCell(colIndex).value;
      const hay = this._canon((cellVal ?? '').toString());
      if (hay === needle) return r;
    }
    return -1;
  }

  _canon(s) {
    return s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  _displayHeader(h) {
    return Array.isArray(h) ? h.join('/') : h;
  }

  _coerceValue(val) {
    if (typeof val === 'number') return val;
    const n = Number(val);
    return Number.isFinite(n) && val !== '' ? n : val;
  }
}
