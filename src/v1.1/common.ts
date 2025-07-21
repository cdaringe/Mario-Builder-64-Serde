/**
 * A tile is a u32. JS bitwise operations are done on signed 32-bit integers.
 * However, the final bit is for signing. Well, luckily the tile uses only
 * 30 bits, thus, we push in our 30 bits then multiply by 4 to get to a proper
 * u32 number. *4 will work because it's not a s32 op, where a final <<2 will not.
 */
export const tileToU32 = (
  tile: {
    x: number;
    y: number;
    z: number;
    type: number;
    mat: number;
    rot: number;
    waterlogged: number;
  },
): number =>
  (((tile.x & 0x3F) << 24) |
    ((tile.y & 0x3F) << 18) |
    ((tile.z & 0x3F) << 12) |
    ((tile.type & 0x1F) << 7) |
    ((tile.mat & 0xF) << 3) |
    ((tile.rot & 0x3) << 1) |
    ((tile.waterlogged & 0x1) << 0)) * 4;

export type Ref<T> = { current: T };
export type OffsetRef = Ref<number>;
