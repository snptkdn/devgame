import { useState, useRef, useEffect } from 'react';
import { processTurn, calculateTotalLivingCost } from './game/engine';
import { COMPANIES, PROPERTIES, CARS, createInitialState } from './game/data';

const rankToTier = (rank: number) => {
    switch(rank) {
        case 7: return 'S';
        case 6: return 'A';
        case 5: return 'B';
        case 4: return 'C';
        case 3: return 'D';
        case 2: return 'E';
        case 1: return 'F';
        default: return '?';
    }
};

import type { Allocation, PlayerState, GameState } from './game/types';
import { Brain, Users, Briefcase, Coins, ChevronRight, Activity, Gamepad2, Coffee, Home, CheckCircle, Building, Car as CarIcon, Plus, Minus, PiggyBank, Target } from 'lucide-react';

type TurnSummary = {
  salaryRaise: number;
  promotedPositionName: string | null;
  projectCompletedName: string | null;
  jobOfferCompanyName: string | null;
  jobOfferPositionName: string | null;
  jobOfferSalary: number | null;
  jobOfferDeclined: boolean;
  died: boolean;
  retired: boolean;
  fundsDelta: number;
};

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const player = gameState.player;
  const allocation = gameState.allocation;
  const setPlayer = (p: any) => setGameState(prev => ({ ...prev, player: typeof p === 'function' ? p(prev.player) : p }));
  const setAllocation = (a: any) => setGameState(prev => ({ ...prev, allocation: typeof a === 'function' ? a(prev.allocation) : a }));
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [targetCompanyId, setTargetCompanyId] = useState<string>('');
  const [showJobHuntModal, setShowJobHuntModal] = useState<boolean>(false);
  const [loanYears, setLoanYears] = useState(35);
  const [activeTab, setActiveTab] = useState<'status' | 'action' | 'assets' | 'logs'>('action');

  const [turnSummary, setTurnSummary] = useState<TurnSummary | null>(null);

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [player.history]);

  useEffect(() => {
    // Sync current company projects
    if (player.currentProject === null) {
      setSelectedProjectId('');
    }
  }, [player.companyId, player.currentProject]);

  const maxTech = Math.max(...COMPANIES.flatMap(c => c.positions.map(p => p.requiredTech)));
  const maxNetwork = Math.max(...COMPANIES.flatMap(c => c.positions.map(p => p.requiredNetwork)));

  const handleAllocationChange = (key: keyof Allocation, delta: number) => {
    setAllocation((prev: Allocation) => {
      let nextValue = prev[key] + delta;

      // Boundaries
      if (key === 'work' && nextValue < 50) nextValue = 50;
      else if (nextValue < 0) nextValue = 0;
      if (nextValue > 100) nextValue = 100;

      // Special rule for job hunt
      if (key === 'jobHunt' && nextValue > 0 && nextValue < 10) {
          nextValue = delta > 0 ? 10 : 0;
      }
      if (key === 'jobHunt' && nextValue > 50) nextValue = 50;

      const next = { ...prev, [key]: nextValue };
      return next;
    });
  };

  const handleLivingStandardChange = (key: keyof PlayerState['livingStandards'], value: number) => {
    setPlayer((prev: PlayerState) => ({
      ...prev,
      livingStandards: {
        ...prev.livingStandards,
        [key]: value
      }
    }));
  };

  const totalAllocation = allocation.work + allocation.study + allocation.play + allocation.rest + allocation.jobHunt;
  const isAllocationValid = totalAllocation === 100;

  const currentCompany = COMPANIES.find(c => c.id === player.companyId);
  const AVAILABLE_PROJECTS = currentCompany?.projects || [];
  const currentPosition = currentCompany?.positions.find(p => p.id === player.positionId) || currentCompany?.positions[0];

  const handleNextTurn = () => {
    if (!isAllocationValid && !player.isRetired) return;

    let nextPlayer = { ...player };

    if (!player.isRetired) {
        if (!nextPlayer.currentProject && selectedProjectId) {
          nextPlayer.currentProject = AVAILABLE_PROJECTS.find(p => p.id === selectedProjectId) || null;
          if (nextPlayer.currentProject) {
            nextPlayer.projectYearsLeft = 0; // Not used anymore
          }
        }
        if (allocation.jobHunt > 0) {
            nextPlayer.targetCompanyId = targetCompanyId || null;
        }
    }

    const prevSalary = nextPlayer.salary;
    const prevPositionId = nextPlayer.positionId;
    const prevProject = nextPlayer.currentProject;
    const prevFunds = nextPlayer.funds;
    const prevWasRetired = nextPlayer.isRetired;

    const newState = processTurn({ ...gameState, player: nextPlayer, allocation });
    setGameState(newState);
    const newPlayerState = newState.player;

    // Summary calculation
    if (!newPlayerState.isAlive && player.isAlive) {
        setTurnSummary({ salaryRaise: 0, promotedPositionName: null, projectCompletedName: null, jobOfferCompanyName: null, jobOfferPositionName: null, jobOfferSalary: null, jobOfferDeclined: false, died: true, retired: false, fundsDelta: 0 });
    } else {
        const salaryRaise = newPlayerState.salary - prevSalary;
        let promotedPositionName = null;
        if (newPlayerState.positionId !== prevPositionId && newPlayerState.companyId === player.companyId) {
            const comp = COMPANIES.find(c => c.id === newPlayerState.companyId);
            const pos = comp?.positions.find(p => p.id === newPlayerState.positionId);
            if (pos) promotedPositionName = pos.name;
        }

        let projectCompletedName = null;
        if (prevProject && !newPlayerState.currentProject) {
            projectCompletedName = prevProject.name;
        }

        let jobOfferCompanyName = null;
        let jobOfferPositionName = null;
        let jobOfferSalary = null;
        let jobOfferDeclined = false;

        if (newPlayerState.pendingOffer) {
            const offerComp = COMPANIES.find(c => c.id === newPlayerState.pendingOffer?.companyId);
            const offerPos = offerComp?.positions.find(p => p.id === newPlayerState.pendingOffer?.positionId);
            jobOfferCompanyName = offerComp?.name || null;
            jobOfferPositionName = offerPos?.name || null;
            jobOfferSalary = newPlayerState.pendingOffer.offeredSalary;
        } else if (allocation.jobHunt > 0 && targetCompanyId && !newPlayerState.pendingOffer) {
            jobOfferDeclined = true;
        }

        const newlyRetired = newPlayerState.isRetired && !prevWasRetired;
        const fundsDelta = newPlayerState.funds - prevFunds;

        setTurnSummary({
            salaryRaise,
            promotedPositionName,
            projectCompletedName,
            jobOfferCompanyName,
            jobOfferPositionName,
            jobOfferSalary,
            jobOfferDeclined,
            died: false,
            retired: newlyRetired,
            fundsDelta
        });
    }

    if (!newPlayerState.currentProject) {
        setSelectedProjectId('');
    }

    // Automatically switch to logs if they died or retired this turn (optional)
    if (!newPlayerState.isAlive) {
        setActiveTab('logs');
    }
  };

  const isProjectReady = player.currentProject !== null || selectedProjectId !== '' || player.isRetired || player.companyId === '';

  const handleOfferResponse = (accept: boolean) => {
    if (accept && player.pendingOffer) {
        const offer = player.pendingOffer;
        const newCompany = COMPANIES.find(c => c.id === offer.companyId)!;
        setPlayer((prev: PlayerState) => ({
            ...prev,
            companyId: offer.companyId,
            positionId: offer.positionId,
            salary: offer.offeredSalary,
            companyTenure: 0,
            pendingOffer: null,
            history: [...prev.history, `【転職】「${newCompany.name}」に入社した！年収は${offer.offeredSalary}万円だ。`]
        }));
    } else {
        setPlayer((prev: PlayerState) => ({
            ...prev,
            pendingOffer: null,
            history: [...prev.history, `内定を辞退した。`]
        }));
    }
  };

  const renderProgressBar = (label: string, value: number, max: number, icon: React.ReactNode, colorClass: string) => {
      const percentage = Math.min(100, Math.max(0, (value / max) * 100));
      return (
          <div className="mb-2">
              <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center text-gray-600 font-bold">{icon} {label}</span>
                  <span className="font-bold text-gray-800">{value} <span className="text-xs text-gray-400">/ {max} (MAX)</span></span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans md:p-8 flex flex-col">

      {/* Job Hunt Modal */}
      {showJobHuntModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-2xl font-black text-orange-900 flex items-center">
                        <Target className="w-6 h-6 mr-2" />
                        転職先を探す
                    </h2>
                    <button
                        onClick={() => setShowJobHuntModal(false)}
                        className="text-gray-500 hover:text-gray-800 text-xl font-bold px-3 py-1"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {COMPANIES.filter(c => c.id !== player.companyId).map(c => {
                        const techScore = player.tech / Math.max(1, c.requiredTech);
                        const networkScore = player.network / Math.max(1, c.requiredNetwork);
                        let rawProb = (techScore * 0.5 + networkScore * 0.5) * (allocation.jobHunt > 0 ? allocation.jobHunt / 100 : 0.2) * player.intelligence;
                        const successProb = Math.floor(Math.max(0.01, Math.min(0.95, rawProb)) * 100);

                        const minSal = Math.min(...c.positions.map(p => p.minSalary));
                        const maxSal = Math.max(...c.positions.map(p => p.maxSalary));

                        let probLabel = '';
                        let probColor = '';
                        if (successProb >= 80) {
                            probLabel = '高'; probColor = 'text-green-600 bg-green-100 border-green-300';
                        } else if (successProb >= 40) {
                            probLabel = '中'; probColor = 'text-yellow-600 bg-yellow-100 border-yellow-300';
                        } else {
                            probLabel = '低'; probColor = 'text-red-600 bg-red-100 border-red-300';
                        }

                        return { company: c, successProb, probLabel, probColor, minSal, maxSal };
                    }).sort((a, b) => b.successProb - a.successProb).map(item => (
                        <div key={item.company.id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-lg mb-1">{item.company.name}</h3>
                                <p className="text-sm text-gray-600">想定年収: {item.minSal}万円 〜 {item.maxSal}万円</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded-full border font-bold text-sm ${item.probColor} whitespace-nowrap`}>
                                    内定確率: {item.probLabel}
                                </div>
                                <button
                                    onClick={() => {
                                        setTargetCompanyId(item.company.id);
                                        setShowJobHuntModal(false);
                                    }}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg whitespace-nowrap shadow-sm"
                                >
                                    選択
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Turn Summary Modal */}
      {turnSummary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all">
            <h2 className="text-2xl font-black text-center mb-6 border-b pb-4">
              {player.age - 1}歳の記録
            </h2>

            <div className="space-y-4">
              {turnSummary.died && (
                <div className="p-4 bg-red-100 text-red-800 rounded-xl font-bold text-center">
                  あなたは亡くなりました...
                </div>
              )}

              {turnSummary.retired && (
                <div className="p-4 bg-green-100 text-green-800 rounded-xl font-bold text-center">
                  定年退職しました！お疲れ様でした。
                </div>
              )}

              {!turnSummary.died && !turnSummary.retired && (
                <>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-600">資金増減</span>
                    <span className={`font-black text-lg ${turnSummary.fundsDelta >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {turnSummary.fundsDelta >= 0 ? '+' : ''}{turnSummary.fundsDelta}万円
                    </span>
                  </div>

                  {turnSummary.salaryRaise > 0 && (
                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                       <span className="font-bold text-blue-800 flex items-center"><Coins className="w-4 h-4 mr-1"/> 今年の昇給</span>
                       <span className="font-black text-blue-600 text-lg">+{turnSummary.salaryRaise}万円</span>
                     </div>
                  )}
                  {turnSummary.salaryRaise < 0 && (
                     <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                       <span className="font-bold text-red-800 flex items-center"><Coins className="w-4 h-4 mr-1"/> 今年の減給</span>
                       <span className="font-black text-red-600 text-lg">{turnSummary.salaryRaise}万円</span>
                     </div>
                  )}

                  {turnSummary.promotedPositionName && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                       <p className="font-black text-yellow-800 text-center flex items-center justify-center">
                         <ChevronRight className="w-5 h-5 mr-1" />
                         「{turnSummary.promotedPositionName}」に昇進しました！
                       </p>
                    </div>
                  )}

                  {turnSummary.projectCompletedName && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                       <p className="font-bold text-green-800 text-center text-sm">
                         案件「{turnSummary.projectCompletedName}」を完遂しました！
                       </p>
                    </div>
                  )}

                  {turnSummary.jobOfferCompanyName && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-300">
                       <p className="font-black text-orange-800 text-center mb-2">🎉 内定獲得 🎉</p>
                       <p className="text-sm text-center font-bold text-gray-700">
                         {turnSummary.jobOfferCompanyName} ({turnSummary.jobOfferPositionName})<br/>
                         提示年収: {turnSummary.jobOfferSalary}万円
                       </p>
                       <p className="text-xs text-center text-orange-600 mt-2">※アクションタブから転職するか選んでください</p>
                    </div>
                  )}

                  {turnSummary.jobOfferDeclined && (
                    <div className="p-3 bg-gray-100 rounded-lg text-center">
                       <p className="font-bold text-gray-500 text-sm">
                         転職活動は不採用に終わりました...
                       </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => setTurnSummary(null)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-end border-b pb-4 p-4 md:px-0 bg-white md:bg-transparent sticky top-0 z-10 shadow-sm md:shadow-none">
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-gray-900">ITサラリーマン 人生シミュレータ</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">選択が未来を創る。</p>
          </div>
          <div className="text-right">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{player.age} 歳</div>
            <div className="text-xs md:text-sm text-gray-500 font-bold">
              {player.isAlive ? (player.isRetired ? '引退 (年金生活)' : '現役') : 'ゲームオーバー'}
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b bg-white mt-2 md:mt-4 overflow-x-auto hide-scrollbar">
          {(['status', 'action', 'assets', 'logs'] as const).map(tab => {
              const labels = { status: 'ステータス', action: '行動', assets: '資産管理', logs: '人生の記録' };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  {labels[tab]}
                </button>
              );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:px-0 bg-white md:bg-transparent mt-2">

            {/* GAME OVER Overlay */}
            {!player.isAlive && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border-t-8 border-gray-800 mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">GAME OVER</h2>
                <p className="text-gray-600 mb-8">{player.age}歳で生涯を終えました。</p>

                <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg text-left mb-8 shadow-inner border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">最終リザルト</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex justify-between items-center"><span className="flex items-center"><Coins className="w-4 h-4 mr-2"/> 最終資金:</span> <span className="font-bold text-lg">{player.funds.toLocaleString()} 万円</span></li>
                    <li className="flex justify-between items-center"><span className="flex items-center"><Briefcase className="w-4 h-4 mr-2"/> 獲得技術:</span> <span className="font-bold">{player.tech}</span></li>
                    <li className="flex justify-between items-center"><span className="flex items-center"><Users className="w-4 h-4 mr-2"/> 獲得人脈:</span> <span className="font-bold">{player.network}</span></li>
                    <li className="flex justify-between items-center"><span className="flex items-center"><Building className="w-4 h-4 mr-2"/> 最終所属:</span> <span className="font-bold">{currentCompany?.name} ({currentPosition?.name})</span></li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setPlayer(createInitialState());
                    setAllocation({ work: 50, rest: 10, study: 20, play: 20, jobHunt: 0 });
                    setSelectedProjectId('');
                    setTargetCompanyId('');
                    setActiveTab('action');
                  }}
                  className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition shadow-md w-full md:w-auto"
                >
                  次の人生（周回）へ
                </button>
              </div>
            )}

            {/* TAB: STATUS */}
            {activeTab === 'status' && player.isAlive && (
              <div className="space-y-6">
                 {/* Basic Info */}
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex flex-col items-center rounded-xl shadow-sm">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">主人公</h2>
                  <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-sm flex items-center font-bold">
                    <Activity className="w-4 h-4 mr-1" /> 健康度: {player.health}%
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center text-lg pb-4 border-b border-gray-100">
                    <span className="flex items-center text-gray-600 font-bold"><Coins className="w-5 h-5 mr-2 text-yellow-500"/> 資金</span>
                    <span className="font-black text-3xl text-gray-900">{player.funds.toLocaleString()} <span className="text-sm font-normal">万円</span></span>
                  </div>

                  {!player.isRetired && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-2 mb-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center text-gray-600 font-bold"><Building className="w-4 h-4 mr-1"/> 企業</span>
                            <span className="font-bold text-gray-800">{currentCompany?.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center text-gray-600 font-bold"><Briefcase className="w-4 h-4 mr-1"/> 役職</span>
                            <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{currentPosition?.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center text-gray-600 font-bold"><Target className="w-4 h-4 mr-1"/> 勤続年数</span>
                            <span className="font-bold text-gray-800">{player.companyTenure} 年</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center text-gray-600 font-bold"><Coins className="w-4 h-4 mr-1"/> 今年の基本給</span>
                            <span className="font-bold text-gray-800">{player.salary} 万円</span>
                        </div>
                      </div>
                  )}

                  {/* Limits calculation based on all companies required tech/network */}
                  {renderProgressBar('技術力', player.tech, maxTech, <Briefcase className="w-4 h-4 mr-1"/>, 'bg-purple-500')}
                  {renderProgressBar('人脈', player.network, maxNetwork, <Users className="w-4 h-4 mr-1"/>, 'bg-green-500')}

                  <div className="flex justify-between items-center text-sm mt-4">
                    <span className="flex items-center text-gray-600 font-bold"><PiggyBank className="w-4 h-4 mr-1"/> 年金積立額</span>
                    <span className="font-bold text-gray-800">{player.pensionFund.toLocaleString()} 万円</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-400 font-bold"><Brain className="w-4 h-4 mr-1"/> 地頭の良さ</span>
                    <span className="text-gray-400 font-mono">{(player.intelligence).toFixed(2)}</span>
                  </div>
                </div>

                {/* Living Standards Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-md font-bold text-gray-800 border-l-4 border-blue-500 pl-2">生活水準の設定（固定費）</h3>

                    {([
                      { key: 'food', label: '食費', icon: <Coffee className="w-4 h-4 mr-2 text-gray-500" /> },
                      { key: 'entertainment', label: '娯楽', icon: <Gamepad2 className="w-4 h-4 mr-2 text-gray-500" /> },
                    ] as const).map(item => (
                      <div key={item.key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-sm font-bold text-gray-700">
                          {item.icon} {item.label}
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => handleLivingStandardChange(item.key, Math.max(1, player.livingStandards[item.key] - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 shadow-sm active:scale-95"><Minus className="w-4 h-4"/></button>
                          <span className="w-8 text-center text-sm font-black">Lv.{player.livingStandards[item.key]}</span>
                          <button onClick={() => handleLivingStandardChange(item.key, player.livingStandards[item.key] + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 shadow-sm active:scale-95"><Plus className="w-4 h-4"/></button>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 text-sm font-bold text-red-700 flex justify-between">
                      <span>予想年間固定費:</span>
                      <span>約 {Math.floor(calculateTotalLivingCost(player)).toLocaleString()} 万円</span>
                    </div>
                </div>
              </div>
            )}

            {/* TAB: ACTION */}
            {activeTab === 'action' && player.isAlive && (
              <div className="space-y-6">

                {player.isRetired ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center border-t-4 border-green-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">悠々自適な引退生活</h2>
                        <p className="text-gray-600 mb-6">仕事をする必要はありません。年金を受給し、趣味や休養に時間を使いましょう。</p>

                        <div className="p-4 bg-green-50 rounded-lg inline-block mb-6 text-left">
                           <div className="text-sm font-bold text-green-800 mb-1">今年の予想受給額</div>
                           <div className="text-2xl font-black text-green-900">{Math.floor(player.pensionFund / 30).toLocaleString()} 万円</div>
                        </div>

                        <button
                          onClick={handleNextTurn}
                          className="w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]"
                        >
                          1年進める <ChevronRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Projects */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-md font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-2">仕事の選択</h2>

                        {player.currentProject ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                  <div className="font-bold text-lg text-blue-900">{player.currentProject.name}</div>
                                  <div className="text-sm text-blue-700 mt-1">{player.currentProject.description}</div>
                                  </div>
                                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                  進捗: {Math.min(100, Math.floor((gameState.projectProgress / player.currentProject.requiredEffort) * 100))}%
                                  </div>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (gameState.projectProgress / player.currentProject.requiredEffort) * 100)}%` }}></div>
                              </div>
                              <div className="flex justify-between text-xs text-blue-800 font-bold mb-2">
                                <span>難易度: {'★'.repeat(player.currentProject.difficulty)}</span>
                                <span className={gameState.consecutivePoorEvaluations > 0 ? 'text-red-500' : 'text-blue-500'}>ストライク: {gameState.consecutivePoorEvaluations}</span>
                              </div>
                              <div className="mt-2 text-xs font-bold text-blue-800 grid grid-cols-2 gap-2 bg-white/50 p-2 rounded">
                                  <div>成長: 技術+{player.currentProject.techGrowthPerYear}/年</div>
                                  <div>完遂: 資金{player.currentProject.completionBonusFunds}万 / 技術+{player.currentProject.completionBonusTech}</div>
                              </div>
                            </div>
                            </div>
                        ) : (
                            <div>
                            <p className="text-sm text-gray-600 mb-3">新しい案件を選んでください。</p>
                            <div className="space-y-3">
                                {AVAILABLE_PROJECTS.filter(p => !currentPosition || currentPosition.level >= p.requiredPositionLevel).map(proj => {
                                const canSelect = player.tech >= proj.requiredTech;
                                const isSelected = selectedProjectId === proj.id;
                                return (
                                    <div
                                    key={proj.id}
                                    onClick={() => canSelect && setSelectedProjectId(proj.id)}
                                    className={`p-4 rounded-lg border text-sm transition-all shadow-sm ${
                                        !canSelect ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' :
                                        isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 cursor-pointer' :
                                        'bg-white border-gray-300 hover:border-blue-400 cursor-pointer'
                                    }`}
                                    >
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="font-bold text-gray-800">{proj.name}</div>
                                        {!canSelect && <div className="text-xs text-red-500 font-bold bg-red-100 px-2 py-0.5 rounded">必要技術: {proj.requiredTech}</div>}
                                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <div className={`text-xs mt-2 ${isSelected ? 'text-blue-800' : 'text-gray-500'}`}>
                                        {proj.description} <br/>
                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                          <span>必要工数: {proj.requiredEffort}</span>
                                          <span>難易度: {'★'.repeat(proj.difficulty)}</span>
                                          <span className="font-bold">ボーナス: 資金{proj.completionBonusFunds}万 / 技術+{proj.completionBonusTech}</span>
                                        </div>
                                    </div>
                                    </div>
                                );
                                })}
                            </div>
                            </div>
                        )}
                        </div>

                        {/* Allocation Sliders */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-md font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-2">時間の割り振り (合計100%)</h2>

                            <div className="space-y-5 mb-6">
                            {([
                                { key: 'work', label: '仕事', icon: <Briefcase className="w-4 h-4 mr-1" />, colorText: 'text-blue-700', note: '※最低50%' },
                                { key: 'study', label: '勉強', icon: <Brain className="w-4 h-4 mr-1" />, colorText: 'text-purple-700', note: '' },
                                { key: 'play', label: '遊ぶ', icon: <Users className="w-4 h-4 mr-1" />, colorText: 'text-green-700', note: '' },
                                { key: 'rest', label: '休養', icon: <Activity className="w-4 h-4 mr-1" />, colorText: 'text-yellow-700', note: '' },
                                { key: 'jobHunt', label: '転職', icon: <Target className="w-4 h-4 mr-1" />, colorText: 'text-orange-700', note: '(0% or 10-50%)' },
                            ] as const).map(item => (
                                <div key={item.key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <label className={`text-sm font-bold flex items-center ${item.colorText}`}>
                                        {item.icon} {item.label} <span className="text-[10px] text-gray-400 ml-2">{item.note}</span>
                                    </label>
                                    <span className={`text-lg font-black ${item.colorText}`}>{allocation[item.key]}%</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => handleAllocationChange(item.key, -5)} className="w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center active:bg-gray-100 transition-transform active:scale-95"><Minus className="w-5 h-5 text-gray-600"/></button>
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full bg-gray-200 h-2 rounded-full"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center">
                                            <div className={`h-2 rounded-full ${item.colorText.replace('text-', 'bg-')}`} style={{ width: `${allocation[item.key]}%` }}></div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleAllocationChange(item.key, 5)} className="w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center active:bg-gray-100 transition-transform active:scale-95"><Plus className="w-5 h-5 text-gray-600"/></button>
                                </div>
                                </div>
                            ))}
                            </div>

                            <div className={`p-4 rounded-xl mb-6 flex justify-between items-center shadow-inner border ${isAllocationValid ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                                <div className="font-bold">合計:</div>
                                <div className="flex items-center">
                                    <span className="font-black text-2xl">{totalAllocation}%</span>
                                    {!isAllocationValid && <span className="ml-3 text-xs font-bold bg-red-100 px-2 py-1 rounded">100%に調整してください</span>}
                                </div>
                            </div>

                            {/* Job Hunting target selection */}
                            {allocation.jobHunt > 0 && (
                                <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-xl space-y-3">
                                    <h3 className="font-bold text-orange-900 flex items-center"><Target className="w-4 h-4 mr-2"/> 転職希望先の選択</h3>

                                    {!targetCompanyId ? (
                                        <button
                                            onClick={() => setShowJobHuntModal(true)}
                                            className="w-full p-3 rounded-lg border-2 border-orange-400 bg-orange-100 hover:bg-orange-200 font-bold text-orange-900 shadow-sm transition"
                                        >
                                            転職先を探す
                                        </button>
                                    ) : (
                                        <div className="bg-white p-3 rounded-lg border border-orange-300 shadow-sm flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-gray-800 text-sm">選択中の企業:</span>
                                                <span className="font-black text-orange-700">{COMPANIES.find(c => c.id === targetCompanyId)?.name}</span>
                                            </div>
                                            <button
                                                onClick={() => setShowJobHuntModal(true)}
                                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded"
                                            >
                                                変更する
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleNextTurn}
                                disabled={!isAllocationValid || !isProjectReady || (allocation.jobHunt > 0 && !targetCompanyId)}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center ${
                                    (isAllocationValid && isProjectReady && (allocation.jobHunt === 0 || targetCompanyId))
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                1年進める <ChevronRight className="ml-2 w-5 h-5" />
                            </button>
                            {!isProjectReady && (
                                <p className="text-red-500 text-xs text-center mt-3 font-bold">※新しい案件を選択してください</p>
                            )}
                            {(allocation.jobHunt > 0 && !targetCompanyId) && (
                                <p className="text-red-500 text-xs text-center mt-3 font-bold">※転職希望先の企業を選択してください</p>
                            )}
                        </div>
                    </>
                )}
              </div>
            )}

            {/* TAB: ASSETS */}
            {activeTab === 'assets' && player.isAlive && (
                <div className="space-y-6">
                    {/* Current Assets */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-md font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-2">所有資産</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="flex items-center text-indigo-900 font-bold mb-2"><Home className="w-5 h-5 mr-2"/> 住居</div>
                                {player.property ? (
                                    <>
                                        <div className="font-black text-lg text-gray-800">{player.property.name}</div>
                                        <div className="text-sm mt-2 font-bold text-gray-600">
                                            {player.property.type === 'rent' ? (
                                                <span>家賃: {player.property.price}万/月</span>
                                            ) : (
                                                <span>所有年数: {player.property.ownedYears}年 / 現在価値: {Math.floor(player.property.price * Math.pow(1 - (player.property.depreciationRate || 0), player.property.ownedYears))}万</span>
                                            )}
                                        </div>
                                    </>
                                ) : <div className="text-gray-500 font-bold">なし</div>}
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="flex items-center text-indigo-900 font-bold mb-2"><CarIcon className="w-5 h-5 mr-2"/> 車</div>
                                {player.car ? (
                                    <>
                                        <div className="font-black text-lg text-gray-800">{player.car.name}</div>
                                        <div className="text-sm mt-2 font-bold text-gray-600">
                                            所有年数: {player.car.ownedYears}年 / 現在価値: {Math.floor(player.car.price * Math.pow(1 - player.car.depreciationRate, player.car.ownedYears))}万
                                        </div>
                                    </>
                                ) : <div className="text-gray-500 font-bold">なし</div>}
                            </div>
                        </div>

                        {/* Loans */}
                        {player.loans.length > 0 && (
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-bold text-gray-800 mb-3 text-sm">組んでいるローン</h3>
                                <div className="space-y-2">
                                    {player.loans.map((loan, idx) => (
                                        <div key={idx} className="bg-red-50 p-3 rounded border border-red-100 flex justify-between items-center flex-wrap gap-2">
                                            <div>
                                                <div className="font-bold text-red-900 text-sm">{loan.name}</div>
                                                <div className="text-xs text-red-700 mt-1">残債: {Math.floor(loan.remainingPrincipal).toLocaleString()}万 / 残り{loan.remainingYears}年 / 年間返済: {loan.yearlyPayment}万</div>
                                            </div>
                                            <button
                                                disabled={player.funds < loan.remainingPrincipal}
                                                onClick={() => {
                                                    setPlayer((prev: PlayerState) => ({
                                                        ...prev,
                                                        funds: prev.funds - loan.remainingPrincipal,
                                                        loans: prev.loans.filter(l => l.id !== loan.id),
                                                        history: [...prev.history, `【繰上返済】「${loan.name}」の残債 ${Math.floor(loan.remainingPrincipal)}万円 を一括で返済した。`]
                                                    }));
                                                }}
                                                className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm ${player.funds >= loan.remainingPrincipal ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                一括返済
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sell Actions */}
                        <div className="mt-6 flex gap-2">
                            {player.property && player.property.type === 'buy' && (
                                <button
                                    onClick={() => {
                                        const prop = player.property!;
                                        const currentValue = Math.floor(prop.price * Math.pow(1 - (prop.depreciationRate || 0), prop.ownedYears));

                                        // 相殺処理: この物件のローンがあれば探して一括返済する
                                        let loanToPay = player.loans.find(l => l.name.includes(prop.name));
                                        let profit = currentValue;
                                        let newLoans = [...player.loans];

                                        if (loanToPay) {
                                            profit -= loanToPay.remainingPrincipal;
                                            newLoans = newLoans.filter(l => l.id !== loanToPay.id);
                                        }

                                        setPlayer((prev: PlayerState) => ({
                                            ...prev,
                                            funds: prev.funds + profit,
                                            property: null,
                                            loans: newLoans,
                                            history: [...prev.history, `【売却】「${prop.name}」を売却した。（現在価値: ${currentValue}万${loanToPay ? `, ローン残債相殺: -${Math.floor(loanToPay.remainingPrincipal)}万` : ''}） → 最終利益: ${Math.floor(profit)}万`]
                                        }));
                                    }}
                                    className="flex-1 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 rounded font-bold text-sm shadow-sm"
                                >
                                    家を売却する
                                </button>
                            )}
                             {player.car && (
                                <button
                                    onClick={() => {
                                        const car = player.car!;
                                        const currentValue = Math.floor(car.price * Math.pow(1 - car.depreciationRate, car.ownedYears));

                                        let loanToPay = player.loans.find(l => l.name.includes(car.name));
                                        let profit = currentValue;
                                        let newLoans = [...player.loans];

                                        if (loanToPay) {
                                            profit -= loanToPay.remainingPrincipal;
                                            newLoans = newLoans.filter(l => l.id !== loanToPay.id);
                                        }

                                        setPlayer((prev: PlayerState) => ({
                                            ...prev,
                                            funds: prev.funds + profit,
                                            car: null,
                                            loans: newLoans,
                                            history: [...prev.history, `【売却】「${car.name}」を売却した。（現在価値: ${currentValue}万${loanToPay ? `, ローン残債相殺: -${Math.floor(loanToPay.remainingPrincipal)}万` : ''}） → 最終利益: ${Math.floor(profit)}万`]
                                        }));
                                    }}
                                    className="flex-1 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 rounded font-bold text-sm shadow-sm"
                                >
                                    車を売却する
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-md font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-2">不動産・カーディーラー</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded">物件一覧</h3>
                                <div className="space-y-3">
                                {PROPERTIES.map(prop => {
                                    const isOwned = player.property?.id === prop.id;
                                    const cost = prop.type === 'buy' ? prop.price : prop.initialCost;
                                    const canAffordCash = player.funds >= cost;

                                    return (
                                    <div key={prop.id} className={`p-4 rounded-lg border shadow-sm ${isOwned ? 'border-indigo-500 bg-indigo-50/30' : 'bg-white border-gray-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded mr-2 ${prop.type === 'buy' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {prop.type === 'buy' ? '購入' : '賃貸'}
                                            </span>
                                            <span className="font-bold text-gray-800">{prop.name}</span>
                                        </div>
                                        {isOwned && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                                        </div>

                                        <div className="text-xs text-gray-600 mb-3">
                                        {prop.type === 'buy' ? (
                                            <div className="flex gap-4">
                                                <span>販売価格: <span className="font-bold text-gray-900">{prop.price.toLocaleString()}</span> 万</span>
                                                <span>残価率目安: <span className="font-bold">{(100 - (prop.depreciationRate||0)*100).toFixed(0)}% / 年</span></span>
                                            </div>
                                        ) : (
                                            <div className="flex gap-4">
                                                <span>家賃: <span className="font-bold text-gray-900">{prop.price}</span> 万/月</span>
                                                <span>初期費用: {prop.initialCost}万</span>
                                            </div>
                                        )}
                                        </div>

                                        {!isOwned && (
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <button
                                                disabled={!canAffordCash}
                                                onClick={() => {
                                                    setPlayer((prev: PlayerState) => ({
                                                        ...prev,
                                                        funds: prev.funds - cost,
                                                        property: { ...prop, ownedYears: 0 },
                                                        history: [...prev.history, `【契約】「${prop.name}」を現金(${cost}万円)で${prop.type === 'buy' ? '購入' : '契約'}した。`]
                                                    }));
                                                }}
                                                className={`flex-1 py-2 text-xs font-bold rounded shadow-sm ${canAffordCash ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                現金決済 ({cost}万)
                                            </button>

                                            {prop.type === 'buy' && (
                                                <div className="flex-1 flex flex-row">
                                                    <select value={loanYears} onChange={e => setLoanYears(Number(e.target.value))} className="text-xs border border-gray-300 rounded-l p-2 bg-gray-50 focus:ring-0">
                                                        <option value="10">10年</option>
                                                        <option value="20">20年</option>
                                                        <option value="35">35年</option>
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            const company = COMPANIES.find(c => c.id === player.companyId)!;
                                                            const rate = company.loanInterestRate;
                                                            const yearlyRate = rate;
                                                            const payment = Math.floor(prop.price * yearlyRate * Math.pow(1 + yearlyRate, loanYears) / (Math.pow(1 + yearlyRate, loanYears) - 1));

                                                            const newLoan = {
                                                                id: 'loan_' + Date.now(),
                                                                name: prop.name + 'ローン',
                                                                remainingPrincipal: prop.price,
                                                                interestRate: yearlyRate,
                                                                remainingYears: loanYears,
                                                                yearlyPayment: payment
                                                            };

                                                            setPlayer((prev: PlayerState) => ({
                                                                ...prev,
                                                                property: { ...prop, ownedYears: 0 },
                                                                loans: [...prev.loans, newLoan],
                                                                history: [...prev.history, `【ローン】「${prop.name}」を${loanYears}年ローン(金利${(rate*100).toFixed(1)}%)で購入した。`]
                                                            }));
                                                        }}
                                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-r px-2 shadow-sm active:scale-[0.98]"
                                                    >
                                                        ローン契約
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        )}
                                    </div>
                                    );
                                })}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm text-gray-600 mb-3 bg-gray-100 p-2 rounded">車一覧</h3>
                                <div className="space-y-3">
                                {CARS.map(car => {
                                    const isOwned = player.car?.id === car.id;
                                    const canAffordCash = player.funds >= car.price;
                                    return (
                                    <div key={car.id} className={`p-4 rounded-lg border shadow-sm ${isOwned ? 'border-indigo-500 bg-indigo-50/30' : 'bg-white border-gray-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-800">{car.name}</div>
                                        {isOwned && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                                        </div>

                                        <div className="text-xs text-gray-600 mb-3 flex gap-4">
                                            <span>価格: <span className="font-bold text-gray-900">{car.price.toLocaleString()}</span> 万</span>
                                            <span>残価率目安: <span className="font-bold">{(100 - car.depreciationRate*100).toFixed(0)}% / 年</span></span>
                                        </div>

                                        {!isOwned && (
                                        <div className="flex gap-2">
                                            <button
                                                disabled={!canAffordCash}
                                                onClick={() => {
                                                    setPlayer((prev: PlayerState) => ({
                                                        ...prev,
                                                        funds: prev.funds - car.price,
                                                        car: { ...car, ownedYears: 0 },
                                                        history: [...prev.history, `【購入】「${car.name}」を現金(${car.price}万円)で購入した。`]
                                                    }));
                                                }}
                                                className={`flex-1 py-2 text-xs font-bold rounded shadow-sm ${canAffordCash ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                現金決済 ({car.price}万)
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const company = COMPANIES.find(c => c.id === player.companyId)!;
                                                    const rate = company.loanInterestRate;
                                                    const years = 5;
                                                    const payment = Math.floor(car.price * rate * Math.pow(1 + rate, years) / (Math.pow(1 + rate, years) - 1));

                                                    const newLoan = {
                                                        id: 'loan_' + Date.now(),
                                                        name: car.name + 'ローン',
                                                        remainingPrincipal: car.price,
                                                        interestRate: rate,
                                                        remainingYears: years,
                                                        yearlyPayment: payment
                                                    };

                                                    setPlayer((prev: PlayerState) => ({
                                                        ...prev,
                                                        car: { ...car, ownedYears: 0 },
                                                        loans: [...prev.loans, newLoan],
                                                        history: [...prev.history, `【ローン】「${car.name}」を5年ローンで購入した。`]
                                                    }));
                                                }}
                                                className="flex-1 py-2 text-xs font-bold rounded bg-purple-600 hover:bg-purple-700 text-white shadow-sm active:scale-[0.98]"
                                            >
                                                5年ローン
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                    );
                                })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: LOGS */}
            {activeTab === 'logs' && (
              <div className="bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 h-[70vh] flex flex-col">
                <h2 className="text-sm font-bold text-gray-400 mb-4 border-b border-gray-700 pb-2">人生の記録</h2>
                <div className="flex-1 overflow-y-auto font-mono text-xs md:text-sm space-y-2 pr-2 hide-scrollbar">
                  {player.history.map((log, idx) => {
                    const isYearHeader = log.startsWith('---');
                    const isSystem = log.startsWith('===');
                    const isDeath = log.includes('【死亡】') || log.includes('GAME OVER');
                    const isRetire = log.includes('【定年】');
                    let color = 'text-gray-300';
                    if (isYearHeader) color = 'text-blue-400 mt-6 mb-2 font-black border-b border-blue-900/50 pb-1';
                    if (isSystem) color = 'text-yellow-400 font-bold';
                    if (isDeath) color = 'text-red-500 font-black';
                    if (isRetire) color = 'text-green-300 font-black';
                    if (log.includes('資金が底を')) color = 'text-red-400 font-bold';
                    if (log.includes('【案件完遂！】') || log.includes('【昇進！】') || log.includes('【内定！】') || log.includes('【転職】')) color = 'text-green-400 font-bold';
                    if (log.includes('【契約】') || log.includes('【購入】') || log.includes('【ローン】') || log.includes('【繰上返済】') || log.includes('【売却】')) color = 'text-indigo-300 font-bold';

                    return (
                      <div key={idx} className={`${color} leading-relaxed`}>
                        {!isYearHeader && !isDeath && !isSystem && <span className="text-gray-600 mr-2 opacity-50">&gt;</span>}
                        {log}
                      </div>
                    );
                  })}
                  <div ref={historyEndRef} className="h-4" />
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Offer Modal */}
      {player.pendingOffer && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
                <Target className="w-12 h-12 mx-auto mb-3 text-white/90" />
                <h2 className="text-2xl font-black">内定のお知らせ</h2>
             </div>

             <div className="p-6 bg-gray-50 text-center space-y-4">
                <p className="text-gray-600 font-bold">以下の企業からオファーが届きました！</p>

                {(() => {
                    const comp = COMPANIES.find(c => c.id === player.pendingOffer?.companyId);
                    const pos = comp?.positions.find(p => p.id === player.pendingOffer?.positionId);
                    return (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
                            <div className="text-sm text-gray-500 font-bold">企業名</div>
                            <div className="text-xl font-black text-gray-900"><span className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2 align-middle">Tier {comp ? rankToTier(comp.rank) : '?'}</span>{comp?.name}</div>

                            <div className="h-px bg-gray-100 my-4"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 font-bold">提示役職</div>
                                    <div className="text-md font-bold text-blue-700">{pos?.name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 font-bold">提示年収</div>
                                    <div className="text-lg font-black text-red-600">{player.pendingOffer.offeredSalary} <span className="text-xs">万円</span></div>
                                </div>
                            </div>

                            {player.companyTenure < 2 && (
                                <div className="mt-4 text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded">※前職の勤続年数が短いため、年収オファーが若干下がっています。</div>
                            )}
                        </div>
                    );
                })()}

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => handleOfferResponse(false)}
                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition"
                    >
                        辞退する
                    </button>
                    <button
                        onClick={() => handleOfferResponse(true)}
                        className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md"
                    >
                        転職する！
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Global CSS for hiding scrollbar visually but keeping function */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;
