// LevelMB64 interface and enums
export interface LevelMB64 {
  file_header: string; // [0-9] (10 bytes)
  version: number; // [10] (1 byte)
  author: string; // [11-41] (31 bytes)
  piktcher: number[][]; // [42-8233] (8192 bytes, 64x64x2)

  costume: CostumeType; // [8234] (1 byte)
  seq: SeqType[]; // [8235-8239] (5 bytes)
  envfx: EnvFxType; // [8240] (1 byte)
  theme: ThemeType; // [8241] (1 byte)
  bg: BgType; // [8242] (1 byte)
  boundary_mat: BoundaryMatType; // [8243] (1 byte)
  boundary: BoundaryType; // [8244] (1 byte)
  boundary_height: number; // [8245] (1 byte)
  coinstar: number; // [8246] (1 byte)
  size: LevelSizeType; // [8247] (1 byte)
  waterlevel: number; // [8248] (1 byte)
  secret: number; // [8249] (1 byte)
  game: GameType; // [8250] (1 byte)

  toolbar: ToolbarType[]; // [8251-8259] (9 bytes)
  toolbar_params: number[]; // [8260-8268] (9 bytes)
  tile_count: number; // [8269-8270] (2 bytes)
  object_count: number; // [8271-8272] (2 bytes)

  custom_theme: CustomTheme; // [8273-8306] (34 bytes: mats/topmats/topmatsEnabled 10x1 each, fence/pole/bars/water 1 each)
  trajectories: TrajectoryTuple[][]; // [8307-12306] (4000 bytes: 20x50x4)
  pad: number; // [12307-12314] (8 bytes, u64 as JS number)

  tiles: TileMB64[]; // [12315-?] (variable)
  objects: ObjectMB64[]; // [?-?] (variable)
}

export const CostumeTypeMap = {
  MARIO: 0,
  LUIGI: 1,
  PEACH: 2,
  TOAD: 3,
  YOSHI: 4,
} as const;
export type CostumeType = keyof typeof CostumeTypeMap;

