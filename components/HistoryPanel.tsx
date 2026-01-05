
import React from 'react';
import type { Consultation } from '../types';
import { PlusIcon, UpdateIcon } from './Icons';

interface HistoryPanelProps {
  consultations: Consultation[];
  activeConsultationId?: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onShowUpdates: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  consultations,
  activeConsultationId,
  onSelect,
  onNewChat,
  onShowUpdates
}) => {
  return (
    <div className="bg-slate-800 h-full flex flex-col border-l border-slate-700/50">
      <div className="p-4 flex-shrink-0 space-y-3 border-b border-slate-700/50">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            <PlusIcon />
            استشارة جديدة
          </button>
          <button
            onClick={onShowUpdates}
            className="w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            <UpdateIcon />
            آخر التعديلات القانونية
          </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-2">
        <h2 className="text-sm font-semibold text-slate-400 px-2 pb-2">سجل الاستشارات</h2>
        <nav className="flex flex-col gap-1">
          {consultations.map(consultation => (
            <a
              key={consultation.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelect(consultation.id);
              }}
              className={`block p-3 rounded-md transition-colors text-right truncate ${
                activeConsultationId === consultation.id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'hover:bg-slate-700/50 text-slate-300'
              }`}
            >
              <p className="font-medium text-sm">{consultation.question}</p>
              <time className="text-xs text-slate-500">
                {new Date(consultation.timestamp).toLocaleString('ar-DZ')}
              </time>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default HistoryPanel;
