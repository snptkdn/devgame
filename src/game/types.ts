export type Allocation = {
  work: number;
  rest: number;
  study: number;
  play: number;
  jobHunt: number; // 転職活動
};

export type Company = {
  id: string;
  name: string;
  rank: number; // 1: tier1, 2: tier2, 3: tier3
  baseRaiseRate: number; // 昇給の目安
  loanInterestRate: number; // ローン金利 (0.01 = 1%)
  requiredTech: number;
  requiredNetwork: number;
};

export type Property = {
  id: string;
  name: string;
  type: 'rent' | 'buy';
  price: number; // 賃貸: 家賃/年(万), 購入: 価格(万)
  initialCost: number; // 賃貸: 礼金など(万)
};

export type Car = {
  id: string;
  name: string;
  price: number; // 価格(万)
};

export type Loan = {
  id: string;
  name: string;
  remainingPrincipal: number; // 残債
  interestRate: number; // 年利
  remainingYears: number; // 残り年数
  yearlyPayment: number; // 年間の返済額
};

export type LivingStandards = {
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
  completionBonusFunds: number; // 調整予定
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

  // 転職・給与関連
  companyId: string;
  salary: number; // 今年の基本給

  // 資産・負債
  property: Property | null;
  car: Car | null;
  loans: Loan[];
};

export type GameState = {
  player: PlayerState;
  allocation: Allocation;
  turn: number;
};
