
import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Consultation } from './types';
import Header from './components/Header';
import HistoryPanel from './components/HistoryPanel';
import ChatInterface from './components/ChatInterface';
import UpdatesPanel from './components/UpdatesPanel';
import { MenuIcon, XIcon } from './components/Icons';

type View = 'chat' | 'updates';

export default function App() {
  const [consultations, setConsultations] = useLocalStorage<Consultation[]>('consultations', []);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleNewConsultation = useCallback((consultation: Consultation) => {
    setConsultations(prev => [consultation, ...prev]);
    setActiveConsultation(consultation);
    setCurrentView('chat');
  }, [setConsultations]);

  const selectConsultation = useCallback((id: string) => {
    const selected = consultations.find(c => c.id === id) || null;
    setActiveConsultation(selected);
    setCurrentView('chat');
    setIsHistoryOpen(false); // Close panel on selection
  }, [consultations]);

  const startNewChat = useCallback(() => {
    setActiveConsultation(null);
    setCurrentView('chat');
    setIsHistoryOpen(false);
  }, []);

  const showUpdates = useCallback(() => {
    setCurrentView('updates');
    setIsHistoryOpen(false);
  }, []);
  
  const toggleHistoryPanel = useCallback(() => {
    setIsHistoryOpen(prev => !prev);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex flex-col antialiased">
      <Header onToggleHistory={toggleHistoryPanel} />
      <div className="flex-grow flex overflow-hidden">
        {/* Mobile History Panel */}
        <div 
          className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${isHistoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={toggleHistoryPanel}
        ></div>
        <div 
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-40 transform transition-transform duration-300 ease-in-out bg-slate-800 md:hidden ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button onClick={toggleHistoryPanel} className="absolute top-4 left-4 text-slate-400 hover:text-white">
            <XIcon />
          </button>
          <HistoryPanel
            consultations={consultations}
            activeConsultationId={activeConsultation?.id}
            onSelect={selectConsultation}
            onNewChat={startNewChat}
            onShowUpdates={showUpdates}
          />
        </div>
        
        {/* Desktop History Panel */}
        <div className="hidden md:flex md:w-80 lg:w-96 flex-shrink-0">
           <HistoryPanel
            consultations={consultations}
            activeConsultationId={activeConsultation?.id}
            onSelect={selectConsultation}
            onNewChat={startNewChat}
            onShowUpdates={showUpdates}
          />
        </div>

        <main className="flex-grow flex flex-col p-4 md:p-6 overflow-y-auto">
          {currentView === 'chat' && (
            <ChatInterface
              activeConsultation={activeConsultation}
              onNewConsultation={handleNewConsultation}
            />
          )}
          {currentView === 'updates' && <UpdatesPanel />}
        </main>
      </div>
    </div>
  );
}
