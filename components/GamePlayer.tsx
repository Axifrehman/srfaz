
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Game, KidProfile, UserStats, Achievement } from '../types';
import { getGameStrategy } from '../services/geminiService';
import { updateKidGameResult, getKidStats, getPlayCounts, addRecentGame, checkAchievements, getFavorites, saveFavorites, getAllGameStats, updateGameStats } from '../services/storageService';
import { GAMES_DATA } from '../services/gameData';
import { GameCard } from './GameCard';

interface GamePlayerProps {
  game: Game | null;
  activeKid: KidProfile | null;
  onClose: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ game, activeKid, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<string>('');
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // For Favorites
  const [userVote, setUserVote] = useState<'LIKE' | 'DISLIKE' | null>(null); // For Rating
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  
  // Game Control State
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Stats
  const [currentPlayCount, setCurrentPlayCount] = useState(0);

  useEffect(() => {
    if (game) {
      setLoading(true);
      setLoadingGuide(true);
      setGuide('');
      setUserVote(null);
      
      // Check if favorited
      const favs = getFavorites();
      setIsLiked(favs.includes(game.id));
      
      const counts = getPlayCounts();
      setCurrentPlayCount(counts[game.id] || 0);

      // Fetch stats first
      let currentStats: UserStats | undefined;
      if (activeKid) {
          currentStats = getKidStats(activeKid.id);
          // Auto-record a "Play" start & Record recent game
          updateKidGameResult(activeKid.id, game.id, 'PLAY', game.category);
          addRecentGame(activeKid.id, game.id);
      }

      // Fetch AI Strategy with stats context
      getGameStrategy(game, activeKid?.name, currentStats).then((strategy) => {
        setGuide(strategy);
        setLoadingGuide(false);
      });
    }
  }, [game, activeKid]);

