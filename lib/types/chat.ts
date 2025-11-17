export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  avatar?: string;
  imageUrl?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  buttons?: NavigationButton[];
}

export interface Choice {
  label: string;
  value: string;
  correct?: boolean;
  wrongMessage?: string;
}

export interface NavigationButton {
  label: string;
  url: string;
}

export interface ScriptNode {
  type: 'bot' | 'user';
  content: string;
  choices?: Choice[];
  imageUrl?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  buttons?: NavigationButton[];
  speakerId?: string; // 複数Bot対応: 話者ID
}

export interface ChatScript {
  userAvatar: string;
  botAvatar?: string;
  defaultBot?: string;
  requireCorrect?: boolean;
  wrongMessage?: string;
  bots?: Record<string, { displayName?: string; avatar: string }>;
  nodes: ScriptNode[];
}
