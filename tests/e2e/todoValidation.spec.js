import { test, expect, chromium } from '@playwright/test';

const API_URL = 'http://localhost:1337/api/auth/local/register';
const LOGIN_URL = 'http://localhost:1337/api/auth/local';
const TODOS_URL = 'http://localhost:1337/api/todos';

const testUser = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@mail.com`,
  password: 'TestPassword123'
};

let authToken; // Store authentication token
let browser;
let context;
let page;

test.describe('Todo App - Validation Tests', () => {
  
  test.beforeAll(async ({ request }) => {
    // 1️⃣ Register the user
    await request.post(API_URL, { data: testUser }).catch(() => {});

    // 2️⃣ Log in and store auth token
    const loginResponse = await request.post(LOGIN_URL, {
      data: { identifier: testUser.email, password: testUser.password }
    });
    expect(loginResponse.status()).toBe(200);

    const loginData = await loginResponse.json();
    authToken = loginData.jwt;

    // 3️⃣ Launch a new browser session
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // 4️⃣ Perform UI login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[placeholder="Enter your email"]', testUser.email);
    await page.fill('input[placeholder="Enter your password"]', testUser.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 5️⃣ Ensure login was successful
    await expect(page.locator('nav a', { hasText: 'Dashboard' })).toBeVisible();

    // 6️⃣ Save storage state to reuse in tests
    await context.storageState({ path: 'auth.json' });
  });

  test.beforeEach(async () => {
    // 7️⃣ Open a new browser context for each test
    context = await browser.newContext({ storageState: 'auth.json' });
    page = await context.newPage();
    await page.goto('http://localhost:3000');
  });

  test.afterEach(async () => {
    // 8️⃣ Close browser after each test to prevent blank page issues
    await page.close();
    await context.close();
  });

  test.afterAll(async () => {
    // 9️⃣ Close the browser completely after all tests
    await browser.close();
  });

  test('should show an error when Task Title is empty', async () => {
    await page.getByText('Add').click();
    await expect(page.locator('p.error-message')).toHaveText('Task title is required');
  });

  test('should prevent selection of past DueDate', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split("T")[0];

    await page.fill('input[type="date"]', pastDateString);
    await page.getByText('Add').click();

  });

  test('should submit successfully when all inputs are valid', async () => {
    const todayDate = new Date().toISOString().split("T")[0];

    await page.fill('input[placeholder="Task title..."]', 'Valid Task');
    await page.fill('input[placeholder="Description..."]', 'Valid Description');
    await page.selectOption('select', 'medium');
    await page.fill('input[type="date"]', todayDate);
    await page.getByText('Add').click();

  });

});
