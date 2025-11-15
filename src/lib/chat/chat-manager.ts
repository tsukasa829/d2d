import { ChatScript, Message, ScriptNode } from '../../types/chat';

export class ChatManager {
  private script: ChatScript;
  private index = 0;
  private messages: Message[] = [];
  private lastAnswer: string | null = null;
  private seq = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(script: ChatScript) {
    this.script = script;
  }

  initialize(): Message[] {
    this.messages = [];
    this.index = 0;
    this.lastAnswer = null;
    // 既存のタイマーはクリアしてから最初のBotメッセージを流す
    this.clearTimers();
    this.emitBotUntilUser();
    return [...this.messages];
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getCurrentChoices(): { label: string; value: string }[] {
    const node = this.script.nodes[this.index];
    if (node && node.type === 'user' && node.choices) return node.choices;
    return [];
  }

  handleUserChoice(choice: string): void {
    const node = this.script.nodes[this.index];
    if (!node || node.type !== 'user') return;

    // ユーザーメッセージを追加
    this.messages.push({
      id: `m-${Date.now()}-u-${this.seq++}`,
      type: 'user',
      content: choice,
      timestamp: new Date(),
      avatar: this.script.userAvatar,
    });
    this.lastAnswer = choice;

    // 次へ進める
    this.index++;

    // 0.5秒後にBotメッセージを続行
    // タイマーの重複を避けるため既存タイマーをクリアしてからセット
    this.clearTimers();
    const shortDelay = 500;
    const t = setTimeout(() => {
      this.emitBotUntilUser();
    }, shortDelay);
    this.timers.push(t);
  }

  // 連続するBotノードを消化して、次のUserノード/終端まで進める
  private emitBotUntilUser(): void {
    // 1行ごとの遅延秒（環境変数かデフォルト）
    const lineDelaySeconds = Number(process.env.NEXT_PUBLIC_BOT_LINE_DELAY ?? '0.5');
    const lineDelayMs = Math.max(0, lineDelaySeconds) * 1000;

    let accDelay = 0;
    while (this.index < this.script.nodes.length) {
      const node: ScriptNode = this.script.nodes[this.index];
      if (node.type === 'bot') {
        const fullText = this.interpolate(node.content);
        // 改行で分割して1行ごとに送る
        const lines = fullText.split('\n');
        const speakerId = node.speakerId ?? this.script.defaultBot;
        const avatar = speakerId && this.script.bots && this.script.bots[speakerId]
          ? this.script.bots[speakerId].avatar
          : (this.script.botAvatar || '/avatars/bot.png');

        // 先頭の1行は即時に追加しておく（initialize時の挙動に合わせるため）
        if (lines.length > 0) {
          const firstLine = lines[0];
          this.messages.push({
            id: `m-${Date.now()}-b-${this.seq++}`,
            type: 'bot',
            content: firstLine,
            timestamp: new Date(),
            avatar,
            imageUrl: node.imageUrl,
            buttonLabel: node.buttonLabel,
            buttonUrl: node.buttonUrl,
            buttons: node.buttons,
          });
        }
        

        // 1行目は既に追加したため、残りの行をスケジュール
        for (let i = 1; i < lines.length; i++) {
          const text = lines[i];
          const t = setTimeout(() => {
            this.messages.push({
              id: `m-${Date.now()}-b-${this.seq++}`,
              type: 'bot',
              content: text,
              timestamp: new Date(),
              avatar,
              imageUrl: node.imageUrl,
              buttonLabel: node.buttonLabel,
              buttonUrl: node.buttonUrl,
              buttons: node.buttons,
            });
          }, accDelay + lineDelayMs * (i - 1));
          this.timers.push(t);
        }
        // 次の行のスケジュールは既に積算済みとして、offsetを調整
        accDelay += lineDelayMs * Math.max(0, lines.length - 1);

        this.index++;
        continue;
      }
      if (node.type === 'user') {
        // ユーザー選択待ち
        break;
      }
      this.index++;
    }
  }

  private clearTimers(): void {
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
  }

  private interpolate(text: string): string {
    return text.replace(/\{\{\s*answer\s*\}\}/g, this.lastAnswer ?? '');
  }
}
