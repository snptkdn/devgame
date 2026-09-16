import type { Company, Property, Car, GameState } from './types';

// Exported standard positions
// POSITIONS array removed. Each company now has its own positions array.

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    name: '株式会社ミライIT',
    rank: 4,
    requiredTech: 0,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 0,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 300, maxSalary: 600, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 400, maxSalary: 840, requiredTech: 45, requiredNetwork: 15, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 500, maxSalary: 1080, requiredTech: 90, requiredNetwork: 45, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 700, maxSalary: 1440, requiredTech: 135, requiredNetwork: 90, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 900, maxSalary: 2160, requiredTech: 180, requiredNetwork: 150, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 1200, maxSalary: 4000, requiredTech: 225, requiredNetwork: 225, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c1_p1',
        name: 'PCキッティング業務',
        description: '新入社員用のPCセットアップ',
        requiredTech: 0,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c1_p2',
        name: '新人研修サポート',
        description: '研修資料の作成と整理',
        requiredTech: 10,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c1_p3',
        name: '備品管理システム入力',
        description: '簡単な在庫データの入力',
        requiredTech: 20,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c2',
    name: 'TechFront',
    rank: 5,
    requiredTech: 4,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 2,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c2_p1',
        name: '社内ネットワーク監視',
        description: 'LANの死活監視',
        requiredTech: 4,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c2_p2',
        name: 'ヘルプデスク補助',
        description: 'パスワードリセット対応',
        requiredTech: 14,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c2_p3',
        name: 'マニュアル翻訳',
        description: '海外拠点の簡単なマニュアル和訳',
        requiredTech: 24,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c3',
    name: 'GigaSystem',
    rank: 7,
    requiredTech: 8,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 4,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 600, maxSalary: 1500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 800, maxSalary: 2100, requiredTech: 90, requiredNetwork: 30, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 1000, maxSalary: 2700, requiredTech: 180, requiredNetwork: 90, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1400, maxSalary: 3600, requiredTech: 270, requiredNetwork: 180, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1800, maxSalary: 5400, requiredTech: 360, requiredNetwork: 300, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 5000, maxSalary: 50000, requiredTech: 450, requiredNetwork: 450, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c3_p1',
        name: 'バグチケットの整理',
        description: 'JIRAのチケット分類',
        requiredTech: 8,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c3_p2',
        name: 'テストデータの作成',
        description: 'ダミーデータの自動生成スクリプト作成',
        requiredTech: 18,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c3_p3',
        name: 'コーディング規約のチェック',
        description: '静的解析ツールの実行',
        requiredTech: 28,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c4',
    name: 'サイバーネット工業',
    rank: 5,
    requiredTech: 12,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 6,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c4_p1',
        name: 'アクセスログの集計',
        description: 'Apacheログの月次集計',
        requiredTech: 12,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c4_p2',
        name: '簡単なSQLクエリ作成',
        description: 'DBからのデータ抽出',
        requiredTech: 22,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c4_p3',
        name: '会議の議事録作成',
        description: '開発定例の議事録係',
        requiredTech: 32,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c5',
    name: '日本データソリューション',
    rank: 3,
    requiredTech: 16,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 8,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 240, maxSalary: 500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 320, maxSalary: 700, requiredTech: 30, requiredNetwork: 10, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 400, maxSalary: 900, requiredTech: 60, requiredNetwork: 30, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 560, maxSalary: 1200, requiredTech: 90, requiredNetwork: 60, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 720, maxSalary: 1800, requiredTech: 120, requiredNetwork: 100, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 800, maxSalary: 2000, requiredTech: 150, requiredNetwork: 150, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c5_p1',
        name: '小規模なLP制作',
        description: 'キャンペーン用のランディングページ作成',
        requiredTech: 16,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c5_p2',
        name: 'CSSのバグ修正',
        description: 'レイアウト崩れの調整',
        requiredTech: 26,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c5_p3',
        name: '画像アセットの最適化',
        description: 'Web画像の軽量化',
        requiredTech: 36,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c6',
    name: 'CloudSync',
    rank: 2,
    requiredTech: 20,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 10,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 210, maxSalary: 400, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 280, maxSalary: 560, requiredTech: 24, requiredNetwork: 8, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 350, maxSalary: 720, requiredTech: 48, requiredNetwork: 24, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 489, maxSalary: 960, requiredTech: 72, requiredNetwork: 48, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 630, maxSalary: 1440, requiredTech: 96, requiredNetwork: 80, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 600, maxSalary: 1000, requiredTech: 120, requiredNetwork: 120, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c6_p1',
        name: 'APIドキュメント更新',
        description: 'Swagger定義の修正',
        requiredTech: 20,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c6_p2',
        name: '単体テストの追加',
        description: 'カバレッジ向上のためのテスト追加',
        requiredTech: 30,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c6_p3',
        name: '古いライブラリの調査',
        description: '非推奨APIの洗い出し',
        requiredTech: 40,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c7',
    name: 'NextGen Software',
    rank: 2,
    requiredTech: 24,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 12,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 210, maxSalary: 400, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 280, maxSalary: 560, requiredTech: 24, requiredNetwork: 8, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 350, maxSalary: 720, requiredTech: 48, requiredNetwork: 24, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 489, maxSalary: 960, requiredTech: 72, requiredNetwork: 48, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 630, maxSalary: 1440, requiredTech: 96, requiredNetwork: 80, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 600, maxSalary: 1000, requiredTech: 120, requiredNetwork: 120, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c7_p1',
        name: '社内ツールの改修',
        description: '勤怠管理システムのUI改善',
        requiredTech: 24,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c7_p2',
        name: 'バッチ処理のエラー調査',
        description: '夜間バッチのログ解析',
        requiredTech: 34,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c7_p3',
        name: 'デプロイ手順書の作成',
        description: 'リリース手順のドキュメント化',
        requiredTech: 44,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c8',
    name: 'メガ・テクノロジーズ',
    rank: 3,
    requiredTech: 28,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 14,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 240, maxSalary: 500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 320, maxSalary: 700, requiredTech: 30, requiredNetwork: 10, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 400, maxSalary: 900, requiredTech: 60, requiredNetwork: 30, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 560, maxSalary: 1200, requiredTech: 90, requiredNetwork: 60, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 720, maxSalary: 1800, requiredTech: 120, requiredNetwork: 100, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 800, maxSalary: 2000, requiredTech: 150, requiredNetwork: 150, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c8_p1',
        name: '既存機能のリファクタ',
        description: '古いコンポーネントの書き直し',
        requiredTech: 28,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c8_p2',
        name: '決済ログの分析',
        description: 'エラー発生傾向の調査',
        requiredTech: 38,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c8_p3',
        name: '新機能のプロトタイプ作成',
        description: 'モックUIの実装',
        requiredTech: 48,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c9',
    name: 'Advanced Web',
    rank: 4,
    requiredTech: 32,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 16,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 300, maxSalary: 600, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 400, maxSalary: 840, requiredTech: 45, requiredNetwork: 15, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 500, maxSalary: 1080, requiredTech: 90, requiredNetwork: 45, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 700, maxSalary: 1440, requiredTech: 135, requiredNetwork: 90, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 900, maxSalary: 2160, requiredTech: 180, requiredNetwork: 150, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 1200, maxSalary: 4000, requiredTech: 225, requiredNetwork: 225, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c9_p1',
        name: 'DBインデックス最適化',
        description: 'スロークエリの改善',
        requiredTech: 32,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c9_p2',
        name: '負荷テストの実施',
        description: 'JMeterを使ったパフォーマンステスト',
        requiredTech: 42,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c9_p3',
        name: 'AWSコスト削減調査',
        description: '無駄なリソースの洗い出し',
        requiredTech: 52,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c10',
    name: 'Quantum IT',
    rank: 4,
    requiredTech: 36,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 18,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 300, maxSalary: 600, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 400, maxSalary: 840, requiredTech: 45, requiredNetwork: 15, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 500, maxSalary: 1080, requiredTech: 90, requiredNetwork: 45, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 700, maxSalary: 1440, requiredTech: 135, requiredNetwork: 90, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 900, maxSalary: 2160, requiredTech: 180, requiredNetwork: 150, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 1200, maxSalary: 4000, requiredTech: 225, requiredNetwork: 225, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c10_p1',
        name: '決済APIの連携',
        description: '外部決済ゲートウェイの実装',
        requiredTech: 36,
        requiredEffort: 50,
        difficulty: 1,
        completionBonusFunds: 10,
        completionBonusTech: 2,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 1
      },
      {
        id: 'c10_p2',
        name: 'セキュリティ脆弱性対応',
        description: 'ペネトレーションテストの指摘事項修正',
        requiredTech: 46,
        requiredEffort: 80,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 4,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c10_p3',
        name: 'レガシーコードの移行',
        description: 'PHPからGoへの一部移行',
        requiredTech: 56,
        requiredEffort: 120,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 8,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 3
      }
    ]
  },
  {
    id: 'c11',
    name: 'Neo Tech',
    rank: 1,
    requiredTech: 40,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 20,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 180, maxSalary: 350, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 240, maxSalary: 489, requiredTech: 15, requiredNetwork: 5, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 300, maxSalary: 630, requiredTech: 30, requiredNetwork: 15, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 420, maxSalary: 840, requiredTech: 45, requiredNetwork: 30, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 540, maxSalary: 1260, requiredTech: 60, requiredNetwork: 50, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 500, maxSalary: 600, requiredTech: 75, requiredNetwork: 75, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c11_p1',
        name: 'マイクロサービス設計',
        description: '新規ドメインのサービス分割',
        requiredTech: 40,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c11_p2',
        name: 'CI/CDパイプライン構築',
        description: 'GitHub Actionsの高度化',
        requiredTech: 50,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c11_p3',
        name: 'インシデント対応',
        description: '本番障害のトラブルシューティング',
        requiredTech: 60,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c12',
    name: 'SysAdmin Inc.',
    rank: 1,
    requiredTech: 44,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 22,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 180, maxSalary: 350, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 240, maxSalary: 489, requiredTech: 15, requiredNetwork: 5, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 300, maxSalary: 630, requiredTech: 30, requiredNetwork: 15, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 420, maxSalary: 840, requiredTech: 45, requiredNetwork: 30, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 540, maxSalary: 1260, requiredTech: 60, requiredNetwork: 50, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 500, maxSalary: 600, requiredTech: 75, requiredNetwork: 75, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c12_p1',
        name: '機械学習モデルの組み込み',
        description: '推論APIの繋ぎこみ',
        requiredTech: 44,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c12_p2',
        name: '大規模データ移行',
        description: '旧DBから新DBへのデータ移行',
        requiredTech: 54,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c12_p3',
        name: '認証基盤の刷新',
        description: 'OAuth2.0の導入',
        requiredTech: 64,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c13',
    name: 'DataFlow Group',
    rank: 3,
    requiredTech: 48,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 24,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 240, maxSalary: 500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 320, maxSalary: 700, requiredTech: 30, requiredNetwork: 10, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 400, maxSalary: 900, requiredTech: 60, requiredNetwork: 30, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 560, maxSalary: 1200, requiredTech: 90, requiredNetwork: 60, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 720, maxSalary: 1800, requiredTech: 120, requiredNetwork: 100, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 800, maxSalary: 2000, requiredTech: 150, requiredNetwork: 150, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c13_p1',
        name: 'コンテナオーケストレーション',
        description: 'Kubernetes環境の構築',
        requiredTech: 48,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c13_p2',
        name: 'リアルタイム通信の実装',
        description: 'WebSocketを使ったチャット機能開発',
        requiredTech: 58,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c13_p3',
        name: 'SRE業務の立ち上げ',
        description: 'SLOの設定と監視',
        requiredTech: 68,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c14',
    name: 'Global IT Solutions',
    rank: 3,
    requiredTech: 52,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 26,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 240, maxSalary: 500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 320, maxSalary: 700, requiredTech: 30, requiredNetwork: 10, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 400, maxSalary: 900, requiredTech: 60, requiredNetwork: 30, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 560, maxSalary: 1200, requiredTech: 90, requiredNetwork: 60, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 720, maxSalary: 1800, requiredTech: 120, requiredNetwork: 100, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 800, maxSalary: 2000, requiredTech: 150, requiredNetwork: 150, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c14_p1',
        name: '決済システムの再構築',
        description: 'コア決済エンジンのリプレイス',
        requiredTech: 52,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c14_p2',
        name: 'グローバル展開対応',
        description: '多言語・多通貨対応のアーキテクチャ設計',
        requiredTech: 62,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c14_p3',
        name: 'データレイク構築',
        description: 'ログの一元管理と分析基盤',
        requiredTech: 72,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c15',
    name: 'DevWorks',
    rank: 5,
    requiredTech: 56,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 28,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c15_p1',
        name: 'AIエージェントの開発',
        description: 'LLMを使った自動応答システム',
        requiredTech: 56,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c15_p2',
        name: 'ブロックチェーン連携',
        description: 'スマートコントラクトとの連携機能',
        requiredTech: 66,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c15_p3',
        name: '全社セキュリティアーキテクチャ設計',
        description: 'ゼロトラストネットワークの導入',
        requiredTech: 76,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c16',
    name: 'TechNova',
    rank: 4,
    requiredTech: 60,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 30,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 300, maxSalary: 600, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 400, maxSalary: 840, requiredTech: 45, requiredNetwork: 15, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 500, maxSalary: 1080, requiredTech: 90, requiredNetwork: 45, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 700, maxSalary: 1440, requiredTech: 135, requiredNetwork: 90, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 900, maxSalary: 2160, requiredTech: 180, requiredNetwork: 150, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 1200, maxSalary: 4000, requiredTech: 225, requiredNetwork: 225, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c16_p1',
        name: '基幹システムのクラウド移行',
        description: 'オンプレからのリフト＆シフト',
        requiredTech: 60,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c16_p2',
        name: 'IoTデバイス制御',
        description: 'エッジコンピューティングの実装',
        requiredTech: 70,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c16_p3',
        name: '自動スケーリング最適化',
        description: '需要予測に基づくインフラ制御',
        requiredTech: 80,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c17',
    name: 'InnovaSoft',
    rank: 2,
    requiredTech: 64,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 32,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 210, maxSalary: 400, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 280, maxSalary: 560, requiredTech: 24, requiredNetwork: 8, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 350, maxSalary: 720, requiredTech: 48, requiredNetwork: 24, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 489, maxSalary: 960, requiredTech: 72, requiredNetwork: 48, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 630, maxSalary: 1440, requiredTech: 96, requiredNetwork: 80, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 600, maxSalary: 1000, requiredTech: 120, requiredNetwork: 120, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c17_p1',
        name: '量子コンピューティング調査',
        description: '量子アルゴリズムのビジネス応用検証',
        requiredTech: 64,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c17_p2',
        name: 'メタバースプラットフォーム開発',
        description: 'VR空間でのインタラクション実装',
        requiredTech: 74,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c17_p3',
        name: '次世代ネットワーク設計',
        description: '5G/6G向け低遅延通信',
        requiredTech: 84,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c18',
    name: 'Future Code',
    rank: 2,
    requiredTech: 68,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 34,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 210, maxSalary: 400, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 280, maxSalary: 560, requiredTech: 24, requiredNetwork: 8, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 350, maxSalary: 720, requiredTech: 48, requiredNetwork: 24, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 489, maxSalary: 960, requiredTech: 72, requiredNetwork: 48, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 630, maxSalary: 1440, requiredTech: 96, requiredNetwork: 80, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 600, maxSalary: 1000, requiredTech: 120, requiredNetwork: 120, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c18_p1',
        name: '自動運転AIの検証',
        description: 'シミュレーター上での挙動テスト',
        requiredTech: 68,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c18_p2',
        name: '生体認証システムの開発',
        description: '顔認証・指紋認証の統合',
        requiredTech: 78,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c18_p3',
        name: '宇宙開発向けシステム',
        description: '衛星軌道計算プログラムの補助',
        requiredTech: 88,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c19',
    name: 'Prime System',
    rank: 4,
    requiredTech: 72,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 36,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 300, maxSalary: 600, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 400, maxSalary: 840, requiredTech: 45, requiredNetwork: 15, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 500, maxSalary: 1080, requiredTech: 90, requiredNetwork: 45, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 700, maxSalary: 1440, requiredTech: 135, requiredNetwork: 90, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 900, maxSalary: 2160, requiredTech: 180, requiredNetwork: 150, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 1200, maxSalary: 4000, requiredTech: 225, requiredNetwork: 225, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c19_p1',
        name: '金融取引エンジンの最適化',
        description: 'ミリ秒単位のレイテンシ改善',
        requiredTech: 72,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c19_p2',
        name: '医療データ解析基盤',
        description: '匿名化と安全なデータ共有',
        requiredTech: 82,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c19_p3',
        name: 'スマートシティ実証実験',
        description: '都市データのリアルタイム可視化',
        requiredTech: 92,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c20',
    name: 'Alpha IT',
    rank: 5,
    requiredTech: 76,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 38,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c20_p1',
        name: '完全自動化工場システム',
        description: 'ロボットアームの連携制御',
        requiredTech: 76,
        requiredEffort: 70,
        difficulty: 2,
        completionBonusFunds: 20,
        completionBonusTech: 3,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 2
      },
      {
        id: 'c20_p2',
        name: 'ドローン配送の最適経路計算',
        description: '配送アルゴリズムの改善',
        requiredTech: 86,
        requiredEffort: 110,
        difficulty: 3,
        completionBonusFunds: 40,
        completionBonusTech: 6,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c20_p3',
        name: '分散型ID基盤',
        description: 'Web3時代の認証システム',
        requiredTech: 96,
        requiredEffort: 160,
        difficulty: 4,
        completionBonusFunds: 70,
        completionBonusTech: 11,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 4
      }
    ]
  },
  {
    id: 'c21',
    name: 'Omega Tech',
    rank: 6,
    requiredTech: 80,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 40,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 450, maxSalary: 1000, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 600, maxSalary: 1400, requiredTech: 75, requiredNetwork: 25, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 750, maxSalary: 1800, requiredTech: 150, requiredNetwork: 75, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1050, maxSalary: 2400, requiredTech: 225, requiredNetwork: 150, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1350, maxSalary: 3600, requiredTech: 300, requiredNetwork: 250, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 3000, maxSalary: 15000, requiredTech: 375, requiredNetwork: 375, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c21_p1',
        name: '次世代UIフレームワーク開発',
        description: '社内向け共通UIライブラリの構築',
        requiredTech: 80,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c21_p2',
        name: '大規模検索エンジンの改善',
        description: '検索精度の向上とインデックス最適化',
        requiredTech: 90,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c21_p3',
        name: '動画配信基盤の構築',
        description: '低遅延なライブストリーミング',
        requiredTech: 100,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c22',
    name: 'Zenith Software',
    rank: 6,
    requiredTech: 84,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 42,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 450, maxSalary: 1000, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 600, maxSalary: 1400, requiredTech: 75, requiredNetwork: 25, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 750, maxSalary: 1800, requiredTech: 150, requiredNetwork: 75, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1050, maxSalary: 2400, requiredTech: 225, requiredNetwork: 150, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1350, maxSalary: 3600, requiredTech: 300, requiredNetwork: 250, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 3000, maxSalary: 15000, requiredTech: 375, requiredNetwork: 375, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c22_p1',
        name: '音声認識AIのチューニング',
        description: '業界特化の音声認識モデル改善',
        requiredTech: 84,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c22_p2',
        name: 'エッジAIのデプロイ',
        description: '推論モデルの軽量化とエッジ配置',
        requiredTech: 94,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c22_p3',
        name: '全社データガバナンス策定',
        description: 'データカタログの構築',
        requiredTech: 104,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c23',
    name: 'Apex IT',
    rank: 5,
    requiredTech: 88,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 44,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c23_p1',
        name: '自律型サイバー防衛',
        description: 'AIによる攻撃検知と自動防御',
        requiredTech: 88,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c23_p2',
        name: '超並列計算基盤',
        description: 'スパコン向けジョブスケジューラ',
        requiredTech: 98,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c23_p3',
        name: '脳波インターフェース研究',
        description: 'BMIの基礎研究サポート',
        requiredTech: 108,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c24',
    name: 'Vertex Tech',
    rank: 6,
    requiredTech: 92,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 46,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 450, maxSalary: 1000, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 600, maxSalary: 1400, requiredTech: 75, requiredNetwork: 25, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 750, maxSalary: 1800, requiredTech: 150, requiredNetwork: 75, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1050, maxSalary: 2400, requiredTech: 225, requiredNetwork: 150, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1350, maxSalary: 3600, requiredTech: 300, requiredNetwork: 250, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 3000, maxSalary: 15000, requiredTech: 375, requiredNetwork: 375, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c24_p1',
        name: 'スマート農業IoT',
        description: 'センサーデータによる自動灌水',
        requiredTech: 92,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c24_p2',
        name: '海洋資源探査データ解析',
        description: 'ソナーデータのノイズ除去',
        requiredTech: 102,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c24_p3',
        name: '次世代バッテリー管理',
        description: 'EV向けBMSの開発',
        requiredTech: 112,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c25',
    name: 'Pinnacle Systems',
    rank: 6,
    requiredTech: 96,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 48,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 450, maxSalary: 1000, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 600, maxSalary: 1400, requiredTech: 75, requiredNetwork: 25, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 750, maxSalary: 1800, requiredTech: 150, requiredNetwork: 75, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1050, maxSalary: 2400, requiredTech: 225, requiredNetwork: 150, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1350, maxSalary: 3600, requiredTech: 300, requiredNetwork: 250, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 3000, maxSalary: 15000, requiredTech: 375, requiredNetwork: 375, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c25_p1',
        name: '防災予測シミュレーション',
        description: '気象データと地形データの統合',
        requiredTech: 96,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c25_p2',
        name: 'パーソナライズド医療AI',
        description: '遺伝子データに基づく予測モデル',
        requiredTech: 106,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c25_p3',
        name: 'デジタルツイン構築',
        description: '物理工場の仮想空間再現',
        requiredTech: 116,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c26',
    name: 'Summit IT',
    rank: 5,
    requiredTech: 100,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 50,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c26_p1',
        name: '完全自動翻訳システム',
        description: 'リアルタイム同時通訳AI',
        requiredTech: 100,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c26_p2',
        name: '宇宙ゴミ追跡システム',
        description: 'デブリ軌道の予測計算',
        requiredTech: 110,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c26_p3',
        name: '深海探査ロボットの制御',
        description: '自律型探査アルゴリズム',
        requiredTech: 120,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c27',
    name: 'Crest Tech',
    rank: 7,
    requiredTech: 104,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 52,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 600, maxSalary: 1500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 800, maxSalary: 2100, requiredTech: 90, requiredNetwork: 30, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 1000, maxSalary: 2700, requiredTech: 180, requiredNetwork: 90, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1400, maxSalary: 3600, requiredTech: 270, requiredNetwork: 180, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1800, maxSalary: 5400, requiredTech: 360, requiredNetwork: 300, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 5000, maxSalary: 50000, requiredTech: 450, requiredNetwork: 450, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c27_p1',
        name: '超高解像度映像のリアルタイム処理',
        description: '8K映像の圧縮と転送',
        requiredTech: 104,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c27_p2',
        name: '量子暗号通信の実証',
        description: 'セキュアな鍵配送システム',
        requiredTech: 114,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c27_p3',
        name: '感情認識AI',
        description: '表情と音声からの感情分析',
        requiredTech: 124,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c28',
    name: 'Crown Software',
    rank: 5,
    requiredTech: 108,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 54,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 360, maxSalary: 750, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 480, maxSalary: 1050, requiredTech: 60, requiredNetwork: 20, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 600, maxSalary: 1350, requiredTech: 120, requiredNetwork: 60, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 840, maxSalary: 1800, requiredTech: 180, requiredNetwork: 120, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1080, maxSalary: 2700, requiredTech: 240, requiredNetwork: 200, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 2000, maxSalary: 8000, requiredTech: 300, requiredNetwork: 300, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c28_p1',
        name: '完全自動生成ゲームエンジン',
        description: 'プロンプトからの3D世界生成',
        requiredTech: 108,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c28_p2',
        name: '人型ロボットの歩行制御',
        description: '不整地での安定歩行アルゴリズム',
        requiredTech: 118,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c28_p3',
        name: '合成生物学シミュレータ',
        description: 'DNA配列の設計支援',
        requiredTech: 128,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c29',
    name: 'Royal IT',
    rank: 6,
    requiredTech: 112,
    isForeign: false,
    baseSalaryMultiplier: 1,
    corporateType: 'domestic',
    baseRaiseRate: 1.05,
    loanInterestRate: 0.05,
    requiredNetwork: 56,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 450, maxSalary: 1000, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 600, maxSalary: 1400, requiredTech: 75, requiredNetwork: 25, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 750, maxSalary: 1800, requiredTech: 150, requiredNetwork: 75, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1050, maxSalary: 2400, requiredTech: 225, requiredNetwork: 150, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1350, maxSalary: 3600, requiredTech: 300, requiredNetwork: 250, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 3000, maxSalary: 15000, requiredTech: 375, requiredNetwork: 375, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c29_p1',
        name: '汎用人工知能(AGI)の基礎研究',
        description: '自己学習型AIアーキテクチャ',
        requiredTech: 112,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c29_p2',
        name: '核融合炉のプラズマ制御',
        description: '磁場閉じ込めのシミュレーション',
        requiredTech: 122,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c29_p3',
        name: '恒星間航行軌道計算',
        description: '光帆船の推進力計算',
        requiredTech: 132,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
  {
    id: 'c30',
    name: 'Imperial Tech',
    rank: 7,
    requiredTech: 116,
    isForeign: true,
    baseSalaryMultiplier: 1.5,
    corporateType: 'foreign',
    baseRaiseRate: 1.1,
    loanInterestRate: 0.05,
    requiredNetwork: 58,
    positions: [
      { id: 'p1', name: '平社員', level: 1, minSalary: 600, maxSalary: 1500, requiredTech: 0, requiredNetwork: 0, requiredTenure: 0, isExecutive: false },
      { id: 'p2', name: '主任', level: 2, minSalary: 800, maxSalary: 2100, requiredTech: 90, requiredNetwork: 30, requiredTenure: 3, isExecutive: false },
      { id: 'p3', name: '係長', level: 3, minSalary: 1000, maxSalary: 2700, requiredTech: 180, requiredNetwork: 90, requiredTenure: 6, isExecutive: false },
      { id: 'p4', name: '課長', level: 4, minSalary: 1400, maxSalary: 3600, requiredTech: 270, requiredNetwork: 180, requiredTenure: 10, isExecutive: false },
      { id: 'p5', name: '部長', level: 5, minSalary: 1800, maxSalary: 5400, requiredTech: 360, requiredNetwork: 300, requiredTenure: 15, isExecutive: false },
      { id: 'p6', name: '役員', level: 6, minSalary: 5000, maxSalary: 50000, requiredTech: 450, requiredNetwork: 450, requiredTenure: 20, isExecutive: true }
    ],
    projects: [
      {
        id: 'c30_p1',
        name: '人類補完計画システム',
        description: '全人類の意識統合基盤',
        requiredTech: 116,
        requiredEffort: 90,
        difficulty: 3,
        completionBonusFunds: 30,
        completionBonusTech: 4,
        requiredPositionLevel: 1,
        durationYears: 1,
        techGrowthPerYear: 3
      },
      {
        id: 'c30_p2',
        name: '次元間通信プロトコル',
        description: '別次元とのデータリンク',
        requiredTech: 126,
        requiredEffort: 140,
        difficulty: 4,
        completionBonusFunds: 60,
        completionBonusTech: 8,
        requiredPositionLevel: 2,
        durationYears: 1,
        techGrowthPerYear: 4
      },
      {
        id: 'c30_p3',
        name: 'タイムトラベルパラドックス回避',
        description: '因果律崩壊の予測と防止',
        requiredTech: 136,
        requiredEffort: 200,
        difficulty: 5,
        completionBonusFunds: 100,
        completionBonusTech: 14,
        requiredPositionLevel: 3,
        durationYears: 1,
        techGrowthPerYear: 5
      }
    ]
  },
];

