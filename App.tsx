
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { GameDetailsModal } from './components/GameDetailsModal';
import { MagicSearchModal } from './components/MagicSearchModal';
import { GameSection } from './components/GameSection';
import { DailyChallenge } from './components/DailyChallenge';
import { Leaderboard } from './components/Leaderboard';
import { AchievementsModal } from './components/AchievementsModal';
import { GAMES_DATA } from './services/gameData';
import { Game, KidProfile, SortOption, DifficultyLevel, GameStats } from './types';
import { getFavorites, saveFavorites, getPlayCounts, getKidStats, getAllGameStats, updateGameStats } from './services/storageService';

const App: React.FC = () => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interaction State
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState<Game | null>(null);
  const [activeKid, setActiveKid] = useState<KidProfile | null>(null);
  const [visibleCount, setVisibleCount] = useState(30); 
  const [isMagicModalOpen, setMagicModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [kidUnlockedAchievements, setKidUnlockedAchievements] = useState<string[]>([]);

  // New Features State
  const [favorites, setFavorites] = useState<string[]>([]);
  // Use GameStats record instead of simple number count
  const [allGameStats, setAllGameStats] = useState<Record<string, GameStats>>({});
  
  const [sortBy, setSortBy] = useState<SortOption>('POPULARITY');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'ALL'>('ALL');
  
  // Recent Games State
  const [recentGamesList, setRecentGamesList] = useState<Game[]>([]);

  // Load Initial Data
  useEffect(() => {
    // Start with all data, but filtering happens in the next effect based on activeKid
    setAllGames(GAMES_DATA);
    setFavorites(getFavorites());
    setAllGameStats(getAllGameStats()); // Load aggregated stats
  }, []);

  // MASTER FILTER LOGIC: Restricts games based on Premium status, Search, Sort, etc.
  useEffect(() => {
    let games = [...allGames];

    // 0. PREMIUM CHECK (The Logic requested)
    // If a kid is selected and is NOT premium, restrict to first 50 games.
    if (activeKid && !activeKid.isPremium) {
       games = games.slice(0, 50);
    }
    
    // 1. Filter by Search
    const lowerTerm = searchTerm.toLowerCase();
    if (lowerTerm) {
      games = games.filter(game => 
        game.name.toLowerCase().includes(lowerTerm) || 
        game.description.toLowerCase().includes(lowerTerm) ||
        (game.category && game.category.toLowerCase().includes(lowerTerm))
      );
    }

    // 2. Filter by Favorites
    if (showFavoritesOnly) {
      games = games.filter(game => favorites.includes(game.id));
    }

    // 3. Filter by Difficulty
    if (difficultyFilter !== 'ALL') {
      games = games.filter(game => game.difficulty === difficultyFilter);
    }

    // 4. Sorting
    games.sort((a, b) => {
      if (sortBy === 'NAME_ASC') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'NAME_DESC') {
        return b.name.localeCompare(a.name);
      } else {
        const statsA = allGameStats[a.id]?.plays || 0;
        const statsB = allGameStats[b.id]?.plays || 0;
        if (statsB !== statsA) return statsB - statsA;
        return 0;
      }
    });
    
    setFilteredGames(games);
    // Reset visible count when filters change to avoid empty spaces
    setVisibleCount(30); 
  }, [searchTerm, allGames, showFavoritesOnly, favorites, sortBy, allGameStats, difficultyFilter, activeKid]);

  // Load specific kid stats (Recent games & Achievements)
  useEffect(() => {
    if (activeKid) {
      const stats = getKidStats(activeKid.id);
      setKidUnlockedAchievements(stats.unlockedAchievements || []);
      
      const recentIds = stats.recentGames || [];
      const recent = recentIds.map(id => GAMES_DATA.find(g => g.id === id)).filter(g => g !== undefined) as Game[];
      setRecentGamesList(recent);
    } else {
      setRecentGamesList([]);
    }
  }, [activeKid, isPlaying]); 

  // Derived Categorized Lists for Sliders
  const { racingGames, actionGames, puzzleGames, otherGames } = useMemo(() => {
    return {
      racingGames: filteredGames.filter(g => g.category === 'Racing'),
      actionGames: filteredGames.filter(g => g.category === 'Action'),
      puzzleGames: filteredGames.filter(g => g.category === 'Puzzle'),
      otherGames: filteredGames.filter(g => !['Racing', 'Action', 'Puzzle'].includes(g.category || '')),
    };
  }, [filteredGames]);

  const getVariantForIndex = (index: number): 'small' | 'medium' | 'large' | 'wide' => {
      const patternIndex = index % 16; 
      if (patternIndex === 0) return 'large'; 
      if (patternIndex === 7) return 'wide'; 
      return 'small';
  };

  // Actions
  const handleToggleFavorite = (e: React.MouseEvent | null, gameId: string) => {
    if (e) e.stopPropagation();
    let newFavs;
    if (favorites.includes(gameId)) {
      newFavs = favorites.filter(id => id !== gameId);
    } else {
      newFavs = [...favorites, gameId];
    }
    setFavorites(newFavs);
    saveFavorites(newFavs);
  };

  const handleRateGame = (e: React.MouseEvent | null, gameId: string, action: 'LIKE' | 'DISLIKE') => {
      if (e) e.stopPropagation();
      const updated = updateGameStats(gameId, action);
      setAllGameStats(updated);
  };

  const handlePlayFromDetails = () => {
    if (selectedGameForDetails) {
      // Just visually open player, actual stats update happens inside GamePlayer mount
      setIsPlaying(selectedGameForDetails);
      setSelectedGameForDetails(null);
    }
  };

  const handleDailyChallengePlay = (game: Game) => {
     setIsPlaying(game);
  };

  const showMoreGames = () => {
    setVisibleCount(prev => prev + 30);
  };

  const currentVisibleDiscoveryGames = useMemo(() => {
    return otherGames.slice(0, visibleCount);
  }, [otherGames, visibleCount]);

  const handleMagicGameFound = (gameName: string) => {
    setSearchTerm(gameName);
    document.getElementById('discovery-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExitKidMode = () => {
    setActiveKid(null);
    setSearchTerm('');
    setShowFavoritesOnly(false);
    setDifficultyFilter('ALL');
  };

  const showSliders = !searchTerm && !showFavoritesOnly && difficultyFilter === 'ALL';

  // --- RENDER GAME PAGE (FULL VIEW) ---
  if (isPlaying) {
    return (
      <GamePlayer 
        game={isPlaying} 
        activeKid={activeKid}
        onClose={() => {
            setIsPlaying(null);
            setAllGameStats(getAllGameStats()); // Refresh stats after playing
        }} 
      />
    );
  }

  // --- RENDER HOME PAGE ---
  return (
    <div className={`min-h-screen pb-12`}>
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onMagicSearch={() => setMagicModalOpen(true)}
        activeKid={activeKid}
        onExitKidMode={handleExitKidMode}
      />
      
      <main>
        <Hero 
          activeKid={activeKid}
          onSelectKid={setActiveKid}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
        />

        {/* --- MAIN GAME VIEW (When Kid is Selected) --- */}
        <div 
          className={`transition-all duration-700 ${activeKid ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 h-0 overflow-hidden'}`}
        >
          {activeKid && (
            <div className="container mx-auto px-4">
              
              <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  {/* Left: Main Content (Filters, Daily Challenge, Games) */}
                  <div className="flex-1 min-w-0">
                      
                      {/* Filter Controls Row */}
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                          <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-gaming font-bold uppercase tracking-wider transition-all border ${
                                  showFavoritesOnly 
                                  ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                }`}
                            >
                              <span className={showFavoritesOnly ? "animate-pulse" : ""}>❤️</span> 
                              Favorites
                            </button>

                            {/* Difficulty Buttons */}
                            {['ALL', 'Easy', 'Medium', 'Hard'].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => setDifficultyFilter(level as DifficultyLevel | 'ALL')}
                                  className={`px-4 py-2 rounded-lg font-gaming font-bold uppercase tracking-wider transition-all border ${
                                    difficultyFilter === level 
                                    ? 'bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                  }`}
                                >
                                  {level === 'ALL' ? 'All Levels' : level}
                                </button>
                            ))}
                          </div>
                          
                          <div className="relative group">
                                <select 
                                  value={sortBy}
                                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                                  className="appearance-none bg-black/40 border border-white/10 text-white font-gaming uppercase tracking-wider py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary hover:bg-black/60 transition-colors cursor-pointer text-sm"
                                >
                                  <option value="POPULARITY">🔥 Popularity</option>
                                  <option value="NAME_ASC">Aa-Zz Name</option>
                                  <option value="NAME_DESC">Zz-Aa Name</option>
                                </select>
                          </div>
                      </div>

                      {/* Notification Banner for Guests */}
                      {!activeKid.isPremium && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3 animate-pulse mb-6">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h4 className="text-yellow-400 font-bold uppercase tracking-wider text-sm">Guest Mode Active</h4>
                                <p className="text-gray-400 text-xs">You are viewing a limited selection of games (50). Ask for a Premium Pass to unlock 10,000+ games!</p>
                            </div>
                        </div>
                      )}

                      {/* Recently Played Section */}
                      {recentGamesList.length > 0 && showSliders && (
                          <GameSection 
                            title="Recently Played" 
                            games={recentGamesList} 
                            onGameClick={setSelectedGameForDetails} 
                            favorites={favorites} 
                            onToggleFavorite={handleToggleFavorite}
                            stats={allGameStats}
                            activeKidTheme={activeKid.themeColor}
                          />
                      )}

                      {/* Daily Challenge - Only show if not filtering heavily */}
                      {showSliders && <DailyChallenge games={allGames} onPlay={handleDailyChallengePlay} />}

                      {/* SECTION 1: AUTO SLIDERS */}
                      {showSliders && (
                        <div className="space-y-2 mb-8">
                          <GameSection 
                            title="High Speed Racing" 
                            games={racingGames} 
                            onGameClick={setSelectedGameForDetails} 
                            favorites={favorites} 
                            onToggleFavorite={handleToggleFavorite}
                            stats={allGameStats}
                            activeKidTheme={activeKid.themeColor}
                          />
                          
                          <GameSection 
                            title="Action & Adventure" 
                            games={actionGames} 
                            onGameClick={setSelectedGameForDetails} 
                            favorites={favorites} 
                            onToggleFavorite={handleToggleFavorite}
                            stats={allGameStats}
                            activeKidTheme={activeKid.themeColor}
                          />

                          <GameSection 
                            title="Brainy Puzzles" 
                            games={puzzleGames} 
                            onGameClick={setSelectedGameForDetails} 
                            favorites={favorites} 
                            onToggleFavorite={handleToggleFavorite}
                            stats={allGameStats}
                            activeKidTheme={activeKid.themeColor}
                          />
                        </div>
                      )}

                      {/* SECTION 2: DISCOVERY GRID */}
                      <div id="discovery-grid">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                            <h2 className="text-xl md:text-2xl font-gaming font-bold text-white uppercase tracking-wider drop-shadow-md">
                                {searchTerm ? 'Search Results' : showFavoritesOnly ? 'Your Favorites' : 'All Games Collection'}
                            </h2>
                            {!activeKid.isPremium && <span className="bg-white/10 text-xs px-2 py-1 rounded">Limited View</span>}
                        </div>

                        {filteredGames.length > 0 ? (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-[200px] gap-4 grid-flow-dense">
                                {(searchTerm || showFavoritesOnly || difficultyFilter !== 'ALL' ? filteredGames : currentVisibleDiscoveryGames).map((game, index) => (
                                  <GameCard 
                                    key={game.id} 
                                    game={game} 
                                    onClick={() => setSelectedGameForDetails(game)}
                                    accentColor={`bg-gradient-to-r ${activeKid.themeColor}`}
                                    isFavorite={favorites.includes(game.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    stats={allGameStats[game.id]}
                                    onRateGame={handleRateGame}
                                    variant={searchTerm || showFavoritesOnly || difficultyFilter !== 'ALL' ? 'small' : getVariantForIndex(index)}
                                  />
                                ))}
                              </div>

                              {/* Load More */}
                              {!searchTerm && !showFavoritesOnly && difficultyFilter === 'ALL' && activeKid.isPremium && visibleCount < otherGames.length && (
                                <div className="mt-16 text-center">
                                  <button 
                                    onClick={showMoreGames}
                                    className={`bg-white/5 border border-white/10 text-white px-10 py-3 rounded-full font-gaming uppercase tracking-widest hover:bg-white/10 hover:border-accent transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:translate-y-0 text-sm group`}
                                  >
                                    Load More Data <span className="inline-block group-hover:animate-bounce ml-2">👇</span>
                                  </button>
                                </div>
                              )}
                              
                              {/* Guest Footer */}
                              {!activeKid.isPremium && (
                                  <div className="mt-12 text-center py-8 border-t border-white/5">
                                    <p className="text-gray-500 italic">~ End of Guest Preview ~</p>
                                  </div>
                              )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-dashed border-white/10">
                              <div className="text-6xl mb-4 animate-float">🛸</div>
                              <h3 className="text-xl font-gaming font-bold text-white">No games found in this sector.</h3>
                              <p className="text-gray-400 font-medium mt-2">
                                Try a different search or filter!
                              </p>
                            </div>
                        )}
                      </div>
                  </div>

                  {/* Right: Leaderboard (Desktop only sticky) */}
                  <div className="w-full lg:w-80 flex-shrink-0">
                     <div className="sticky top-24">
                        <Leaderboard />
                     </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-24 border-t border-white/5 py-8 text-center text-gray-500">
        <p className="font-gaming font-bold text-sm mb-2 tracking-[0.2em] uppercase text-accent/50">srfaz.fun © 2025</p>
        <p className="text-xs font-mono">Engineered for the Squad.</p>
      </footer>

      {/* Modals */}
      <GameDetailsModal 
        isOpen={!!selectedGameForDetails}
        game={selectedGameForDetails}
        onClose={() => setSelectedGameForDetails(null)}
        onPlay={handlePlayFromDetails}
        isFavorite={selectedGameForDetails ? favorites.includes(selectedGameForDetails.id) : false}
        onToggleFavorite={() => selectedGameForDetails && handleToggleFavorite(null, selectedGameForDetails.id)}
        stats={selectedGameForDetails ? allGameStats[selectedGameForDetails.id] : undefined}
        onRateGame={handleRateGame}
      />
      
      <MagicSearchModal 
        isOpen={isMagicModalOpen} 
        onClose={() => setMagicModalOpen(false)}
        games={activeKid?.isPremium ? allGames : allGames.slice(0, 50)} 
        onGameFound={handleMagicGameFound}
      />
      
      <AchievementsModal 
         isOpen={isAchievementsOpen}
         onClose={() => setIsAchievementsOpen(false)}
         unlockedIds={kidUnlockedAchievements}
         kidName={activeKid?.name || ''}
      />
    </div>
  );
};

export default App;
