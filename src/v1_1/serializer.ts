import { tileToU32 } from "./common.ts";
import { log } from "./logger.ts";
import {
  BgTypeMap,
  BoundaryMatTypeMap,
  BoundaryTypeMap,
  CostumeTypeMap,
  EnvFxTypeMap,
  GameTypeMap,
  type LevelMB64,
  LevelSizeTypeMap,
  type MaterialType,
  MaterialTypeMap,
  SeqTypeMap,
  ThemeTypeMap,
  ToolbarTypeMap,
} from "./types.ts";

function writeString(
  view: DataView,
  offset: number,
  str: string,
  length: number,
): number {
  for (let i = 0; i < length; i++) {
    view.setUint8(offset + i, i < str.length ? str.charCodeAt(i) : 0);
  }
  return offset + length;
}

function writeU8(view: DataView, offset: number, value: number): number {
  view.setUint8(offset, value);
  return offset + 1;
}

function writeU16(view: DataView, offset: number, value: number): number {
  view.setUint16(offset, value);
  return offset + 2;
}

function writeU64(view: DataView, offset: number, value: bigint): number {
  view.setBigUint64(offset, value);
  return offset + 8;
}

function writeU32(view: DataView, offset: number, value: number): number {
  view.setUint32(offset, value);
  return offset + 4;
}

function assertOffset(actual: number, expected: number, label: string) {
  if (actual !== expected) {
    throw new Error(
      `${label} should be ${expected}, got ${actual} (0x${
        actual.toString(16)
      })`,
    );
  }
}

