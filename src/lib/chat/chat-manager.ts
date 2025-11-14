import { ChatScript, Message, ScriptNode } from '../../types/chat';

export class ChatManager {
  private script: ChatScript;
  private index = 0;
  private messages: Message[] = [];
  private lastAnswer: string | null = null;
  private seq = 0;

  constructor(script: ChatScript) {
    this.script = script;
  }

  initialize(): Message[] {
    this.messages = [];
    this.index = 0;
    this.lastAnswer = null;
    // 最初のBotメッセージを流す
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
    setTimeout(() => {
      this.emitBotUntilUser();
    }, 500);
  }

  // 連続するBotノードを消化して、次のUserノード/終端まで進める
  private emitBotUntilUser(): void {
    while (this.index < this.script.nodes.length) {
      const node: ScriptNode = this.script.nodes[this.index];
      if (node.type === 'bot') {
        const text = this.interpolate(node.content);
        const speakerId = node.speakerId ?? this.script.defaultBot;
        const avatar = speakerId && this.script.bots && this.script.bots[speakerId]
          ? this.script.bots[speakerId].avatar
          : (this.script.botAvatar || '/avatars/bot.png');
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

  private interpolate(text: string): string {
    return text.replace(/\{\{\s*answer\s*\}\}/g, this.lastAnswer ?? '');
  }
}
