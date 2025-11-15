import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseScript } from '../script-parser';
import { ChatManager } from '../chat-manager';

const md = `---
userAvatar: /avatars/user.png
---

Bot: こんにちは！お名前を教えてください。

User:
- 山田太郎
- 田中花子

Bot: {{answer}}さん、ありがとうございます！
`;

describe('parseScript', () => {
  it('BotとUserノードを構築できる', () => {
    const s = parseScript(md);
    expect(s.userAvatar).toBe('/avatars/user.png');
    expect(s.nodes[0]).toMatchObject({ type: 'bot' });
    expect(s.nodes[1]).toMatchObject({ type: 'user' });
    expect(s.nodes[1].choices?.length).toBe(2);
  });
});

describe('parseScript - 画像・ボタン構文', () => {
  it('Bot[image]:を正しくパース', () => {
    const md = `Bot[image]: /test.png`;
    const s = parseScript(md);
    expect(s.nodes.length).toBe(1);
    expect(s.nodes[0].type).toBe('bot');
    expect(s.nodes[0].imageUrl).toBe('/test.png');
  });

  it('Bot[button]:を正しくパース', () => {
    const md = `Bot[button]: クリック | /page`;
    const s = parseScript(md);
    expect(s.nodes.length).toBe(1);
    expect(s.nodes[0].type).toBe('bot');
    expect(s.nodes[0].buttonLabel).toBe('クリック');
    expect(s.nodes[0].buttonUrl).toBe('/page');
  });

  it('Bot[buttons]:を正しくパース', () => {
    const md = `Bot[buttons]:
- A | /a
- B | /b`;
    const s = parseScript(md);
    expect(s.nodes.length).toBe(1);
    expect(s.nodes[0].type).toBe('bot');
    expect(s.nodes[0].buttons?.length).toBe(2);
    expect(s.nodes[0].buttons?.[0].label).toBe('A');
    expect(s.nodes[0].buttons?.[0].url).toBe('/a');
  });
});

describe('parseScript - o/x 選択肢 + requireCorrect', () => {
  it('o/x と個別wrongメッセージ、ヘッダ設定を解釈', () => {
    const md = `---\nuserAvatar: /u.png\ndefaultBot: guide\nrequireCorrect: true\nwrongMessage: "違います。もう一度。"\n---\n\nBot(guide): Q\n\nUser:\n- o: 正解\n- x: 不正解 | 個別メッセージ\n`;
    const s = parseScript(md);
    expect(s.requireCorrect).toBe(true);
    expect(s.wrongMessage).toBe('違います。もう一度。');
    expect(s.nodes[1].type).toBe('user');
    const ch = s.nodes[1].choices!;
    expect(ch[0]).toMatchObject({ label: '正解', correct: true });
    expect(ch[1]).toMatchObject({ label: '不正解', correct: false, wrongMessage: '個別メッセージ' });
  });
});

describe('parseScript - 複数Bot', () => {
  const mdMulti = `---\nuserAvatar: /avatars/user.png\ndefaultBot: guide\nbots:\n  guide:\n    displayName: ガイド\n    avatar: /avatars/guide.png\n  sales:\n    displayName: セールス\n    avatar: /avatars/sales.png\n---\n\nBot(guide): ようこそ\nBot(sales)[image]: /images/sample2.svg\n\nUser:\n- 進む\n- 戻る\n\nBot: 既定ボットメッセージ\n`;

  it('Bot(id)のspeakerIdを付与してパースできる', () => {
    const s = parseScript(mdMulti);
    expect(s.defaultBot).toBe('guide');
    expect(s.bots?.guide?.avatar).toBe('/avatars/guide.png');
    expect(s.nodes[0].speakerId).toBe('guide');
    expect(s.nodes[1].speakerId).toBe('sales');
    expect(s.nodes[1].imageUrl).toBe('/images/sample2.svg');
    // 省略時はspeakerId未設定
    expect(s.nodes[3].type).toBe('bot');
    expect(s.nodes[3].speakerId).toBeUndefined();
  });
});

