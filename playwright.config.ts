import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration
 * - Chromium only (headless)
 * - Fast fail on errors
 * - Optimized for Copilot development
 */
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
    // ベースURL
    baseURL: 'http://localhost:3000',
    
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
  
  // devサーバー自動起動（オプション）
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