export const SeqTypeMap = {
  // Vanilla
  "Bob-omb Battlefield": 0,
  "Slider": 1,
  "Dire, Dire Docks": 2,
  "Dire, Dire Docks (Underwater)": 3,
  "Lethal Lava Land": 4,
  "Cool, Cool Mountain": 5,
  "Big Boo's Haunt": 6,
  "Hazy Maze Cave": 7,
  "Hazy Maze Cave (Haze)": 8,
  "Koopa's Road": 9,
  "Stage Boss": 10,
  "Koopa's Theme": 11,
  "Ultimate Koopa": 12,
  "Inside the Castle Walls": 13,
  // BTCM
  "Cosmic Castle": 14,
  "Red-Hot Reservoir": 15,
  "Lonely Floating Farm": 16,
  "Jurassic Savanna": 17,
  "The Phantom Strider": 18,
  "Virtuaplex": 19,
  "Immense Residence": 20,
  "Thwomp Towers": 21,
  "Cursed Boss": 22,
  "Road To The Boss": 23,
  "Urbowser": 24,
  "The Show's Finale": 25,
  "Parasite Moon": 26,
  "AGAMEMNON": 27,
  // Romhack
  "Bianco Hills (Super Mario Sunshine)": 28,
  "Sky and Sea (Super Mario Sunshine)": 29,
  "Secret Course (Super Mario Sunshine)": 30,
  "Comet Observatory (Mario Galaxy)": 31,
  "Buoy Base Galaxy (Mario Galaxy)": 32,
  "Battlerock Galaxy (Mario Galaxy)": 33,
  "Ghostly Galaxy (Mario Galaxy)": 34,
  "Purple Comet (Mario Galaxy)": 35,
  "Honeybloom Galaxy (Mario Galaxy 2)": 36,
  "Piranha Creeper Creek (3D World)": 37,
  "Desert (New Super Mario Bros.)": 38,
  "Koopa Troopa Beach (Mario Kart 64)": 39,
  "Frappe Snowland (Mario Kart 64)": 40,
  "Bowser's Castle (Mario Kart 64)": 41,
  "Rainbow Road (Mario Kart 64)": 42,
  "Waluigi Pinball (Mario Kart DS)": 43,
  "Rainbow Road (Mario Kart 8)": 44,
  "Mario's Pad (Super Mario RPG)": 45,
  "Nimbus Land (Super Mario RPG)": 46,
  "Forest Maze (Super Mario RPG)": 47,
  "Sunken Ship (Super Mario RPG)": 48,
  "Dry Dry Desert (Paper Mario 64)": 49,
  "Forever Forest (Paper Mario 64)": 50,
  "Petal Meadows (Paper Mario: TTYD)": 51,
  "Riddle Tower (Paper Mario: TTYD)": 52,
  "Rogueport Sewers (Paper Mario: TTYD)": 53,
  "X-Naut Fortress (Paper Mario: TTYD)": 54,
  "Flipside (Super Paper Mario)": 55,
  "Lineland Road (Super Paper Mario)": 56,
  "Sammer Kingdom (Super Paper Mario)": 57,
  "Floro Caverns (Super Paper Mario)": 58,
  "Overthere Stair (Super Paper Mario)": 59,
  "Yoshi's Tropical Island (Mario Party)": 60,
  "Rainbow Castle (Mario Party)": 61,
  "Behind Yoshi Village (Partners in Time)": 62,
  "Gritzy Desert (Partners in Time)": 63,
  "Bumpsy Plains (Bowser's Inside Story)": 64,
  "Deep Castle (Bowser's Inside Story)": 65,
  "Overworld (Yoshi's Island)": 66,
  "Underground (Yoshi's Island)": 67,
  "Title (Yoshi's Story)": 68,
  "Kokiri Forest (Ocarina of Time)": 69,
  "Lost Woods (Ocarina of Time)": 70,
  "Gerudo Valley (Ocarina of Time)": 71,
  "Stone Tower Temple (Majora's Mask)": 72,
  "Outset Island (Wind Waker)": 73,
  "Lake Hylia (Twilight Princess)": 74,
  "Gerudo Desert (Twilight Princess)": 75,
  "Skyloft (Skyward Sword)": 76,
  "Frantic Factory (Donkey Kong 64)": 77,
  "Hideout Helm (Donkey Kong 64)": 78,
  "Creepy Castle (Donkey Kong 64)": 79,
  "Gloomy Galleon (Donkey Kong 64)": 80,
  "Fungi Forest (Donkey Kong 64)": 81,
  "Crystal Caves (Donkey Kong 64)": 82,
  "Angry Aztec (Donkey Kong 64)": 83,
  "In a Snow-Bound Land (DKC 2)": 84,
  "Bubblegloop Swamp (Banjo-Kazooie)": 85,
  "Freezeezy Peak (Banjo-Kazooie)": 86,
  "Gobi's Valley (Banjo-Kazooie)": 87,
  "Factory Inspection (Kirby 64)": 88,
  "Green Garden (Bomberman 64)": 89,
  "Black Fortress (Bomberman 64)": 90,
  "Windy Hill (Sonic Adventure)": 91,
  "Sky Tower (Pokemon Mystery Dungeon)": 92,
  "Youkai Mountain (Touhou 10)": 93,
  "Forest Temple (Final Fantasy VII)": 94,
  "Band Land (Rayman)": 95,
  // Retro
  "Overworld (Super Mario Bros.)": 96,
  "Castle Mix (Super Mario Bros.)": 97,
  "Overworld (Super Mario Bros. 2)": 98,
  "Overworld Mix (Super Mario Bros. 3)": 99,
  "Fortress (Super Mario Bros. 3)": 100,
  "Athletic (Super Mario World)": 101,
  "Castle (Super Mario World)": 102,
} as const;
export type SeqType = keyof typeof SeqTypeMap;

export const EnvFxTypeMap = {
  NONE: 0,
  SNOW: 1,
  RAIN: 2,
  LEAVES: 3,
} as const;
export type EnvFxType = keyof typeof EnvFxTypeMap;

export const ThemeTypeMap = {
  GENERIC: 0,
  SSL: 1,
  RHR: 2,
  HMC: 3,
  CASTLE: 4,
  VIRTUAPLEX: 5,
  SNOW: 6,
  BBH: 7,
  JRB: 8,
  RETRO: 9,
  CUSTOM: 10,
  MC: 11,
} as const;
export type ThemeType = keyof typeof ThemeTypeMap;

export const BgTypeMap = {
  DAY: 0,
  NIGHT: 1,
  SUNSET: 2,
  SPACE: 3,
} as const;
export type BgType = keyof typeof BgTypeMap;

export const BoundaryMatTypeMap = {
  STONE: 0,
  WOOD: 1,
  METAL: 2,
  GLASS: 3,
} as const;
export type BoundaryMatType = keyof typeof BoundaryMatTypeMap;

