
import React from 'react';
import { LogoIcon, MenuIcon } from './Icons';

interface HeaderProps {
  onToggleHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between p-4 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <LogoIcon />
        <h1 className="text-xl font-bold text-white">المحامي الجزائري</h1>
      </div>
      <div className="md:hidden">
        <button
          onClick={onToggleHistory}
          className="text-slate-300 hover:text-white transition-colors"
          aria-label="فتح القائمة"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
