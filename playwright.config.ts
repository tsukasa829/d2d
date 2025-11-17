import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration
 * - Chromium only (headless)
 * - Fast fail on errors
 * - Optimized for Copilot development
 */
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const isExternal = !!process.env.BASE_URL && !/localhost|127\.0\.0\.1/i.test(process.env.BASE_URL);

export default defineConfig({
  testDir: './e2e',
  
  // 並列実行なし（デバッグしやすい）
  fullyParallel: false,
  workers: 1,
  
  // エラー時すぐに終了
  maxFailures: 1,
  
  // リトライなし（エラーを即座に把握）
  retries: 0,
  
  // タイムアウト設定
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  
  // レポート設定（簡潔に）
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  
  use: {
    // ベースURL（環境変数で上書き可能）
    baseURL,
    
    // トレース（失敗時のみ）
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // ヘッドレスモード
    headless: true,
  },
  
  // Chromiumのみ
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // devサーバー自動起動（BASE_URLが外部の場合は無効化）
  webServer: isExternal
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
