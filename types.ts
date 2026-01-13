
export interface Game {
  id: string;
  name: string;
  url: string;
  image: string;
  description: string;
  category?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
  rating?: number; // 0-5 stars
  likes?: number;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalPlays: number;
  wins: number;
  losses: number;
  xp: number; // Experience points
  categoryPlays: Record<string, number>;
  unlockedAchievements: string[];
  recentGames: string[]; // Array of Game IDs
}

// Global stats for a specific game (aggregated from all users)
export interface GameStats {
  plays: number;
  wins: number;
  losses: number;
  likes: number;
  dislikes: number;
}

export interface KidProfile {
  id: string;
  name: string;
  avatarColor: string; // Tailwind class fallback
  themeColor: string; // CSS Gradient classes
  icon: string;
  isPremium: boolean; // Determines if they see all games
  password?: string; // Optional password for premium accounts
  customBackground?: string; // URL or Base64
  accessory?: string; // Emoji accessory (Hat, Glasses, etc.)
}

export type SortOption = 'POPULARITY' | 'NAME_ASC' | 'NAME_DESC';
