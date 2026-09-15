import type { PlayerState, Allocation } from './types';

// Box-Muller変換で正規分布（平均1.0、標準偏差0.2）の「地頭の良さ」を生成
export const generateIntelligence = (): number => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  const stdNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const mean = 1.0;
  const stdDev = 0.2;
  // 0.2 ~ 1.8 くらいに丸める
  return Math.max(0.2, Math.min(1.8, mean + stdDev * stdNormal));
};

export const createInitialState = (): PlayerState => {
  return {
    age: 22,
    funds: 100, // 初期資金 100万円とする
    tech: 10,
    health: 100,
    network: 10,
    intelligence: generateIntelligence(),
    isAlive: true,
    livingStandardLevel: 1, // 初期生活水準
    history: ["人生シミュレーションを開始しました。"],
  };
};

// 死亡確率の計算
// 年齢と健康度からその年の死亡確率(0~1)を算出する
export const calculateDeathProbability = (age: number, health: number): number => {
  let baseProb = 0.001; // 若年層の基本確率

  if (age > 80) baseProb = 0.15;
  else if (age > 70) baseProb = 0.05;
  else if (age > 60) baseProb = 0.015;
  else if (age > 50) baseProb = 0.005;
  else if (age > 40) baseProb = 0.002;

  // 健康による倍率 (健康100なら1倍、健康0なら10倍)
  const healthFactor = Math.max(1, 10 - (health / 10));

  return baseProb * healthFactor;
};

// 生活費の算出（レベルに応じた必要額）
export const calculateLivingCost = (level: number): number => {
  // レベル1: 150万, レベル2: 250万, レベル3: 400万 ...
  const baseCost = 150;
  return baseCost * Math.pow(1.5, level - 1);
};

// 1ターン進める処理
export const processTurn = (player: PlayerState, allocation: Allocation): PlayerState => {
  const nextPlayer = { ...player, history: [...player.history] };
  const logs: string[] = [];
  logs.push(`--- ${nextPlayer.age}歳の1年 ---`);

  // 1. 各行動の結果を計算 (割り振り率は0~100)

  // 【休養】健康の回復/維持
  // 割り振り0%だと毎年健康が10下がる。100%だと30回復。
  const restFactor = allocation.rest / 100;
  const healthDelta = Math.floor(-10 + (40 * restFactor));
  nextPlayer.health = Math.min(100, Math.max(0, nextPlayer.health + healthDelta));
  if (healthDelta < 0) logs.push(`休養不足で健康が低下した。`);
  else if (healthDelta > 0) logs.push(`しっかり休養を取り、健康を維持した。`);

  // 【勉強】技術の成長
  // 地頭の良さがボーナスとしてかかる
  const studyFactor = allocation.study / 100;
  const techGrowth = Math.floor(20 * studyFactor * nextPlayer.intelligence);
  nextPlayer.tech += techGrowth;
  if (techGrowth > 5) logs.push(`勉強の成果が出て、技術力が大きく向上した。`);
  else if (techGrowth > 0) logs.push(`勉強して技術力を少し高めた。`);

  // 【遊ぶ】人脈の成長
  const playFactor = allocation.play / 100;
  const networkGrowth = Math.floor(15 * playFactor);
  nextPlayer.network += networkGrowth;
  if (networkGrowth > 0) logs.push(`遊びを通じて人脈を広げた。`);

  // 【仕事】ITサラリーマン案件ロジック
  // 技術力と地頭に応じて稼ぎが変わる
  const workFactor = allocation.work / 100;

  // 案件のベース収入
  let earned = 0;
  if (workFactor > 0) {
    // ITサラリーマンの案件: 技術力に応じてこなせる案件の質（ベース単価）が上がる
    const baseIncome = 200 + (nextPlayer.tech * 1.5);
    // 仕事への割当率と地頭による補正
    earned = Math.floor(baseIncome * workFactor * nextPlayer.intelligence);

    // スキル不足による失敗リスク（ここでは簡易的に、技術が低いのに無理に仕事率を上げると稼ぎがブレる）
    const successRoll = Math.random();
    if (successRoll > 0.8 && nextPlayer.intelligence < 1.0) {
       logs.push(`仕事でミスをしてしまい、思ったより稼げなかった...`);
       earned = Math.floor(earned * 0.6);
    } else if (successRoll > 0.9) {
       logs.push(`仕事で大きな成果を上げ、ボーナスが出た！`);
       earned = Math.floor(earned * 1.5);
    } else {
       logs.push(`仕事に励み、収入を得た。`);
    }
  } else {
    logs.push(`今年は一切仕事をしなかった。`);
  }

  nextPlayer.funds += earned;

  // 2. 生活費の支払いと生活水準の変動
  const livingCost = Math.floor(calculateLivingCost(nextPlayer.livingStandardLevel));
  nextPlayer.funds -= livingCost;

  if (nextPlayer.funds < 0) {
    logs.push(`資金が底をつき、借金生活に突入した...（ストレスで健康激減）`);
    nextPlayer.health -= 30; // 借金ペナルティ
  } else {
    logs.push(`生活費として ${livingCost}万円 支出した。`);
  }

  // 収入が生活水準を上回っていたら自動で上がる
  const nextLevelThreshold = calculateLivingCost(nextPlayer.livingStandardLevel + 1) * 1.5;
  if (earned > nextLevelThreshold) {
    nextPlayer.livingStandardLevel += 1;
    logs.push(`収入が増えたため、気づかぬうちに生活水準が上がってしまった。`);
  }

  // 3. 死亡判定
  const deathProb = calculateDeathProbability(nextPlayer.age, nextPlayer.health);
  if (Math.random() < deathProb) {
    nextPlayer.isAlive = false;
    logs.push(`【死亡】 ${nextPlayer.age}歳、その生涯を閉じた。`);
  } else {
    // 翌年へ
    nextPlayer.age += 1;
  }

  // ログ保存 (最大50行程度に制限するか、全て残すか。今回は全て残してUIで末尾だけ見せる)
  nextPlayer.history = [...nextPlayer.history, ...logs];

  return nextPlayer;
};

// 生活水準を手動で下げる処理（ペナルティあり）
export const lowerLivingStandard = (player: PlayerState): PlayerState => {
  if (player.livingStandardLevel <= 1) return player;

  return {
    ...player,
    livingStandardLevel: player.livingStandardLevel - 1,
    health: Math.max(0, player.health - 10), // 食費を削るなどして健康低下
    network: Math.max(0, player.network - 5), // 交際費を削り人脈低下
    history: [...player.history, `生活水準を意図的に下げた。少し無理が生じている...`]
  };
};
