
import React, { useState, useRef, useEffect } from 'react';
import { getLegalAdvice } from '../services/geminiService';
import type { Consultation } from '../types';
import { SendIcon, LoadingSpinner, LogoIcon, MicIcon } from './Icons';

interface ChatInterfaceProps {
  activeConsultation: Consultation | null;
  onNewConsultation: (consultation: Consultation) => void;
  onStartVoice: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeConsultation, onNewConsultation, onStartVoice }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConsultation, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    const userQuestion = question;
    setQuestion('');

    const answer = await getLegalAdvice(userQuestion);
    
    const newConsultation: Consultation = {
      id: crypto.randomUUID(),
      question: userQuestion,
      answer: answer,
      timestamp: Date.now(),
    };

    onNewConsultation(newConsultation);
    setIsLoading(false);
  };

  const formatAnswer = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-2 last:mb-0">{line || <br />}</p>
    ));
  };


  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div ref={scrollRef} className="flex-grow overflow-y-auto mb-4 pr-2">
        {activeConsultation ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold">أ</div>
              <div className="bg-slate-800 p-4 rounded-lg rounded-tr-none">
                <p className="font-semibold text-slate-200">{activeConsultation.question}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex-shrink-0 flex items-center justify-center">
                <LogoIcon />
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg rounded-tl-none prose prose-invert prose-p:text-slate-300 max-w-full">
                {formatAnswer(activeConsultation.answer)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <div className="p-6 bg-slate-800/30 rounded-full mb-6">
              <LogoIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-300">مرحباً بك في المحامي الجزائري</h2>
            <p className="mt-2 mb-8 max-w-sm">يمكنك الكتابة أو البدء في محادثة صوتية مباشرة للحصول على استشارتك القانونية.</p>
            
            <button 
              onClick={onStartVoice}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <MicIcon />
              بدء استشارة صوتية
            </button>
          </div>
        )}
        {isLoading && (
            <div className="flex items-start gap-4 mt-6">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex-shrink-0 flex items-center justify-center">
                    <LogoIcon />
                </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg rounded-tl-none flex items-center gap-2">
                    <LoadingSpinner />
                    <span className="text-slate-400">جاري مراجعة القوانين...</span>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 mt-auto flex gap-2">
        <div className="relative flex-grow">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder="اكتب سؤالك القانوني هنا..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pr-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-shadow"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 transition-colors"
          >
            {isLoading ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>
        <button 
          type="button"
          onClick={onStartVoice}
          className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-blue-400 hover:bg-slate-700 transition-colors"
          title="استشارة صوتية"
        >
          <MicIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