export const BoundaryTypeMap = {
  NONE: 0,
  WALL: 1,
  FENCE: 2,
  CLIFF: 3,
} as const;
export type BoundaryType = keyof typeof BoundaryTypeMap;

export const LevelSizeTypeMap = {
  SMALL: 0,
  MEDIUM: 1,
  LARGE: 2,
} as const;
export type LevelSizeType = keyof typeof LevelSizeTypeMap;

export const GameTypeMap = {
  VANILLA: 0,
  CUSTOM: 1,
  CHALLENGE: 2,
} as const;
export type GameType = keyof typeof GameTypeMap;

export const ToolbarTypeMap = {
  SETTINGS: 0,
  TEST: 1,
  TERRAIN: 2,
  SLOPE: 3,
  TROLL: 4,
  STAR: 5,
  GOOMBA: 6,
  PIRANHA: 7,
  KOOPA: 8,
  COIN: 9,
  BLANK: 10,
  GCOIN: 11,
  CORNER: 12,
  ICORNER: 13,
  RCOIN: 14,
  BCOIN: 15,
  NOTEBLOCK: 16,
  CULL: 17,
  BOBOMB: 18,
  CHUCKYA: 19,
  BULLY: 20,
  BULLET: 21,
  HEAVEHO: 22,
  MOTOS: 23,
  TREE: 24,
  EXCLA: 25,
  SPAWN: 26,
  REX: 27,
  PODOBOO: 28,
  CRABLET: 29,
  HAMMER_BRO: 30,
  CHICKEN: 31,
  PHANTASM: 32,
  PIPE: 33,
  BADGE: 34,
  WATER: 35,
  FENCE: 36,
  KING_BOBOMB: 37,
  WIGGLER: 38,
  BOWSER: 39,
  MPLAT: 40,
  BBALL: 41,
  KTQ: 42,
  SSLOPE: 43,
  SLAB: 44,
  PURPLE_SWITCH: 45,
  TIMED_BOX: 46,
  HEART: 47,
  FORMATION: 48,
  VSLAB: 49,
  SCORNER: 50,
  UGENTLE: 51,
  LGENTLE: 52,
  BARS: 53,
  THWOMP: 54,
  WHOMP: 55,
  POLE: 56,
  VEXCLA: 57,
  LAKITU: 58,
  FLYGUY: 59,
  SNUFIT: 60,
  AMP: 61,
  BOO: 62,
  MR_I: 63,
  SCUTTLEBUG: 64,
  SPINDRIFT: 65,
  BLIZZARD: 66,
  MONEYBAG: 67,
  SKEETER: 68,
  POKEY: 69,
  MINE: 70,
  FIRE: 71,
  FLAMETHROWER: 72,
  FIRE_SPITTER: 73,
  FIRE_SPINNER: 74,
  BREAKABLE: 75,
  SMALL_BOX: 76,
  DIAMOND: 77,
  NPC: 78,
  NPCCM: 79,
  BUTTON: 80,
  BLOCK: 81,
  WOODPLAT: 82,
  RFBOX: 83,
  SHOWRUN: 84,
  POWER: 85,
  CONVEYOR: 86,
  ISCORNER: 87,
  TRIGGER: 88,
} as const;
export type ToolbarType = keyof typeof ToolbarTypeMap;

