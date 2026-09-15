export type Allocation = {
  work: number;
  rest: number;
  study: number;
  play: number;
};

export type LivingStandards = {
  housing: number;
  food: number;
  entertainment: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  durationYears: number;
  requiredTech: number;
  techGrowthPerYear: number;
  completionBonusTech: number;
  completionBonusFunds: number;
};

export type PlayerState = {
  age: number;
  funds: number;
  tech: number;
  health: number;
  network: number;
  intelligence: number;
  isAlive: boolean;
  livingStandards: LivingStandards;
  currentProject: Project | null;
  projectYearsLeft: number;
  history: string[];
};

export type GameState = {
  player: PlayerState;
  allocation: Allocation;
  turn: number;
};
