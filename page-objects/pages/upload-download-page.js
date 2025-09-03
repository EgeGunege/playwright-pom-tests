import { Base } from '../utils/base.js';

export class UploadDownloadPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      downloadBtnName: 'Download',
      fileInput: '#fileinput',
      columnHeaderRole: 'columnheader',
      rowRole: 'row',
      cellRole: 'cell',
      frame: '#courses-iframe',
    };
  }

  /**
   * Click the download button and save the file to given path.
   * @param {string} filePath - Absolute path to save the downloaded file.
   */
  async downloadAndSave(filePath) {
    const downloadBtn = this.getElement('role', 'button', { name: this.sel.downloadBtnName });
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.clickElement(downloadBtn),
    ]);
    await download.saveAs(filePath);
  }

  /**
   * Upload file into input[type="file"].
   * @param {string|string[]} filePath - File path(s) to upload.
   */
  async uploadFile(filePath) {
    const input = this.getElement('locator', this.sel.fileInput);
    await this.setInputFiles(input, filePath);
  }

  /**
   * Find column index by header aliases (case-insensitive, tolerant).
   * @param {string[]} aliases - Possible header names (e.g. ['Price','price']).
   * @returns {Promise<number>} Zero-based index, -1 if not found.
   */
  async findColumnIndexByAliases(aliases) {
    let header = null;
    for (const a of aliases) {
      const candidate = this.getElement('role', this.sel.columnHeaderRole, {
        name: new RegExp(`\\b${this._escape(a)}\\b`, 'i'),
      }).first();
      try {
        await candidate.waitFor({ state: 'visible', timeout: 2000 });
        header = candidate;
        break;
      } catch {}
    }
    if (!header) return -1;

    const ariaIdx = await header.getAttribute('aria-colindex');
    if (ariaIdx) return parseInt(ariaIdx, 10) - 1;

    const headers = this.getElement('role', this.sel.columnHeaderRole);
    const n = await headers.count();
    const canonAliases = aliases.map(this._canon);
    for (let i = 0; i < n; i++) {
      const txt = this._canon(await headers.nth(i).textContent());
      if (canonAliases.some((a) => txt.includes(a))) return i;
    }
    return -1;
  }

  /**
   * Get a row locator filtered by exact cell text.
   * @param {string} exactCellText - The text of the cell to match.
   * @returns {import('@playwright/test').Locator}
   */
  getRowByExactCellText(exactCellText) {
    const rows = this.getElement('role', this.sel.rowRole);
    const cell = this.getElement('role', this.sel.cellRole, { name: exactCellText, exact: true });
    return rows.filter({ has: cell });
  }

  /**
   * Get a cell locator inside a given row by index.
   * @param {import('@playwright/test').Locator} row - Locator for the row.
   * @param {number} index0 - Zero-based index of the cell.
   * @returns {import('@playwright/test').Locator}
   */
  getCellInRowByIndex(row, index0) {
    return row.getByRole(this.sel.cellRole).nth(index0);
  }

  // --- helpers ---
  _canon(s) {
    return (s || '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  _escape(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
