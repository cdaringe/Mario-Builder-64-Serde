import { type OffsetRef, tileToU32 } from "./common.ts";
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
  type ObjectMB64,
  type SeqType,
  SeqTypeMap,
  ThemeTypeMap,
  type TileMB64,
  type ToolbarType,
  ToolbarTypeMap,
  type TrajectoryTuple,
} from "./types.ts";

function readString(
  view: DataView,
  offsetRef: OffsetRef,
  length: number,
): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    const code = view.getUint8(offsetRef.current + i);
    if (code !== 0) str += String.fromCharCode(code);
  }
  offsetRef.current += length;
  return str;
}

function readU8(view: DataView, offsetRef: OffsetRef): number {
  const v = view.getUint8(offsetRef.current);
  offsetRef.current += 1;
  return v;
}

function readU16(view: DataView, offsetRef: OffsetRef): number {
  const v = view.getUint16(offsetRef.current);
  offsetRef.current += 2;
  return v;
}

function readU64(view: DataView, offsetRef: OffsetRef): bigint {
  const v = view.getBigUint64(offsetRef.current);
  offsetRef.current += 8;
  return v;
}

function reverseMap<T extends Record<string, number>>(
  map: T,
  value: number,
): keyof T {
  return (Object.keys(map) as Array<keyof T>).find((k) => map[k] === value)!;
}

