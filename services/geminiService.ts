
import { GoogleGenAI } from "@google/genai";
import { Game, UserStats } from "../types";

// SAFELY initialize API Key to prevent white-screen crashes if env is missing
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const getGameRecommendation = async (
  query: string,
  availableGames: Game[]
): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key missing");
    return "No exact match"; // Fail gracefully
  }

  const gameNames = availableGames.map(g => g.name).slice(0, 500).join(", ");

  const prompt = `
    You are a helpful assistant for a kids' game portal. 
    A child asks: "${query}".
    Here is a list of available games: ${gameNames}.
    
    Based on the child's request, pick the single best matching game name from the list. 
    Return ONLY the exact game name. If nothing matches well, return "No exact match".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "No exact match";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't find a game right now.";
  }
};

export const getGameStrategy = async (game: Game, kidName?: string, stats?: UserStats): Promise<string> => {
  if (!apiKey) {
    return "AI Coach requires an API Key to activate. Just have fun!";
  }

  let context = "";
  if (kidName && stats) {
     const favCategory = Object.keys(stats.categoryPlays).reduce((a, b) => stats.categoryPlays[a] > stats.categoryPlays[b] ? a : b, '');
     
     context = `The player is ${kidName}. 
     Stats:
     - Total Games Played: ${stats.totalPlays}
     - Wins: ${stats.wins}
     - Losses: ${stats.losses}
     - Experience Level: ${stats.xp} XP.
     - Favorite Category: ${favCategory || 'None yet'}.
     `;
     
     if (game.category === favCategory) {
         context += ` This is their favorite category (${game.category})! Cheer them on as an expert.`;
     } else if (stats.categoryPlays[game.category || ''] === undefined || stats.categoryPlays[game.category || ''] < 3) {
         context += ` They are new to ${game.category} games. Give very simple, beginner-friendly advice.`;
     }

     if (stats.losses > stats.wins + 5) {
         context += " They have been losing a lot recently. Be super encouraging and focus on 'having fun' rather than winning.";
     } else if (stats.wins > 20) {
         context += " They are a PRO gamer. Challenge them to beat their own high score.";
     }
  }

  const prompt = `
    You are a "Gaming Coach" for kids (ages 5-12).
    The kid is about to play: "${game.name}".
    Description: "${game.description}".
    Category: "${game.category}".
    ${context}

    Provide a short, fun, and encouraging "Mission Briefing".
    Format the output exactly like this (use simple Markdown):
    
    **🎮 Controls:** (Guess standard controls based on game type, e.g., WASD or Arrows)
    **🚀 Pro Trick:** (One cool tip to win, customized to their skill level if known)
    **✨ Objective:** (What is the goal in 1 sentence)
    
    Keep it very short, energetic, and easy to read. Use emojis!
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Have fun and try your best!";
  } catch (error) {
    return "System ready. Good luck, commander!";
  }
};

export const getGameFunDescription = async (game: Game): Promise<{ summary: string; funFact: string }> => {
  const fallback = {
      summary: game.description,
      funFact: "Gaming helps improve hand-eye coordination!"
  };

  if (!apiKey) {
    return fallback;
  }

  const prompt = `
    Analyze this game for a 7-year-old gamer.
    Game Name: "${game.name}"
    Original Description: "${game.description}"
    Category: "${game.category}"

    Output a strict JSON object with exactly two keys:
    1. "summary": A super exciting, movie-trailer style summary (max 25 words). Use emojis.
    2. "funFact": An interesting, educational, or cool "Did You Know?" fact related to the game's theme (e.g. cars, space, logic).

    Example Output format:
    {"summary": "Race at light speed! 🏎️", "funFact": "The first cars didn't have steering wheels!"}
    
    Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text?.trim() || "";
    // Clean up if the model adds markdown despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini JSON Parse Error", error);
    return fallback;
  }
};
