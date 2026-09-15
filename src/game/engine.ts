import type { PlayerState, Allocation, Project } from './types';
import { COMPANIES, PROPERTIES } from './data';

export const AVAILABLE_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: '【保守】社内ツールの運用保守',
    description: '簡単な業務。成長は少ないが確実。',
    durationYears: 1,
    requiredTech: 0,
    techGrowthPerYear: 5,
    completionBonusTech: 2,
    completionBonusFunds: 5 // 調整
  },
  {
    id: 'proj_2',
    name: '【開発】新規Webサービス開発',
    description: '一般的な開発案件。着実にスキルが身につく。',
    durationYears: 2,
    requiredTech: 20,
    techGrowthPerYear: 15,
    completionBonusTech: 10,
    completionBonusFunds: 30 // 調整
  },
  {
    id: 'proj_3',
    name: '【基盤】大規模システムのリプレイス',
    description: '長期間拘束されるが、完了時の見返りは大きい。',
    durationYears: 3,
    requiredTech: 50,
    techGrowthPerYear: 20,
    completionBonusTech: 30,
    completionBonusFunds: 100 // 調整
  },
  {
    id: 'proj_4',
    name: '【先端】AIアルゴリズム研究開発',
    description: '高度な技術を要求される最先端プロジェクト。',
    durationYears: 4,
    requiredTech: 100,
    techGrowthPerYear: 30,
    completionBonusTech: 60,
    completionBonusFunds: 300 // 調整
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
      food: 1,
      entertainment: 1
    },
    currentProject: null,
    projectYearsLeft: 0,
    history: ["人生シミュレーションを開始しました。"],
    companyId: 'c1',
    salary: 300,
    property: PROPERTIES[0], // 木造アパート
    car: null,
    loans: []
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

export const calculateFoodCost = (level: number) => 40 * Math.pow(1.4, level - 1);
export const calculateEntertainmentCost = (level: number) => 20 * Math.pow(1.8, level - 1);

export const calculateTotalLivingCost = (player: PlayerState): number => {
  let cost = 0;
  cost += calculateFoodCost(player.livingStandards.food);
  cost += calculateEntertainmentCost(player.livingStandards.entertainment);

  if (player.property && player.property.type === 'rent') {
    cost += player.property.price; // price in property is per year or month depending on how we render. we assume yearly price. Wait, UI said 60万, but realistic rent might be 120万/year. If price is monthly, we multiply by 12. Let's assume price in property is monthly rent.
    cost += player.property.price * 12; // Update: we'll treat property.price as monthly rent.
  }

  // ローンの支払い計算
  player.loans.forEach(loan => {
    cost += loan.yearlyPayment;
  });

  return cost;
};

