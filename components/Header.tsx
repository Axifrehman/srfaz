import React from 'react';
import { APP_NAME } from '../constants';
import { KidProfile } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onMagicSearch: () => void;
  activeKid: KidProfile | null;
  onExitKidMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onMagicSearch, 
  activeKid,
  onExitKidMode 
}) => {
  return (
    <header className={`sticky top-0 z-50 bg-space/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-500`}>
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo Area */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => {
           window.scrollTo({top: 0, behavior: 'smooth'});
        }}>
          {activeKid ? (
             <button onClick={onExitKidMode} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-bold text-white transition-all border border-white/10 hover:scale-105">
                <span>🚀 Exit Planet</span>
             </button>
          ) : (
            <div className="bg-gradient-to-tr from-primary to-secondary text-white p-2.5 rounded-2xl shadow-lg shadow-primary/30 transform group-hover:rotate-12 transition-all duration-300">
              <span className="text-2xl">🪐</span>
            </div>
          )}
          
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {activeKid ? (
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeKid.themeColor}`}>
                  {activeKid.name}'s Planet
                </span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
                  {APP_NAME}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-72 group">
            <input
              type="text"
              placeholder={activeKid ? "Search games..." : "Search the galaxy..."}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-white/10 bg-white/5 focus:bg-white/10 focus:border-accent focus:ring-2 focus:ring-accent/50 outline-none transition-all shadow-inner font-bold text-white placeholder-gray-400 backdrop-blur-sm"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl opacity-60 group-focus-within:opacity-100 transition-all">
              🛸
            </span>
          </div>
          
          <button 
            onClick={onMagicSearch}
            className="bg-gradient-to-r from-accent to-orange-500 text-black px-6 py-2 rounded-full font-black shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2 whitespace-nowrap border-b-4 border-orange-700 active:border-b-0"
          >
            <span className="text-xl animate-pulse">✨</span> 
            <span className="hidden sm:inline">Magic</span>
          </button>
        </div>
      </div>
    </header>
  );
};