import { useState, useRef, useEffect } from 'react';
import { createInitialState, processTurn, AVAILABLE_PROJECTS, calculateTotalLivingCost } from './game/engine';
import { COMPANIES, PROPERTIES, CARS } from './game/data';
import type { Allocation, PlayerState } from './game/types';
import { Brain, Users, Briefcase, Coins, ChevronRight, Activity, Gamepad2, Coffee, Home, CheckCircle, Building, Car as CarIcon } from 'lucide-react';

function App() {
  const [player, setPlayer] = useState<PlayerState>(createInitialState());
  const [allocation, setAllocation] = useState<Allocation>({ work: 50, rest: 10, study: 20, play: 20, jobHunt: 0 });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showShop, setShowShop] = useState(false);
  const [loanYears, setLoanYears] = useState(35);

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [player.history]);

  const handleSliderChange = (key: keyof Allocation, value: number) => {
    if (key === 'jobHunt' && value > 0 && value < 10) value = 10;
    if (key === 'jobHunt' && value > 50) value = 50;

    setAllocation(prev => {
      const next = { ...prev, [key]: value };

      if (key === 'work' && next.work < 50) next.work = 50;

      let currentTotal = next.work + next.study + next.play + next.rest + next.jobHunt;

      // Auto-adjust logic (simplified for robust replacement)
      if (currentTotal > 100) {
          // just let it be invalid for now, standard logic was complex
      }

      return next;
    });
  };

  const handleLivingStandardChange = (key: keyof PlayerState['livingStandards'], value: number) => {
    setPlayer(prev => ({
      ...prev,
      livingStandards: {
        ...prev.livingStandards,
        [key]: value
      }
    }));
  };

  const totalAllocation = allocation.work + allocation.study + allocation.play + allocation.rest + allocation.jobHunt;
  const isAllocationValid = totalAllocation === 100;

  const handleNextTurn = () => {
    if (!isAllocationValid) return;

    let nextPlayer = { ...player };
    if (!nextPlayer.currentProject && selectedProjectId) {
      nextPlayer.currentProject = AVAILABLE_PROJECTS.find(p => p.id === selectedProjectId) || null;
      if (nextPlayer.currentProject) {
        nextPlayer.projectYearsLeft = nextPlayer.currentProject.durationYears;
      }
    }

    const newPlayerState = processTurn(nextPlayer, allocation);
    setPlayer(newPlayerState);
    if (!newPlayerState.currentProject) {
        setSelectedProjectId('');
    }
  };

  const isProjectReady = player.currentProject !== null || selectedProjectId !== '';
  const currentCompany = COMPANIES.find(c => c.id === player.companyId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex justify-between items-end border-b pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">ITサラリーマン 人生シミュレータ</h1>
            <p className="text-sm text-gray-500 mt-1">選択が未来を創る。限られた時間をどう使うか。</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{player.age} 歳</div>
            <div className="text-sm text-gray-500">
              {player.isAlive ? '現在プレイ中' : 'ゲームオーバー'}
            </div>
          </div>
        </header>

        {player.isAlive ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Status */}
            <div className="lg:col-span-1 space-y-6">

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">主人公</h2>
                  <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-1" /> 健康度: {player.health}%
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg pb-2 border-b">
                    <span className="flex items-center text-gray-600"><Coins className="w-5 h-5 mr-2 text-yellow-500"/> 資金</span>
                    <span className="font-black text-2xl text-gray-900">{player.funds.toLocaleString()} <span className="text-sm font-normal">万円</span></span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600"><Briefcase className="w-4 h-4 mr-1"/> 技術力</span>
                    <span className="font-bold text-gray-800">{player.tech}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600"><Users className="w-4 h-4 mr-1"/> 人脈</span>
                    <span className="font-bold text-gray-800">{player.network}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600"><Building className="w-4 h-4 mr-1"/> 企業</span>
                    <span className="font-bold text-gray-800 text-xs truncate max-w-[120px]" title={currentCompany?.name}>{currentCompany?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600"><Coins className="w-4 h-4 mr-1"/> 基本給</span>
                    <span className="font-bold text-gray-800">{player.salary} 万円</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600"><Home className="w-4 h-4 mr-1"/> 家</span>
                    <span className="font-bold text-gray-800 text-xs truncate max-w-[120px]" title={player.property?.name || 'なし'}>{player.property?.name || 'なし'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-600"><CarIcon className="w-4 h-4 mr-1"/> 車</span>
                    <span className="font-bold text-gray-800 text-xs truncate max-w-[120px]" title={player.car?.name || 'なし'}>{player.car?.name || 'なし'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-400"><Brain className="w-4 h-4 mr-1"/> 地頭の良さ</span>
                    <span className="text-gray-400 font-mono">{(player.intelligence).toFixed(2)}</span>
                  </div>

                  {/* Living Standards Settings */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700">生活水準の設定（固定費）</h3>

                    {([
                      { key: 'food', label: '食費', icon: <Coffee className="w-4 h-4 mr-1 text-gray-500" /> },
                      { key: 'entertainment', label: '娯楽', icon: <Gamepad2 className="w-4 h-4 mr-1 text-gray-500" /> },
                    ] as const).map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-gray-600">
                          {item.icon} {item.label}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleLivingStandardChange(item.key, Math.max(1, player.livingStandards[item.key] - 1))} className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-300">-</button>
                          <span className="w-8 text-center text-sm font-bold">Lv.{player.livingStandards[item.key]}</span>
                          <button onClick={() => handleLivingStandardChange(item.key, player.livingStandards[item.key] + 1)} className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-300">+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="text-sm font-bold text-red-600 flex justify-between">
                      <span>今年の予想固定費:</span>
                      <span>約 {Math.floor(calculateTotalLivingCost(player)).toLocaleString()} 万円</span>
                    </div>
                  </div>

                  <button onClick={() => setShowShop(true)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow flex items-center justify-center transition">
                    <Building className="w-4 h-4 mr-2" /> 不動産・カーディーラーに行く
                  </button>
                </div>
              </div>

            </div>

            {/* Middle & Right Column: Actions & Logs */}
            <div className="lg:col-span-2 space-y-6">

              {/* Projects & Allocation */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">仕事と時間の割り振り</h2>

                <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" /> 現在のプロジェクト
                  </h3>

                  {player.currentProject ? (
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg">{player.currentProject.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{player.currentProject.description}</div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                          残り {player.projectYearsLeft} 年
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 grid grid-cols-2 gap-2">
                         <div>毎年の技術成長: +{player.currentProject.techGrowthPerYear} ベース</div>
                         <div>完遂ボーナス: 資金{player.currentProject.completionBonusFunds}万円 / 技術+{player.currentProject.completionBonusTech}</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-700 mb-3">新しい案件を選んでください。（自身の技術力によって選べる案件が増えます）</p>
                      <div className="space-y-2">
                        {AVAILABLE_PROJECTS.map(proj => {
                          const canSelect = player.tech >= proj.requiredTech;
                          const isSelected = selectedProjectId === proj.id;
                          return (
                            <div
                              key={proj.id}
                              onClick={() => canSelect && setSelectedProjectId(proj.id)}
                              className={`p-3 rounded border text-sm transition-all ${
                                !canSelect ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' :
                                isSelected ? 'bg-blue-600 text-white border-blue-700 shadow-md cursor-pointer' :
                                'bg-white border-gray-300 hover:border-blue-400 cursor-pointer'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <div className="font-bold">{proj.name} <span className="text-xs font-normal opacity-80">({proj.durationYears}年)</span></div>
                                {!canSelect && <div className="text-xs text-red-500 font-bold">必要技術: {proj.requiredTech}</div>}
                                {isSelected && <CheckCircle className="w-4 h-4" />}
                              </div>
                              <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                {proj.description} (ボーナス: 資金{proj.completionBonusFunds}万/技術+{proj.completionBonusTech})
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* スライダー */}
                <p className="text-sm text-gray-600 mb-4">合計が100%になるように配分してください。</p>
                <div className="space-y-6 mb-8">
                  {([
                    { key: 'work', label: '仕事 (資金・技術)', color: 'bg-blue-500', thumb: 'accent-blue-500', min: 50, note: '※最低50%' },
                    { key: 'study', label: '勉強 (技術向上)', color: 'bg-purple-500', thumb: 'accent-purple-500', min: 0, note: '' },
                    { key: 'play', label: '遊ぶ (人脈/ストレス発散)', color: 'bg-green-500', thumb: 'accent-green-500', min: 0, note: '' },
                    { key: 'rest', label: '休養 (健康維持)', color: 'bg-yellow-500', thumb: 'accent-yellow-500', min: 0, note: '' },
                    { key: 'jobHunt', label: '転職活動 (0, 10-50%)', color: 'bg-orange-500', thumb: 'accent-orange-500', min: 0, note: '' },
                  ] as const).map(item => (
                    <div key={item.key}>
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-sm font-medium text-gray-700">
                          {item.label} <span className="text-xs text-gray-400 ml-2">{item.note}</span>
                        </label>
                        <span className="text-sm text-gray-500 font-mono">{allocation[item.key]}%</span>
                      </div>
                      <input
                        type="range"
                        min={item.min} max="100"
                        value={allocation[item.key]}
                        onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value, 10))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${item.thumb} bg-gray-200`}
                      />
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-lg mb-6 flex justify-between items-center ${isAllocationValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <div>合計: <span className="font-bold text-xl">{totalAllocation}%</span></div>
                  {!isAllocationValid && <div className="text-sm font-bold">100%にしてください</div>}
                </div>

                <button
                  onClick={handleNextTurn}
                  disabled={!isAllocationValid || !isProjectReady}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center ${
                    (isAllocationValid && isProjectReady)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  1年進める <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                {!isProjectReady && (
                  <p className="text-red-500 text-xs text-center mt-2 font-bold">※新しい案件を選択してください</p>
                )}
              </div>

              {/* Logs */}
              <div className="bg-gray-900 rounded-xl shadow-sm p-4 h-80 flex flex-col">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-2">人生の記録</h2>
                <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1">
                  {player.history.map((log, idx) => {
                    const isYearHeader = log.startsWith('---');
                    const isSystem = log.startsWith('===');
                    const isDeath = log.includes('【死亡】');
                    let color = 'text-gray-300';
                    if (isYearHeader) color = 'text-blue-400 mt-4 mb-1 font-bold';
                    if (isSystem) color = 'text-yellow-400 font-bold';
                    if (isDeath) color = 'text-red-500 font-bold';
                    if (log.includes('資金が底を')) color = 'text-red-400';
                    if (log.includes('【案件完遂！】') || log.includes('【転職成功！】')) color = 'text-green-400 font-bold';

                    return (
                      <div key={idx} className={`${color}`}>
                        {!isYearHeader && !isDeath && !isSystem && <span className="text-gray-600 mr-2">&gt;</span>}
                        {log}
                      </div>
                    );
                  })}
                  <div ref={historyEndRef} />
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-t-8 border-gray-800">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">GAME OVER</h2>
            <p className="text-gray-600 mb-8">{player.age}歳で生涯を終えました。</p>

            <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg text-left mb-8">
              <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">最終リザルト</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between"><span>最終資金:</span> <span className="font-bold">{player.funds.toLocaleString()} 万円</span></li>
                <li className="flex justify-between"><span>獲得技術:</span> <span className="font-bold">{player.tech}</span></li>
                <li className="flex justify-between"><span>獲得人脈:</span> <span className="font-bold">{player.network}</span></li>
                <li className="flex justify-between"><span>持って生まれた地頭:</span> <span className="font-bold">{(player.intelligence).toFixed(2)}</span></li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlayer(createInitialState());
                setAllocation({ work: 50, rest: 10, study: 20, play: 20, jobHunt: 0 });
                setSelectedProjectId('');
              }}
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition"
            >
              次の人生（周回）へ
            </button>
          </div>
        )}

      </div>

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
              <h2 className="text-xl font-bold text-indigo-900 flex items-center">
                <Building className="w-6 h-6 mr-2" /> 不動産・カーディーラー
              </h2>
              <button onClick={() => setShowShop(false)} className="text-gray-500 hover:text-gray-800 font-bold text-xl px-2">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50">
              {/* Properties */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-2">物件（賃貸・購入）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROPERTIES.map(prop => {
                    const isOwned = player.property?.id === prop.id;
                    const canAffordCash = player.funds >= (prop.type === 'buy' ? prop.price : prop.initialCost);
                    return (
                      <div key={prop.id} className={`p-4 rounded-lg border bg-white shadow-sm ${isOwned ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`text-xs font-bold px-2 py-1 rounded mr-2 ${prop.type === 'buy' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                              {prop.type === 'buy' ? '購入' : '賃貸'}
                            </span>
                            <span className="font-bold">{prop.name}</span>
                          </div>
                          {isOwned && <CheckCircle className="w-5 h-5 text-indigo-500" />}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          {prop.type === 'buy' ? (
                            <span>販売価格: <span className="font-bold text-gray-900">{prop.price.toLocaleString()}</span> 万円</span>
                          ) : (
                            <div>
                              <div>家賃: <span className="font-bold text-gray-900">{prop.price}</span> 万円/月</div>
                              <div className="text-xs">初期費用: {prop.initialCost} 万円</div>
                            </div>
                          )}
                        </div>

                        {!isOwned && (
                          <div className="flex space-x-2">
                            <button
                              disabled={!canAffordCash}
                              onClick={() => {
                                const cost = prop.type === 'buy' ? prop.price : prop.initialCost;
                                setPlayer({...player, funds: player.funds - cost, property: prop});
                                setShowShop(false);
                              }}
                              className={`flex-1 py-2 text-xs font-bold rounded ${canAffordCash ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                              現金（{prop.type === 'buy' ? prop.price : prop.initialCost}万）
                            </button>

                            {prop.type === 'buy' && (
                                <div className="flex-1 flex flex-col">
                                    <div className="flex mb-1">
                                      <select value={loanYears} onChange={e => setLoanYears(Number(e.target.value))} className="text-xs border rounded-l p-1 flex-1">
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

                                          setPlayer({...player, property: prop, loans: [...player.loans, newLoan]});
                                          setShowShop(false);
                                        }}
                                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-r px-2"
                                      >
                                        ローン
                                      </button>
                                    </div>
                                    <div className="text-[10px] text-gray-500 text-center">金利優遇: {((currentCompany?.loanInterestRate || 0) * 100).toFixed(1)}%</div>
                                </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cars */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-2">ディーラー（車）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CARS.map(car => {
                    const isOwned = player.car?.id === car.id;
                    const canAffordCash = player.funds >= car.price;
                    return (
                      <div key={car.id} className={`p-4 rounded-lg border bg-white shadow-sm ${isOwned ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold flex items-center">
                            <CarIcon className="w-4 h-4 mr-1 text-gray-500"/> {car.name}
                          </div>
                          {isOwned && <CheckCircle className="w-5 h-5 text-indigo-500" />}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          販売価格: <span className="font-bold text-gray-900">{car.price.toLocaleString()}</span> 万円
                        </div>

                        {!isOwned && (
                          <div className="flex space-x-2">
                            <button
                              disabled={!canAffordCash}
                              onClick={() => {
                                setPlayer({...player, funds: player.funds - car.price, car: car});
                                setShowShop(false);
                              }}
                              className={`flex-1 py-2 text-xs font-bold rounded ${canAffordCash ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                              現金購入（{car.price}万）
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

                                    setPlayer({...player, car: car, loans: [...player.loans, newLoan]});
                                    setShowShop(false);
                                }}
                                className="flex-1 py-2 text-xs font-bold rounded bg-purple-600 hover:bg-purple-700 text-white"
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

    </div>
  );
}

export default App;