export const MaterialTypeMap = {
  MB64_MATLIST_START: 0,
  MB64_MAT_GRASS: 0,
  MB64_MAT_GRASS_OLD: 1,
  MB64_MAT_CARTOON_GRASS: 2,
  MB64_MAT_DARK_GRASS: 3,
  MB64_MAT_HMC_GRASS: 4,
  MB64_MAT_ORANGE_GRASS: 5,
  MB64_MAT_RED_GRASS: 6,
  MB64_MAT_PURPLE_GRASS: 7,
  MB64_MAT_SAND: 8,
  MB64_MAT_JRB_SAND: 9,
  MB64_MAT_SNOW: 10,
  MB64_MAT_SNOW_OLD: 11,
  MB64_MAT_DIRT: 12,
  MB64_MAT_SANDDIRT: 13,
  MB64_MAT_LIGHTDIRT: 14,
  MB64_MAT_HMC_DIRT: 15,
  MB64_MAT_ROCKY_DIRT: 16,
  MB64_MAT_DIRT_OLD: 17,
  MB64_MAT_WAVY_DIRT: 18,
  MB64_MAT_WAVY_DIRT_BLUE: 19,
  MB64_MAT_SNOWDIRT: 20,
  MB64_MAT_PURPLE_DIRT: 21,
  MB64_MAT_HMC_LAKEGRASS: 22,
  MB64_MATLIST_TERRAIN_END: 23,
  MB64_MAT_STONE: 23,
  MB64_MAT_HMC_STONE: 24,
  MB64_MAT_HMC_MAZEFLOOR: 25,
  MB64_MAT_CCM_ROCK: 26,
  MB64_MAT_TTM_FLOOR: 27,
  MB64_MAT_TTM_ROCK: 28,
  MB64_MAT_COBBLESTONE: 29,
  MB64_MAT_JRB_WALL: 30,
  MB64_MAT_GABBRO: 31,
  MB64_MAT_RHR_STONE: 32,
  MB64_MAT_LAVA_ROCKS: 33,
  MB64_MAT_VOLCANO_WALL: 34,
  MB64_MAT_RHR_BASALT: 35,
  MB64_MAT_OBSIDIAN: 36,
  MB64_MAT_CASTLE_STONE: 37,
  MB64_MAT_JRB_UNDERWATER: 38,
  MB64_MAT_SNOW_ROCK: 39,
  MB64_MAT_ICY_ROCK: 40,
  MB64_MAT_DESERT_STONE: 41,
  MB64_MAT_RHR_OBSIDIAN: 42,
  MB64_MAT_JRB_STONE: 43,
  MB64_MATLIST_STONE_END: 44,
  MB64_MAT_BRICKS: 44,
  MB64_MAT_DESERT_BRICKS: 45,
  MB64_MAT_RHR_BRICK: 46,
  MB64_MAT_HMC_BRICK: 47,
  MB64_MAT_LIGHTBROWN_BRICK: 48,
  MB64_MAT_WDW_BRICK: 49,
  MB64_MAT_TTM_BRICK: 50,
  MB64_MAT_C_BRICK: 51,
  MB64_MAT_BBH_BRICKS: 52,
  MB64_MAT_ROOF_BRICKS: 53,
  MB64_MAT_C_OUTSIDEBRICK: 54,
  MB64_MAT_SNOW_BRICKS: 55,
  MB64_MAT_JRB_BRICKS: 56,
  MB64_MAT_SNOW_TILE_SIDE: 57,
  MB64_MAT_TILESBRICKS: 58,
  MB64_MATLIST_BRICKS_END: 59,
  MB64_MAT_TILES: 59,
  MB64_MAT_C_TILES: 60,
  MB64_MAT_DESERT_TILES: 61,
  MB64_MAT_VP_BLUETILES: 62,
  MB64_MAT_SNOW_TILES: 63,
  MB64_MAT_JRB_TILETOP: 64,
  MB64_MAT_JRB_TILESIDE: 65,
  MB64_MAT_HMC_TILES: 66,
  MB64_MAT_GRANITE_TILES: 67,
  MB64_MAT_RHR_TILES: 68,
  MB64_MAT_VP_TILES: 69,
  MB64_MAT_DIAMOND_PATTERN: 70,
  MB64_MAT_C_STONETOP: 71,
  MB64_MAT_SNOW_BRICK_TILES: 72,
  MB64_MATLIST_TILES_END: 73,
  MB64_MAT_DESERT_BLOCK: 73,
  MB64_MAT_VP_BLOCK: 74,
  MB64_MAT_BBH_STONE: 75,
  MB64_MAT_BBH_STONE_PATTERN: 76,
  MB64_MAT_PATTERNED_BLOCK: 77,
  MB64_MAT_HMC_SLAB: 78,
  MB64_MAT_RHR_BLOCK: 79,
  MB64_MAT_GRANITE_BLOCK: 80,
  MB64_MAT_C_STONESIDE: 81,
  MB64_MAT_C_PILLAR: 82,
  MB64_MAT_BBH_PILLAR: 83,
  MB64_MAT_RHR_PILLAR: 84,
  MB64_MATLIST_CUTSTONE_END: 85,
  MB64_MAT_WOOD: 85,
  MB64_MAT_BBH_WOOD_FLOOR: 86,
  MB64_MAT_BBH_WOOD_WALL: 87,
  MB64_MAT_C_WOOD: 88,
  MB64_MAT_JRB_WOOD: 89,
  MB64_MAT_JRB_SHIPSIDE: 90,
  MB64_MAT_JRB_SHIPTOP: 91,
  MB64_MAT_BBH_HAUNTED_PLANKS: 92,
  MB64_MAT_BBH_ROOF: 93,
  MB64_MAT_SOLID_WOOD: 94,
  MB64_MAT_RHR_WOOD: 95,
  MB64_MATLIST_WOOD_END: 96,
  MB64_MAT_BBH_METAL: 96,
  MB64_MAT_JRB_METALSIDE: 97,
  MB64_MAT_JRB_METAL: 98,
  MB64_MAT_C_BASEMENTWALL: 99,
  MB64_MAT_DESERT_TILES2: 100,
  MB64_MAT_VP_RUSTYBLOCK: 101,
  MB64_MATLIST_METAL_END: 102,
  MB64_MAT_C_CARPET: 102,
  MB64_MAT_C_WALL: 103,
  MB64_MAT_ROOF: 104,
  MB64_MAT_C_ROOF: 105,
  MB64_MAT_SNOW_ROOF: 106,
  MB64_MAT_BBH_WINDOW: 107,
  MB64_MAT_HMC_LIGHT: 108,
  MB64_MAT_VP_CAUTION: 109,
  MB64_MAT_RR_BLOCKS: 110,
  MB64_MAT_STUDDED_TILE: 111,
  MB64_MAT_TTC_BLOCK: 112,
  MB64_MAT_TTC_SIDE: 113,
  MB64_MAT_TTC_WALL: 114,
  MB64_MAT_FLOWERS: 115,
  MB64_MATLIST_BUILDING_END: 116,
  MB64_MAT_LAVA: 116,
  MB64_MAT_LAVA_OLD: 117,
  MB64_MAT_SERVER_ACID: 118,
  MB64_MAT_BURNING_ICE: 119,
  MB64_MAT_QUICKSAND: 120,
  MB64_MAT_DESERT_SLOWSAND: 121,
  MB64_MAT_VP_VOID: 122,
  MB64_MATLIST_HAZARD_END: 123,
  MB64_MAT_RHR_MESH: 123,
  MB64_MAT_VP_MESH: 124,
  MB64_MAT_HMC_MESH: 125,
  MB64_MAT_BBH_MESH: 126,
  MB64_MAT_PINK_MESH: 127,
  MB64_MAT_TTC_MESH: 128,
  MB64_MAT_ICE: 129,
  MB64_MAT_CRYSTAL: 130,
  MB64_MAT_VP_SCREEN: 131,
  MB64_MATLIST_END: 132,
  MB64_MAT_RETRO_GROUND: 132,
  MB64_MAT_RETRO_BRICKS: 133,
  MB64_MAT_RETRO_TREETOP: 134,
  MB64_MAT_RETRO_TREEPLAT: 135,
  MB64_MAT_RETRO_BLOCK: 136,
  MB64_MAT_RETRO_BLUEGROUND: 137,
  MB64_MAT_RETRO_BLUEBRICKS: 138,
  MB64_MAT_RETRO_BLUEBLOCK: 139,
  MB64_MAT_RETRO_WHITEBRICK: 140,
  MB64_MAT_RETRO_LAVA: 141,
  MB64_MAT_RETRO_UNDERWATERGROUND: 142,
  MB64_MAT_MC_DIRT: 143,
  MB64_MAT_MC_GRASS: 144,
  MB64_MAT_MC_COBBLESTONE: 145,
  MB64_MAT_MC_STONE: 146,
  MB64_MAT_MC_OAK_LOG_TOP: 147,
  MB64_MAT_MC_OAK_LOG_SIDE: 148,
  MB64_MAT_MC_OAK_LEAVES: 149,
  MB64_MAT_MC_WOOD_PLANKS: 150,
  MB64_MAT_MC_SAND: 151,
  MB64_MAT_MC_BRICKS: 152,
  MB64_MAT_MC_LAVA: 153,
  MB64_MAT_MC_FLOWING_LAVA: 154,
  MB64_MAT_MC_GLASS: 155,
} as const;

export type MaterialType = keyof typeof MaterialTypeMap;

export interface CustomTheme {
  mats: (MaterialType)[];
  topmats: (MaterialType)[];
  topmatsEnabled: (MaterialType)[];
  fence: MaterialType;
  pole: MaterialType;
  bars: MaterialType;
  water: MaterialType;
}

export interface TileMB64 {
  x: number;
  y: number;
  z: number;
  type: number;
  mat: number;
  rot: number;
  waterlogged: number;
}

export interface ObjectMB64 {
  bparam: number;
  x: number;
  y: number;
  z: number;
  type: number;
  rot: number;
  imbue: number;
  pad: number;
}

export type TrajectoryTuple = [t: number, x: number, y: number, z: number];
