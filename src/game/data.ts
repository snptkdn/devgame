import type { Company, Property, Car } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'c1', name: '名もなき零細SES', rank: 3, corporateType: 'domestic', baseRaiseRate: 1.01, loanInterestRate: 0.03, requiredTech: 0, requiredNetwork: 0,
    positions: [
      { id: 'c1_p1', name: '平社員', minSalary: 300, maxSalary: 400, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'c1_p2', name: '主任', minSalary: 350, maxSalary: 500, requiredTech: 10, requiredNetwork: 5, requiredTenure: 3, isExecutive: false },
      { id: 'c1_p3', name: '課長', minSalary: 450, maxSalary: 600, requiredTech: 20, requiredNetwork: 10, requiredTenure: 8, isExecutive: false },
      { id: 'c1_p4', name: '部長', minSalary: 550, maxSalary: 750, requiredTech: 30, requiredNetwork: 20, requiredTenure: 15, isExecutive: false },
      { id: 'c1_p5', name: '役員', minSalary: 700, maxSalary: 1000, requiredTech: 40, requiredNetwork: 30, requiredTenure: 25, isExecutive: true },
    ],
    projects: [
      { id: 'c1_proj1', name: '【保守】社内ツールの運用保守', description: '簡単な業務。成長は少ないが確実。', durationYears: 1, requiredTech: 0, techGrowthPerYear: 5, completionBonusTech: 2, completionBonusFunds: 5 }
    ]
  },
  {
    id: 'c2', name: '中堅SIer「株式会社システムなんとか」', rank: 2, corporateType: 'domestic', baseRaiseRate: 1.03, loanInterestRate: 0.015, requiredTech: 30, requiredNetwork: 20,
    positions: [
      { id: 'c2_p1', name: '平社員', minSalary: 400, maxSalary: 550, requiredTech: 30, requiredNetwork: 20, requiredTenure: 0, isExecutive: false },
      { id: 'c2_p2', name: '主任', minSalary: 500, maxSalary: 700, requiredTech: 45, requiredNetwork: 30, requiredTenure: 4, isExecutive: false },
      { id: 'c2_p3', name: '課長', minSalary: 650, maxSalary: 900, requiredTech: 60, requiredNetwork: 50, requiredTenure: 10, isExecutive: false },
      { id: 'c2_p4', name: '部長', minSalary: 850, maxSalary: 1200, requiredTech: 80, requiredNetwork: 70, requiredTenure: 18, isExecutive: false },
      { id: 'c2_p5', name: '役員', minSalary: 1200, maxSalary: 1800, requiredTech: 100, requiredNetwork: 100, requiredTenure: 25, isExecutive: true },
    ],
    projects: [
      { id: 'c2_proj1', name: '【開発】新規Webサービス開発', description: '一般的な開発案件。着実にスキルが身につく。', durationYears: 2, requiredTech: 30, techGrowthPerYear: 15, completionBonusTech: 10, completionBonusFunds: 30 }
    ]
  },
  {
    id: 'c3', name: 'メガベンチャー「CyberXXX」', rank: 1, corporateType: 'domestic', baseRaiseRate: 1.05, loanInterestRate: 0.008, requiredTech: 80, requiredNetwork: 50,
    positions: [
      { id: 'c3_p1', name: '平社員', minSalary: 500, maxSalary: 800, requiredTech: 80, requiredNetwork: 50, requiredTenure: 0, isExecutive: false },
      { id: 'c3_p2', name: '主任', minSalary: 700, maxSalary: 1000, requiredTech: 100, requiredNetwork: 70, requiredTenure: 3, isExecutive: false },
      { id: 'c3_p3', name: '課長', minSalary: 900, maxSalary: 1400, requiredTech: 130, requiredNetwork: 100, requiredTenure: 8, isExecutive: false },
      { id: 'c3_p4', name: '部長', minSalary: 1300, maxSalary: 2000, requiredTech: 160, requiredNetwork: 150, requiredTenure: 12, isExecutive: false },
      { id: 'c3_p5', name: '役員', minSalary: 2000, maxSalary: 4000, requiredTech: 200, requiredNetwork: 250, requiredTenure: 15, isExecutive: true },
    ],
    projects: [
      { id: 'c3_proj1', name: '【基盤】大規模システムのリプレイス', description: '長期間拘束されるが、完了時の見返りは大きい。', durationYears: 3, requiredTech: 80, techGrowthPerYear: 20, completionBonusTech: 30, completionBonusFunds: 100 }
    ]
  },
  {
    id: 'c4', name: '外資系IT「G-ogle」', rank: 1, corporateType: 'foreign', baseRaiseRate: 1.10, loanInterestRate: 0.005, requiredTech: 150, requiredNetwork: 100,
    positions: [
      { id: 'c4_p1', name: 'スタッフ', minSalary: 1000, maxSalary: 1500, requiredTech: 150, requiredNetwork: 100, requiredTenure: 0, isExecutive: false },
      { id: 'c4_p2', name: 'シニアスタッフ', minSalary: 1400, maxSalary: 2200, requiredTech: 200, requiredNetwork: 150, requiredTenure: 0, isExecutive: false },
      { id: 'c4_p3', name: 'マネージャー', minSalary: 2000, maxSalary: 3500, requiredTech: 280, requiredNetwork: 250, requiredTenure: 0, isExecutive: false },
      { id: 'c4_p4', name: 'ディレクター', minSalary: 3500, maxSalary: 6000, requiredTech: 400, requiredNetwork: 400, requiredTenure: 0, isExecutive: false },
      { id: 'c4_p5', name: 'パートナー', minSalary: 8000, maxSalary: 20000, requiredTech: 600, requiredNetwork: 800, requiredTenure: 0, isExecutive: true },
    ],
    projects: [
      { id: 'c4_proj1', name: '【先端】AIアルゴリズム研究開発', description: '高度な技術を要求される最先端プロジェクト。', durationYears: 4, requiredTech: 150, techGrowthPerYear: 30, completionBonusTech: 60, completionBonusFunds: 300 }
    ]
  },
];

