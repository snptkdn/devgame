import type { PlayerState, Allocation } from './types';
import { COMPANIES, PROPERTIES } from './data';

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
    companyTenure: 0,
    positionId: 'c1_p1', // 平社員
    salary: 300,
    pensionFund: 0,
    isRetired: false,
    targetCompanyId: null,
    pendingOffer: null,
    property: { ...PROPERTIES[0], ownedYears: 0 }, // 木造アパート
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

  // 引退している場合
  if (nextPlayer.isRetired) {
    logs.push(`年金生活。穏やかな日々を過ごしている。`);

    // 資産の保有年数を増やす
    if (nextPlayer.property) nextPlayer.property.ownedYears += 1;
    if (nextPlayer.car) nextPlayer.car.ownedYears += 1;

    // 毎年の年金受給額の計算
    // 積立額の30分の1を毎年受給すると仮定
    const pensionPayout = Math.floor(nextPlayer.pensionFund / 30);
    logs.push(`年金として ${pensionPayout}万円 を受給した。`);
    nextPlayer.funds += pensionPayout;

    // 休養（100%休養相当）
    const healthDelta = Math.floor(-15 + (40 * 1.0));
    nextPlayer.health = Math.min(100, Math.max(0, nextPlayer.health + healthDelta));

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
      logs.push(`生活費・ローン等 ${totalExpense}万円 を支出した。`);
    }

    // 死亡判定
    const deathProb = calculateDeathProbability(nextPlayer.age, nextPlayer.health);
    if (Math.random() < deathProb) {
      nextPlayer.isAlive = false;
      logs.push(`【死亡】 ${nextPlayer.age}歳、その生涯を閉じた。`);
    } else {
      nextPlayer.age += 1;
    }

    nextPlayer.history = [...nextPlayer.history, ...logs];
    return nextPlayer;
  }

  // 1. 各行動の結果を計算
  nextPlayer.companyTenure += 1;
  if (nextPlayer.property) nextPlayer.property.ownedYears += 1;
  if (nextPlayer.car) nextPlayer.car.ownedYears += 1;

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
  if (jobHuntFactor > 0 && nextPlayer.targetCompanyId) {
      logs.push(`「${COMPANIES.find(c => c.id === nextPlayer.targetCompanyId)?.name}」への転職活動に ${allocation.jobHunt}% の時間を割いた。`);
      const targetCompany = COMPANIES.find(c => c.id === nextPlayer.targetCompanyId)!;

      // 合否判定: 技術力と人脈、地頭、転職活動割合から算出
      const techScore = nextPlayer.tech / Math.max(1, targetCompany.requiredTech);
      const networkScore = nextPlayer.network / Math.max(1, targetCompany.requiredNetwork);

      let successProb = (techScore * 0.5 + networkScore * 0.5) * jobHuntFactor * nextPlayer.intelligence;
      if (successProb > Math.random()) {
          // オファーの算出: 役職と年収を決定
          // 条件を満たす最大の役職をオファー
          let offeredPosition = targetCompany.positions[0];
          for (let i = targetCompany.positions.length - 1; i >= 0; i--) {
            const pos = targetCompany.positions[i];
            const tenureReq = targetCompany.corporateType === 'domestic' ? pos.requiredTenure / 2 : 0; // 転職時は前職の経験を半減して評価
            if (nextPlayer.tech >= pos.requiredTech && nextPlayer.network >= pos.requiredNetwork && nextPlayer.companyTenure >= tenureReq) {
              offeredPosition = pos;
              break;
            }
          }

          // 短い勤続年数のペナルティ
          const tenurePenalty = nextPlayer.companyTenure < 2 ? 0.8 : 1.0;

          const baseOffer = offeredPosition.minSalary + Math.random() * (offeredPosition.maxSalary - offeredPosition.minSalary);
          const offeredSalary = Math.floor(baseOffer * tenurePenalty);

          logs.push(`【内定！】「${targetCompany.name}」から内定をもらった！`);

          nextPlayer.pendingOffer = {
            companyId: targetCompany.id,
            positionId: offeredPosition.id,
            offeredSalary: Math.max(offeredPosition.minSalary, Math.min(offeredPosition.maxSalary, offeredSalary))
          };
      } else {
          logs.push(`「${targetCompany.name}」の選考を受けたが、お見送りとなった...`);
          nextPlayer.pendingOffer = null;
      }
      nextPlayer.targetCompanyId = null; // リセット
  } else {
    nextPlayer.pendingOffer = null;
  }

  // 仕事（プロジェクトと給与）
  const workFactor = allocation.work / 100;
  const company = COMPANIES.find(c => c.id === nextPlayer.companyId)!;
  const currentPosition = company.positions.find(p => p.id === nextPlayer.positionId) || company.positions[0];

  // 昇進判定
  const nextPositionIndex = company.positions.findIndex(p => p.id === currentPosition.id) + 1;
  if (nextPositionIndex < company.positions.length) {
    const candidatePosition = company.positions[nextPositionIndex];
    if (nextPlayer.tech >= candidatePosition.requiredTech &&
        nextPlayer.network >= candidatePosition.requiredNetwork &&
        nextPlayer.companyTenure >= candidatePosition.requiredTenure) {

        // ランダム要素 (0.8 ~ 1.2)
        if (Math.random() * nextPlayer.intelligence > 0.8) {
           nextPlayer.positionId = candidatePosition.id;
           logs.push(`【昇進！】「${candidatePosition.name}」に昇進した！`);

           // 昇進に伴う給与アップ
           if (nextPlayer.salary < candidatePosition.minSalary) {
              nextPlayer.salary = candidatePosition.minSalary;
           } else {
              nextPlayer.salary += Math.floor((candidatePosition.maxSalary - candidatePosition.minSalary) * 0.2);
           }
        }
    }
  }

  // 基本給の昇給 (前年ベース + 能力・企業ランクによる昇給)
  const baseRaise = Math.floor(nextPlayer.salary * (company.baseRaiseRate - 1));
  const abilityRaise = Math.floor(nextPlayer.tech * 0.1 * nextPlayer.intelligence);
  // 昇給額にランダムブレを持たせる (0.8 ~ 1.2)
  const actualRaise = Math.floor((baseRaise + abilityRaise) * (0.8 + Math.random() * 0.4));

  nextPlayer.salary += actualRaise;

  // 役職の上限キャップ
  const maxSalaryForPosition = company.positions.find(p => p.id === nextPlayer.positionId)?.maxSalary || 9999;
  if (nextPlayer.salary > maxSalaryForPosition) {
    nextPlayer.salary = maxSalaryForPosition;
  }

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

  // 年金積立
  const pensionContribution = Math.floor(earned * 0.1);
  nextPlayer.pensionFund += pensionContribution;
  earned -= pensionContribution;

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

  // 3. 引退判定と死亡判定
  if (nextPlayer.age >= 65 && !nextPlayer.isRetired) {
    const currentCompany = COMPANIES.find(c => c.id === nextPlayer.companyId)!;
    const currentPos = currentCompany.positions.find(p => p.id === nextPlayer.positionId);

    if (currentPos && currentPos.isExecutive) {
      logs.push(`【定年】 65歳を迎えたが、役員であるため会社に残り、働き続けることになった。`);
    } else {
      logs.push(`【定年】 65歳を迎え、定年退職した。これからは年金生活だ。`);
      nextPlayer.isRetired = true;
      nextPlayer.currentProject = null;
      nextPlayer.targetCompanyId = null;
      nextPlayer.pendingOffer = null;
    }
  }

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
