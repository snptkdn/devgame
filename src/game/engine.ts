import type { PlayerState, Allocation, LivingStandards, Project } from './types';

export const AVAILABLE_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: '【保守】社内ツールの運用保守',
    description: '簡単な業務。成長は少ないが確実。',
    durationYears: 1,
    requiredTech: 0,
    techGrowthPerYear: 5,
    completionBonusTech: 2,
    completionBonusFunds: 50
  },
  {
    id: 'proj_2',
    name: '【開発】新規Webサービス開発',
    description: '一般的な開発案件。着実にスキルが身につく。',
    durationYears: 2,
    requiredTech: 20,
    techGrowthPerYear: 15,
    completionBonusTech: 10,
    completionBonusFunds: 200
  },
  {
    id: 'proj_3',
    name: '【基盤】大規模システムのリプレイス',
    description: '長期間拘束されるが、完了時の見返りは大きい。',
    durationYears: 3,
    requiredTech: 50,
    techGrowthPerYear: 20,
    completionBonusTech: 30,
    completionBonusFunds: 500
  },
  {
    id: 'proj_4',
    name: '【先端】AIアルゴリズム研究開発',
    description: '高度な技術を要求される最先端プロジェクト。',
    durationYears: 4,
    requiredTech: 100,
    techGrowthPerYear: 30,
    completionBonusTech: 60,
    completionBonusFunds: 1000
  }
];

export const generateIntelligence = (): number => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  const stdNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const mean = 1.0;
  const stdDev = 0.2;
  return Math.max(0.2, Math.min(1.8, mean + stdDev * stdNormal));
};

export const createInitialState = (): PlayerState => {
  return {
    age: 22,
    funds: 100,
    tech: 10,
    health: 100,
    network: 10,
    intelligence: generateIntelligence(),
    isAlive: true,
    livingStandards: {
      housing: 1,
      food: 1,
      entertainment: 1
    },
    currentProject: null,
    projectYearsLeft: 0,
    history: ["人生シミュレーションを開始しました。"],
  };
};

export const calculateDeathProbability = (age: number, health: number): number => {
  let baseProb = 0.001;

  if (age > 80) baseProb = 0.15;
  else if (age > 70) baseProb = 0.05;
  else if (age > 60) baseProb = 0.015;
  else if (age > 50) baseProb = 0.005;
  else if (age > 40) baseProb = 0.002;

  const healthFactor = Math.max(1, 10 - (health / 10));
  return baseProb * healthFactor;
};

// 生活費の算出（カテゴリ別）
export const calculateHousingCost = (level: number) => 60 * Math.pow(1.5, level - 1);
export const calculateFoodCost = (level: number) => 40 * Math.pow(1.4, level - 1);
export const calculateEntertainmentCost = (level: number) => 20 * Math.pow(1.8, level - 1);

export const calculateTotalLivingCost = (standards: LivingStandards): number => {
  return calculateHousingCost(standards.housing) +
         calculateFoodCost(standards.food) +
         calculateEntertainmentCost(standards.entertainment);
};