  // Handle Fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const similarGames = useMemo(() => {
     if (!game) return [];
     // Increase recommendation count to 12
     return GAMES_DATA
        .filter(g => g.category === game.category && g.id !== game.id)
        .slice(0, 12); 
  }, [game]);

  const handleExitRequest = () => {
     // If fullscreen, exit it first
     if (document.fullscreenElement) {
         document.exitFullscreen().catch(() => {});
     }
     
     if (activeKid) {
         setShowReportModal(true);
     } else {
         onClose();
     }
  };

  const handleResult = (result: 'WIN' | 'LOSS' | 'SKIP') => {
      if (activeKid && result !== 'SKIP') {
          updateKidGameResult(activeKid.id, game!.id, result, game!.category);
          
          // Check for unlocked achievements
          const unlocked = checkAchievements(activeKid.id);
          if (unlocked.length > 0) {
              setNewAchievements(unlocked);
              // Delay closing to show achievement
              setTimeout(() => {
                  setShowReportModal(false);
                  onClose();
              }, 3000); 
              return;
          }
      }
      setShowReportModal(false);
      onClose();
  };
  
  const toggleFavorite = () => {
      const favs = getFavorites();
      let newFavs;
      if (isLiked) {
          newFavs = favs.filter(id => id !== game!.id);
      } else {
          newFavs = [...favs, game!.id];
      }
      saveFavorites(newFavs);
      setIsLiked(!isLiked);
  };

  const handleRate = (action: 'LIKE' | 'DISLIKE') => {
      if (!game) return;
      // Only allow voting once per session for simplicity in this demo
      if (userVote) return;
      
      updateGameStats(game.id, action);
      setUserVote(action);
  };

  const toggleFullscreen = () => {
      if (!gameContainerRef.current) return;

      if (!document.fullscreenElement) {
          gameContainerRef.current.requestFullscreen().catch(err => {
              console.error("Error enabling fullscreen:", err);
          });
      } else {
          document.exitFullscreen().catch(() => {});
      }
  };

  const handleReload = () => {
      setLoading(true);
      setRefreshKey(prev => prev + 1);
  };

  // Prevent clicks from passing through shields
  const blockClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
  };

  const handleReportGame = () => {
      alert("Thanks Agent! We've flagged this game for repairs. 🛠️");
  };

  // Need global stats for similar cards
  const allGameStats = getAllGameStats();

  if (!game) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#050b14] overflow-y-auto animate-fade-in scrollbar-hide">
      <div className="min-h-screen flex flex-col">
        
        {/* Navigation Bar */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <button 
                  onClick={handleExitRequest}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-gaming font-bold uppercase tracking-wider hidden sm:block">Exit</span>
                </button>
                
                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                
                <h1 className="text-xl font-black text-white tracking-tight truncate max-w-[150px] sm:max-w-md">
                  {game.name}
                </h1>
             </div>

             <div className="flex items-center gap-3">
               <button 
                 onClick={handleReload}
                 className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5"
                 title="Reload Game"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
               </button>

               <button 
                 onClick={toggleFullscreen}
                 className="p-2 bg-accent/10 hover:bg-accent/20 rounded-lg text-accent transition-colors border border-accent/20"
                 title="Fullscreen Mode"
               >
                 {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                    </svg>
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                 )}
               </button>

               <div className="hidden sm:block h-6 w-[1px] bg-white/10 mx-1"></div>

               <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                 LIVE
               </span>
             </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Game Window & Details */}
          <div className="lg:col-span-3 flex flex-col gap-6">
             
             {/* THE GAME BOX */}
             <div 
                ref={gameContainerRef}
                className={`relative w-full bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-[#1e293b] ring-1 ring-white/10 group ${isFullscreen ? 'h-screen w-screen border-0 rounded-none z-[9999]' : 'aspect-video'}`}
             >
                {/* Loader */}
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050b14] z-10">
                    <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4"></div>
                    <div className="text-accent font-gaming tracking-[0.2em] animate-pulse">INITIALIZING...</div>
                  </div>
                )}

                {/* Shield */}
                <div 
                  className="absolute top-0 right-0 w-[220px] h-[100px] z-50 cursor-default bg-transparent"
                  onClick={blockClick}
                  title="Protected Zone"
                />

                {/* Iframe */}
                <iframe 
                  key={refreshKey}
                  src={game.url} 
                  className="w-full h-full border-0"
                  allowFullScreen
                  onLoad={() => setLoading(false)}
                  title="Game Area"
                  allow="autoplay; fullscreen; gamepad; accelerator; gyroscope; clipboard-write"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
                  style={{ backgroundColor: 'black' }}
                />
             </div>
             
             {/* Mission Control Bar */}
             <div className="bg-[#1e1b4b]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-3xl font-gaming font-black text-white mb-2 tracking-wide">{game.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            {game.tags?.map(tag => (
                                <span key={tag} className="bg-white/5 hover:bg-white/10 transition-colors px-3 py-1 rounded-full text-xs font-bold text-indigo-300 border border-white/10 uppercase tracking-wide">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        {/* LIKE / DISLIKE BUTTONS */}
                        <div className="flex items-center bg-black/40 rounded-xl border border-white/10 p-1">
                             <button 
                                onClick={() => handleRate('LIKE')}
                                className={`p-2.5 rounded-lg transition-all ${userVote === 'LIKE' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-green-400 hover:bg-white/5'}`}
                                disabled={!!userVote}
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={userVote === 'LIKE' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                             </button>
                             <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                             <button 
                                onClick={() => handleRate('DISLIKE')}
                                className={`p-2.5 rounded-lg transition-all ${userVote === 'DISLIKE' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-400 hover:bg-white/5'}`}
                                disabled={!!userVote}
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={userVote === 'DISLIKE' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                             </button>
                        </div>

                        <button 
                            onClick={toggleFavorite}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border border-white/10 ${isLiked ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] border-pink-400' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                        >
                            <span className={`text-xl ${isLiked ? "animate-bounce" : "grayscale"}`}>❤️</span> 
                            <span>{isLiked ? 'Saved' : 'Save'}</span>
                        </button>
                        
                        <button 
                           onClick={handleReportGame}
                           className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-300 font-bold transition-all border border-red-500/10 hover:border-red-500/30"
                        >
                            <span className="text-xl">🚩</span>
                            <span className="hidden sm:inline">Report</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:bg-black/40 transition-colors group">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Total Plays</div>
                        <div className="text-2xl font-gaming font-bold text-white group-hover:text-accent transition-colors">{currentPlayCount.toLocaleString()}</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:bg-black/40 transition-colors group">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Rating</div>
                        <div className="text-2xl font-gaming font-bold text-yellow-400 flex items-center gap-1">
                            {game.rating} <span className="text-xs text-yellow-400/50 relative top-[1px]">★</span>
                        </div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:bg-black/40 transition-colors group">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Difficulty</div>
                        <div className={`text-2xl font-gaming font-bold ${game.difficulty === 'Hard' ? 'text-red-400' : game.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                            {game.difficulty || 'Normal'}
                        </div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center hover:bg-black/40 transition-colors group">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Category</div>
                        <div className="text-2xl font-gaming font-bold text-blue-400">{game.category}</div>
                    </div>
                </div>

                {/* You May Also Like Section (Visible always at bottom of container) */}
                {similarGames.length > 0 && (
                     <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-2xl font-gaming font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">⚡</span>
                            You May Also Like
                        </h3>
                        {/* Improved Grid for up to 12 games */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            {similarGames.map(g => (
                                <GameCard 
                                    key={g.id} 
                                    game={g} 
                                    onClick={() => {
                                        setLoading(true);
                                        onClose(); 
                                    }}
                                    isFavorite={getFavorites().includes(g.id)} 
                                    onToggleFavorite={() => {}} 
                                    stats={allGameStats[g.id]}
                                    variant="small"
                                />
                            ))}
                        </div>
                     </div>
                 )}
             </div>
          </div>

          {/* Right Column: AI Companion */}
          <div className="lg:col-span-1">
             <div className="bg-[#0f172a] rounded-2xl border border-accent/20 h-full max-h-[calc(100vh-140px)] flex flex-col shadow-[0_0_30px_rgba(0,229,255,0.05)] relative overflow-hidden sticky top-24">
                
                <div className="p-4 bg-gradient-to-r from-accent/10 to-transparent border-b border-accent/10 flex items-center gap-2">
                   <div className="text-2xl animate-pulse">🤖</div>
                   <div>
                      <h2 className="font-gaming font-bold text-white leading-none">AI COACH</h2>
                      <p className="text-[10px] text-accent font-mono uppercase tracking-widest">Strategy Uplink Active</p>
                   </div>
                </div>

                <div className="p-5 overflow-y-auto flex-1 font-mono text-sm leading-relaxed space-y-4 scrollbar-hide">
                   {loadingGuide ? (
                     <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                        <div className="h-20 bg-white/5 rounded w-full mt-4"></div>
                        <p className="text-xs text-center text-gray-500 mt-4">Analyzing player stats & game mechanics...</p>
                     </div>
                   ) : (
                     <div className="prose prose-invert prose-sm max-w-none">
                        {guide.split('\n').map((line, idx) => {
                           if (line.includes('Controls:')) {
                              return (
                                <div key={idx} className="bg-white/5 p-3 rounded-lg border-l-2 border-green-400 mb-2">
                                   <strong className="text-green-400 block mb-1 uppercase text-xs tracking-wider">🎮 Controls</strong>
                                   <span className="text-gray-300 block mt-1">{line.replace('**🎮 Controls:**', '').replace('Controls:', '')}</span>
                                </div>
                              );
                           }
                           return <p key={idx} className="text-gray-400">{line}</p>;
                        })}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mission Report / Achievement Modal */}
      {(showReportModal || newAchievements.length > 0) && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
              {newAchievements.length > 0 ? (
                  <div className="bg-gradient-to-b from-yellow-900 to-black border border-yellow-400 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_100px_rgba(234,179,8,0.5)]">
                      <div className="text-7xl mb-6 animate-bounce">
                          {newAchievements[0].icon}
                      </div>
                      <h2 className="text-yellow-400 font-black uppercase tracking-wider text-sm mb-2">Achievement Unlocked</h2>
                      <h3 className="text-3xl font-black text-white mb-2">{newAchievements[0].name}</h3>
                      <p className="text-gray-300 mb-4">{newAchievements[0].description}</p>
                      <div className="text-xs text-yellow-500/60 font-mono">Redirecting to base...</div>
                  </div>
              ) : (
                  <div className="bg-[#1e1b4b] border border-white/20 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(99,102,241,0.4)]">
                      <div className="text-6xl mb-4 animate-bounce">📝</div>
                      <h2 className="text-3xl font-black text-white uppercase mb-2">Mission Report</h2>
                      <p className="text-indigo-200 mb-8">How did the game go, {activeKid?.name}?</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <button 
                            onClick={() => handleResult('WIN')}
                            className="bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-xl shadow-lg hover:scale-105 transition-transform"
                          >
                              VICTORY 🏆
                          </button>
                          <button 
                            onClick={() => handleResult('LOSS')}
                            className="bg-red-500 hover:bg-red-400 text-white font-black py-4 rounded-xl text-xl shadow-lg hover:scale-105 transition-transform"
                          >
                              DEFEAT 💀
                          </button>
                      </div>
                      <button 
                        onClick={() => handleResult('SKIP')}
                        className="text-gray-400 text-sm hover:text-white underline"
                      >
                          Skip Reporting
                      </button>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};
