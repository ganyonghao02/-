
import React, { useState, useCallback } from 'react';
import { Send, Trash2, History, Info, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import Header from './components/Header';
import ReportCard from './components/ReportCard';
import { generateProfessionalReport } from './services/geminiService';
import { WeeklyReportState, ReportHistoryItem } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<WeeklyReportState>({
    inputText: '',
    resultMarkdown: '',
    isLoading: false,
    error: null,
  });

  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!state.inputText.trim()) {
      setState(prev => ({ ...prev, error: '请先输入您的工作内容' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await generateProfessionalReport(state.inputText);
      setState(prev => ({
        ...prev,
        resultMarkdown: result,
        isLoading: false,
      }));

      // Add to history if valid report
      if (result.includes('本周工作汇报')) {
        const newItem: ReportHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          input: state.inputText,
          output: result,
        };
        setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || '服务异常，请稍后重试',
      }));
    }
  }, [state.inputText]);

  const clearInput = () => {
    setState({
      inputText: '',
      resultMarkdown: '',
      isLoading: false,
      error: null,
    });
  };

  const loadFromHistory = (item: ReportHistoryItem) => {
    setState({
      inputText: item.input,
      resultMarkdown: item.output,
      isLoading: false,
      error: null,
    });
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                工作记录
              </h2>
              <button 
                onClick={clearInput}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="清空输入"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <textarea
              value={state.inputText}
              onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value, error: null }))}
              placeholder="请输入零散、口语化的工作记录...&#10;例如：&#10;- 修了3个支付bug&#10;- 跟运营对接了双11活动需求&#10;- 招了个新后端"
              className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400 font-medium"
            />

            {state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={state.isLoading || !state.inputText.trim()}
              className={`mt-6 w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md ${
                state.isLoading || !state.inputText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI 正在深度对齐中...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>生成专业周报</span>
                </>
              )}
            </button>
          </section>

          <section className="bg-slate-100 p-4 rounded-xl border border-dashed border-slate-300">
            <h3 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
              <History className="w-4 h-4" />
              最近历史
            </h3>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 italic">暂无历史记录</p>
              ) : (
                history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-2 bg-white rounded border border-slate-200 hover:border-blue-300 transition-colors group"
                  >
                    <p className="text-xs text-slate-700 truncate font-medium group-hover:text-blue-600">
                      {item.input}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-7">
          {state.resultMarkdown ? (
            <ReportCard content={state.resultMarkdown} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                <Sparkles className="w-12 h-12 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">准备好升级您的周报了吗？</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                在左侧输入您的工作碎片，我们将以资深项目经理的视角，为您转化为体现核心价值的专业化周报输出。
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
        <p>© 2024 Weekly Professionalizer · 效率至上 · 价值驱动</p>
      </footer>
    </div>
  );
};

export default App;
