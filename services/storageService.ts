
import { UserStats, Achievement, GameStats } from '../types';
import { ALL_ACHIEVEMENTS } from './achievementData';

export const STORAGE_KEYS = {
  FAVORITES: 'srfaz_favorites',
  GAME_STATS: 'srfaz_game_global_stats', // New key for aggregated stats
  KID_STATS_PREFIX: 'srfaz_stats_',   
  KID_ACCESSORY_PREFIX: 'srfaz_accessory_', 
};

// Global Favorites
export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveFavorites = (favorites: string[]) => {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
};

// --- GLOBAL GAME STATS (Aggregated) ---
export const getAllGameStats = (): Record<string, GameStats> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

export const saveAllGameStats = (stats: Record<string, GameStats>) => {
  localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
};

export const getSingleGameStats = (gameId: string): GameStats => {
  const all = getAllGameStats();
  return all[gameId] || { plays: 0, wins: 0, losses: 0, likes: 0, dislikes: 0 };
};

export const updateGameStats = (gameId: string, action: 'PLAY' | 'WIN' | 'LOSS' | 'LIKE' | 'DISLIKE'): Record<string, GameStats> => {
    const all = getAllGameStats();
    if (!all[gameId]) {
        all[gameId] = { plays: 0, wins: 0, losses: 0, likes: 0, dislikes: 0 };
    }

    if (action === 'PLAY') all[gameId].plays++;
    if (action === 'WIN') all[gameId].wins++;
    if (action === 'LOSS') all[gameId].losses++;
    
    // Toggle logic for likes/dislikes could be complex, but for simplicity here we just increment
    // In a real app, we'd track user vote state to prevent spamming, but here we just add.
    if (action === 'LIKE') all[gameId].likes++;
    if (action === 'DISLIKE') all[gameId].dislikes++;

    saveAllGameStats(all);
    return all;
};

// Kept for backward compatibility if needed, but mapped to new stats
export const getPlayCounts = (): Record<string, number> => {
    const all = getAllGameStats();
    const counts: Record<string, number> = {};
    Object.keys(all).forEach(k => counts[k] = all[k].plays);
    return counts;
};

// --- INDIVIDUAL KID STATS ---

export const getKidStats = (kidId: string): UserStats => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.KID_STATS_PREFIX}${kidId}`);
    if (stored) {
       const stats = JSON.parse(stored);
       if (!stats.recentGames) stats.recentGames = [];
       if (!stats.categoryPlays) stats.categoryPlays = {};
       if (!stats.unlockedAchievements) stats.unlockedAchievements = [];
       return stats;
    }
  } catch (e) {
    // ignore
  }
  
  return {
    totalPlays: 0,
    wins: 0,
    losses: 0,
    xp: 0,
    categoryPlays: {},
    unlockedAchievements: [],
    recentGames: []
  };
};

export const saveKidStats = (kidId: string, stats: UserStats) => {
  localStorage.setItem(`${STORAGE_KEYS.KID_STATS_PREFIX}${kidId}`, JSON.stringify(stats));
};

export const addRecentGame = (kidId: string, gameId: string) => {
    const stats = getKidStats(kidId);
    const filtered = stats.recentGames.filter(id => id !== gameId);
    filtered.unshift(gameId);
    stats.recentGames = filtered.slice(0, 10);
    saveKidStats(kidId, stats);
};

// Update BOTH individual stats AND global game stats
export const updateKidGameResult = (kidId: string, gameId: string, result: 'WIN' | 'LOSS' | 'PLAY', category?: string): UserStats => {
  const stats = getKidStats(kidId);
  
  // 1. Update Individual Stats
  if (result === 'PLAY') {
      stats.totalPlays += 1;
      stats.xp += 10; 
      if (category) {
        stats.categoryPlays[category] = (stats.categoryPlays[category] || 0) + 1;
      }
      updateGameStats(gameId, 'PLAY');
  } else if (result === 'WIN') {
      stats.wins += 1;
      stats.xp += 50; 
      updateGameStats(gameId, 'WIN');
  } else if (result === 'LOSS') {
      stats.losses += 1;
      stats.xp += 5; 
      updateGameStats(gameId, 'LOSS');
  }
  
  saveKidStats(kidId, stats);
  return stats;
};

export const checkAchievements = (kidId: string): Achievement[] => {
    const stats = getKidStats(kidId);
    const newUnlocked: Achievement[] = [];
    let updated = false;

    ALL_ACHIEVEMENTS.forEach(achievement => {
        if (!stats.unlockedAchievements.includes(achievement.id)) {
            if (achievement.condition(stats)) {
                stats.unlockedAchievements.push(achievement.id);
                newUnlocked.push(achievement);
                updated = true;
            }
        }
    });

    if (updated) {
        saveKidStats(kidId, stats);
    }

    return newUnlocked;
};

export const getKidAccessory = (kidId: string): string => {
    return localStorage.getItem(`${STORAGE_KEYS.KID_ACCESSORY_PREFIX}${kidId}`) || '';
};

export const saveKidAccessory = (kidId: string, accessory: string) => {
    localStorage.setItem(`${STORAGE_KEYS.KID_ACCESSORY_PREFIX}${kidId}`, accessory);
};