describe('ChatManager', () => {
  beforeEach(() => {
    // テスト環境で遅延秒数を明示的に設定（未設定時は1秒デフォルトになるため）
    process.env.NEXT_PUBLIC_BOT_MESSAGE_DELAY = '0.5';
    vi.useFakeTimers();
  });

  it('initializeで最初のBotメッセージを返す', () => {
    const s = parseScript(md);
    const mgr = new ChatManager(s);
    const msgs = mgr.initialize();
    expect(msgs.length).toBe(1);
    expect(msgs[0].type).toBe('bot');
  });

  it('ユーザー選択後、0.5秒後に次のBotが出る', () => {
    const s = parseScript(md);
    const mgr = new ChatManager(s);
    mgr.initialize();
    mgr.handleUserChoice('山田太郎');
    // 直後はまだBotが追加されない
    expect(mgr.getMessages().filter(m => m.type==='bot').length).toBe(1);
    // 最初のタイマー（handleUserChoiceの500ms）が経過
    vi.advanceTimersByTime(500);
    // まだ次のBotメッセージはスケジュールされたが表示されていない（500ms後にスケジュール開始）
    // 次のBotメッセージは500ms後にスケジュールされ、さらに500ms後に表示される
    vi.advanceTimersByTime(500);
    // 追加された
    const bots = mgr.getMessages().filter(m => m.type==='bot');
    expect(bots.length).toBe(2);
    expect(bots[1].content.includes('山田太郎')).toBe(true);
  });

  it('複数Botのアバターを適用する', () => {
    const s = parseScript(`---\nuserAvatar: /avatars/user.png\ndefaultBot: guide\nbots:\n  guide:\n    avatar: /avatars/guide.png\n  sales:\n    avatar: /avatars/sales.png\n---\n\nBot(guide): ようこそ\nBot(sales): 商品をご紹介します\nUser:\n- 進む\n- 戻る\n\nBot: 既定です\n`);
    const mgr = new ChatManager(s);
    const msgs = mgr.initialize();
    // 連続する2つのBotメッセージ
    expect(msgs[0].avatar).toBe('/avatars/guide.png');
    expect(msgs[1].avatar).toBe('/avatars/sales.png');
    // ユーザー選択後の次のBot（省略形）はdefaultBotのアバター
    mgr.handleUserChoice('進む');
    // handleUserChoiceの500ms + 最初のBotメッセージの500ms = 1000ms
    vi.advanceTimersByTime(1000);
    const all = mgr.getMessages().filter(m => m.type==='bot');
    expect(all[2].avatar).toBe('/avatars/guide.png');
  });

  it('requireCorrect=true で誤答時は進まずフィードバックを表示', () => {
    const md = `---\nuserAvatar: /u.png\ndefaultBot: guide\nrequireCorrect: true\nwrongMessage: "違います。もう一度。"\nbots:\n  guide:\n    avatar: /g.png\n---\n\nBot(guide): Q\n\nUser:\n- x: ばつ\n- o: まる\n\nBot: 次\n`;
    const s = parseScript(md);
    const mgr = new ChatManager(s);
    mgr.initialize();
    // 誤答を選ぶ
    mgr.handleUserChoice('ばつ');
    // 即時にフィードバック(bot)が追加され、次のBotには進まない
    const bots = mgr.getMessages().filter(m => m.type==='bot');
    expect(bots.length).toBe(2); // 初期のQ + フィードバック
    expect(bots[1].content).toBe('違います。もう一度。');
    // タイマーを進めても次のBotは未表示（indexが進んでいない）
    vi.advanceTimersByTime(2000);
    const bots2 = mgr.getMessages().filter(m => m.type==='bot');
    expect(bots2.length).toBe(2);

    // 正解を選び直すと進行
    mgr.handleUserChoice('まる');
    vi.advanceTimersByTime(1000);
    const bots3 = mgr.getMessages().filter(m => m.type==='bot');
    expect(bots3.some(b => b.content === '次')).toBe(true);
  });
});