export function serializeMb64(level: LevelMB64): Uint8Array {
  const headerSize = 10 + 1 + 31 + 8192 + 1 + 5 + 11 + 9 +
    9 + /* inexplicable byte */ 1 + 2 + 2 + 34 + 4000 +
    8 + /* inexplicable ghost pad bytes */ +4;
  const tilesSize = (level.tiles.length) * 4;
  const objectsSize = (level.objects.length) * 8;
  const bufSize = headerSize + tilesSize + objectsSize;
  const buffer = new ArrayBuffer(bufSize);
  const view = new DataView(buffer);
  let offset = 0;

  offset = writeString(view, offset, level.file_header, 10);
  assertOffset(offset, 10, "Offset after file_header");
  offset = writeU8(view, offset, level.version);
  assertOffset(offset, 11, "Offset after version");
  offset = writeString(view, offset, level.author, 31);
  assertOffset(offset, 42, "Offset after author");

  // piktcher: 64x64 u16
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      offset = writeU16(view, offset, level.piktcher[y][x]);
    }
  }
  assertOffset(offset, 8234, "Offset after piktcher");
  offset = writeU8(view, offset, CostumeTypeMap[level.costume]);
  assertOffset(offset, 8235, "Offset after costume");
  for (let i = 0; i < 5; i++) {
    const seqVal =
      typeof level.seq[i] === "string" && level.seq[i] in SeqTypeMap
        ? SeqTypeMap[level.seq[i] as keyof typeof SeqTypeMap]
        : (() => {
          throw new Error(
            `BUG: seq value at index ${i} (${
              level.seq[i]
            }) does not match any music track string. Fix your SeqTypeMap!`,
          );
        })();
    offset = writeU8(view, offset, Number(seqVal));
  }
  assertOffset(offset, 8240, "Offset after seq");
  offset = writeU8(
    view,
    offset,
    typeof level.envfx === "string" && level.envfx in EnvFxTypeMap
      ? EnvFxTypeMap[level.envfx as keyof typeof EnvFxTypeMap]
      : Number(level.envfx),
  );
  offset = writeU8(
    view,
    offset,
    ThemeTypeMap[level.theme as keyof typeof ThemeTypeMap]
  );
  offset = writeU8(
    view,
    offset,
    typeof level.bg === "string" && level.bg in BgTypeMap
      ? BgTypeMap[level.bg as keyof typeof BgTypeMap]
      : Number(level.bg),
  );
  offset = writeU8(
    view,
    offset,
    typeof level.boundary_mat === "string" &&
      level.boundary_mat in BoundaryMatTypeMap
      ? BoundaryMatTypeMap[
        level.boundary_mat as keyof typeof BoundaryMatTypeMap
      ]
      : Number(level.boundary_mat),
  );
  offset = writeU8(
    view,
    offset,
    typeof level.boundary === "string" && level.boundary in BoundaryTypeMap
      ? BoundaryTypeMap[level.boundary as keyof typeof BoundaryTypeMap]
      : Number(level.boundary),
  );
  offset = writeU8(view, offset, level.boundary_height);
  offset = writeU8(view, offset, level.coinstar);
  offset = writeU8(
    view,
    offset,
    typeof level.size === "string" && level.size in LevelSizeTypeMap
      ? LevelSizeTypeMap[level.size as keyof typeof LevelSizeTypeMap]
      : Number(level.size),
  );
  offset = writeU8(view, offset, level.waterlevel);
  offset = writeU8(view, offset, level.secret);
  offset = writeU8(
    view,
    offset,
    typeof level.game === "string" && level.game in GameTypeMap
      ? GameTypeMap[level.game as keyof typeof GameTypeMap]
      : Number(level.game),
  );
  assertOffset(
    offset,
    8251,
    "Offset after envfx-theme-bg-boundary_mat-boundary-boundary_height-coinstar-size-waterlevel-secret-game",
  );

  for (let i = 0; i < 9; i++) {
    offset = writeU8(view, offset, ToolbarTypeMap[level.toolbar[i]]);
  }
  assertOffset(offset, 8260, "Offset after toolbar");
  for (let i = 0; i < 9; i++) {
    offset = writeU8(view, offset, level.toolbar_params[i]);
  }
  assertOffset(offset, 8269, "Offset after toolbar_params");

  offset = writeU8(view, offset, 0); // UNEXPLAINABLE BYTE!
  offset = writeU16(view, offset, level.tile_count);
  assertOffset(offset, 8271 + 1, "Offset after tile_count");
  offset = writeU16(view, offset, level.object_count);
  assertOffset(offset, 8273 + 1, "Offset after object_count");

  const customThemeLen = 10; // NUM_MATERIALS_PER_THEME
  for (let i = 0; i < customThemeLen; i++) {
    const val = level.custom_theme.mats[i];
    offset = writeU8(
      view,
      offset,
      typeof val === "string" && val in MaterialTypeMap
        ? MaterialTypeMap[val as MaterialType]
        : Number(val),
    );
  }
  for (let i = 0; i < customThemeLen; i++) {
    const val = level.custom_theme.topmats[i];
    offset = writeU8(
      view,
      offset,
      typeof val === "string" && val in MaterialTypeMap
        ? MaterialTypeMap[val as MaterialType]
        : Number(val),
    );
  }
  for (let i = 0; i < customThemeLen; i++) {
    const val = level.custom_theme.topmatsEnabled[i];
    offset = writeU8(
      view,
      offset,
      typeof val === "string" && val in MaterialTypeMap
        ? MaterialTypeMap[val as MaterialType]
        : Number(val),
    );
  }
  offset = writeU8(
    view,
    offset,
    typeof level.custom_theme.fence === "string" &&
      level.custom_theme.fence in MaterialTypeMap
      ? MaterialTypeMap[level.custom_theme.fence as MaterialType]
      : Number(level.custom_theme.fence),
  );
  offset = writeU8(
    view,
    offset,
    typeof level.custom_theme.pole === "string" &&
      level.custom_theme.pole in MaterialTypeMap
      ? MaterialTypeMap[level.custom_theme.pole as MaterialType]
      : Number(level.custom_theme.pole),
  );
  offset = writeU8(
    view,
    offset,
    typeof level.custom_theme.bars === "string" &&
      level.custom_theme.bars in MaterialTypeMap
      ? MaterialTypeMap[level.custom_theme.bars as MaterialType]
      : Number(level.custom_theme.bars),
  );
  offset = writeU8(
    view,
    offset,
    typeof level.custom_theme.water === "string" &&
      level.custom_theme.water in MaterialTypeMap
      ? MaterialTypeMap[level.custom_theme.water as MaterialType]
      : Number(level.custom_theme.water),
  );
  assertOffset(offset, 8307 + 1, "Offset at start of trajectories");
  for (const trajArr of level.trajectories) {
    for (const traj of trajArr) {
      offset = writeU8(view, offset, traj[0]);
      offset = writeU8(view, offset, traj[1]);
      offset = writeU8(view, offset, traj[2]);
      offset = writeU8(view, offset, traj[3]);
    }
  }
  assertOffset(offset, 12307 + 1, "Offset after trajectories");

  offset = writeU64(view, offset, BigInt(level.pad));
  assertOffset(offset, 12315 + 1, "Offset after pad");

  // Write ghost pad bytes. No idea why these are here, but they exist in all known .mb64 files.
  offset = writeU32(view, offset, 0);

  // Diagnostics for tile/object counts and buffer sizes
  log(
    "debug",
    "DIAG serializer: tile_count:",
    level.tile_count,
    "tiles.length:",
    level.tiles.length,
  );
  log(
    "debug",
    "DIAG serializer: object_count:",
    level.object_count,
    "objects.length:",
    level.objects.length,
  );
  log(
    "debug",
    "DIAG serializer: headerSize:",
    headerSize,
    "tilesSize:",
    tilesSize,
    "objectsSize:",
    objectsSize,
    "bufSize:",
    bufSize,
  );

  // Write tiles (packed 32-bit)
  for (const tile of level.tiles) {
    view.setUint32(offset, tileToU32(tile), false);
    offset += 4;
  }
  // Write objects (1 byte per field)
  for (const obj of level.objects) {
    offset = writeU8(view, offset, obj.bparam);
    offset = writeU8(view, offset, obj.x);
    offset = writeU8(view, offset, obj.y);
    offset = writeU8(view, offset, obj.z);
    offset = writeU8(view, offset, obj.type);
    offset = writeU8(view, offset, obj.rot);
    offset = writeU8(view, offset, obj.imbue);
    offset = writeU8(view, offset, obj.pad);
  }

  return new Uint8Array(buffer, 0, offset);
}
