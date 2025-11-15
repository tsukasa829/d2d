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
    this.emitBotUntilUser(false);
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
    const shortDelay = Number(process.env.NEXT_PUBLIC_BOT_MESSAGE_DELAY ?? process.env.NEXT_PUBLIC_BOT_LINE_DELAY ?? '0.5') * 1000;
    const t = setTimeout(() => {
      this.emitBotUntilUser(true);
    }, shortDelay);
    this.timers.push(t);
  }

  // 連続するBotノードを消化して、次のUserノード/終端まで進める
  private emitBotUntilUser(delaySubsequent: boolean = false): void {
    // 1メッセージごとの遅延秒（環境変数かデフォルト）
    const msgDelaySec = Number(process.env.NEXT_PUBLIC_BOT_MESSAGE_DELAY ?? process.env.NEXT_PUBLIC_BOT_LINE_DELAY ?? '0.5');
    const msgDelayMs = Math.max(0, msgDelaySec) * 1000;

    let accDelay = 0;
    while (this.index < this.script.nodes.length) {
      const node: ScriptNode = this.script.nodes[this.index];
      if (node.type === 'bot') {
        const fullText = this.interpolate(node.content);
        const getAvatarFor = (n: ScriptNode) => {
          const sp = n.speakerId ?? this.script.defaultBot;
          return sp && this.script.bots && this.script.bots[sp]
            ? this.script.bots[sp].avatar
            : (this.script.botAvatar || '/avatars/bot.png');
        };

        // Collect consecutive bot nodes to schedule per-message delay
        const botNodes: ScriptNode[] = [];
        let j = this.index;
        while (j < this.script.nodes.length && this.script.nodes[j].type === 'bot') {
          botNodes.push(this.script.nodes[j]);
          j++;
        }
        // Behavior:
        // - If delaySubsequent is false (initial call), push all consecutive bot nodes immediately
        // - If delaySubsequent is true, push only the first bot immediately and schedule subsequent bot nodes
        
        // Push first bot message immediately
        const firstNode = botNodes[0];
        const firstText = this.interpolate(firstNode.content);
        this.messages.push({
          id: `m-${Date.now()}-b-${this.seq++}`,
          type: 'bot',
          content: firstText,
          timestamp: new Date(),
          avatar: getAvatarFor(firstNode),
          imageUrl: firstNode.imageUrl,
          buttonLabel: firstNode.buttonLabel,
          buttonUrl: firstNode.buttonUrl,
          buttons: firstNode.buttons,
        });

        if (delaySubsequent) {
          // Schedule subsequent bot nodes with per-message delay
          for (let k = 1; k < botNodes.length; k++) {
          const nodeToSend = botNodes[k];
          const text = this.interpolate(nodeToSend.content);
          const t = setTimeout(() => {
            this.messages.push({
              id: `m-${Date.now()}-b-${this.seq++}`,
              type: 'bot',
              content: text,
              timestamp: new Date(),
              avatar: getAvatarFor(nodeToSend),
              imageUrl: nodeToSend.imageUrl,
              buttonLabel: nodeToSend.buttonLabel,
              buttonUrl: nodeToSend.buttonUrl,
              buttons: nodeToSend.buttons,
            });
          }, accDelay + msgDelayMs * (k - 1));
          this.timers.push(t);
          }
          // Advance accDelay by the number of scheduled messages
          accDelay += msgDelayMs * Math.max(0, botNodes.length - 1);
        } else {
          // No delay: push all remaining bot messages immediately
          for (let k = 1; k < botNodes.length; k++) {
            const nodeToSend = botNodes[k];
            const text = this.interpolate(nodeToSend.content);
            this.messages.push({
              id: `m-${Date.now()}-b-${this.seq++}`,
              type: 'bot',
              content: text,
              timestamp: new Date(),
              avatar: getAvatarFor(nodeToSend),
              imageUrl: nodeToSend.imageUrl,
              buttonLabel: nodeToSend.buttonLabel,
              buttonUrl: nodeToSend.buttonUrl,
              buttons: nodeToSend.buttons,
            });
          }
        }

        // Advance accDelay by the number of scheduled messages
        // Move index past all processed bot nodes
        this.index = j;
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
