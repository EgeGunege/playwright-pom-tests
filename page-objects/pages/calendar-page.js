import { Base } from '../utils/base.js';
import { expect } from '@playwright/test';

export class CalendarPage extends Base {
  constructor(page) {
    super(page);
    this.sel = {
      calendarInput: '[class="react-date-picker__inputGroup"]',
      calendarLabel: 'button[class="react-calendar__navigation__label"]',
      monthOptions: '.react-calendar__year-view__months__month',
      calendarRoot: '.react-calendar',
      dateDay: '[name="day"]',
      dateMonth: '[name="month"]',
      dateYear: '[name="year"]',
    };
  }

  async openCalendar() {
    await this.clickElement(this.getElement('locator', this.sel.calendarInput));
  }

  async navigateToYearView() {
    await this.clickElement(this.getElement('locator', this.sel.calendarLabel));
    await this.clickElement(this.getElement('locator', this.sel.calendarLabel));
  }

  async selectYear(year) {
    const yearBtn = this.getElement('text', String(year));
    await this.waitForElement(yearBtn, 'visible');
    await this.clickElement(yearBtn);
    await this.waitForFirst(this.getElement('locator', this.sel.monthOptions), 'visible');
  }

  async selectMonth(monthNumber) {
    const idx = Number(monthNumber) - 1;
    await this.clickElement(this.getNth(this.getElement('locator', this.sel.monthOptions), idx));
  }

  async selectDate(day) {
    const root = this.getElement('locator', this.sel.calendarRoot);
    const dayButton = this.getElement(
      'locator',
      `button:has(abbr:has-text("${String(day)}"))`,
      {},
      root
    );
    await this.clickElement(dayButton);
  }

  async expectSelectedDate({ day, month, year }) {
    await expect(this.getElement('locator', this.sel.dateDay)).toHaveValue(day);
    await expect(this.getElement('locator', this.sel.dateMonth)).toHaveValue(month);
    await expect(this.getElement('locator', this.sel.dateYear)).toHaveValue(year);
  }
}
