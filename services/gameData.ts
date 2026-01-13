import { Game, DifficultyLevel } from '../types';

// INSTRUCTIONS FOR USER:
// To add your 10,000+ games, simply paste the full content of your text file 
// into the backticks of the rawData variable below.
// The parser handles the specific format: Name \t Link \t Image \t Description

const RAW_DATA_SNIPPET = `Kart Racing Game 3D	https://m.igroutka.ru/games/igry-dlya-malchikov/go_kart_racing/	https://igroutka.ru/uploads/posts/2016-11/thumbs/1480416924_igra-gonki-na-kartingah-3d.jpg	Not every game in the Racing category has such high-quality
Game Dim: Endless Runner	https://igroutka.ru/loader/game/42670/	https://igroutka.ru/uploads/posts/2022-01/thumbs/Dimness-thedarkworldEndlessRunnerGame_164250151661e6958c87e0e8.83099610.jpg	A terrible, gloomy and completely incomprehensible story
Game Guess the Game Based on the Screenshot	https://igroutka.ru/loader/game/39507/	https://igroutka.ru/uploads/posts/2021-08/thumbs/Guessgamefromscreenshot_1628669138611384d21bf964.75227132.jpg	Do you consider yourself a real connoisseur
Bottle Cap Challenge Game	https://igroutka.ru/loader/game/31940/	https://igroutka.ru/uploads/posts/2020-06/thumbs/1591368661_bottlecapchallenge.jpeg	Despite the fact that the Bottle Cap Challenge game is simple
Game Creeper Vs Enderman From Minecraft	https://igroutka.ru/loader/game/38576/	https://igroutka.ru/uploads/posts/2021-06/thumbs/CreepervsEndermanfromminecraft_162505868960dc6d81cc1555.31706416.jpg	An evil Creeper has entered the cubic world
Game Doodle Time	https://igroutka.ru/loader/game/38591/	https://igroutka.ru/uploads/posts/2021-06/thumbs/ScribbleTime_162507401560dca95f54ce10.38920283.jpg	An exciting adventure in the world of doodles
Game Save Me Now	https://igroutka.ru/loader/game/35762/	https://igroutka.ru/uploads/posts/2021-02/thumbs/1614538403_save-me-now.jpg	For several years now, a special police unit has been proving
Game Knife IO	https://igroutka.ru/loader/game/56538/	https://igroutka.ru/uploads/posts/2025-10/thumbs/Knifeio_175983719468e4fc0ac864b5.54326202.jpg	A multiplayer io game in the style of a battle royale
Game Park Your Car	https://igroutka.ru/loader/game/18947/	https://igroutka.ru/uploads/posts/2018-01/thumbs/1516959695_igra-priparkuy-avto.jpg	There is another opportunity to test yourself as a parking attendant
Game Tank Arena 2D	https://igroutka.ru/loader/game/56514/	https://igroutka.ru/uploads/posts/2025-11/thumbs/TankArena2D_17628413366912d2f834bfc9.28589311.jpg	A cool tank war game in the style of “Worms”
Game Driver Simulator ZIL USSR	https://igroutka.ru/loader/game/52609/	https://igroutka.ru/uploads/posts/2024-10/thumbs/ZILUSSRdriversimulator_17291799526711313070dcb4.90725140.jpg	This car is recognizable even now - in our time
Game Open Tennis Championship 2021	https://igroutka.ru/loader/game/40721/	https://igroutka.ru/uploads/posts/2021-10/thumbs/TennisOpen2021_16330842466156e3569f6dc0.52783593.jpeg	Professional tennis players take part in the Open Tennis Championship
Game Traffic Puzzle	https://igroutka.ru/loader/game/54192/	https://igroutka.ru/uploads/posts/2025-02/thumbs/TrafficTapPuzzle_174066486067c0701cc19298.68699790.jpg	An exciting logic game in which tricky car puzzles await you
Snow Field Driving Game	https://igroutka.ru/loader/game/41925/	https://igroutka.ru/uploads/posts/2021-12/thumbs/SnowfieldDriving_163853677861aa164a384929.87294503.jpg	With the onset of winter, everything around is covered with snow
Game Two Archers: Duel with Bows	https://igroutka.ru/loader/game/55363/	https://igroutka.ru/uploads/posts/2025-05/thumbs/TwoArchersBowDuel_17480856386831ab86e39258.99614615.jpg	Very soon one of the most dangerous archer duels will take place
Super Archer Game	https://igroutka.ru/loader/game/30334/	https://igroutka.ru/uploads/posts/2020-01/thumbs/1580289703_super-archer.jpg	Super Archer is a great toy for fans of Mario-style games
Game Pickaxe Crafter	https://igroutka.ru/loader/game/51822/	https://igroutka.ru/uploads/posts/2024-07/thumbs/PickCrafter_17198468796682c7df91b977.28709472.jpg	Having been in the world of Minecraft, you understand that the main tool
Merge Plants Vs Zombies Game	https://igroutka.ru/loader/game/52612/	https://igroutka.ru/uploads/posts/2024-10/thumbs/UnitePlantsvsZombies_1729188947671154534f32c2.24432871.jpg	We already thought that the plants had finally won
Game Bravo Stars: Shootout 3	https://igroutka.ru/loader/game/43699/	https://igroutka.ru/uploads/posts/2022-03/thumbs/GunBattle3_1647526091623340cbd7b618.72674179.jpg	Representatives of crime got out of the control
Hero Rescue Game	https://igroutka.ru/loader/game/33829/	https://igroutka.ru/uploads/posts/2020-11/thumbs/1604991979_hero-rescue.jpg	Sometimes even the bravest and bravest heroes, who constantly help everyone
Game Master Archer	https://igroutka.ru/loader/game/39287/	https://igroutka.ru/uploads/posts/2021-08/thumbs/MasterArcher_162791592161080691814173.94499539.jpg	In ancient times, archers formed the backbone of the royal army
Game Pedestrian Crossing	https://igroutka.ru/loader/game/19188/	https://igroutka.ru/uploads/posts/2019-10/thumbs/1572518895_traffic.jpg	People are always in a hurry to somewhere
Game Incredible Motorcycle Stunts 3D	https://m.igroutka.ru/ni/474/igra-neveroyatnye-tryuki-na-mototsiklakh1/	https://igroutka.ru/uploads/posts/2020-02/thumbs/1582627120_impossible-bike-stunt-3d.jpg	Anyone who has at least once heard the sound of a sports motorcycle
Game Idle Hero Lumberjack	https://igroutka.ru/loader/game/44758/	https://igroutka.ru/uploads/posts/2022-06/thumbs/IdleLumberHero_165494921362a4855d1b79f8.84458970.jpeg	If you want to have an exciting time testing your strength
Game Sword Master: Chop Your Enemies	https://igroutka.ru/loader/game/56132/	https://igroutka.ru/uploads/posts/2025-08/thumbs/_175640982768b0afe341ef98.22171226.jpg	Do you feel like a born Jedi? Then prove that you can handle a laser sword
Game Professional Builder 3D	https://igroutka.ru/loader/game/50525/	https://igroutka.ru/uploads/posts/2024-02/thumbs/ProBuilder3D_170720671765c1e83deb4119.98259203.jpg	We invite everyone who loves to create and dreams of creating their own business
Game Color Pump	https://igroutka.ru/loader/game/40350/	https://igroutka.ru/uploads/posts/2021-09/thumbs/ColorPump_163207257861477382577206.33413034.jpg	An arcade journey where you can show all your dexterity is about to begin
Game Epic Stunts With Real Cars	https://igroutka.ru/loader/game/52345/	https://igroutka.ru/uploads/posts/2024-09/thumbs/RealCarsEpicStunts_172772049466faec2e67dd32.10920077.jpg	The new racing simulator will allow you to drive the fastest sports cars
Game Russian Extreme Off-Road 3D	https://m.igroutka.ru/games/igry-dlya-malchikov/russian_extreme_offroad/	https://igroutka.ru/uploads/posts/2016-11/thumbs/1480417816_igra-russkiy-ekstrim-po-bezdorozhu.jpg	You have already driven a variety of cars, from racing cars to heavy trucks
Game Billiard Club	https://igroutka.ru/loader/game/30134/	https://igroutka.ru/uploads/posts/2019-12/thumbs/1577529121_pool-club.jpeg	Who said that winter is only a time for winter sports
Game Lego Ninjago: Team	https://igroutka.ru/loader/game/23377/	https://igroutka.ru/uploads/posts/2018-03/thumbs/1520412923_igra-ninjago-pazl-komanda.jpg	The fact that ninjas are among the top three greatest fighters
Game Fight for Food	https://igroutka.ru/loader/game/49826/	https://igroutka.ru/uploads/posts/2023-11/thumbs/FightForFood_1699474458654bec1a665a03.90522623.jpg	I wouldn’t want to know in real life what is happening now in the world
Game Shadow of the Samurai	https://g2.igroutka.ru/lib/crazy/games/samurai-s-shadow-qtn/	https://igroutka.ru/uploads/posts/2025-05/thumbs/SamuraisShadow_17483582526835d46cf22b83.35877357.jpg	The 3D simulator invites all fans of hot action films to live the dangerous life
Game Shot Shells	https://igroutka.ru/loader/game/51912/	https://igroutka.ru/uploads/posts/2024-07/thumbs/SpentShells_1720626875668eaebb0657e1.79972046.jpg	The gloomy and damp dungeon has become a real hell for the brave shooter
Game Running City Crowds	https://igroutka.ru/loader/game/35965/	https://igroutka.ru/uploads/posts/2021-03/thumbs/1615635319_crowd-city-online.jpg	Do you consider yourself a leader, or just want to spend time doing something exciting
Game Unbeatable Basketball	https://g2.igroutka.ru/lib/crazy/games/unmatched-basketball/	https://igroutka.ru/uploads/posts/2025-10/thumbs/UnmatchedBasketball_175995875468e6d6e2bb4d06.67286368.jpg	Do you love basketball? This multiplayer simulator invites you to realize your athletic
Game Toilet Skibidi Only Up	https://g2.igroutka.ru/games/196/anZOqgp1KYB25ljX/pnvv4xtk5ga8bny4140oyg4henh6pi9d/Build/skibbbb.data.unityweb	https://igroutka.ru/uploads/posts/2023-10/thumbs/SkibidiToiletOnlyUp_1698567729653e1631517af1.13132618.jpg	Toilet Skibidi Only Up is a fun adventure game with unique missions
Game Job Arrow	https://igroutka.ru/loader/game/44405/	https://igroutka.ru/uploads/posts/2022-05/thumbs/ShooterJob_1652908238628560ce8213c5.73381472.jpg	The job of a shooter is not easy, because maintaining a high level of professionalism
Game Lighter On Skateboard	https://igroutka.ru/loader/game/43239/	https://igroutka.ru/uploads/posts/2022-02/thumbs/SkateboardLighter_1644854540620a7d0cdc3bb8.27876471.jpg	If you have ever taken part in various speed competitions
Game Zed the Hunter	https://igroutka.ru/loader/game/51535/	https://igroutka.ru/uploads/posts/2024-06/thumbs/ZHunter2_1719215168667924401821b2.72679815.jpg	Once again, the stickman becomes a participant in dangerous events
Game Age of Wars	https://igroutka.ru/loader/game/45188/	https://igroutka.ru/uploads/posts/2022-07/thumbs/AgeWarsIdle_165851484962daeda1cdf2d2.31151408.jpeg	The caveman is about to begin the most important race of his life`;

