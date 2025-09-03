import { test, expect } from '@playwright/test';

test.only('Client app test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/client/');
  const emailBox = page.locator('#userEmail');
  const passwordBox = page.locator('#userPassword');
  const signButton = page.locator('[value="Login"]');
  const itemName = 'ZARA COAT 3';
  const cardTitle = page.locator('.card-body b');
  const cardBodies = page.locator('.card-body');
  const cartButton = page.locator("[routerlink*='cart']");
  const cartSection = page.locator('[class="cartSection"]');
  const checkoutButton = page.locator("button:has-text('Checkout')");
  const countryBox = page.locator("[placeholder*='Country']");
  const canadaOption = page.locator('text=Canada');
  const usernameText = page.locator('.user__name label[type="text"]');
  const placeholderButton = page.locator('.action__submit');
  const thankyouMessage = page.locator('.hero-primary');
  const orderNumberElement = page.locator('label[class="ng-star-inserted"]');
  const myOrders = page.locator('button[routerlink*="myorders"]');
  const orderRow = page.locator('tr[class="ng-star-inserted"]');
  const emailTitle = page.locator("[class='email-title']");

  const username = 'anshika@gmail.com';

  await emailBox.fill(username);
  await passwordBox.fill('Iamking@000');
  await signButton.click();

  await page.waitForLoadState('networkidle');
  // await cardTitle.last().waitFor()
  // const cardTitles = await cardTitle.allTextContents()
  // console.log(cardTitles)

  // for (const cardBody of await cardBodies.all()) {
  //     const cardBodyTitle = cardBody.locator('b');
  //     if ((await cardBodyTitle.textContent()) === itemName) {
  //         await cardBody.locator("text= Add To Cart").click();
  //     }
  // }
  const count = await cardBodies.count();
  console.log(count);
  for (let i = 0; i < count; i++) {
    const cardBody = cardBodies.nth(i);
    if ((await cardBody.locator('b').textContent()) === itemName) {
      await cardBody.locator('text= Add To Cart').click();
      break;
    }
  }

  await cartButton.click();
  await cartSection.locator('h3').waitFor();
  await expect(cartSection.locator('h3')).toContainText(itemName);

  await checkoutButton.click();
  await countryBox.pressSequentially('Can');
  await canadaOption.click();

  await expect(usernameText).toHaveText(username);
  await placeholderButton.click();

  await expect(thankyouMessage).toHaveText(' Thankyou for the order. ');
  const orderNumber = (await orderNumberElement.textContent())
    .split(' ')
    .filter((x) => x.length > 1)[0]
    .trim();
  console.log(orderNumber);
  await myOrders.click();

  await orderRow.first().waitFor();
  const countOrders = await orderRow.count();
  for (let k = 0; k < countOrders; k++) {
    const order = orderRow.nth(k);
    const cellText = (await order.locator('th').textContent())?.trim();

    if (cellText === orderNumber) {
      await order.locator('td button:has-text("View")').click();
      break;
    }
  }

  await expect(emailTitle).toHaveText(' order summary ');
});
