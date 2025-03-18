import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todoPage';

// test('Add multiple tasks to the ToDo app', async ({ page }) => {
//   const todoPage = new TodoPage(page);
  
//   // Go to the app
//   await page.goto('/');

//   // Get initial task count
//   const initialCount = await todoPage.getTaskCount();

//   // Add multiple tasks
//   await todoPage.addTask('Buy groceries');
//   await todoPage.addTask('Call mom');
//   await todoPage.addTask('Finish Playwright setup');

//   // Verify new tasks are added
//   const finalCount = await todoPage.getTaskCount();
//   expect(finalCount).toBe(initialCount + 3);
// });
