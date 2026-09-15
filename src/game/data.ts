import type { Company, Property, Car } from './types';

export const COMPANIES: Company[] = [
  { id: 'c1', name: '名もなき零細SES', rank: 3, baseRaiseRate: 1.01, loanInterestRate: 0.03, requiredTech: 0, requiredNetwork: 0 },
  { id: 'c2', name: '中堅SIer「株式会社システムなんとか」', rank: 2, baseRaiseRate: 1.03, loanInterestRate: 0.015, requiredTech: 30, requiredNetwork: 20 },
  { id: 'c3', name: 'メガベンチャー「CyberXXX」', rank: 1, baseRaiseRate: 1.05, loanInterestRate: 0.008, requiredTech: 80, requiredNetwork: 50 },
  { id: 'c4', name: '外資系IT「G-ogle」', rank: 1, baseRaiseRate: 1.10, loanInterestRate: 0.005, requiredTech: 150, requiredNetwork: 100 },
];

export const PROPERTIES: Property[] = [
  // Rent
  { id: 'r1', name: '木造アパート「コーポ希望」', type: 'rent', price: 6, initialCost: 10 },
  { id: 'r2', name: '普通のマンション「メゾン・ド・IT」', type: 'rent', price: 12, initialCost: 30 },
  { id: 'r3', name: '高級マンション「ヒルズ的なアレ」', type: 'rent', price: 50, initialCost: 150 },
  { id: 'r4', name: '最高級タワマン「ザ・トーキョー・スカイ」', type: 'rent', price: 300, initialCost: 1000 },

  // Buy
  { id: 'b1', name: '郊外の中古マンション', type: 'buy', price: 3000, initialCost: 0 },
  { id: 'b2', name: '都内の新築マンション', type: 'buy', price: 8000, initialCost: 0 },
  { id: 'b3', name: '港区の高級タワマン', type: 'buy', price: 25000, initialCost: 0 },
  { id: 'b4', name: '大富豪の豪邸', type: 'buy', price: 100000, initialCost: 0 },
];

export const CARS: Car[] = [
  { id: 'car1', name: '中古の軽自動車', price: 50 },
  { id: 'car2', name: '国産ファミリーカー「プ〇ウス」', price: 300 },
  { id: 'car3', name: '高級外車「メ〇セデス」', price: 1000 },
  { id: 'car4', name: 'スーパーカー「フェ〇ーリ」', price: 4000 },
];