export function parseMb64(buffer: Uint8Array): LevelMB64 {
  const offsetRef: OffsetRef = { current: 0 };
  log(
    "debug",
    "DIAG parser: Starting parseMb64, buffer length:",
    buffer.length,
  );
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const offset = 0;

  const file_header = readString(view, offsetRef, 10);
  const version = readU8(view, offsetRef);
  const author = readString(view, offsetRef, 31);

  const piktcher: number[][] = [];
  for (let y = 0; y < 64; y++) {
    const row: number[] = [];
    for (let x = 0; x < 64; x++) {
      const v = readU16(view, offsetRef);
      row.push(v);
    }
    piktcher.push(row);
  }

  log(
    "debug",
    `DIAG parser: +1 eo-piktcher bytes ${offset} (0x${offset.toString(16)})`,
  );
  const costumeNum = readU8(view, offsetRef);
  const costume = reverseMap(CostumeTypeMap, costumeNum);

  const seq: SeqType[] = [];
  for (let i = 0; i < 5; i++) {
    const seqNum = readU8(view, offsetRef);
    const seqStr = reverseMap(SeqTypeMap, seqNum);
    if (seqStr === undefined) {
      throw new Error(
        `BUG: seq value at index ${i} (${seqNum}) does not match any music track string. Fix your SeqTypeMap!`,
      );
    }
    seq.push(seqStr);
  }

  const envfxNum = readU8(view, offsetRef);
  const envfx = reverseMap(EnvFxTypeMap, envfxNum) ?? envfxNum;

  const themeNum = readU8(view, offsetRef);
  const theme = reverseMap(ThemeTypeMap, themeNum);

  const bgNum = readU8(view, offsetRef);
  const bg = reverseMap(BgTypeMap, bgNum);

  const boundaryMatNum = readU8(view, offsetRef);
  const boundary_mat = reverseMap(BoundaryMatTypeMap, boundaryMatNum) ??
    boundaryMatNum;

  const boundaryNum = readU8(view, offsetRef);
  const boundary = reverseMap(BoundaryTypeMap, boundaryNum) ?? boundaryNum;

  const boundary_height = readU8(view, offsetRef);
  const coinstar = readU8(view, offsetRef);

  const sizeNum = readU8(view, offsetRef);
  const size = reverseMap(LevelSizeTypeMap, sizeNum) ?? sizeNum;

  const waterlevel = readU8(view, offsetRef);
  const secret = readU8(view, offsetRef);

  const gameNum = readU8(view, offsetRef);
  log(
    "debug",
    `DIAG parser: game_num byte: ${offsetRef.current} (0x${offsetRef.current.toString(16)})`,
  );

  const game = reverseMap(GameTypeMap, gameNum) ?? gameNum;

  const toolbar: ToolbarType[] = [];
  for (let i = 0; i < 9; i++) {
    const tbNum = readU8(view, offsetRef);
    const tbStr = reverseMap(ToolbarTypeMap, tbNum);
    if (tbStr === undefined) {
      throw new Error(
        `BUG: toolbar value at index ${i} (${tbNum}) does not match any mb64_ui_button_type variant. Fix your ToolbarTypeMap!`,
      );
    }
    toolbar.push(tbStr);
  }
  const toolbar_params: number[] = [];
  for (let i = 0; i < 9; i++) {
    const tbp = readU8(view, offsetRef);
    toolbar_params.push(tbp);
  }

  const _UNEXPLAINABLE_BYTE = readU8(view, offsetRef);
  const tile_count = readU16(view, offsetRef);
  const object_count = readU16(view, offsetRef);

  log(
    "debug",
    `DIAG parser: +1 obj_count byte ${offsetRef.current} (0x${
      offsetRef.current.toString(16)
    })`,
  );

  const mats: MaterialType[] = [];
  const topmats: MaterialType[] = [];
  const topmatsEnabled: MaterialType[] = [];
  for (let i = 0; i < 10; i++) {
    const v = readU8(view, offsetRef);
    const matStr = reverseMap(MaterialTypeMap, Number(v));
    if (matStr === undefined) {
      throw new Error(
        `custom_theme.mats value at index ${i} (${v}) does not match any material string. Fix your MaterialTypeMap!`,
      );
    }
    mats.push(matStr || v);
  }
  for (let i = 0; i < 10; i++) {
    const v = readU8(view, offsetRef);
    const matStr = reverseMap(MaterialTypeMap, Number(v));
    if (matStr === undefined) {
      throw new Error(
        `custom_theme.topmats value at index ${i} (${v}) does not match any material string. Fix your MaterialTypeMap!`,
      );
    }
    topmats.push(matStr);
  }
  for (let i = 0; i < 10; i++) {
    const v = readU8(view, offsetRef);
    const matStr = reverseMap(MaterialTypeMap, Number(v));
    if (matStr === undefined) {
      throw new Error(
        `custom_theme.topmatsEnabled value at index ${i} (${v}) does not match any material string. Fix your MaterialTypeMap!`,
      );
    }
    topmatsEnabled.push(matStr);
  }
  const fence = readU8(view, offsetRef);
  const fenceStr = reverseMap(MaterialTypeMap, Number(fence));
  if (fenceStr === undefined) {
    throw new Error(
      `custom_theme.fence value (${fence}) does not match any material string. Fix your MaterialTypeMap!`,
    );
  }
  const pole = readU8(view, offsetRef);
  const poleStr = reverseMap(MaterialTypeMap, Number(pole));
  if (poleStr === undefined) {
    throw new Error(
      `custom_theme.pole value (${pole}) does not match any material string. Fix your MaterialTypeMap!`,
    );
  }
  const bars = readU8(view, offsetRef);
  const barsStr = reverseMap(MaterialTypeMap, Number(bars));
  if (barsStr === undefined) {
    throw new Error(
      `custom_theme.bars value (${bars}) does not match any material string. Fix your MaterialTypeMap!`,
    );
  }

  const water = readU8(view, offsetRef);
  const waterStr = reverseMap(MaterialTypeMap, Number(water));
  if (waterStr === undefined) {
    throw new Error(
      `custom_theme.water value (${water}) does not match any material string. Fix your MaterialTypeMap!`,
    );
  }

  // trajectories
  const trajectories: TrajectoryTuple[][] = [];
  for (let i = 0; i < 20; i++) {
    const trajArr: TrajectoryTuple[] = [];
    for (let j = 0; j < 50; j++) {
      const t = readU8(view, offsetRef);
      const x = readU8(view, offsetRef);
      const y = readU8(view, offsetRef);
      const z = readU8(view, offsetRef);
      trajArr.push([t, x, y, z]);
    }
    trajectories.push(trajArr);
  }

  // Read pad
  const padBigInt = readU64(view, offsetRef);
  const pad = Number(padBigInt);

  // account for ghost pad bytes
  offsetRef.current += 4;

  log(
    "debug",
    `DIAG parser: header bytes ${offsetRef.current} (0x${
      offsetRef.current.toString(16)
    })`,
  );

  // Read tiles
  const tilesStartOffset = offsetRef.current;
  const tiles: TileMB64[] = [];
  for (let i = 0; i < tile_count; i++) {
    const raw = view.getUint32(offsetRef.current, false);
    offsetRef.current += 4;
    const tile = {
      x: (raw >> 26) & 0x3F, // 32 - (6) = 26
      y: (raw >> 20) & 0x3F, // 26 - (6) = 20
      z: (raw >> 14) & 0x3F, // 20 - (6) = 14
      type: (raw >> 9) & 0x1F, // 14 - (5) = 9
      mat: (raw >> 5) & 0xF, // 9 - (4) = 5
      rot: (raw >> 3) & 0x3, // 5 - (2) = 3
      waterlogged: (raw >> 2) & 0x1, // 3 - (1) = 2
    };
    const check = tileToU32(tile);
    if (check !== raw) {
      log(
        "error",
        `Tile packing mismatch at index ${i}: unpacked then repacked value ${check} does not match original ${raw}`,
      );
      throw new Error("Tile packing mismatch");
    }
    tiles.push(tile);
  }
  const tilesEndOffset = offset;
  log(
    "debug",
    `DIAG parser: tiles (${tiles.length}, ${tile_count}) bytes read:`,
    tilesEndOffset - tilesStartOffset,
  );

  // Read objects
  const objectsStartOffset = offset;
  const objects: ObjectMB64[] = [];
  for (let i = 0; i < object_count; i++) {
    const bparam = readU8(view, offsetRef);
    const x = readU8(view, offsetRef);
    const y = readU8(view, offsetRef);
    const z = readU8(view, offsetRef);
    const type = readU8(view, offsetRef);
    const rot = readU8(view, offsetRef);
    const imbue = readU8(view, offsetRef);
    const padObj = readU8(view, offsetRef);
    objects.push({ bparam, x, y, z, type, rot, imbue, pad: padObj });
  }
  const objectsEndOffset = offsetRef.current;
  log(
    "debug",
    `DIAG parser: ${objects.length} objects, bytes read:`,
    objectsEndOffset - objectsStartOffset,
  );

  // Final assertion: all bytes read
  if (offsetRef.current !== buffer.byteLength) {
    throw new Error(
      `DIAG parser: Did not read all bytes. offset=${offsetRef.current}, buffer.byteLength=${buffer.byteLength}`,
    );
  } else {
    log(
      "debug",
      `DIAG parser: All bytes read. offset=${offsetRef.current}, buffer.byteLength=${buffer.byteLength}`,
    );
  }

  return {
    file_header,
    version,
    author,
    costume,
    seq,
    envfx,
    theme,
    bg,
    boundary_mat,
    boundary,
    boundary_height,
    coinstar,
    size,
    waterlevel,
    secret,
    game,
    toolbar,
    toolbar_params,
    custom_theme: {
      mats,
      topmats,
      topmatsEnabled,
      fence: fenceStr,
      pole: poleStr,
      bars: barsStr,
      water: waterStr,
    },
    trajectories,
    pad,
    piktcher,
    tiles,
    objects,
  };
}
