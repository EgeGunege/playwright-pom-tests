import { test } from '@playwright/test';
import { CalendarPage } from '../page-objects/pages/calendar-page.js';

test('Calendar validations', async ({ page }) => {
  const poCalendar = new CalendarPage(page);
  const month = '6';
  const day = '15';
  const year = '2027';

  await poCalendar.goTo(process.env.CALENDAR_URL);

  await poCalendar.openCalendar();
  await poCalendar.navigateToYearView();
  await poCalendar.selectYear(year);
  await poCalendar.selectMonth(Number(month));
  await poCalendar.selectDate(day);

  await poCalendar.expectSelectedDate({
    day: day,
    month: month,
    year,
  });
});