export const processTurn = (player: PlayerState, allocation: Allocation): PlayerState => {
  const nextPlayer = { ...player, history: [...player.history], livingStandards: { ...player.livingStandards } };
  const logs: string[] = [];
  logs.push(`--- ${nextPlayer.age}歳の1年 ---`);

  // 1. 各行動の結果を計算

  // 休養
  const restFactor = allocation.rest / 100;
  // 住居レベルが休養の効果に影響を与える
  const housingBonus = (nextPlayer.livingStandards.housing - 1) * 5;
  const healthDelta = Math.floor(-15 + (40 * restFactor)) + housingBonus;
  nextPlayer.health = Math.min(100, Math.max(0, nextPlayer.health + healthDelta));

  // 食費が低すぎると健康にダメージ
  if (nextPlayer.livingStandards.food === 1) nextPlayer.health = Math.max(0, nextPlayer.health - 5);
  else if (nextPlayer.livingStandards.food >= 4) nextPlayer.health = Math.min(100, nextPlayer.health + 5);

  if (healthDelta < 0) logs.push(`休養不足や住環境の影響で健康が低下した。`);
  else if (healthDelta > 0) logs.push(`しっかり休養を取り、健康を維持した。`);

  // 勉強
  const studyFactor = allocation.study / 100;
  let techGrowth = Math.floor(15 * studyFactor * nextPlayer.intelligence);

  // 遊ぶ
  const playFactor = allocation.play / 100;
  // 娯楽レベルが人脈形成に影響
  const entertainmentBonus = (nextPlayer.livingStandards.entertainment - 1) * 3;
  const networkGrowth = Math.floor(10 * playFactor) + entertainmentBonus;
  nextPlayer.network += networkGrowth;
  if (networkGrowth > 0) logs.push(`遊びを通じて人脈を広げた。`);

  // 仕事（プロジェクト）
  const workFactor = allocation.work / 100;
  let earned = 0;

  // サラリーマンの給与計算
  // 基本給 200万 + 技術力に応じた能力給
  const baseSalary = 200;
  const abilitySalary = Math.floor(nextPlayer.tech * 2.5 * nextPlayer.intelligence); // 駆け出し(10)で約25万, ベテラン(150)で約375万
  const standardSalary = baseSalary + abilitySalary;

  // ワークライフバランス（残業代的な概念）
  // 仕事割合50%を標準とし、それ以上は残業代として加算
  const overtimeFactor = Math.max(0, workFactor - 0.5) * 2; // 50%~100%を0~1.0にマッピング
  const overtimePay = Math.floor(standardSalary * 0.4 * overtimeFactor); // 最大40%増し

  earned = standardSalary + overtimePay;

  if (nextPlayer.currentProject) {
    const proj = nextPlayer.currentProject;
    logs.push(`案件「${proj.name}」に従事。（残り${nextPlayer.projectYearsLeft}年）`);

    // プロジェクトによる技術力向上
    const projTechGrowth = Math.floor(proj.techGrowthPerYear * workFactor * nextPlayer.intelligence);
    techGrowth += projTechGrowth;

    nextPlayer.projectYearsLeft -= 1;

    if (nextPlayer.projectYearsLeft <= 0) {
      logs.push(`【案件完遂！】「${proj.name}」を見事にやり遂げた！`);
      logs.push(`ボーナスとして資金 ${proj.completionBonusFunds}万円、技術力 ${proj.completionBonusTech} を獲得！`);
      earned += proj.completionBonusFunds;
      techGrowth += proj.completionBonusTech;
      nextPlayer.currentProject = null;
    }
  } else {
    logs.push(`特に決まった案件を持たず、定常業務をこなした。`);
  }

  nextPlayer.tech += techGrowth;
  if (techGrowth > 5) logs.push(`勉強や仕事の成果が出て、技術力が ${techGrowth} 向上した。`);

  nextPlayer.funds += earned;

  // 2. 生活費の支払い
  const livingCost = Math.floor(calculateTotalLivingCost(nextPlayer.livingStandards));
  nextPlayer.funds -= livingCost;

  if (nextPlayer.funds < 0) {
    logs.push(`資金が底をつき、借金生活に突入した...（ストレスで健康激減）`);
    nextPlayer.health -= 30; // 借金ペナルティ
  } else {
    logs.push(`給与 ${earned}万円 を得て、生活費 ${livingCost}万円 を支出した。`);
  }

  // 3. 死亡判定
  const deathProb = calculateDeathProbability(nextPlayer.age, nextPlayer.health);
  if (Math.random() < deathProb) {
    nextPlayer.isAlive = false;
    logs.push(`【死亡】 ${nextPlayer.age}歳、その生涯を閉じた。`);
  } else {
    nextPlayer.age += 1;
  }

  nextPlayer.history = [...nextPlayer.history, ...logs];
  return nextPlayer;
};
