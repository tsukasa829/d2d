import { test, expect } from '@playwright/test';

/**
 * トップページ（目次）の基本的な表示テスト
 * - エラーなく表示されること
 * - 7日間プログラムの見出しが存在すること
 * - 少なくとも1つのDay項目が存在すること
 */
test('トップページが正常に表示される', async ({ page }) => {
  // / にアクセス
  await page.goto('/');
  
  // ページタイトルにエラーが含まれていないことを確認
  const title = await page.title();
  expect(title).not.toMatch(/error|404|500/i);
  
  // 7日間プログラムの見出しが表示されることを確認
  await expect(page.getByText('7日間プログラム')).toBeVisible();
  
  // 少なくとも1つのDay項目が存在することを確認（内容は問わない）
  const dayElements = page.locator('text=/Day \\d+/');
  await expect(dayElements.first()).toBeVisible();
  
  // コンソールエラーが出ていないことを確認
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      throw new Error(`Console error detected: ${msg.text()}`);
    }
  });
});
