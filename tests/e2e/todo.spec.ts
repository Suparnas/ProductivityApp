import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:1337/api/auth/local/register';
const LOGIN_URL = 'http://localhost:1337/api/auth/local';

const testUser = {
  username: `testuser_${Date.now()}`,  // Unique username
  email: `testuser_${Date.now()}@mail.com`,
  password: 'TestPassword123'
};

const testTodos = [
  { title: "Task 1", description: "Description 1", status: "pending", priority: "low", dueDate: "2025-03-20" },
  { title: "Task 2", description: "Description 2", status: "in-progress", priority: "medium", dueDate: "2025-03-21" },
  { title: "Task 3", description: "Description 3", status: "completed", priority: "high", dueDate: "2025-03-22" }
];

test.describe('Todo App - Full End-to-End Flow', () => {
  let authToken;

  test('Register a new user via API', async ({ request }) => {
    const response = await request.post(API_URL, { 
      data: testUser 
    });
    expect(response.status()).toBe(200);
  });

//   test('Log in with registered user and get token', async ({ request }) => {
//     const response = await request.post(LOGIN_URL, {
//       data: {
//         identifier: testUser.email,
//         password: testUser.password
//       }
//     });
//     expect(response.status()).toBe(200);
//     const resBody = await response.json();
//     authToken = resBody.jwt;  // Store JWT for authenticated requests
//   });

  test('Log in via UI and add tasks', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click on Login button
    await page.click('button:has-text("Login")');

    // Fill login form
    await page.fill('input[placeholder="Username or Email"]', testUser.email);`1`
    await page.fill('input[placeholder="Password"]', testUser.password);

    // Submit login
    await page.getByRole('button', { name: 'Login' }).click();
    // Wait for dashboard to load
    await expect(page.locator('h2:has-text("Welcome")')).toBeVisible();

    // ✅ Add Todos
    for (const todo of testTodos) {
      await page.fill('input[placeholder="Task title..."]', todo.title);
      await page.fill('input[placeholder="Description..."]', todo.description);
      await page.selectOption('select', { value: todo.priority });
      await page.fill('input[type="date"]', todo.dueDate);
      await page.getByText('Add').click();
      await expect(page.locator(`text=${todo.title}`)).toBeVisible();
    }
  });
});
