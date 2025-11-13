import matter from 'gray-matter';
import { ChatScript, ScriptNode, Choice } from '../../types/chat';

// シンプルなMarkdown行パーサ
// - フロントマター: userAvatar, botAvatar
// - 本文: 行頭が "Bot:" / "User:" のブロックを解釈
//   - User ブロック直後の箇条書き (- ラベル) を選択肢として収集
export function parseScript(markdown: string): ChatScript {
  const { data, content } = matter(markdown);

  const userAvatar = String(data?.userAvatar || '/avatars/user.png');
  const botAvatar = data?.botAvatar ? String(data.botAvatar) : '/avatars/bot.png';
  const defaultBot = data?.defaultBot ? String(data.defaultBot) : undefined;
  const bots = typeof data?.bots === 'object' ? (data.bots as Record<string, { displayName?: string; avatar: string }>) : undefined;

  const lines = content.split(/\r?\n/);
  const nodes: ScriptNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }

    // Bot(id)[image]:
    const mImage = line.match(/^Bot\(([^)]+)\)\[image\]:\s*(.+)$/);
    if (mImage) {
      const [, speakerId, url] = mImage;
      nodes.push({ type: 'bot', content: '', imageUrl: url.trim(), speakerId });
      i++;
      continue;
    }
    // Bot[image]: (既存形式)
    if (line.startsWith('Bot[image]:')) {
      const imageUrl = line.replace(/^Bot\[image\]:\s?/, '').trim();
      nodes.push({ type: 'bot', content: '', imageUrl });
      i++;
      continue;
    }

    // Bot(id)[button]:
    const mButton = line.match(/^Bot\(([^)]+)\)\[button\]:\s*(.+)$/);
    if (mButton) {
      const [, speakerId, rest] = mButton;
      const [label, url] = rest.split('|').map(s => s.trim());
      nodes.push({ type: 'bot', content: '', buttonLabel: label, buttonUrl: url, speakerId });
      i++;
      continue;
    }
    // Bot[button]:
    if (line.startsWith('Bot[button]:')) {
      const rest = line.replace(/^Bot\[button\]:\s?/, '').trim();
      const [label, url] = rest.split('|').map(s => s.trim());
      nodes.push({ type: 'bot', content: '', buttonLabel: label, buttonUrl: url });
      i++;
      continue;
    }

    // Bot(id)[buttons]:
    const mButtons = line.match(/^Bot\(([^)]+)\)\[buttons\]:\s*$/);
    if (mButtons) {
      const [, speakerId] = mButtons;
      const buttons: { label: string; url: string }[] = [];
      i++;
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) { i++; continue; }
        if (l.startsWith('- ')) {
          const rest = l.replace(/^-\s+/, '');
          const [label, url] = rest.split('|').map(s => s.trim());
          buttons.push({ label, url });
          i++;
          continue;
        }
        break;
      }
      nodes.push({ type: 'bot', content: '', buttons, speakerId });
      continue;
    }
    // Bot[buttons]:
    if (line.startsWith('Bot[buttons]:')) {
      const buttons: { label: string; url: string }[] = [];
      i++;
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) { i++; continue; }
        if (l.startsWith('- ')) {
          const rest = l.replace(/^-\s+/, '');
          const [label, url] = rest.split('|').map(s => s.trim());
          buttons.push({ label, url });
          i++;
          continue;
        }
        break;
      }
      nodes.push({ type: 'bot', content: '', buttons });
      continue;
    }

    // Bot(id): テキスト
    const mBotText = line.match(/^Bot\(([^)]+)\):\s*(.*)$/);
    if (mBotText) {
      const [, speakerId, text] = mBotText;
      nodes.push({ type: 'bot', content: text.trim(), speakerId });
      i++;
      continue;
    }
    // Bot: テキスト（既存形式）
    if (line.startsWith('Bot:')) {
      const contentLine = line.replace(/^Bot:\s?/, '').trim();
      nodes.push({ type: 'bot', content: contentLine });
      i++;
      continue;
    }

    if (line.startsWith('User:')) {
      // 次行以降の箇条書きを choices として収集
      const choices: Choice[] = [];
      i++;
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) { i++; continue; }
        if (l.startsWith('- ')) {
          const label = l.replace(/^-\s+/, '');
          choices.push({ label, value: label });
          i++;
          continue;
        }
        break;
      }
      nodes.push({ type: 'user', content: '', choices });
      continue;
    }

    // 未知行は無視
    i++;
  }

  return { userAvatar, botAvatar, defaultBot, bots, nodes };
}