export const PROPERTIES: Property[] = [
    { id: 'rent_1', name: '築40年木造アパート(風呂なし)', type: 'rent', price: 3, initialCost: 5 },
    { id: 'rent_2', name: '郊外ボロワンルーム', type: 'rent', price: 5, initialCost: 15 },
    { id: 'rent_3', name: '普通の1Kアパート', type: 'rent', price: 8, initialCost: 20 },
    { id: 'rent_4', name: '都心築浅1LDK', type: 'rent', price: 15, initialCost: 40 },
    { id: 'rent_5', name: '高級タワマン(低層階)', type: 'rent', price: 30, initialCost: 100 },
    { id: 'rent_6', name: '高級タワマン(高層階)', type: 'rent', price: 50, initialCost: 200 },
    { id: 'rent_7', name: 'ブリリアント六本木(中層階)', type: 'rent', price: 100, initialCost: 400 },
    { id: 'buy_1', name: '中古ボロ戸建て', type: 'buy', price: 1500, initialCost: 100, depreciationRate: 0.05 },
    { id: 'buy_2', name: '郊外の中古マンション', type: 'buy', price: 3000, initialCost: 200, depreciationRate: 0.04 },
    { id: 'buy_3', name: '新築建売戸建て', type: 'buy', price: 5000, initialCost: 400, depreciationRate: 0.05 },
    { id: 'buy_4', name: '都心の中古タワマン', type: 'buy', price: 8000, initialCost: 600, depreciationRate: 0.02 },
    { id: 'buy_5', name: '都心の新築タワマン', type: 'buy', price: 15000, initialCost: 1000, depreciationRate: 0.02 },
    { id: 'buy_6', name: '高級住宅街の注文住宅', type: 'buy', price: 30000, initialCost: 2000, depreciationRate: 0.04 },
    { id: 'buy_7', name: 'ブリリアント六本木(ペントハウス)', type: 'buy', price: 100000, initialCost: 5000, depreciationRate: 0.01 },
];

