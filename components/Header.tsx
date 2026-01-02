
import React from 'react';
import { ClipboardList, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ClipboardList className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">周报专业润色工具</h1>
            <p className="text-xs text-slate-500 font-medium">10年经验资深项目经理 AI 引擎</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <Sparkles className="w-4 h-4" />
          <span>提炼价值 · 深度对齐 · 结构化输出</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
