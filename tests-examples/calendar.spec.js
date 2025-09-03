import { test, expect } from '@playwright/test';

const url = 'https://rahulshettyacademy.com/seleniumPractise/#/offers';

test('Calendar validations', async ({ page }) => {
  const monthNumber = '6';
  const date = '15';
  const year = '2027';
  const calendar = page.locator('[class="react-date-picker__inputGroup"]');
  const calendarLabel = page.locator('button[class="react-calendar__navigation__label"]');
  const dateOption = page.locator(`abbr:has-text("${date}")`);
  const monthOptions = page.locator('.react-calendar__year-view__months__month');
  const yearOption = page.getByText(year);
  const dateDay = page.locator('[name="day"]');
  const dateMonth = page.locator('[name="month"]');
  const dateYear = page.locator('[name="year"]');

  await page.goto(url);
  await calendar.click();

  await calendarLabel.click();
  await calendarLabel.click();
  await yearOption.click();
  await monthOptions.nth(Number(monthNumber) - 1).click();
  await dateOption.click();

  await expect(dateDay).toHaveValue(date);
  await expect(dateMonth).toHaveValue(monthNumber);
  await expect(dateYear).toHaveValue(year);
});