export const parseGames = (rawData: string): Game[] => {
  const lines = rawData.trim().split('\n');
  const games: Game[] = [];

  lines.forEach((line, index) => {
    let parts = line.split('\t');
    
    if (parts.length >= 2) {
      const name = parts[0]?.trim();
      const url = parts[1]?.trim();
      const image = parts[2]?.trim();
      let description = parts[3]?.trim();
      
      // Safety check: ensure description is not a URL
      if (!description || description.startsWith('http') || description.startsWith('www') || description.length < 5) {
          description = "A super fun mission waiting for you to complete! Click Play to start.";
      }

      if (url && url.toLowerCase() !== "not found" && image) {
        const category = determineCategory(name, description);
        games.push({
          id: `game-${index}`,
          name,
          url,
          image,
          description,
          category,
          difficulty: determineDifficulty(name, description),
          tags: generateTags(name, description, category),
          rating: (Math.floor(Math.random() * 10) + 40) / 10, // 4.0 to 5.0
          likes: Math.floor(Math.random() * 500) + 50
        });
      }
    }
  });

  return games;
};

// Guess category based on keywords
const determineCategory = (name: string, desc: string): string => {
  const text = (name + " " + desc).toLowerCase();
  if (text.includes('racing') || text.includes('car') || text.includes('drive') || text.includes('moto') || text.includes('truck')) return 'Racing';
  if (text.includes('shooter') || text.includes('sniper') || text.includes('war') || text.includes('gun') || text.includes('zombie') || text.includes('fight')) return 'Action';
  if (text.includes('puzzle') || text.includes('logic') || text.includes('quiz') || text.includes('merge')) return 'Puzzle';
  if (text.includes('minecraft') || text.includes('craft') || text.includes('block') || text.includes('build')) return 'Minecraft';
  if (text.includes('sport') || text.includes('football') || text.includes('soccer') || text.includes('tennis') || text.includes('ball')) return 'Sports';
  return 'Arcade';
};

