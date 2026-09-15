export type Allocation = {
  work: number;
  rest: number;
  study: number;
  play: number;
  jobHunt: number; // 転職活動
};

export type Position = {
  id: string;
  name: string;
  minSalary: number;
  maxSalary: number;
  requiredTech: number;
  requiredNetwork: number;
  requiredTenure: number;
  isExecutive: boolean;
};

export type Company = {
  id: string;
  name: string;
  rank: number; // 1: tier1, 2: tier2, 3: tier3
  corporateType: 'domestic' | 'foreign';
  baseRaiseRate: number; // 昇給の目安
  loanInterestRate: number; // ローン金利 (0.01 = 1%)
  requiredTech: number; // 入社するための最低技術力
  requiredNetwork: number; // 入社するための最低人脈
  positions: Position[];
  projects: Project[];
};

export type Property = {
  id: string;
  name: string;
  type: 'rent' | 'buy';
  price: number; // 賃貸: 月額(万), 購入: 価格(万)
  initialCost: number; // 賃貸: 礼金など(万)
  depreciationRate?: number; // 購入時の毎年の価値下落率（例：0.05 = 5%減）
};

export type OwnedProperty = Property & {
  ownedYears: number;
};

export type Car = {
  id: string;
  name: string;
  price: number; // 価格(万)
  depreciationRate: number; // 毎年の価値下落率（例：0.1 = 10%減）
};

export type OwnedCar = Car & {
  ownedYears: number;
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

export type JobOffer = {
  companyId: string;
  positionId: string;
  offeredSalary: number;
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

  // 転職・給与・役職・年金関連
  companyId: string;
  companyTenure: number;
  positionId: string;
  salary: number; // 今年の基本給
  pensionFund: number;
  isRetired: boolean;
  targetCompanyId: string | null;
  pendingOffer: JobOffer | null;

  // 資産・負債
  property: OwnedProperty | null;
  car: OwnedCar | null;
  loans: Loan[];
};

export type GameState = {
  player: PlayerState;
  allocation: Allocation;
  turn: number;
};
