import { test, expect } from '@playwright/test';

/**
 * トップページ（目次）の基本的な表示テスト
 * - エラーなく表示されること
 * - 7日間プログラムの見出しが存在すること
 * - 少なくとも1つのDay項目が存在すること
 */
test('トップページが正常に表示される @smoke', async ({ page }) => {
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

/**
 * 管理画面で現在のユーザーがハイライトされ、1日パスが無効になっていることを確認
 * - /admin にアクセス
 * - ハイライトされた行（bg-blue-50）が存在すること
 * - その行の1日パス項目が「無効」になっていること
 */
test('管理画面でハイライト行の1日パスが無効になっている', async ({ page }) => {
  // まず / にアクセスしてセッション初期化
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // /admin にアクセス
  await page.goto('/admin');
  
  // ハイライトされた行を探す（bg-blue-50 クラスを持つ tr）
  const highlightedRow = page.locator('tr.bg-blue-50');
  await expect(highlightedRow).toBeVisible();
  
  // ハイライト行内の1日パス列（4列目）のボタンを取得
  const oneDayPassButton = highlightedRow.locator('td').nth(3).locator('button');
  await expect(oneDayPassButton).toBeVisible();
  
  // ボタンのテキストが「無効」であることを確認
  await expect(oneDayPassButton).toHaveText('無効');
  
  // ボタンのスタイルが無効状態（bg-gray-100）であることを確認
  await expect(oneDayPassButton).toHaveClass(/bg-gray-100/);
});

/**
 * 1日パス購入成功後、管理画面で1日パスが有効になることを確認
 * - /product/1daypass/success にアクセス（購入完了処理をトリガー）
 * - /admin にアクセス
 * - ハイライト行の1日パス項目が「有効」になっていること
 */
test('購入成功後に管理画面で1日パスが有効になる', async ({ page }) => {
  // まず / にアクセスしてセッション初期化
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // /product/1daypass/success にアクセス（購入完了処理）
  await page.goto('/product/1daypass/success');
  
  // 処理完了まで待機（「1日パス購入完了」が表示されるまで）
  await expect(page.getByText('1日パス購入完了')).toBeVisible({ timeout: 10000 });
  
  // /admin にアクセス
  await page.goto('/admin');
  
  // ハイライトされた行を探す
  const highlightedRow = page.locator('tr.bg-blue-50');
  await expect(highlightedRow).toBeVisible();
  
  // ハイライト行内の1日パス列（4列目）のボタンを取得
  const oneDayPassButton = highlightedRow.locator('td').nth(3).locator('button');
  await expect(oneDayPassButton).toBeVisible();
  
  // ボタンのテキストが「有効」であることを確認
  await expect(oneDayPassButton).toHaveText('有効');
  
  // ボタンのスタイルが有効状態（bg-green-100）であることを確認
  await expect(oneDayPassButton).toHaveClass(/bg-green-100/);
});

/**
 * スタンダードプラン購入成功後、管理画面でスタンダードが有効になることを確認
 * - /product/standerd/success にアクセス（購入完了処理をトリガー）
 * - /admin にアクセス
 * - ハイライト行のスタンダード項目が「有効」になっていること
 */
test('スタンダードプラン購入成功後に管理画面でスタンダードが有効になる', async ({ page }) => {
  // まず / にアクセスしてセッション初期化
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // /product/standerd/success にアクセス（購入完了処理）
  await page.goto('/product/standerd/success');
  
  // 処理完了まで待機（「スタンダードプラン購入完了」が表示されるまで）
  await expect(page.getByText('スタンダードプラン購入完了')).toBeVisible({ timeout: 10000 });
  
  // /admin にアクセス
  await page.goto('/admin');
  
  // ハイライトされた行を探す
  const highlightedRow = page.locator('tr.bg-blue-50');
  await expect(highlightedRow).toBeVisible();
  
  // ハイライト行内のスタンダード列（5列目）のボタンを取得
  const standardButton = highlightedRow.locator('td').nth(4).locator('button');
  await expect(standardButton).toBeVisible();
  
  // ボタンのテキストが「有効」であることを確認
  await expect(standardButton).toHaveText('有効');
  
  // ボタンのスタイルが有効状態（bg-blue-100）であることを確認
  await expect(standardButton).toHaveClass(/bg-blue-100/);
});

// トライアル機能は削除済みのため、関連E2Eテストも削除しました。