export const CARS: Car[] = [
    { id: 'car_1', name: 'ボロボロの軽自動車', price: 30, depreciationRate: 0.3 },
    { id: 'car_2', name: '型落ちコンパクトカー', price: 80, depreciationRate: 0.25 },
    { id: 'car_3', name: '中古のハイブリッド車', price: 150, depreciationRate: 0.2 },
    { id: 'car_4', name: '新車の軽自動車', price: 200, depreciationRate: 0.2 },
    { id: 'car_5', name: '国産ファミリーミニバン', price: 350, depreciationRate: 0.15 },
    { id: 'car_6', name: '国産SUV', price: 450, depreciationRate: 0.15 },
    { id: 'car_7', name: '型落ち高級外車', price: 600, depreciationRate: 0.3 },
    { id: 'car_8', name: 'ドイツ製高級セダン', price: 1200, depreciationRate: 0.2 },
    { id: 'car_9', name: 'ドイツ製高級SUV', price: 1500, depreciationRate: 0.2 },
    { id: 'car_10', name: 'イギリス製高級クーペ', price: 2500, depreciationRate: 0.15 },
    { id: 'car_11', name: 'イタリア製スーパーカー', price: 4000, depreciationRate: 0.1 },
    { id: 'car_12', name: 'ハイパーカー(限定モデル)', price: 20000, depreciationRate: 0.05 },
];

export const createInitialState = (): GameState => {
    return {
        projectProgress: 0,
        consecutivePoorEvaluations: 0,
        turn: 0,
        player: {
            age: 22,
            funds: 100,
            tech: 10,
            health: 100,
            network: 5,
            intelligence: 1.0,
            isAlive: true,
            livingStandards: { food: 5, entertainment: 5 },
            currentProject: null,
            projectYearsLeft: 0,
            history: [],

            companyId: 'c1',
            companyTenure: 0,
            positionId: 'p1',
            salary: 300,
            pensionFund: 0,
            isRetired: false,
            targetCompanyId: null,
            pendingOffer: null,

            property: null,
            car: null,
            loans: []
        },
        allocation: {
            work: 50,
            rest: 30,
            study: 20,
            play: 0,
            jobHunt: 0
        }
    };
};