export const processTurn = (player: PlayerState, allocation: Allocation): PlayerState => {
  const nextPlayer = {
    ...player,
    history: [...player.history],
    livingStandards: { ...player.livingStandards },
    loans: player.loans.map(l => ({ ...l }))
  };
  const logs: string[] = [];
  logs.push(`--- ${nextPlayer.age}歳の1年 ---`);

  // 1. 各行動の結果を計算

  // 休養
  const restFactor = allocation.rest / 100;
  // 住居による休養ボーナス (家賃/価格に依存)
  let housingBonus = 0;
  if (nextPlayer.property) {
      if (nextPlayer.property.type === 'rent') housingBonus = Math.floor(nextPlayer.property.price / 10);
      if (nextPlayer.property.type === 'buy') housingBonus = Math.floor(nextPlayer.property.price / 3000);
  }

  const healthDelta = Math.floor(-15 + (40 * restFactor)) + housingBonus;
  nextPlayer.health = Math.min(100, Math.max(0, nextPlayer.health + healthDelta));

  if (nextPlayer.livingStandards.food === 1) nextPlayer.health = Math.max(0, nextPlayer.health - 5);
  else if (nextPlayer.livingStandards.food >= 4) nextPlayer.health = Math.min(100, nextPlayer.health + 5);

  if (healthDelta < 0) logs.push(`休養不足や住環境の影響で健康が低下した。`);
  else if (healthDelta > 0) logs.push(`しっかり休養を取り、健康を維持した。`);

  // 勉強
  const studyFactor = allocation.study / 100;
  let techGrowth = Math.floor(15 * studyFactor * nextPlayer.intelligence);

  // 遊ぶ
  const playFactor = allocation.play / 100;
  const entertainmentBonus = (nextPlayer.livingStandards.entertainment - 1) * 3;
  // 車による人脈ボーナス
  const carBonus = nextPlayer.car ? Math.floor(nextPlayer.car.price / 200) : 0;
  const networkGrowth = Math.floor(10 * playFactor) + entertainmentBonus + carBonus;
  nextPlayer.network += networkGrowth;
  if (networkGrowth > 0) logs.push(`遊びを通じて人脈を広げた。`);

  // 転職活動
  const jobHuntFactor = allocation.jobHunt / 100;
  if (jobHuntFactor > 0) {
      logs.push(`転職活動に ${allocation.jobHunt}% の時間を割いた。`);
      // ランダムな企業をピックアップ（今のランクより上か同等）
      const currentCompany = COMPANIES.find(c => c.id === nextPlayer.companyId)!;
      const targetCompanies = COMPANIES.filter(c => c.rank <= currentCompany.rank && c.id !== currentCompany.id);

      if (targetCompanies.length > 0) {
          const target = targetCompanies[Math.floor(Math.random() * targetCompanies.length)];
          // 合否判定: 技術力と人脈、地頭、転職活動割合から算出
          const techScore = nextPlayer.tech / Math.max(1, target.requiredTech);
          const networkScore = nextPlayer.network / Math.max(1, target.requiredNetwork);

          let successProb = (techScore * 0.5 + networkScore * 0.5) * jobHuntFactor * nextPlayer.intelligence;
          if (successProb > Math.random()) {
              logs.push(`【転職成功！】「${target.name}」から内定をもらい、転職した！`);
              nextPlayer.companyId = target.id;
              // 転職時の給与ジャンプアップ (ランダム + 能力ベース)
              const jump = Math.floor(target.baseRaiseRate * 100 + (Math.random() * 50));
              nextPlayer.salary += jump;
          } else {
              logs.push(`「${target.name}」の選考を受けたが、お見送りとなった...`);
          }
      } else {
          logs.push(`より良い条件の企業が見つからなかった。`);
      }
  }

  // 仕事（プロジェクトと給与）
  const workFactor = allocation.work / 100;
  const company = COMPANIES.find(c => c.id === nextPlayer.companyId)!;

  // 基本給の昇給 (前年ベース + 能力・企業ランクによる昇給)
  const baseRaise = Math.floor(nextPlayer.salary * (company.baseRaiseRate - 1));
  const abilityRaise = Math.floor(nextPlayer.tech * 0.1 * nextPlayer.intelligence);
  // 昇給額にランダムブレを持たせる (0.8 ~ 1.2)
  const actualRaise = Math.floor((baseRaise + abilityRaise) * (0.8 + Math.random() * 0.4));
  nextPlayer.salary += actualRaise;

  const standardSalary = nextPlayer.salary;
  const overtimeFactor = Math.max(0, workFactor - 0.5) * 2;
  const overtimePay = Math.floor(standardSalary * 0.4 * overtimeFactor);
  let earned = standardSalary + overtimePay;

  if (nextPlayer.currentProject) {
    const proj = nextPlayer.currentProject;
    logs.push(`案件「${proj.name}」に従事。（残り${nextPlayer.projectYearsLeft}年）`);

    const projTechGrowth = Math.floor(proj.techGrowthPerYear * workFactor * nextPlayer.intelligence);
    techGrowth += projTechGrowth;
    nextPlayer.projectYearsLeft -= 1;

    if (nextPlayer.projectYearsLeft <= 0) {
      logs.push(`【案件完遂！】「${proj.name}」を見事にやり遂げた！`);

      // ボーナスにランダム要素を加える (0.8 ~ 1.5)
      const bonusMultiplier = 0.8 + (Math.random() * 0.7);
      const actualBonusFunds = Math.floor(proj.completionBonusFunds * bonusMultiplier);

      logs.push(`ボーナスとして資金 ${actualBonusFunds}万円、技術力 ${proj.completionBonusTech} を獲得！`);
      earned += actualBonusFunds;
      techGrowth += proj.completionBonusTech;
      nextPlayer.currentProject = null;
    }
  } else {
    logs.push(`特に決まった案件を持たず、定常業務をこなした。`);
  }

  nextPlayer.tech += techGrowth;
  if (techGrowth > 5) logs.push(`勉強や仕事の成果が出て、技術力が ${techGrowth} 向上した。`);

  nextPlayer.funds += earned;

  // 2. 生活費・ローンの支払い
  let livingCost = calculateFoodCost(nextPlayer.livingStandards.food) + calculateEntertainmentCost(nextPlayer.livingStandards.entertainment);

  if (nextPlayer.property && nextPlayer.property.type === 'rent') {
      livingCost += nextPlayer.property.price * 12;
  }

  let totalLoanPayment = 0;
  for (let i = nextPlayer.loans.length - 1; i >= 0; i--) {
      const loan = nextPlayer.loans[i];
      totalLoanPayment += loan.yearlyPayment;
      loan.remainingPrincipal -= (loan.yearlyPayment - (loan.remainingPrincipal * loan.interestRate));
      loan.remainingYears -= 1;

      if (loan.remainingYears <= 0 || loan.remainingPrincipal <= 0) {
          logs.push(`【ローン完済】「${loan.name}」のローンを完済した！`);
          nextPlayer.loans.splice(i, 1);
      }
  }

  const totalExpense = Math.floor(livingCost + totalLoanPayment);
  nextPlayer.funds -= totalExpense;

  if (nextPlayer.funds < 0) {
    logs.push(`資金が底をつき、借金生活に突入した...（ストレスで健康激減）`);
    nextPlayer.health -= 30; // 借金ペナルティ
  } else {
    logs.push(`給与 ${earned}万円 を得て、生活費・住居費・ローン等 ${totalExpense}万円 を支出した。`);
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
