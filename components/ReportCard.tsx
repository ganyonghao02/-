
import React, { useState } from 'react';
import { Copy, Check, FileText, Download } from 'lucide-react';

interface ReportCardProps {
  content: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  if (!content) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <FileText className="w-4 h-4" />
          <span>报告预览</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制内容</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-8 prose prose-slate max-w-none">
        <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
