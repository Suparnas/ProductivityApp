import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly addButton: Locator;
  readonly taskList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.locator('[data-testid="task-input"]'); // Update with actual selector
    this.addButton = page.locator('[data-testid="add-task-btn"]'); // Update with actual selector
    this.taskList = page.locator('[data-testid="task-list"]');
  }

  async addTask(task: string) {
    await this.taskInput.fill(task);
    await this.addButton.click();
  }

  async getTaskCount() {
    return await this.taskList.locator('li').count();
  }
}
