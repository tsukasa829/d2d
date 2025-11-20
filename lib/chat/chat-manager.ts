import { ChatScript, Message, ScriptNode } from '../types/chat';

export class ChatManager {
  private script: ChatScript;
  private index = 0;
  private messages: Message[] = [];
  private lastAnswer: string | null = null;
  private seq = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private defaultUserAvatar: string; // デフォルトアバターを保存

  constructor(script: ChatScript) {
    this.script = script;
    this.defaultUserAvatar = script.userAvatar; // 初期値を保存
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

    // 現在の選択肢から選択内容を特定
    const selected = node.choices?.find(c => c.value === choice || c.label === choice);

    // ユーザーメッセージを追加
    this.messages.push({
      id: `m-${Date.now()}-u-${this.seq++}`,
      type: 'user',
      content: choice,
      timestamp: new Date(),
      avatar: this.script.userAvatar,
    });
    this.lastAnswer = choice;

    const requireCorrect = !!this.script.requireCorrect;
    const isCorrect = selected?.correct === true || !requireCorrect;

    if (!isCorrect) {
      // 不正解: 進行を止めて、その場でフィードバックを表示（defaultBot が話す）
      const feedback = selected?.wrongMessage || this.script.wrongMessage || '違います。もう一度選んでください。';
      const defaultBotId = this.script.defaultBot;
      const avatar = defaultBotId && this.script.bots && this.script.bots[defaultBotId]
        ? this.script.bots[defaultBotId].avatar
        : (this.script.botAvatar || '/avatars/bot.png');

      this.messages.push({
        id: `m-${Date.now()}-b-${this.seq++}`,
        type: 'bot',
        content: feedback,
        timestamp: new Date(),
        avatar,
      });
      // index は据え置き、タイマーは張らない
      return;
    }

    // 正解 or 正解不要: 次へ進める
    this.index++;

    // 次のBotメッセージを遅延で続行
    this.clearTimers();
    const shortDelay = Number(process.env.NEXT_PUBLIC_BOT_MESSAGE_DELAY ?? '1') * 1000;
    const t = setTimeout(() => {
      this.emitBotUntilUser(true);
    }, shortDelay);
    this.timers.push(t);
  }

  // 連続するBotノードを消化して、次のUserノード/終端まで進める
  private emitBotUntilUser(delaySubsequent: boolean = false): void {
    // 1メッセージごとの遅延秒（環境変数かデフォルト）
    const msgDelaySec = Number(process.env.NEXT_PUBLIC_BOT_MESSAGE_DELAY ?? '1');
    const msgDelayMs = Math.max(0, msgDelaySec) * 1000;

    let accDelay = 0;
    while (this.index < this.script.nodes.length) {
      const node: ScriptNode = this.script.nodes[this.index];
      
      // User[avatar]: ノードの処理 - ユーザーアバターを更新
      if (node.type === 'user-avatar' && node.avatarUrl) {
        const url = node.avatarUrl.trim();
        
        // 'default' キーワードでデフォルトアバターに戻す
        if (url === 'default') {
          this.script.userAvatar = this.defaultUserAvatar;
        }
        // defaultUser.png が指定された場合はアバターを非表示にする
        else if (url.includes('defaultUser.png')) {
          this.script.userAvatar = '';
        }
        // その他のパスはそのまま設定
        else {
          this.script.userAvatar = url;
        }
        
        this.index++;
        continue;
      }
      
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
        // - If delaySubsequent is true, schedule all bot nodes with per-message delay
        
        if (delaySubsequent) {
          // Schedule all bot nodes with per-message delay (including first)
          for (let k = 0; k < botNodes.length; k++) {
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
            }, accDelay + msgDelayMs * k);
            this.timers.push(t);
          }
          // Advance accDelay by the total scheduled time
          accDelay += msgDelayMs * botNodes.length;
        } else {
          // No delay: push all bot messages immediately
          for (let k = 0; k < botNodes.length; k++) {
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
