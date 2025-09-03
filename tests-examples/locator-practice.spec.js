import { test, expect } from "@playwright/test";

const url = "https://rahulshettyacademy.com/angularpractice/";

test("Playwright special locators", async ({ page }) => {
  await page.goto(url);
  await page.getByLabel("Check me out if you Love IceCreams!").check();
  await page.getByLabel("Employed").check();
  await page.getByLabel("Gender").selectOption("Female");
  await page.getByPlaceholder("Password").fill("abc123");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("link", { name: "Shop" }).click();
  await page
    .locator("app-card")
    .filter({ hasText: "Nokia Edge" })
    .getByRole("button")
    .click();
});