// Guess difficulty based on keywords
const determineDifficulty = (name: string, desc: string): DifficultyLevel => {
   const text = (name + " " + desc).toLowerCase();
   
   if (text.includes('war') || text.includes('fight') || text.includes('zombie') || text.includes('impossible') || text.includes('hard') || text.includes('extreme') || text.includes('sniper') || text.includes('survival') || text.includes('horror')) {
     return 'Hard';
   }
   
   if (text.includes('color') || text.includes('draw') || text.includes('easy') || text.includes('kids') || text.includes('puzzle') || text.includes('click') || text.includes('idle') || text.includes('dress')) {
     return 'Easy';
   }
   
   return 'Medium';
}

// Generate cool tags for UI
const generateTags = (name: string, desc: string, category: string): string[] => {
   const tags = [category];
   const text = (name + " " + desc).toLowerCase();
   
   if (text.includes('3d')) tags.push('3D');
   if (text.includes('2d')) tags.push('2D');
   if (text.includes('io') || text.includes('multiplayer')) tags.push('Multiplayer');
   if (text.includes('hero')) tags.push('Hero');
   if (text.includes('car')) tags.push('Cars');
   if (text.includes('truck')) tags.push('Trucks');
   if (text.includes('bike') || text.includes('motorcycle')) tags.push('Bikes');
   if (text.includes('speed') || text.includes('race')) tags.push('Speed');
   if (text.includes('zombie')) tags.push('Zombies');
   if (text.includes('shoot') || text.includes('gun')) tags.push('Shooting');
   if (text.includes('sword') || text.includes('ninja')) tags.push('Ninja');
   if (text.includes('jump') || text.includes('run')) tags.push('Parkour');
   if (text.includes('brain') || text.includes('logic')) tags.push('Brain');
   
   // Add generic fun tags if too few
   if (tags.length < 2) tags.push('Fun');
   if (tags.length < 3) tags.push('Cool');
   
   return Array.from(new Set(tags)).slice(0, 4); // Max 4 tags
};

export const GAMES_DATA = parseGames(RAW_DATA_SNIPPET);