export const PROPERTIES: Property[] = [
  // Rent (depreciation doesn't matter)
  { id: 'r1', name: '木造アパート「コーポ希望」', type: 'rent', price: 6, initialCost: 10 },
  { id: 'r2', name: '普通のマンション「メゾン・ド・IT」', type: 'rent', price: 12, initialCost: 30 },
  { id: 'r3', name: '高級マンション「ヒルズ的なアレ」', type: 'rent', price: 50, initialCost: 150 },
  { id: 'r4', name: '最高級タワマン「ザ・トーキョー・スカイ」', type: 'rent', price: 300, initialCost: 1000 },

  // Buy
  { id: 'b1', name: '郊外の中古マンション', type: 'buy', price: 3000, initialCost: 0, depreciationRate: 0.05 },
  { id: 'b2', name: '都内の新築マンション', type: 'buy', price: 8000, initialCost: 0, depreciationRate: 0.04 },
  { id: 'b3', name: '港区の高級タワマン', type: 'buy', price: 25000, initialCost: 0, depreciationRate: 0.02 }, // 高級物件は価値が落ちにくい
  { id: 'b4', name: '大富豪の豪邸', type: 'buy', price: 100000, initialCost: 0, depreciationRate: 0.01 },
];

export const CARS: Car[] = [
  { id: 'car1', name: '中古の軽自動車', price: 50, depreciationRate: 0.3 },
  { id: 'car2', name: '国産ファミリーカー「プ〇ウス」', price: 300, depreciationRate: 0.2 },
  { id: 'car3', name: '高級外車「メ〇セデス」', price: 1000, depreciationRate: 0.15 },
  { id: 'car4', name: 'スーパーカー「フェ〇ーリ」', price: 4000, depreciationRate: 0.05 }, // 高級車は価値が落ちにくい
];
