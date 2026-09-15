import { useState, useEffect, useRef } from 'react';
import type { PlayerState, Allocation } from './game/types';
import { createInitialState, processTurn, lowerLivingStandard, calculateLivingCost } from './game/engine';
import { AlertCircle, Heart, Brain, Zap, Briefcase, ChevronDown, Activity } from 'lucide-react';

function App() {
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [allocation, setAllocation] = useState<Allocation>({ work: 25, rest: 25, study: 25, play: 25 });

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlayer(createInitialState());
  }, []);

  useEffect(() => {
    // ログが更新されたら末尾にスクロール
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [player?.history]);

  if (!player) return <div className="p-8">Loading...</div>;

  const totalAllocation = allocation.work + allocation.rest + allocation.study + allocation.play;
  const isAllocationValid = totalAllocation === 100;

  const handleSliderChange = (key: keyof Allocation, value: number) => {
    setAllocation(prev => ({ ...prev, [key]: value }));
  };

  const handleNextTurn = () => {
    if (!isAllocationValid) return;
    setPlayer(processTurn(player, allocation));
  };

  const handleLowerStandard = () => {
    setPlayer(lowerLivingStandard(player));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column: Status & Living */}
            <div className="md:col-span-1 space-y-6">

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">パラメタ</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">資金</div>
                    <div className="text-2xl font-bold flex items-end">
                      {player.funds.toLocaleString()} <span className="text-sm font-normal ml-1">万円</span>
                    </div>
                  </div>

                  {/* マスクデータ(何が動いたかのみを表現) */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-2">コンディション推測</div>
                    <ul className="text-sm space-y-2">
                       <li className="flex items-center text-gray-600"><Heart className="w-4 h-4 mr-2" /> 体力・健康: {player.health < 30 ? "危険" : player.health < 60 ? "疲れ気味" : "良好"}</li>
                       <li className="flex items-center text-gray-600"><Zap className="w-4 h-4 mr-2" /> 技術力: {player.tech < 50 ? "駆け出し" : player.tech < 150 ? "一人前" : "達人"}</li>
                       <li className="flex items-center text-gray-600"><Briefcase className="w-4 h-4 mr-2" /> 人脈: {player.network < 30 ? "ぼっち" : player.network < 100 ? "普通" : "顔が広い"}</li>
                       <li className="flex items-center text-gray-600"><Brain className="w-4 h-4 mr-2" /> 地頭: {player.intelligence < 0.8 ? "少し鈍い" : player.intelligence > 1.2 ? "キレ者" : "普通"}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">生活水準</h2>
                <div className="mb-4">
                  <div className="text-sm text-gray-500">現在のレベル</div>
                  <div className="text-xl font-bold">Lv. {player.livingStandardLevel}</div>
                  <div className="text-sm text-red-500 mt-1">今年の予想固定費: 約 {Math.floor(calculateLivingCost(player.livingStandardLevel)).toLocaleString()} 万円</div>
                </div>

                {player.livingStandardLevel > 1 && (
                  <button
                    onClick={handleLowerStandard}
                    className="w-full py-2 px-4 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-sm flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 mr-1" /> 生活水準を意図的に下げる (ペナルティ有)
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-3">※収入が一定を超えると自動的に水準が上がります</p>
              </div>

            </div>

            {/* Right Column: Actions & Logs */}
            <div className="md:col-span-2 space-y-6">

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">1年の時間の割り振り</h2>
                <p className="text-sm text-gray-600 mb-6">合計が100%になるように配分してください。</p>

                <div className="space-y-6 mb-8">
                  {([
                    { key: 'work', label: '仕事 (資金稼ぎ)', color: 'bg-blue-500', thumb: 'accent-blue-500' },
                    { key: 'study', label: '勉強 (技術向上)', color: 'bg-purple-500', thumb: 'accent-purple-500' },
                    { key: 'play', label: '遊ぶ (人脈/ストレス発散)', color: 'bg-green-500', thumb: 'accent-green-500' },
                    { key: 'rest', label: '休養 (健康維持)', color: 'bg-yellow-500', thumb: 'accent-yellow-500' },
                  ] as const).map(item => (
                    <div key={item.key}>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700">{item.label}</label>
                        <span className="text-sm text-gray-500 font-mono">{allocation[item.key]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0" max="100"
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
                  disabled={!isAllocationValid}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
                    isAllocationValid
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  1年進める
                </button>
              </div>

              <div className="bg-gray-900 rounded-xl shadow-sm p-4 h-64 flex flex-col">
                <h2 className="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-2">人生の記録</h2>
                <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1">
                  {player.history.map((log, idx) => {
                    const isYearHeader = log.startsWith('---');
                    const isDeath = log.includes('【死亡】');
                    let color = 'text-gray-300';
                    if (isYearHeader) color = 'text-blue-400 mt-3 mb-1 font-bold';
                    if (isDeath) color = 'text-red-500 font-bold';
                    if (log.includes('資金が底を')) color = 'text-red-400';

                    return (
                      <div key={idx} className={`${color}`}>
                        {!isYearHeader && !isDeath && <span className="text-gray-600 mr-2">&gt;</span>}
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
                <li className="flex justify-between"><span>生活水準レベル:</span> <span className="font-bold">Lv. {player.livingStandardLevel}</span></li>
                <li className="flex justify-between"><span>獲得技術:</span> <span className="font-bold">{player.tech}</span></li>
                <li className="flex justify-between"><span>獲得人脈:</span> <span className="font-bold">{player.network}</span></li>
                <li className="flex justify-between"><span>持って生まれた地頭:</span> <span className="font-bold">{(player.intelligence).toFixed(2)}</span></li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlayer(createInitialState());
                setAllocation({ work: 25, rest: 25, study: 25, play: 25 });
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
