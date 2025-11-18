export interface StageRule {
  path: string;
  requiredStage: number;  // このstageのときに訪問可能
  nextStage: number;       // 訪問時に進める先のstage
  maxStage?: number;       // これ以上のstageでは訪問不可（未指定なら無制限）
}

export const STAGE_RULES: StageRule[] = [
  { path: '/chat/day1', requiredStage: 0, nextStage: 1, maxStage: 1 },
  { path: '/chat/day1-confirm', requiredStage: 1, nextStage: 1.1, maxStage: 1.1 },
  { path: '/chat/day2', requiredStage: 1.1, nextStage: 2, maxStage: 2 },
  { path: '/chat/day3', requiredStage: 2, nextStage: 3, maxStage: 3 },
  { path: '/chat/day4', requiredStage: 3, nextStage: 4, maxStage: 4 },
  { path: '/chat/day5', requiredStage: 4, nextStage: 5, maxStage: 5 },
  { path: '/chat/day6', requiredStage: 5, nextStage: 6, maxStage: 6 },
  { path: '/chat/day7', requiredStage: 6, nextStage: 7, maxStage: 7 },
];
