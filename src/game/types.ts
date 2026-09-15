export type Allocation = {
  work: number;
  rest: number;
  study: number;
  play: number;
};

export type PlayerState = {
  age: number;
  funds: number;
  tech: number;
  health: number;
  network: number;
  intelligence: number; // 地頭の良さ (0.0 ~ 2.0 程度, 1.0が平均)
  isAlive: boolean;
  livingStandardLevel: number;
  history: string[]; // 過去のログ
};

export type GameState = {
  player: PlayerState;
  allocation: Allocation;
  turn: number;
};
