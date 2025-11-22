#!/usr/bin/env node

const { execSync } = require('child_process');

function run(command, options = {}) {
  console.log(`\n▶️  ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ コマンド実行エラー: ${command}`);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 デプロイを開始します...\n');

  // 1. ビルド
  console.log('📦 ビルド中...');
  run('npm run build');

  // 2. Git プッシュ
  console.log('\n📤 GitHub にプッシュ中...');
  run('git push');

  // 3. Netlify デプロイ監視
  console.log('\n⏳ Netlify のデプロイを監視中...');
  console.log('   (最新のデプロイが完了するまで待機します)\n');
  
  try {
    run('netlify watch');
  } catch (error) {
    // netlify watch はデプロイ完了後に終了するため、エラーではない
    console.log('\n✅ デプロイが完了しました！');
  }
}

main().catch((error) => {
  console.error('❌ デプロイに失敗しました:', error);
  process.exit(1);
});
