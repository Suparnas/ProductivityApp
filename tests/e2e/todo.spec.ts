import { test, expect, chromium } from '@playwright/test';

const API_URL = 'http://localhost:1337/api/auth/local/register';
const LOGIN_URL = 'http://localhost:1337/api/auth/local';
const TODOS_URL = 'http://localhost:1337/api/todos';

const testUser = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@mail.com`,
  password: 'TestPassword123'
};

let authToken;
let browser;
let context;
let page;

test.describe('Todo App - End-to-End Happy Flow', () => {
  
  test.beforeAll(async ({ request }) => {
    // 1️⃣ Register the user
    await request.post(API_URL, { data: testUser }).catch(() => {});

    // 2️⃣ Log in and get auth token
    const loginResponse = await request.post(LOGIN_URL, {
      data: { identifier: testUser.email, password: testUser.password }
    });
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    authToken = loginData.jwt;

    // 3️⃣ Delete all existing tasks before running tests
    await request.delete(TODOS_URL, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    // 4️⃣ Launch a new browser session
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // 5️⃣ Perform UI login
    await page.goto('http://localhost:3000');
    await page.fill('input[placeholder="Username or Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 6️⃣ Ensure login was successful
    await expect(page.locator('h2:has-text("Welcome")')).toBeVisible();

    // 7️⃣ Save storage state to reuse session
    await context.storageState({ path: 'auth.json' });

    await page.close(); // Close initial login page
  });

  test.beforeEach(async () => {
    // 8️⃣ Load existing login session for each test
    context = await browser.newContext({ storageState: 'auth.json' });
    page = await context.newPage();
    await page.goto('http://localhost:3000');
  });

  test.afterEach(async () => {
    // 9️⃣ Close browser after each test
    await page.close();
    await context.close();
  });

  test.afterAll(async () => {
    // 🔟 Close the browser completely after all tests
    await browser.close();
  });

  test('should complete the full happy path', async () => {
    const todayDate = new Date().toISOString().split("T")[0];

    // ✅ Step 1: Add a new task
    await page.fill('input[placeholder="Task title..."]', 'End to End Task');
    await page.fill('input[placeholder="Description..."]', 'This is a happy flow test.');
    await page.selectOption('select', 'high');
    await page.fill('input[type="date"]', todayDate);
    await page.getByText('Add').click();

  //   // Ensure task appears in the list
  const taskLocator = page.locator('table tbody tr td:nth-child(1)', { hasText: "End to End Task" });
  await expect(taskLocator).toBeVisible({ timeout: 5000 });
  //   // ✅ Step 2: Edit the task
  //   await page.getByTestId('edit-task-btn').first().click();
  //   await page.fill('[data-testid="task-input"]', 'Updated Task Title');
  //   await page.getByTestId('save-task-btn').click();

  //   // Ensure task is updated
  //   await expect(page.locator('[data-testid="task-list"]')).toContainText('Updated Task Title');

  //   // ✅ Step 3: Mark task as completed
  //   await page.getByTestId('mark-complete-btn').first().click();

  //   // Ensure task is marked as completed
  //   await expect(page.locator('[data-testid="task-status"]')).toHaveText('completed');

  //   // ✅ Step 4: Delete the task
  //   await page.getByTestId('delete-task-btn').first().click();
  //   await expect(page.locator('[data-testid="task-list"]')).not.toContainText('Updated Task Title');
   });

});
