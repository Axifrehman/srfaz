
import React, { useState, useEffect } from 'react';
import { KIDS_PROFILES } from '../constants';
import { KidProfile } from '../types';
import { saveKidAccessory, getKidAccessory, getKidStats } from '../services/storageService';

interface HeroProps {
  onSelectKid: (kid: KidProfile) => void;
  activeKid: KidProfile | null;
  onOpenAchievements: () => void;
}

const ACCESSORIES = ['👑', '🧢', '🕶️', '🎧', '🦄', '🎭', '🤠', '🎩', ''];

export const Hero: React.FC<HeroProps> = ({ onSelectKid, activeKid, onOpenAchievements }) => {
  const [selectedForAuth, setSelectedForAuth] = useState<KidProfile | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState('');
  const [xp, setXp] = useState(0);

  // Load accessory & stats when active kid changes
  useEffect(() => {
    if (activeKid) {
      setCurrentAccessory(getKidAccessory(activeKid.id));
      const stats = getKidStats(activeKid.id);
      setXp(stats.xp);
    }
  }, [activeKid]);

  const handleProfileClick = (kid: KidProfile) => {
    if (kid.isPremium) {
      setSelectedForAuth(kid);
      setPasswordInput('');
      setError(false);
    } else {
      onSelectKid(kid);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedForAuth && passwordInput === selectedForAuth.password) {
      onSelectKid(selectedForAuth);
      setSelectedForAuth(null);
    } else {
      setError(true);
      const input = document.getElementById('pin-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
    }
  };

  const cycleAccessory = () => {
     if (!activeKid) return;
     const currentIndex = ACCESSORIES.indexOf(currentAccessory);
     const nextIndex = (currentIndex + 1) % ACCESSORIES.length;
     const nextAccessory = ACCESSORIES[nextIndex];
     setCurrentAccessory(nextAccessory);
     saveKidAccessory(activeKid.id, nextAccessory);
  };

  if (activeKid) {
    // Personalized Hero for the Active Kid
    return (
      <section className="relative overflow-hidden mb-8 py-10 md:py-16 mx-4 rounded-[3rem] border border-white/10 shadow-2xl transition-all duration-500">
        {/* Dynamic Background based on kid's theme */}
        <div className={`absolute inset-0 bg-gradient-to-br ${activeKid.themeColor} opacity-20`}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Area with Customization */}
          <div className="relative group cursor-pointer" onClick={cycleAccessory}>
            <div className={`absolute inset-0 bg-gradient-to-r ${activeKid.themeColor} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-[#0f172a] rounded-full border-4 border-white/20 flex items-center justify-center text-7xl md:text-8xl shadow-xl transform group-hover:scale-105 transition-transform duration-300">
              {/* Main Icon */}
              <span className="relative z-10">{activeKid.icon}</span>
              
              {/* Accessory Overlay */}
              {currentAccessory && (
                  <span className="absolute -top-4 -right-2 text-5xl z-20 animate-bounce">{currentAccessory}</span>
              )}
            </div>
            
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black/80 px-2 py-1 rounded text-white whitespace-nowrap">
                Click to Style 🧢
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-md text-white/80">
              {activeKid.isPremium ? '💎 Premium Access Granted' : 'Guest Access Only'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-2">
              {activeKid.name}
            </h1>
            <p className="text-xl text-indigo-100/80 font-medium max-w-lg">
              {activeKid.isPremium 
                ? "Welcome back, Commander! All systems operational. 10,000+ games unlocked." 
                : "Welcome, Agent. You have limited access to the training grounds."}
            </p>
          </div>

          {/* Stats / Action */}
          <div className="flex flex-col gap-3 ml-auto bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 min-w-[200px]">
             <div className="flex items-center gap-3">
               <span className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-xl">⚡</span>
               <div>
                 <div className="text-xs text-gray-400 uppercase font-bold">XP Level</div>
                 <div className="text-white font-black text-xl">{xp} XP</div>
               </div>
             </div>
             
             <button 
               onClick={onOpenAchievements}
               className="mt-2 w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
             >
                <span>🏆</span> View Achievements
             </button>
          </div>
        </div>
      </section>
    ); 
  }

  // Default "Select Pilot" View (Same as before)
  return (
    <>
      <section className="relative overflow-hidden mb-12 py-12 md:py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] tracking-tight">
              <span className="inline-block animate-float">Select</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 inline-block animate-float" style={{animationDelay: '0.2s'}}>Pilot</span>
            </h1>
            <p className="text-blue-200 text-xl font-bold tracking-widest uppercase">
              To Enter The Gaming Universe
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {KIDS_PROFILES.map((kid) => (
              <button 
                key={kid.id} 
                onClick={() => handleProfileClick(kid)}
                className="group relative flex flex-col items-center focus:outline-none transition-all duration-500"
              >
                {/* Premium Glow */}
                {kid.isPremium && (
                    <div className="absolute -top-6 text-2xl animate-bounce z-20">👑</div>
                )}
                
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full blur-xl transition-all duration-300 transform scale-150"></div>
                <div 
                  className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${kid.themeColor} shadow-[0_0_0_4px_rgba(255,255,255,0.1),inset_-10px_-10px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.6),inset_-5px_-5px_10px_rgba(0,0,0,0.3)] transform transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-110 flex items-center justify-center overflow-hidden`}
                >
                  <div className="absolute top-2 left-3 w-6 h-3 bg-white/20 rounded-full blur-[1px] transform -rotate-12"></div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/10 rounded-full blur-[2px]"></div>
                  <span className="text-5xl md:text-6xl drop-shadow-md z-10 transform group-hover:rotate-12 transition-transform duration-300">
                      {kid.icon}
                  </span>
                </div>
                <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                  <span className="text-lg font-black uppercase tracking-wider whitespace-nowrap">
                      {kid.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Security Check Modal */}
      {selectedForAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="bg-[#0f172a] w-full max-w-md rounded-3xl p-8 border-2 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden text-center">
              
              {/* Scanner Line Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_20px_#ef4444] animate-[scan_2s_ease-in-out_infinite]"></div>

              <div className="relative z-10">
                 <div className="text-6xl mb-4">🔒</div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Security Check</h3>
                 <p className="text-red-300/80 mb-6 font-mono text-sm">Restricted Access: {selectedForAuth.name}'s Portal<br/>Please enter your Secret PIN.</p>
                 
                 <form onSubmit={handleAuthSubmit}>
                    <input 
                      id="pin-input"
                      type="password" 
                      inputMode="numeric"
                      maxLength={4}
                      value={passwordInput}
                      onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setError(false);
                      }}
                      className={`w-full bg-black/50 border-2 ${error ? 'border-red-500 text-red-500' : 'border-white/20 text-white focus:border-accent'} rounded-xl px-4 py-4 text-center text-3xl font-mono tracking-[1em] focus:outline-none transition-all mb-6`}
                      placeholder="••••"
                      autoFocus
                    />
                    
                    {error && <p className="text-red-500 font-bold mb-4 text-sm animate-pulse">⚠️ ACCESS DENIED - TRY 123</p>}

                    <div className="flex gap-3">
                       <button 
                          type="button"
                          onClick={() => setSelectedForAuth(null)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors"
                       >
                         Abort
                       </button>
                       <button 
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                       >
                         Unlock
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
