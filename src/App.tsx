import { useState, useEffect, useRef } from 'react';
import type { PlayerState, Allocation, LivingStandards } from './game/types';
import {
  createInitialState,
  processTurn,
  AVAILABLE_PROJECTS,
  calculateHousingCost,
  calculateFoodCost,
  calculateEntertainmentCost,
  calculateTotalLivingCost
} from './game/engine';
import { AlertCircle, Heart, Brain, Zap, Briefcase, Activity, CheckCircle, ChevronRight, Home, Utensils, Gamepad2 } from 'lucide-react';

function App() {
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [allocation, setAllocation] = useState<Allocation>({ work: 50, rest: 10, study: 20, play: 20 });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlayer(createInitialState());
  }, []);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [player?.history]);

  if (!player) return <div className="p-8">Loading...</div>;

  const totalAllocation = allocation.work + allocation.rest + allocation.study + allocation.play;
  const isAllocationValid = totalAllocation === 100;

  // 案件の進行中か、あるいは新しく案件を選んだか
  const isProjectReady = player.currentProject !== null || selectedProjectId !== '';

  const handleSliderChange = (key: keyof Allocation, value: number) => {
    // サラリーマンなのでworkは最低50%
    if (key === 'work' && value < 50) return;
    setAllocation(prev => ({ ...prev, [key]: value }));
  };

  const handleLivingStandardChange = (category: keyof LivingStandards, level: number) => {
    setPlayer(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        livingStandards: {
          ...prev.livingStandards,
          [category]: level
        }
      };
    });
  };

  const handleNextTurn = () => {
    if (!isAllocationValid || !isProjectReady) return;

    let nextPlayer = { ...player };

    // 新しい案件を開始する場合
    if (!nextPlayer.currentProject && selectedProjectId) {
      const proj = AVAILABLE_PROJECTS.find(p => p.id === selectedProjectId);
      if (proj) {
        nextPlayer.currentProject = proj;
        nextPlayer.projectYearsLeft = proj.durationYears;
        nextPlayer.history = [...nextPlayer.history, `=== 新しい案件「${proj.name}」にアサインされた！ ===`];
      }
      setSelectedProjectId('');
    }

    setPlayer(processTurn(nextPlayer, allocation));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center border-t-4 border-blue-600">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ビジネス人生シミュレーション</h1>
            <p className="text-sm text-gray-500 mt-1">現在の職業: ITエンジニア</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-3xl font-bold">{player.age} 歳</div>
            {player.isAlive ? (
              <div className="text-sm text-green-600 flex items-center justify-end"><Activity className="w-4 h-4 mr-1" /> 生存中</div>
            ) : (
              <div className="text-sm text-red-600 flex items-center justify-end"><AlertCircle className="w-4 h-4 mr-1" /> 死亡</div>
            )}
          </div>
        </header>

        {player.isAlive ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Status & Living */}
            <div className="lg:col-span-1 space-y-6">

              {/* Parameters */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">パラメタ</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">資金</div>
                    <div className="text-2xl font-bold flex items-end text-blue-800">
                      {player.funds.toLocaleString()} <span className="text-sm font-normal ml-1">万円</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-2">コンディション</div>
                    <ul className="text-sm space-y-3">
                       <li className="flex items-center text-gray-700">
                         <Heart className={`w-4 h-4 mr-2 ${player.health < 30 ? 'text-red-500' : 'text-pink-500'}`} />
                         健康: {player.health} / 100
                       </li>
                       <li className="flex items-center text-gray-700">
                         <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                         技術力: {player.tech}
                       </li>
                       <li className="flex items-center text-gray-700">
                         <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
                         人脈: {player.network}
                       </li>
                       <li className="flex items-center text-gray-700">
                         <Brain className="w-4 h-4 mr-2 text-purple-500" />
                         地頭: {(player.intelligence).toFixed(2)}
                       </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Living Standards */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">生活水準の設定</h2>
                <p className="text-xs text-gray-500 mb-4">レベルを上げるとコストが増えますが、健康や人脈に良い影響を与えます。</p>

                <div className="space-y-4">
                  {/* Housing */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center text-sm font-medium text-gray-700"><Home className="w-4 h-4 mr-1"/> 住居</div>
                      <div className="text-xs text-gray-500">{Math.floor(calculateHousingCost(player.livingStandards.housing))} 万円/年</div>
                    </div>
                    <select
                      value={player.livingStandards.housing}
                      onChange={(e) => handleLivingStandardChange('housing', Number(e.target.value))}
                      className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value={1}>Lv.1 築古アパート (健康に悪影響)</option>
                      <option value={2}>Lv.2 普通のマンション</option>
                      <option value={3}>Lv.3 良いマンション (健康維持にプラス)</option>
                      <option value={4}>Lv.4 高級タワマン (健康維持に大きくプラス)</option>
                      <option value={5}>Lv.5 大豪邸 (最高環境)</option>
                    </select>
                  </div>

                  {/* Food */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center text-sm font-medium text-gray-700"><Utensils className="w-4 h-4 mr-1"/> 食費</div>
                      <div className="text-xs text-gray-500">{Math.floor(calculateFoodCost(player.livingStandards.food))} 万円/年</div>
                    </div>
                    <select
                      value={player.livingStandards.food}
                      onChange={(e) => handleLivingStandardChange('food', Number(e.target.value))}
                      className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value={1}>Lv.1 もやし生活 (健康ダメージ)</option>
                      <option value={2}>Lv.2 自炊メイン</option>
                      <option value={3}>Lv.3 外食多め</option>
                      <option value={4}>Lv.4 毎日デリバリー・高級店 (健康回復ボーナス)</option>
                      <option value={5}>Lv.5 お抱えシェフ (超健康)</option>
                    </select>
                  </div>

                  {/* Entertainment */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center text-sm font-medium text-gray-700"><Gamepad2 className="w-4 h-4 mr-1"/> 娯楽・交際費</div>
                      <div className="text-xs text-gray-500">{Math.floor(calculateEntertainmentCost(player.livingStandards.entertainment))} 万円/年</div>
                    </div>
                    <select
                      value={player.livingStandards.entertainment}
                      onChange={(e) => handleLivingStandardChange('entertainment', Number(e.target.value))}
                      className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value={1}>Lv.1 基本ひきこもり (人脈増えない)</option>
                      <option value={2}>Lv.2 たまに飲み会</option>
                      <option value={3}>Lv.3 趣味と交際に投資 (人脈ボーナス)</option>
                      <option value={4}>Lv.4 毎晩パーティー (人脈大ボーナス)</option>
                      <option value={5}>Lv.5 クルーザー所有レベル (VIPな人脈)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm font-bold text-red-600 flex justify-between">
                    <span>今年の予想固定費:</span>
                    <span>約 {Math.floor(calculateTotalLivingCost(player.livingStandards)).toLocaleString()} 万円</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle & Right Column: Actions & Logs */}
            <div className="lg:col-span-2 space-y-6">

              {/* Projects & Allocation */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">仕事と時間の割り振り</h2>

                {/* 案件セクション */}
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
                    { key: 'work', label: '仕事 (資金・技術)', color: 'bg-blue-500', thumb: 'accent-blue-500', min: 50, note: '※サラリーマンのため最低50%' },
                    { key: 'study', label: '勉強 (技術向上)', color: 'bg-purple-500', thumb: 'accent-purple-500', min: 0, note: '' },
                    { key: 'play', label: '遊ぶ (人脈/ストレス発散)', color: 'bg-green-500', thumb: 'accent-green-500', min: 0, note: '' },
                    { key: 'rest', label: '休養 (健康維持)', color: 'bg-yellow-500', thumb: 'accent-yellow-500', min: 0, note: '' },
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
                    if (log.includes('【案件完遂！】')) color = 'text-green-400 font-bold';

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
                setAllocation({ work: 50, rest: 10, study: 20, play: 20 });
                setSelectedProjectId('');
              }}
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition"
            >
              次の人生（周回）へ
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
